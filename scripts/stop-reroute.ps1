$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$stateDir = Join-Path $root ".reroute"
$vitePidFile = Join-Path $stateDir "vite.pid"
$tunnelPidFile = Join-Path $stateDir "cloudflared.pid"
$urlFile = Join-Path $stateDir "public-url.txt"

function Stop-PidFromFile($path, $label) {
  if (!(Test-Path -LiteralPath $path)) {
    Write-Host "$label is not recorded as running."
    return
  }

  $pidValue = (Get-Content -LiteralPath $path -Raw).Trim()
  if (!$pidValue) {
    Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue
    Write-Host "$label pid file was empty."
    return
  }

  $process = Get-Process -Id ([int]$pidValue) -ErrorAction SilentlyContinue
  if ($process) {
    Stop-Process -Id $process.Id -Force
    Write-Host "Stopped $label (PID $pidValue)."
  } else {
    Write-Host "$label was already stopped."
  }

  Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue
}

Stop-PidFromFile $tunnelPidFile "Cloudflare tunnel"

$leftoverTunnels = Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue
if ($leftoverTunnels) {
  $leftoverTunnels | Stop-Process -Force
  Write-Host "Stopped leftover Cloudflare quick tunnel process(es)."
}

Remove-Item -LiteralPath $urlFile -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Armortel public reroute is stopped."
Write-Host "Local project may still be running. Use Stop Project if you want to close it too."
