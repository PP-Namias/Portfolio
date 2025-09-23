# Clean COMBINED_REVIEWER.md: remove extraction artifacts while preserving content blocks
$path = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'COMBINED_REVIEWER.md'
if (-not (Test-Path $path)) { Write-Error "Missing file: $path"; exit 1 }

$content = Get-Content $path -Raw

# Remove stray "$f" markers and "- Original file: $f" artifacts
$content = $content -replace "\$f", ""
$content = $content -replace "- Original file: \$f", "- Original file: (see filename)"

# Remove duplicated '```markdown' fence that may appear in the middle
# but keep other code fences intact: replace a lone '```markdown' that is followed by an immediate newline and 'Define ETHICS' (specific to our file)
$content = $content -replace "```markdown\s*\nDefine ETHICS", "Define ETHICS"

# Normalize repeated blank lines to maximum two
$content = $content -replace "(\r?\n){3,}", "`n`n"

Set-Content $path $content -Encoding UTF8
Write-Output 'COMBINED_REVIEWER.md cleaned'
