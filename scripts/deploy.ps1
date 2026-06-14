<#
.SYNOPSIS
    StreamVerse - Production Deployment Script (PowerShell)
.DESCRIPTION
    Deploys StreamVerse OTT platform to production/staging using Docker.
    Supports code pull, image build, migrations, health check, and rollback.
.PARAMETER Environment
    Target environment: staging or production (default: production)
.EXAMPLE
    .\scripts\deploy.ps1 -Environment production
#>

param(
    [Parameter(Position = 0)]
    [ValidateSet("staging", "production")]
    [string]$Environment = "production"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# ── Configuration ───────────────────────────────────────────────────────────
$ProjectName = "streamverse"
$ComposeFile = "docker/docker-compose.yml"
$ComposeOverride = "docker/docker-compose.$Environment.yml"
$BackupDir = ".\backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$LogFile = "deploy-$Timestamp.log"
$MaxRetries = 30
$RetryInterval = 5

# ── Colors ──────────────────────────────────────────────────────────────────
$Host.UI.RawUI.ForegroundColor = [ConsoleColor]::White
function Write-Info { Write-Host "[$(Get-Date -Format HH:mm:ss)] INFO: $($args[0])" -ForegroundColor Cyan }
function Write-Success { Write-Host "[$(Get-Date -Format HH:mm:ss)] SUCCESS: $($args[0])" -ForegroundColor Green }
function Write-Warn { Write-Host "[$(Get-Date -Format HH:mm:ss)] WARN: $($args[0])" -ForegroundColor Yellow }
function Write-Error { Write-Host "[ERROR] $($args[0])" -ForegroundColor Red }
function Write-Banner { Write-Host "`n=== $($args[0]) ===" -ForegroundColor Blue }

# ── Pre-flight Checks ───────────────────────────────────────────────────────
function Invoke-Preflight {
    Write-Banner "Pre-flight Checks"

    if (-not (Test-Path $ComposeFile)) {
        throw "Docker Compose file not found: $ComposeFile"
    }

    $envFile = if (Test-Path ".env.$Environment") { ".env.$Environment" } else { ".env" }
    if (-not (Test-Path $envFile)) {
        throw "Environment file not found: $envFile"
    }

    $dockerVersion = docker --version 2>$null
    if (-not $dockerVersion) {
        throw "Docker is not installed"
    }
    Write-Info "Docker: $dockerVersion"

    $composeVersion = docker-compose --version 2>$null
    if (-not $composeVersion) {
        $composeVersion = docker compose version 2>$null
    }
    if (-not $composeVersion) {
        throw "Docker Compose is not installed"
    }
    Write-Info "Docker Compose: $composeVersion"

    if (-not (Test-Path ".git")) {
        Write-Warn "Not a git repository — skipping pull"
    }

    Write-Success "Pre-flight checks passed"
}

# ── Pull Latest Code ────────────────────────────────────────────────────────
function Invoke-PullCode {
    Write-Banner "Pulling Latest Code"

    if (Test-Path ".git") {
        $branch = git rev-parse --abbrev-ref HEAD
        Write-Info "Current branch: $branch"

        git fetch origin
        git pull origin $branch

        $changedFiles = git diff --name-only HEAD~1..HEAD 2>$null
        if ($changedFiles) {
            Write-Info "Changed files:"
            $changedFiles | ForEach-Object { Write-Host "  $_" }
        }
    } else {
        Write-Warn "Skipping git pull — not a git repository"
    }

    Write-Success "Code pulled successfully"
}

# ── Build Docker Images ─────────────────────────────────────────────────────
function Invoke-BuildImages {
    Write-Banner "Building Docker Images"

    $composeArgs = @("-f", $ComposeFile)
    if (Test-Path $ComposeOverride) {
        $composeArgs += @("-f", $ComposeOverride)
    }
    $composeArgs += @("-p", $ProjectName, "build", "--pull", "--no-cache")

    if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        docker-compose @composeArgs 2>&1 | Tee-Object -FilePath $LogFile -Append
    } else {
        docker compose @composeArgs 2>&1 | Tee-Object -FilePath $LogFile -Append
    }

    Write-Success "Docker images built successfully"
}

# ── Backup Database ─────────────────────────────────────────────────────────
function Invoke-BackupDatabase {
    Write-Banner "Backing Up Database"

    if (-not (Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    }

    $dbContainer = docker ps --filter "name=$ProjectName-db" --format "{{.Names}}" | Select-Object -First 1
    if (-not $dbContainer) {
        Write-Warn "No database container found — skipping backup"
        return
    }

    $dbName = docker exec $dbContainer printenv POSTGRES_DB
    $dbUser = docker exec $dbContainer printenv POSTGRES_USER

    $backupFile = "$BackupDir/${ProjectName}_db_$Timestamp.sql.gz"
    Write-Info "Creating backup: $backupFile"

    $dump = docker exec $dbContainer pg_dump -U $dbUser -d $dbName --clean --if-exists
    $dump | gzip | Set-Content -Path $backupFile -Encoding Byte

    $fileSize = (Get-Item $backupFile).Length / 1MB
    Write-Info "Backup size: $([math]::Round($fileSize, 2)) MB"

    Write-Info "Cleaning backups older than 7 days..."
    Get-ChildItem $BackupDir -Filter "${ProjectName}_db_*.sql.gz" | Where-Object {
        $_.LastWriteTime -lt (Get-Date).AddDays(-7)
    } | ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Info "Removed old backup: $($_.Name)"
    }

    Write-Success "Database backed up: $backupFile"
}

