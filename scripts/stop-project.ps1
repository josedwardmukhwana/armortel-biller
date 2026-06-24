param(
  [switch]$Elevated
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$stateDir = Join-Path $root ".reroute"
$vitePidFile = Join-Path $stateDir "vite.pid"
$port = 5175
$blockedStops = New-Object System.Collections.Generic.List[string]

function Test-IsAdministrator {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($identity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Start-ElevatedStop {
  $script = Join-Path $PSScriptRoot "stop-project.ps1"
  $arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$script`" -Elevated"
  Start-Process -FilePath "powershell" -ArgumentList $arguments -Verb RunAs | Out-Null
}

function Invoke-TaskKill($processId) {
  $previousErrorAction = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $output = & cmd.exe /c "taskkill /PID $processId /T /F 2>&1"
    $exitCode = $LASTEXITCODE
    return @{
      Success = $exitCode -eq 0
      Output = ($output -join "`n")
    }
  } finally {
    $ErrorActionPreference = $previousErrorAction
  }
}

function Stop-ProcessSafely($processId, $label) {
  $process = Get-Process -Id ([int]$processId) -ErrorAction SilentlyContinue
  if (!$process) {
    Write-Host "$label was already stopped."
    return $true
  }

  try {
    Stop-Process -Id $process.Id -Force -ErrorAction Stop
    Write-Host "Stopped $label (PID $processId)."
    return $true
  } catch {
    $taskKill = Invoke-TaskKill $processId
    if ($taskKill.Success) {
      Write-Host "Stopped $label process tree (PID $processId)."
      return $true
    }

    $blockedStops.Add("$label (PID $processId): $($_.Exception.Message)") | Out-Null
    return $false
  }
}

function Get-AncestorProcessIds($processId) {
  $ancestors = @()
  $current = Get-CimInstance Win32_Process -Filter "ProcessId = $processId" -ErrorAction SilentlyContinue

  while ($current -and $current.ParentProcessId) {
    $parent = Get-CimInstance Win32_Process -Filter "ProcessId = $($current.ParentProcessId)" -ErrorAction SilentlyContinue
    if (!$parent) {
      break
    }

    if ($parent.Name -in @("powershell.exe", "pwsh.exe", "cmd.exe", "node.exe")) {
      $ancestors += [int]$parent.ProcessId
      $current = $parent
      continue
    }

    break
  }

  return $ancestors
}

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

  $stopped = Stop-ProcessSafely $pidValue $label
  if (!$stopped) {
    foreach ($ancestor in (Get-AncestorProcessIds $pidValue)) {
      if (Stop-ProcessSafely $ancestor "$label parent") {
        $stopped = $true
        break
      }
    }
  }

  Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue
}

Stop-PidFromFile $vitePidFile "Armortel local project"

$portOwners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique

foreach ($owner in $portOwners) {
  $stopped = Stop-ProcessSafely $owner "process listening on port $port"
  if (!$stopped) {
    foreach ($ancestor in (Get-AncestorProcessIds $owner)) {
      if (Stop-ProcessSafely $ancestor "parent process for port $port") {
        break
      }
    }
  }
}

Write-Host ""
if ($blockedStops.Count -gt 0) {
  if (!(Test-IsAdministrator) -and !$Elevated) {
    Write-Host "Windows blocked one or more project processes from this normal menu session."
    Write-Host "Opening an elevated stop helper. Approve the Windows prompt to finish stopping Armortel."
    Start-ElevatedStop
  } else {
    Write-Host "Windows still blocked these process(es):"
    foreach ($item in $blockedStops) {
      Write-Host "- $item"
    }
  }
} else {
  Write-Host "Local project stop command completed."
}
