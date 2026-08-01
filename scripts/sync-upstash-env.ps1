param(
    [string]$SourceEnv = "$PSScriptRoot\..\portfolio-v1\.env.local",
    [string]$TargetEnv = "$PSScriptRoot\..\.env.local"
)

$ErrorActionPreference = 'Stop'

$keys = @('UPSTASH_VECTOR_URL', 'UPSTASH_VECTOR_TOKEN', 'REINDEX_SECRET')

if (-not (Test-Path -LiteralPath $SourceEnv)) {
    Write-Error "Source env not found: $SourceEnv"
    exit 1
}

$sourceLines = Get-Content -LiteralPath $SourceEnv
$source = @{}
foreach ($line in $sourceLines) {
    $match = [regex]::Match($line, '^([A-Z_]+)=(.*)$')
    if ($match.Success -and $keys -contains $match.Groups[1].Value) {
        $source[$match.Groups[1].Value] = $match.Groups[2].Value
    }
}

$missing = $keys | Where-Object { -not $source.ContainsKey($_) }
if ($missing) {
    Write-Error "Source env is missing: $($missing -join ', ')"
    exit 1
}

$targetLines = @()
if (Test-Path -LiteralPath $TargetEnv) {
    $targetLines = Get-Content -LiteralPath $TargetEnv
}

$target = @{}
foreach ($line in $targetLines) {
    $match = [regex]::Match($line, '^([A-Z_]+)=(.*)$')
    if ($match.Success) {
        $target[$match.Groups[1].Value] = $match.Groups[2].Value
    }
}

$changed = @()
foreach ($key in $keys) {
    if (-not $target.ContainsKey($key) -or $target[$key] -ne $source[$key]) {
        $changed += $key
    }
}

if ($changed.Count -eq 0) {
    Write-Output 'Already in sync: UPSTASH_VECTOR_URL, UPSTASH_VECTOR_TOKEN, REINDEX_SECRET are current in the target env.'
    exit 0
}

$output = New-Object System.Collections.Generic.List[string]
foreach ($line in $targetLines) {
    $match = [regex]::Match($line, '^([A-Z_]+)=(.*)$')
    if ($match.Success -and $keys -contains $match.Groups[1].Value) {
        $output.Add("$($match.Groups[1].Value)=$($source[$match.Groups[1].Value])")
    } else {
        $output.Add($line)
    }
}
$existingKeys = @($targetLines | ForEach-Object {
    $m = [regex]::Match($_, '^([A-Z_]+)=')
    if ($m.Success) { $m.Groups[1].Value }
})
foreach ($key in $keys) {
    if ($existingKeys -notcontains $key) {
        $output.Add("$key=$($source[$key])")
    }
}

$output | Set-Content -LiteralPath $TargetEnv -Encoding UTF8

Write-Output "Synced to ${TargetEnv}: $($changed -join ', ')"
Write-Output 'Note: values are never printed; verify with the health endpoint.'
exit 0
