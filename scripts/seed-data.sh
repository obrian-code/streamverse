#!/usr/bin/env bash
# =============================================================================
# StreamVerse - Database Seed Script
# =============================================================================
# Seeds the database with initial data including:
#   - Admin user
#   - Sample channels (categories: entertainment, news, sports, movies)
#   - Sample movies and series
#   - EPG/guide data for channels
#
# Usage:
#   ./scripts/seed-data.sh              # Seed using local TypeORM
#   ./scripts/seed-data.sh --docker     # Seed using Docker container
#   ./scripts/seed-data.sh --fresh      # Drop + recreate before seeding
#   ./scripts/seed-data.sh --help       # Show help
# =============================================================================

set -euo pipefail

# ── Colors ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

log()     { echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $*"; }
info()    { log "${CYAN}INFO:${NC} $*"; }
success() { log "${GREEN}SUCCESS:${NC} $*"; }
warn()    { log "${YELLOW}WARN:${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# ── Configuration ───────────────────────────────────────────────────────────
PROJECT_NAME="streamverse"
BACKEND_DIR="backend"

# Load environment
if [ -f ".env" ]; then
    set -a
    source .env
    set +a
fi

# ── Parse Arguments ─────────────────────────────────────────────────────────
USE_DOCKER=false
FRESH=false

usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --docker     Run seed inside Docker backend container"
    echo "  --fresh      Drop all data and reseed from scratch"
    echo "  --help       Show this help message"
    exit 0
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --docker)   USE_DOCKER=true; shift ;;
        --fresh)    FRESH=true; shift ;;
        --help)     usage ;;
        *)          error "Unknown option: $1"; usage ;;
    esac
done

# ── Pre-flight Checks ───────────────────────────────────────────────────────
preflight() {
    if [ "$USE_DOCKER" = true ]; then
        if ! command -v docker &>/dev/null; then
            error "Docker is not installed"
            exit 1
        fi

        local container
        container=$(docker ps --filter "name=${PROJECT_NAME}-backend" --format "{{.Names}}" | head -1)
        if [ -z "$container" ]; then
            error "Backend container not found. Is the project running?"
            info "Start with: docker compose -f docker/docker-compose.yml up -d"
            exit 1
        fi
        info "Using Docker container: ${container}"
    else
        if [ ! -f "${BACKEND_DIR}/package.json" ]; then
            error "Backend directory not found: ${BACKEND_DIR}"
            exit 1
        fi

        if [ ! -d "${BACKEND_DIR}/node_modules" ]; then
            info "Installing backend dependencies..."
            cd "${BACKEND_DIR}"
            npm ci --legacy-peer-deps
            cd ..
        fi
    fi
}

# ── Run Seed ────────────────────────────────────────────────────────────────
run_seed() {
    banner
    title "Seeding Database"
    footer

    if [ "$FRESH" = true ]; then
        warn "Running in --fresh mode: this will DROP all existing data!"
        echo ""
        read -rp "Are you sure? Type 'yes' to continue: " confirmation
        if [ "$confirmation" != "yes" ]; then
            info "Seed cancelled"
            exit 0
        fi
    fi

    if [ "$USE_DOCKER" = true ]; then
        run_seed_docker
    else
        run_seed_local
    fi

    success "Database seeded successfully!"
}

# ── Seed via Docker ─────────────────────────────────────────────────────────
run_seed_docker() {
    local container
    container=$(docker ps --filter "name=${PROJECT_NAME}-backend" --format "{{.Names}}" | head -1)

    if [ "$FRESH" = true ]; then
        info "Running fresh seed (drop + reseed)..."
        docker exec -it "${container}" npm run seed:fresh
    else
        info "Running seed..."
        docker exec -it "${container}" npm run seed
    fi
}

# ── Seed Locally ────────────────────────────────────────────────────────────
run_seed_local() {
    cd "${BACKEND_DIR}"

    if [ ! -f "node_modules/.package-lock.json" ]; then
        info "node_modules not found — installing dependencies..."
        npm ci --legacy-peer-deps
    fi

    if [ "$FRESH" = true ]; then
        info "Running fresh seed (drop + reseed)..."
        npm run seed:fresh
    else
        info "Running seed..."
        npm run seed
    fi

    cd ..
}

# ── Verify Seed ─────────────────────────────────────────────────────────────
verify_seed() {
    banner
    title "Verifying Seed Data"
    footer

    local api_url="${API_URL:-http://localhost:3000}"

    info "Checking API connectivity..."
    if curl -sf "${api_url}/health" >/dev/null 2>&1; then
        success "API is reachable"

        info "Checking channels endpoint..."
        if curl -sf "${api_url}/api/channels" >/dev/null 2>&1; then
            local channel_count
            channel_count=$(curl -sf "${api_url}/api/channels" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "N/A")
            info "Channels seeded: ${channel_count}"
        fi

        info "Checking movies endpoint..."
        if curl -sf "${api_url}/api/movies" >/dev/null 2>&1; then
            local movie_count
            movie_count=$(curl -sf "${api_url}/api/movies" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "N/A")
            info "Movies seeded: ${movie_count}"
        fi
    else
        warn "API is not reachable — seed may have completed but verification skipped"
        warn "Start the server and run verification manually"
    fi

    success "Seed verification complete"
}

# ── Banner ──────────────────────────────────────────────────────────────────
banner()  { echo -e "\n${BOLD}${BLUE}════════════════════════════════════════════════════${NC}"; }
title()   { echo -e "${BOLD}${BLUE}  $*${NC}"; }
footer()  { echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════${NC}\n"; }

# ── Main ────────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║        StreamVerse Database Seed                 ║${NC}"
    echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo ""

    preflight
    run_seed
    verify_seed

    echo ""
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}  Database seeding complete 🚀${NC}"
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${BOLD}Admin credentials (default):${NC}"
    echo -e "  Email:    admin@streamverse.com"
    echo -e "  Password: admin123"
    echo ""
    echo -e "  ${YELLOW}⚠  Change the default admin password immediately!${NC}"
    echo ""
}

main "$@"