# ── Run Migrations ──────────────────────────────────────────────────────────
function Invoke-RunMigrations {
    Write-Banner "Running Database Migrations"

    $composeArgs = @("-f", $ComposeFile)
    if (Test-Path $ComposeOverride) {
        $composeArgs += @("-f", $ComposeOverride)
    }
    $composeArgs += @("-p", $ProjectName, "run", "--rm", "backend", "npm", "run", "migration:run")

    if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        docker-compose @composeArgs 2>&1 | Tee-Object -FilePath $LogFile -Append
    } else {
        docker compose @composeArgs 2>&1 | Tee-Object -FilePath $LogFile -Append
    }

    Write-Success "Migrations completed successfully"
}

# ── Deploy Services ─────────────────────────────────────────────────────────
function Invoke-DeployServices {
    Write-Banner "Deploying Services"

    $composeArgs = @("-f", $ComposeFile)
    if (Test-Path $ComposeOverride) {
        $composeArgs += @("-f", $ComposeOverride)
    }
    $composeArgs += @("-p", $ProjectName, "up", "-d", "--remove-orphans")

    if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        docker-compose @composeArgs 2>&1 | Tee-Object -FilePath $LogFile -Append
    } else {
        docker compose @composeArgs 2>&1 | Tee-Object -FilePath $LogFile -Append
    }

    Write-Success "Services deployed"
}

# ── Health Check ────────────────────────────────────────────────────────────
function Invoke-HealthCheck {
    Write-Banner "Health Check Verification"

    $composeArgs = @("-p", $ProjectName)

    if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        $services = docker-compose @composeArgs ps --services 2>$null
    } else {
        $services = docker compose @composeArgs ps --services 2>$null
    }

    foreach ($service in $services) {
        $healthy = $false
        Write-Info "Checking health of service: $service"

        for ($i = 1; $i -le $MaxRetries; $i++) {
            if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
                $status = docker-compose @composeArgs ps $service --format "{{.Status}}" 2>$null
            } else {
                $status = docker compose @composeArgs ps $service --format "{{.Status}}" 2>$null
            }

            if ($status -match "healthy|Up|running") {
                $healthy = $true
                Write-Success "Service '$service' is healthy (attempt $i)"
                break
            }

            if ($i -eq $MaxRetries) {
                throw "Service '$service' failed health check after $MaxRetries attempts"
            }

            Start-Sleep -Seconds $RetryInterval
        }
    }

    # API health endpoint check
    $apiUrl = "http://localhost:3000/health"
    Write-Info "Checking API health endpoint: $apiUrl"

    for ($i = 1; $i -le 10; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $apiUrl -Method GET -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Success "API health endpoint responded OK"
                break
            }
        } catch {
            if ($i -eq 10) {
                throw "API health endpoint did not respond"
            }
            Start-Sleep -Seconds 3
        }
    }

    Write-Success "All health checks passed"
}

# ── Rollback ────────────────────────────────────────────────────────────────
function Invoke-Rollback {
    Write-Banner "Rolling Back Deployment"

    Write-Warn "Initiating rollback procedure..."

    Write-Warn "Rolling back to previous image version"
    docker tag "${ProjectName}-backend:previous" "${ProjectName}-backend:latest" 2>$null
    docker tag "${ProjectName}-frontend:previous" "${ProjectName}-frontend:latest" 2>$null

    Invoke-DeployServices

    try {
        Invoke-HealthCheck
        Write-Success "Rollback completed successfully"
    } catch {
        throw "Rollback also failed — manual intervention required"
    }
}

# ── Cleanup Old Images ──────────────────────────────────────────────────────
function Invoke-CleanupImages {
    Write-Banner "Cleaning Up Old Images"

    Write-Info "Removing dangling images..."
    docker image prune -f 2>&1 | Out-Null

    $services = @("backend", "frontend", "ffmpeg")
    foreach ($service in $services) {
        $imageName = "${ProjectName}-${service}"
        $images = docker images $imageName --format "{{.ID}}" | Select-Object -Skip 2
        foreach ($imageId in $images) {
            docker rmi $imageId 2>$null | Out-Null
        }
    }

    Write-Success "Cleanup completed"
}

# ── Main ────────────────────────────────────────────────────────────────────
function Main {
    Clear-Host
    Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║        StreamVerse Deployment Script            ║" -ForegroundColor Blue
    Write-Host "║        Environment: $Environment" -ForegroundColor Blue
    Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Blue

    try {
        Invoke-Preflight
        Invoke-PullCode
        Invoke-BackupDatabase
        Invoke-BuildImages
        Invoke-RunMigrations

        # Tag current images as "previous" before deploying new
        docker tag "${ProjectName}-backend:latest" "${ProjectName}-backend:previous" 2>$null
        docker tag "${ProjectName}-frontend:latest" "${ProjectName}-frontend:previous" 2>$null

        Invoke-DeployServices
        Invoke-HealthCheck
        Invoke-CleanupImages

        Write-Host "`n════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host "  StreamVerse deployed to $Environment ✅" -ForegroundColor Green
        Write-Host "  Timestamp: $Timestamp" -ForegroundColor Green
        Write-Host "════════════════════════════════════════════════════" -ForegroundColor Green
    } catch {
        Write-Error $_.Exception.Message
        Write-Warn "Initiating rollback..."
        Invoke-Rollback
        exit 1
    }
}

Main
