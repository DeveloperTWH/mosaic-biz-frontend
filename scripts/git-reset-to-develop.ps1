# Returns the repo to a clean develop branch (integration baseline).
# Usage:
#   .\scripts\git-reset-to-develop.ps1
#   .\scripts\git-reset-to-develop.ps1 -Stash
#   .\scripts\git-reset-to-develop.ps1 -Remote origin

param(
    [switch]$Stash,
    [string]$Remote = "launch",
    [string]$Branch = "develop"
)

$ErrorActionPreference = "Stop"

function Write-Step($Message) {
    Write-Host "→ $Message"
}

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Error "Not inside a git repository."
    exit 1
}

Set-Location $repoRoot

$status = git status --porcelain
if ($status -and -not $Stash) {
    Write-Host ""
    Write-Host "Working tree has uncommitted changes."
    Write-Host "Commit, discard, or re-run with -Stash to stash before switching."
    Write-Host ""
    git status -sb
    exit 1
}

if ($status -and $Stash) {
    $stashMessage = "wip: auto-stash before reset to $Branch $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    Write-Step "Stashing uncommitted work..."
    git stash push -u -m $stashMessage
    Write-Host "  Stashed as: $stashMessage"
    Write-Host "  Restore with: git stash pop"
}

Write-Step "Fetching $Remote/$Branch..."
git fetch $Remote $Branch

Write-Step "Checking out $Branch..."
git checkout $Branch

Write-Step "Pulling latest $Remote/$Branch..."
git pull $Remote $Branch

Write-Host ""
Write-Host "Ready on $Branch @ $(git rev-parse --short HEAD)"
git status -sb
