# Extract text from DOCX using Word COM and append to COMBINED_REVIEWER.md
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$docx = Join-Path $root 'Code of Ethics for Fil IT Prof(1).docx'
$out = Join-Path $root 'COMBINED_REVIEWER.md'

if (-not (Test-Path $docx)) {
    Write-Error "DOCX not found: $docx"
    exit 1
}

# Ensure output exists
if (-not (Test-Path $out)) { New-Item -Path $out -ItemType File -Force | Out-Null }

$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open((Resolve-Path $docx).Path)
    $text = $doc.Content.Text
    $doc.Close()
} catch {
    Write-Error "Failed to open DOCX: $_"
    $word.Quit()
    exit 1
}
$word.Quit()

# Append with a clear heading
Add-Content $out "`n#### Code of Ethics for Fil IT Prof(1).docx (extracted)`n- Original file: `Code of Ethics for Fil IT Prof(1).docx`n`n---`n`n"
# Preserve exact text from the docx; don't normalize content
Add-Content $out $text
Write-Output 'DOCX text appended to COMBINED_REVIEWER.md'
