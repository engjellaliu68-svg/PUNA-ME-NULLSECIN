param(
  [switch]$SkipDocker,
  [switch]$SkipPrisma
)

$ErrorActionPreference = "Stop"

function Require-Command {
  param([string]$Name, [string]$Hint)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Write-Host "Missing required tool: $Name" -ForegroundColor Red
    Write-Host $Hint -ForegroundColor Yellow
    exit 1
  }
}

Require-Command "node" "Install Node.js LTS from https://nodejs.org or use winget: winget install OpenJS.NodeJS.LTS"
Require-Command "npm" "npm is included with Node.js. Reinstall Node.js if npm is missing."

Write-Host "Installing workspace dependencies..." -ForegroundColor Cyan
npm install

if (-not (Test-Path "backend/.env") -and (Test-Path "backend/.env.example")) {
  Copy-Item "backend/.env.example" "backend/.env"
  Write-Host "Created backend/.env from backend/.env.example" -ForegroundColor Green
}

if (-not (Test-Path "frontend/.env.local") -and (Test-Path "frontend/.env.example")) {
  Copy-Item "frontend/.env.example" "frontend/.env.local"
  Write-Host "Created frontend/.env.local from frontend/.env.example" -ForegroundColor Green
}

if (-not $SkipDocker) {
  if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    Write-Host "Starting database with docker compose..." -ForegroundColor Cyan
    docker compose up -d
  } else {
    Write-Host "Docker not found. Skipping database startup." -ForegroundColor Yellow
  }
}

if (-not $SkipPrisma) {
  if (Test-Path "backend/.env") {
    Write-Host "Generating Prisma client..." -ForegroundColor Cyan
    npm --workspace backend run prisma:generate

    if (-not $SkipDocker) {
      Write-Host "Running Prisma migrations..." -ForegroundColor Cyan
      npm --workspace backend run prisma:migrate
    } else {
      Write-Host "Skipped migrations because -SkipDocker was set." -ForegroundColor Yellow
    }
  } else {
    Write-Host "backend/.env missing. Skipping Prisma steps." -ForegroundColor Yellow
  }
}

Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Start dev servers in two terminals:" -ForegroundColor Cyan
Write-Host "  npm run dev:backend" -ForegroundColor White
Write-Host "  npm run dev:frontend" -ForegroundColor White
