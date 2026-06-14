#!/usr/bin/env bash
# =============================================================================
# StreamVerse - Production Deployment Script
# =============================================================================
# Usage: ./scripts/deploy.sh [environment]
#   environment: staging | production (default: production)
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

# ── Configuration ───────────────────────────────────────────────────────────
ENVIRONMENT="${1:-production}"
COMPOSE_FILE="docker/docker-compose.yml"
COMPOSE_OVERRIDE="docker/docker-compose.${ENVIRONMENT}.yml"
PROJECT_NAME="streamverse"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="deploy-${TIMESTAMP}.log"

# ── Helpers ─────────────────────────────────────────────────────────────────
log()     { echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $*"; }
info()    { log "${CYAN}INFO:${NC} $*"; }
success() { log "${GREEN}SUCCESS:${NC} $*"; }
warn()    { log "${YELLOW}WARN:${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
banner()  { echo -e "${BOLD}${BLUE}=== $* ===${NC}"; }

cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        error "Deployment failed with exit code $exit_code"
        error "Check log: ${LOG_FILE}"
    fi
    exit "$exit_code"
}
trap cleanup EXIT

# ── Pre-flight Checks ───────────────────────────────────────────────────────
preflight() {
    banner "Pre-flight Checks"

    if [ ! -f "${COMPOSE_FILE}" ]; then
        error "Docker Compose file not found: ${COMPOSE_FILE}"
        exit 1
    fi

    if [ ! -f ".env" ] && [ ! -f ".env.${ENVIRONMENT}" ]; then
        error "Environment file not found. Create .env or .env.${ENVIRONMENT}"
        exit 1
    fi

    if ! command -v docker &>/dev/null; then
        error "Docker is not installed"
        exit 1
    fi

    if ! command -v docker-compose &>/dev/null && ! docker compose version &>/dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi

    if [ ! -d ".git" ]; then
        warn "Not a git repository — skipping pull"
    fi

    success "Pre-flight checks passed"
}

# ── Pull Latest Code ────────────────────────────────────────────────────────
pull_code() {
    banner "Pulling Latest Code"

    if [ -d ".git" ]; then
        local branch
        branch=$(git rev-parse --abbrev-ref HEAD)
        info "Current branch: ${branch}"

        git fetch origin
        git pull origin "${branch}"

        local changed_files
        changed_files=$(git diff --name-only HEAD~1..HEAD 2>/dev/null || echo "")
        if [ -n "$changed_files" ]; then
            info "Changed files:"
            echo "$changed_files" | sed 's/^/  /'
        fi
    else
        warn "Skipping git pull — not a git repository"
    fi

    success "Code pulled successfully"
}

# ── Build Docker Images ─────────────────────────────────────────────────────
build_images() {
    banner "Building Docker Images"

    local compose_cmd
    compose_cmd=$(command -v docker-compose || echo "docker compose")

    if [ -f "${COMPOSE_OVERRIDE}" ]; then
        $compose_cmd -f "${COMPOSE_FILE}" -f "${COMPOSE_OVERRIDE}" \
            -p "${PROJECT_NAME}" build --pull --no-cache 2>&1 | tee -a "${LOG_FILE}"
    else
        $compose_cmd -f "${COMPOSE_FILE}" \
            -p "${PROJECT_NAME}" build --pull --no-cache 2>&1 | tee -a "${LOG_FILE}"
    fi

    success "Docker images built successfully"
}

# ── Backup Database ─────────────────────────────────────────────────────────
backup_database() {
    banner "Backing Up Database"

    mkdir -p "${BACKUP_DIR}"

    local db_container
    db_container=$(docker ps --filter "name=${PROJECT_NAME}-db" --format "{{.Names}}" | head -1)

    if [ -z "$db_container" ]; then
        warn "No database container found — skipping backup"
        return
    fi

    local db_name db_user
    db_name=$(docker exec "$db_container" printenv POSTGRES_DB)
    db_user=$(docker exec "$db_container" printenv POSTGRES_USER)

    local backup_file="${BACKUP_DIR}/${PROJECT_NAME}_db_${TIMESTAMP}.sql.gz"
    info "Creating backup: ${backup_file}"

    docker exec "$db_container" pg_dump -U "$db_user" -d "$db_name" --clean --if-exists \
        | gzip > "$backup_file"

    local file_size
    file_size=$(du -h "$backup_file" | cut -f1)
    info "Backup size: ${file_size}"

    # Remove backups older than 7 days
    info "Cleaning backups older than 7 days..."
    find "${BACKUP_DIR}" -name "${PROJECT_NAME}_db_*.sql.gz" -mtime +7 -delete

    success "Database backed up: ${backup_file}"
}

# ── Run Migrations ──────────────────────────────────────────────────────────
run_migrations() {
    banner "Running Database Migrations"

    local compose_cmd
    compose_cmd=$(command -v docker-compose || echo "docker compose")

    if [ -f "${COMPOSE_OVERRIDE}" ]; then
        $compose_cmd -f "${COMPOSE_FILE}" -f "${COMPOSE_OVERRIDE}" \
            -p "${PROJECT_NAME}" run --rm backend \
            npm run migration:run 2>&1 | tee -a "${LOG_FILE}"
    else
        $compose_cmd -f "${COMPOSE_FILE}" \
            -p "${PROJECT_NAME}" run --rm backend \
            npm run migration:run 2>&1 | tee -a "${LOG_FILE}"
    fi

    success "Migrations completed successfully"
}

# ── Deploy with Docker Compose ──────────────────────────────────────────────
deploy_services() {
    banner "Deploying Services"

    local compose_cmd
    compose_cmd=$(command -v docker-compose || echo "docker compose")

    if [ -f "${COMPOSE_OVERRIDE}" ]; then
        $compose_cmd -f "${COMPOSE_FILE}" -f "${COMPOSE_OVERRIDE}" \
            -p "${PROJECT_NAME}" up -d --remove-orphans 2>&1 | tee -a "${LOG_FILE}"
    else
        $compose_cmd -f "${COMPOSE_FILE}" \
            -p "${PROJECT_NAME}" up -d --remove-orphans 2>&1 | tee -a "${LOG_FILE}"
    fi

    success "Services deployed"
}

# ── Health Check ────────────────────────────────────────────────────────────
health_check() {
    banner "Health Check Verification"

    local compose_cmd
    compose_cmd=$(command -v docker-compose || echo "docker compose")

    local services
    services=$($compose_cmd -p "${PROJECT_NAME}" ps --services 2>/dev/null)

    local max_retries=30
    local retry_interval=5

    for service in $services; do
        local healthy=false
        info "Checking health of service: ${service}"

        for i in $(seq 1 "$max_retries"); do
            local status
            status=$($compose_cmd -p "${PROJECT_NAME}" ps "$service" --format "{{.Status}}" 2>/dev/null || echo "unhealthy")

            if echo "$status" | grep -qE "(healthy|Up|running)"; then
                healthy=true
                success "Service '${service}' is healthy (attempt $i)"
                break
            fi

            if [ "$i" -eq "$max_retries" ]; then
                error "Service '${service}' failed health check after ${max_retries} attempts"
                return 1
            fi

            sleep "$retry_interval"
        done
    done

    # API health endpoint check
    local api_url="http://localhost:3000/health"
    info "Checking API health endpoint: ${api_url}"

    for i in $(seq 1 10); do
        if curl -sf "${api_url}" >/dev/null 2>&1; then
            success "API health endpoint responded OK"
            break
        fi
        if [ "$i" -eq 10 ]; then
            error "API health endpoint did not respond"
            return 1
        fi
        sleep 3
    done

    success "All health checks passed"
}

# ── Rollback ────────────────────────────────────────────────────────────────
rollback() {
    banner "Rolling Back Deployment"

    warn "Initiating rollback procedure..."

    local compose_cmd
    compose_cmd=$(command -v docker-compose || echo "docker compose")

    local previous_tag="previous"
    local current_tag="latest"

    warn "Rolling back to previous image version: ${previous_tag}"

    docker tag "${PROJECT_NAME}-backend:${previous_tag}" "${PROJECT_NAME}-backend:${current_tag}" 2>/dev/null || true
    docker tag "${PROJECT_NAME}-frontend:${previous_tag}" "${PROJECT_NAME}-frontend:${current_tag}" 2>/dev/null || true

    if [ -f "${COMPOSE_OVERRIDE}" ]; then
        $compose_cmd -f "${COMPOSE_FILE}" -f "${COMPOSE_OVERRIDE}" \
            -p "${PROJECT_NAME}" up -d --remove-orphans 2>&1 | tee -a "${LOG_FILE}"
    else
        $compose_cmd -f "${COMPOSE_FILE}" \
            -p "${PROJECT_NAME}" up -d --remove-orphans 2>&1 | tee -a "${LOG_FILE}"
    fi

    if health_check; then
        success "Rollback completed successfully"
    else
        error "Rollback also failed — manual intervention required"
        exit 1
    fi
}

# ── Cleanup Old Images ──────────────────────────────────────────────────────
cleanup_images() {
    banner "Cleaning Up Old Images"

    info "Removing dangling images..."
    docker image prune -f 2>&1 | tee -a "${LOG_FILE}"

    info "Removing old images (keeping last 2 versions)..."
    local services=("backend" "frontend" "ffmpeg")
    for service in "${services[@]}"; do
        local image_name="${PROJECT_NAME}-${service}"
        local old_images
        old_images=$(docker images "${image_name}" --format "{{.ID}}" | tail -n +3)
        if [ -n "$old_images" ]; then
            docker rmi $old_images 2>/dev/null || true
        fi
    done

    success "Cleanup completed"
}

# ── Main ────────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║        StreamVerse Deployment Script            ║${NC}"
    echo -e "${BOLD}${BLUE}║        Environment: ${ENVIRONMENT}${NC}"
    echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo ""

    preflight
    pull_code
    backup_database
    build_images
    run_migrations

    # Tag current images as "previous" before deploying new ones
    docker tag "${PROJECT_NAME}-backend:latest" "${PROJECT_NAME}-backend:previous" 2>/dev/null || true
    docker tag "${PROJECT_NAME}-frontend:latest" "${PROJECT_NAME}-frontend:previous" 2>/dev/null || true

    deploy_services

    if health_check; then
        success "Deployment completed successfully!"
        cleanup_images
    else
        error "Health check failed — initiating rollback"
        rollback
    fi

    echo ""
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}  StreamVerse deployed to ${ENVIRONMENT} ✅${NC}"
    echo -e "${GREEN}${BOLD}  Timestamp: ${TIMESTAMP}${NC}"
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════${NC}"
    echo ""
}

main "$@"
