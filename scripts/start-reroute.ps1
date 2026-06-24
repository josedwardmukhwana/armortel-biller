$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$stateDir = Join-Path $root ".reroute"
$tunnelPidFile = Join-Path $stateDir "cloudflared.pid"
$urlFile = Join-Path $stateDir "public-url.txt"
$tunnelLog = Join-Path $stateDir "cloudflared.log"
$port = 5175
$cloudflared = "C:\Program Files (x86)\cloudflared\cloudflared.exe"

New-Item -ItemType Directory -Path $stateDir -Force | Out-Null

function Stop-PidFromFile($path) {
  if (Test-Path -LiteralPath $path) {
    $pidValue = (Get-Content -LiteralPath $path -Raw).Trim()
    if ($pidValue) {
      $process = Get-Process -Id ([int]$pidValue) -ErrorAction SilentlyContinue
      if ($process) {
        Stop-Process -Id $process.Id -Force
      }
    }
    Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue
  }
}

Stop-PidFromFile $tunnelPidFile
Remove-Item -LiteralPath $urlFile -Force -ErrorAction SilentlyContinue

Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue | Stop-Process -Force

& (Join-Path $PSScriptRoot "start-project.ps1")

if (!(Test-Path -LiteralPath $cloudflared)) {
  throw "cloudflared was not found at $cloudflared"
}

$tunnelArgs = @(
  "-NoProfile",
  "-Command",
  "& '$cloudflared' tunnel --url http://localhost:$port *> '$tunnelLog'"
)

$tunnel = Start-Process -FilePath "powershell" -ArgumentList $tunnelArgs -WindowStyle Hidden -PassThru
Set-Content -LiteralPath $tunnelPidFile -Value $tunnel.Id

$publicUrl = $null
for ($i = 0; $i -lt 45; $i++) {
  if (Test-Path -LiteralPath $tunnelLog) {
    $content = Get-Content -LiteralPath $tunnelLog -Raw
    $match = [regex]::Match($content, "https://[a-z0-9-]+\.trycloudflare\.com")
    if ($match.Success) {
      $publicUrl = $match.Value
      break
    }
  }
  Start-Sleep -Seconds 1
}

if (!$publicUrl) {
  throw "Cloudflare tunnel started, but no public URL was detected yet. Check $tunnelLog"
}

Set-Content -LiteralPath $urlFile -Value $publicUrl

Write-Host ""
Write-Host "Armortel reroute is running."
Write-Host "Local:  http://localhost:$port"
Write-Host "Public: $publicUrl"
Write-Host ""
Write-Host "Share login details:"
Write-Host "admin@armortel.local / password123"
Write-Host "vendor@armortel.local / password123"
Write-Host "user@armortel.local / password123"
Write-Host ""
Write-Host "Run Stop-Reroute.bat when collaborators are done."
