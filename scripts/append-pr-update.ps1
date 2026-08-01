# Appends the latest commit to PR.md (single accumulating PR description for the dev branch).
# Usage: scripts/append-pr-update.ps1 [-CommitSha <sha>] [-Message <text>]
# Without args it uses `git log -1` from the repo root.
param(
  [string]$CommitSha = "",
  [string]$Message = ""
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$prFile = Join-Path $repoRoot "PR.md"

if (-not $CommitSha) {
  $CommitSha = (git -C $repoRoot log -1 --format="%h").Trim()
}
$fullSha = (git -C $repoRoot log -1 --format="%H").Trim()
if (-not $Message) {
  $subject = (git -C $repoRoot log -1 --format="%s").Trim()
  $body = git -C $repoRoot log -1 --format="%b" | Where-Object { $_.Trim() -ne "" } | ForEach-Object {
    $line = $_.Trim()
    if ($line -match "^- ") { "  $line" } else { "  - $line" }
  }
  $Message = "  - $CommitSha $subject`n" + ($body -join "`n")
}

if (-not $Message) {
  Write-Error "No commit message found - run from a git checkout with at least one commit."
}

$date = (Get-Date).ToString("yyyy-MM-dd")
$entry = @"

### $date - Update

$Message
"@

[System.IO.File]::AppendAllText($prFile, $entry, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Appended to PR.md:"
Write-Output $entry
