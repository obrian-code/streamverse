#!/usr/bin/env bash
# =============================================================================
# StreamVerse - Database Backup Script
# =============================================================================
# Performs PostgreSQL backup with pg_dump, compression, rotation, and
# optional S3 upload.
#
# Usage:
#   ./scripts/backup-db.sh                  # Backup using .env defaults
#   ./scripts/backup-db.sh --s3             # Backup + upload to S3
#   ./scripts/backup-db.sh --file output.sql.gz  # Custom output path
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

# ── Default Configuration ───────────────────────────────────────────────────
# Load from .env if available
if [ -f ".env" ]; then
    set -a
    source .env
    set +a
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-streamverse}"
DB_PASSWORD="${DB_PASSWORD:-streamverse_pass}"
DB_NAME="${DB_NAME:-streamverse}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# S3 Configuration (optional)
S3_BUCKET="${S3_BUCKET:-}"
S3_PREFIX="${S3_PREFIX:-streamverse-backups}"
AWS_PROFILE="${AWS_PROFILE:-default}"

# ── Parse Arguments ─────────────────────────────────────────────────────────
UPLOAD_S3=false
CUSTOM_FILE=""

usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --s3           Upload backup to S3 after creation"
    echo "  --file PATH    Custom output file path"
    echo "  --help         Show this help message"
    exit 0
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --s3)
            UPLOAD_S3=true
            shift
            ;;
        --file)
            CUSTOM_FILE="$2"
            shift 2
            ;;
        --help)
            usage
            ;;
        *)
            error "Unknown option: $1"
            usage
            ;;
    esac
done

# ── Pre-flight Checks ───────────────────────────────────────────────────────
preflight() {
    if ! command -v pg_dump &>/dev/null; then
        error "pg_dump is not installed. Install PostgreSQL client tools."
        exit 1
    fi

    if ! command -v gzip &>/dev/null; then
        error "gzip is not installed"
        exit 1
    fi

    mkdir -p "${BACKUP_DIR}"

    # Test database connection
    info "Testing database connection..."
    PGPASSWORD="${DB_PASSWORD}" pg_isready \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -q 2>/dev/null || {
        error "Cannot connect to database at ${DB_HOST}:${DB_PORT}"
        error "Check your .env configuration and ensure PostgreSQL is running"
        exit 1
    }
    success "Database connection OK"
}

# ── Perform Backup ──────────────────────────────────────────────────────────
perform_backup() {
    info "Starting backup of database: ${DB_NAME}"

    if [ -n "$CUSTOM_FILE" ]; then
        BACKUP_FILE="${CUSTOM_FILE}"
    else
        BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
    fi

    # Create backup directory if needed
    mkdir -p "$(dirname "${BACKUP_FILE}")"

    info "Backing up to: ${BACKUP_FILE}"

    # Perform pg_dump with compression
    PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        --no-comments \
        --verbose \
        2>/dev/null \
        | gzip -9 > "${BACKUP_FILE}"

    # Verify backup integrity
    info "Verifying backup integrity..."
    if [ -f "${BACKUP_FILE}" ] && [ -s "${BACKUP_FILE}" ]; then
        # Test gzip integrity
        if gzip -t "${BACKUP_FILE}" 2>/dev/null; then
            local file_size
            file_size=$(du -h "${BACKUP_FILE}" | cut -f1)
            local row_count
            row_count=$(zcat "${BACKUP_FILE}" | grep -c "^INSERT" 2>/dev/null || echo "N/A")
            success "Backup verified: ${file_size} (rows: ${row_count})"
        else
            error "Backup file is corrupted!"
            rm -f "${BACKUP_FILE}"
            exit 1
        fi
    else
        error "Backup file is empty or was not created"
        exit 1
    fi
}

# ── Rotate Old Backups ───────────────────────────────────────────────────────
rotate_backups() {
    info "Rotating backups older than ${RETENTION_DAYS} days..."

    local removed=0
    while IFS= read -r -d '' file; do
        rm -f "${file}"
        info "Removed old backup: ${file}"
        ((removed++))
    done < <(find "${BACKUP_DIR}" -name "${DB_NAME}_*.sql.gz" -mtime +"${RETENTION_DAYS}" -print0 2>/dev/null)

    if [ "$removed" -eq 0 ]; then
        info "No backups older than ${RETENTION_DAYS} days to remove"
    else
        info "Removed ${removed} old backup(s)"
    fi

    # List remaining backups
    info "Current backups in ${BACKUP_DIR}:"
    ls -lh "${BACKUP_DIR}"/*.sql.gz 2>/dev/null | awk '{print "  " $5 " " $9}' || echo "  (none)"
}

# ── Upload to S3 ───────────────────────────────────────────────────────────
upload_to_s3() {
    if [ "$UPLOAD_S3" = false ]; then
        return
    fi

    if [ -z "$S3_BUCKET" ]; then
        warn "S3_BUCKET not set — skipping S3 upload"
        warn "Set S3_BUCKET and (optionally) S3_PREFIX in .env"
        return
    fi

    if ! command -v aws &>/dev/null; then
        warn "AWS CLI is not installed — skipping S3 upload"
        warn "Install with: pip install awscli"
        return
    fi

    local s3_path="${S3_PREFIX}/${DB_NAME}_${TIMESTAMP}.sql.gz"
    info "Uploading to S3: s3://${S3_BUCKET}/${s3_path}"

    if aws s3 cp "${BACKUP_FILE}" "s3://${S3_BUCKET}/${s3_path}" \
        --profile "${AWS_PROFILE}" \
        --storage-class STANDARD_IA \
        2>&1; then
        success "Uploaded to S3 successfully"

        # Verify upload
        if aws s3 ls "s3://${S3_BUCKET}/${s3_path}" --profile "${AWS_PROFILE}" &>/dev/null; then
            success "S3 upload verified"
        fi
    else
        error "S3 upload failed"
        return 1
    fi
}

# ── Send Notification ──────────────────────────────────────────────────────
send_notification() {
    local status="$1"
    local message="$2"
    local webhook_url="${SLACK_WEBHOOK_URL:-}"

    if [ -z "$webhook_url" ]; then
        return
    fi

    local color
    if [ "$status" = "success" ]; then
        color="good"
    else
        color="danger"
    fi

    local payload
    payload=$(cat <<EOF
{
    "attachments": [{
        "color": "${color}",
        "title": "StreamVerse Database Backup",
        "text": "${message}",
        "fields": [
            {"title": "Database", "value": "${DB_NAME}", "short": true},
            {"title": "Host", "value": "${DB_HOST}:${DB_PORT}", "short": true},
            {"title": "File", "value": "${BACKUP_FILE}", "short": false}
        ],
        "ts": $(date +%s)
    }]
}
EOF
)

    curl -sf -X POST -H "Content-Type: application/json" \
        -d "${payload}" "${webhook_url}" >/dev/null 2>&1 || true
}

# ── Main ────────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║        StreamVerse Database Backup               ║${NC}"
    echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo ""

    preflight
    perform_backup
    rotate_backups
    upload_to_s3

    local file_size
    file_size=$(du -h "${BACKUP_FILE}" | cut -f1)
    local summary="${DB_NAME} backed up successfully (${file_size})"

    echo ""
    success "${summary}"
    info "Backup file: ${BACKUP_FILE}"
    echo ""

    send_notification "success" "${summary}"
}

main "$@"
