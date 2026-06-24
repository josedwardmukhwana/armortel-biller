$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$stateDir = Join-Path $root ".reroute"
$vitePidFile = Join-Path $stateDir "vite.pid"
$viteLog = Join-Path $stateDir "vite.log"
$port = 5175
$node = "C:\Program Files\nodejs\node.exe"
$npmCli = "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"

New-Item -ItemType Directory -Path $stateDir -Force | Out-Null

function Test-LocalServer {
  $checkScript = "fetch('http://127.0.0.1:$port').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
  $process = Start-Process -FilePath $node -ArgumentList @("-e", $checkScript) -WindowStyle Hidden -PassThru
  if (!$process.WaitForExit(3000)) {
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    return $false
  }
  return $process.ExitCode -eq 0
}

function Get-PortOwner($localPort) {
  $connection = Get-NetTCPConnection -LocalPort $localPort -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($connection) {
    return $connection.OwningProcess
  }
  return $null
}

if (Test-LocalServer) {
  $owner = Get-PortOwner $port
  if ($owner) {
    Set-Content -LiteralPath $vitePidFile -Value $owner
  }
  Write-Host "Armortel is already running locally."
  Write-Host "Local: http://localhost:$port"
  return
}

if (!(Test-Path -LiteralPath $node)) {
  throw "Node was not found at $node"
}

if (!(Test-Path -LiteralPath $npmCli)) {
  throw "npm CLI was not found at $npmCli"
}

$viteArgs = @(
  "-NoProfile",
  "-Command",
  "Set-Location -LiteralPath '$root'; & '$node' '$npmCli' run dev -w frontend -- --port $port --strictPort *> '$viteLog'"
)

$vite = Start-Process -FilePath "powershell" -ArgumentList $viteArgs -WindowStyle Hidden -PassThru
Set-Content -LiteralPath $vitePidFile -Value $vite.Id

$ready = $false
Write-Host "Starting Vite review server on port $port..."
for ($i = 0; $i -lt 90; $i++) {
  if (Test-LocalServer) {
    $ready = $true
    break
  }
  if (($i + 1) % 10 -eq 0) {
    Write-Host "Still starting... $($i + 1)s"
  }
  if ($vite.HasExited) {
    break
  }
  Start-Sleep -Seconds 1
}

if (!$ready) {
  Write-Host ""
  Write-Host "Armortel did not start on port $port."
  Write-Host "Log file: $viteLog"
  if (Test-Path -LiteralPath $viteLog) {
    Write-Host ""
    Write-Host "Last log lines:"
    Get-Content -LiteralPath $viteLog -Tail 25
  }
  exit 1
}

Write-Host "Armortel local project is running."
Write-Host "Local: http://localhost:$port"
