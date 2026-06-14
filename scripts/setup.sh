#!/usr/bin/env bash
# =============================================================================
# StreamVerse - First-Time Setup Script
# =============================================================================
# This script performs initial project setup including:
#   - Prerequisite checks (node, docker, npm)
#   - Dependency installation
#   - Environment file generation
#   - Docker Compose build and run
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
banner()  { echo -e "\n${BOLD}${BLUE}════════════════════════════════════════════════════${NC}"; }
title()   { echo -e "${BOLD}${BLUE}  $*${NC}"; }
footer()  { echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════${NC}\n"; }

# ── Configuration ───────────────────────────────────────────────────────────
PROJECT_NAME="streamverse"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
COMPOSE_FILE="docker/docker-compose.yml"

# ── Print Header ────────────────────────────────────────────────────────────
print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║                                                          ║${NC}"
    echo -e "${BOLD}${BLUE}║           StreamVerse — First-Time Setup                 ║${NC}"
    echo -e "${BOLD}${BLUE}║           OTT Streaming Platform                         ║${NC}"
    echo -e "${BOLD}${BLUE}║                                                          ║${NC}"
    echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# ── Check Prerequisites ─────────────────────────────────────────────────────
check_prerequisites() {
    banner
    title "Checking Prerequisites"
    footer

    local missing=()

    # Node.js
    if command -v node &>/dev/null; then
        local node_ver
        node_ver=$(node --version)
        info "Node.js: ${node_ver}"
        # Check minimum version (18+)
        local node_major
        node_major=$(node --version | cut -d. -f1 | sed 's/v//')
        if [ "$node_major" -lt 18 ]; then
            error "Node.js 18+ is required. Found: ${node_ver}"
            missing+=("node (version 18+)")
        fi
    else
        error "Node.js is not installed"
        missing+=("node")
    fi

    # npm
    if command -v npm &>/dev/null; then
        local npm_ver
        npm_ver=$(npm --version)
        info "npm: ${npm_ver}"
    else
        error "npm is not installed"
        missing+=("npm")
    fi

    # Docker
    if command -v docker &>/dev/null; then
        local docker_ver
        docker_ver=$(docker --version)
        info "Docker: ${docker_ver}"
    else
        error "Docker is not installed"
        missing+=("docker")
    fi

    # Docker Compose
    if command -v docker-compose &>/dev/null || docker compose version &>/dev/null; then
        local compose_ver
        compose_ver=$(docker-compose --version 2>/dev/null || docker compose version 2>/dev/null)
        info "Docker Compose: ${compose_ver}"
    else
        error "Docker Compose is not installed"
        missing+=("docker-compose")
    fi

    # Git
    if command -v git &>/dev/null; then
        local git_ver
        git_ver=$(git --version)
        info "Git: ${git_ver}"
    else
        warn "Git is not installed (optional for development)"
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        error "Missing prerequisites:"
        for item in "${missing[@]}"; do
            echo "  - ${item}"
        done
        echo ""
        info "Install missing prerequisites and re-run this script."
        exit 1
    fi

    success "All prerequisites are satisfied"
}

# ── Install Dependencies ────────────────────────────────────────────────────
install_dependencies() {
    banner
    title "Installing Dependencies"
    footer

    # Backend
    if [ -f "${BACKEND_DIR}/package.json" ]; then
        info "Installing backend dependencies..."
        cd "${BACKEND_DIR}"
        npm ci --legacy-peer-deps 2>&1 | tail -5
        cd ..
        success "Backend dependencies installed"
    else
        warn "No package.json found in ${BACKEND_DIR}"
    fi

    # Frontend
    if [ -f "${FRONTEND_DIR}/package.json" ]; then
        info "Installing frontend dependencies..."
        cd "${FRONTEND_DIR}"
        npm ci --legacy-peer-deps 2>&1 | tail -5
        cd ..
        success "Frontend dependencies installed"
    else
        warn "No package.json found in ${FRONTEND_DIR}"
    fi
}

# ── Generate Environment Files ──────────────────────────────────────────────
generate_env_files() {
    banner
    title "Generating Environment Files"
    footer

    # Generate backend .env if it doesn't exist
    if [ -f "${BACKEND_DIR}/.env.example" ] && [ ! -f "${BACKEND_DIR}/.env" ]; then
        info "Generating backend .env from .env.example..."
        cp "${BACKEND_DIR}/.env.example" "${BACKEND_DIR}/.env"

        # Generate random secrets
        local jwt_secret
        local refresh_secret
        jwt_secret=$(openssl rand -hex 32 2>/dev/null || echo "change-me-to-a-random-secret")
        refresh_secret=$(openssl rand -hex 32 2>/dev/null || echo "change-me-to-a-random-refresh-secret")

        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=${jwt_secret}/" "${BACKEND_DIR}/.env"
            sed -i '' "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=${refresh_secret}/" "${BACKEND_DIR}/.env"
        else
            sed -i "s/JWT_SECRET=.*/JWT_SECRET=${jwt_secret}/" "${BACKEND_DIR}/.env"
            sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=${refresh_secret}/" "${BACKEND_DIR}/.env"
        fi

        success "Backend .env generated with random secrets"
    elif [ -f "${BACKEND_DIR}/.env" ]; then
        info "Backend .env already exists — skipping"
    else
        warn "No .env.example found in ${BACKEND_DIR} — creating minimal .env"
        cat > "${BACKEND_DIR}/.env" << 'ENVEOF'
# ── Server ──────────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=3000

# ── Database ────────────────────────────────────────────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_USER=streamverse
DB_PASSWORD=streamverse_pass
DB_NAME=streamverse

# ── Redis ───────────────────────────────────────────────────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379

# ── JWT ─────────────────────────────────────────────────────────────────────
JWT_SECRET=dev-jwt-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── Storage ─────────────────────────────────────────────────────────────────
UPLOAD_DIR=./uploads
MEDIA_DIR=./media

# ── Streaming ───────────────────────────────────────────────────────────────
STREAMING_PROTOCOL=hls
SEGMENT_DURATION=4
HLS_LIST_SIZE=10

# ── CORS ────────────────────────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:4200,http://localhost:80

# ── Throttle ────────────────────────────────────────────────────────────────
THROTTLE_TTL=60
THROTTLE_LIMIT=100
ENVEOF
        success "Minimal backend .env created"
    fi

    # Generate root .env for docker-compose if needed
    if [ ! -f ".env" ]; then
        info "Creating root .env from backend configuration..."
        cp "${BACKEND_DIR}/.env" ".env" 2>/dev/null || true
        success "Root .env created"
    fi

    echo ""
    warn "⚠  IMPORTANT: Review the generated .env files and update credentials"
    warn "   before deploying to production!"
}

# ── Build and Run with Docker Compose ──────────────────────────────────────
build_and_run() {
    banner
    title "Building and Running with Docker Compose"
    footer

    local compose_cmd
    compose_cmd=$(command -v docker-compose || echo "docker compose")

    info "Building Docker images..."
    $compose_cmd -f "${COMPOSE_FILE}" -p "${PROJECT_NAME}" build 2>&1 | tail -10

    info "Starting services..."
    $compose_cmd -f "${COMPOSE_FILE}" -p "${PROJECT_NAME}" up -d 2>&1 | tail -10

    info "Waiting for services to be healthy..."
    sleep 10

    # Verify services are running
    local services
    services=$($compose_cmd -p "${PROJECT_NAME}" ps --services 2>/dev/null || echo "")
    if [ -n "$services" ]; then
        info "Running services:"
        echo "$services" | while read -r service; do
            local status
            status=$($compose_cmd -p "${PROJECT_NAME}" ps "$service" --format "{{.Status}}" 2>/dev/null || echo "unknown")
            local port
            port=$($compose_cmd -p "${PROJECT_NAME}" port "$service" 2>/dev/null || echo "")
            echo "  - ${service}: ${status} ${port}"
        done
    fi

    success "Docker Compose is running"
}

# ── Print Summary ───────────────────────────────────────────────────────────
print_summary() {
    echo ""
    echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}${BOLD}║              Setup Complete! 🚀                           ║${NC}"
    echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${BOLD}Frontend:${NC}       http://localhost:4200"
    echo -e "  ${BOLD}Backend API:${NC}     http://localhost:3000"
    echo -e "  ${BOLD}Swagger Docs:${NC}    http://localhost:3000/api/docs"
    echo -e "  ${BOLD}Database:${NC}        postgresql://localhost:5432/streamverse"
    echo -e "  ${BOLD}Redis:${NC}           redis://localhost:6379"
    echo ""
    echo -e "  ${YELLOW}Next steps:${NC}"
    echo -e "  1. Run seed:      ./scripts/seed-data.sh"
    echo -e "  2. Backend dev:   cd backend && npm run start:dev"
    echo -e "  3. Frontend dev:  cd frontend && npm start"
    echo -e "  4. View logs:     docker-compose -f ${COMPOSE_FILE} logs -f"
    echo ""
}

# ── Main ────────────────────────────────────────────────────────────────────
main() {
    print_header
    check_prerequisites
    install_dependencies
    generate_env_files
    build_and_run
    print_summary
}

main "$@"
