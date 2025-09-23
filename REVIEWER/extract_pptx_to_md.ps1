# Extract text from PPTX files and append to COMBINED_REVIEWER.md
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $root 'COMBINED_REVIEWER.md'
$files = @('lesson1.1.pptx','lesson1.2.pptx','lesson2.1.pptx','lesson2.2.pptx')

# Ensure the output file exists
if (-not (Test-Path $out)) { New-Item -Path $out -ItemType File -Force | Out-Null }

$pp = New-Object -ComObject Powerpoint.Application
$pp.Visible = $false

foreach ($f in $files) {
    $path = Join-Path $root $f
    if (-not (Test-Path $path)) {
        Write-Output "Missing: $path"
        continue
    }
    try {
        $presentation = $pp.Presentations.Open((Resolve-Path $path).Path, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    } catch {
        # fallback: try with default params
        $presentation = $pp.Presentations.Open((Resolve-Path $path).Path)
    }

    Add-Content $out "`n#### $f`n- Original file: `$f`n`n---`n`n"
    $slideIndex = 1
    foreach ($slide in $presentation.Slides) {
        $text = ''
        foreach ($shape in $slide.Shapes) {
            try {
                if ($shape -and $shape.HasTextFrame -and $shape.TextFrame -and $shape.TextFrame.HasText) {
                    $text += $shape.TextFrame.TextRange.Text + "`n`n"
                }
            } catch {
                # ignore shapes that throw
            }
        }
        if ($text -ne '') {
            Add-Content $out "##### Slide $slideIndex`n"
            Add-Content $out $text
        }
        $slideIndex++
    }
    $presentation.Close()
}

$pp.Quit()
Write-Output 'Done appending slides.'
