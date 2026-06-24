@echo off
setlocal EnableExtensions
title Armortel Command Center

set "ROOT=%~dp0.."
set "PS=powershell -NoProfile -ExecutionPolicy Bypass"

:menu
cls
echo.
echo  ============================================================
echo                 ARMORTEL SOLUTIONS CONTROL CENTER
echo  ============================================================
echo.
echo     [1] Start Project              Local review server
echo     [2] Stop Project               Stop local review server
echo.
echo     [3] Start Reroute              Public collaborator link
echo     [4] Stop Reroute               Close public exposure
echo.
echo     [5] Show Current Link          Display latest public URL
echo     [6] Open Local Project         Browser: localhost
echo.
echo     [0] Exit
echo.
echo  ------------------------------------------------------------
echo.
set /p choice="  Choose an option: "

if "%choice%"=="1" goto start_project
if "%choice%"=="2" goto stop_project
if "%choice%"=="3" goto start_reroute
if "%choice%"=="4" goto stop_reroute
if "%choice%"=="5" goto show_link
if "%choice%"=="6" goto open_local
if "%choice%"=="0" goto goodbye

echo.
echo  That option is not on the panel. Try again.
pause >nul
goto menu

:start_project
cls
echo.
echo  Starting Armortel local project...
echo.
%PS% -File "%~dp0start-project.ps1"
echo.
pause
goto menu

:stop_project
cls
echo.
echo  Stopping Armortel local project...
echo.
%PS% -File "%~dp0stop-project.ps1"
echo.
pause
goto menu

:start_reroute
cls
echo.
echo  Starting public collaborator reroute...
echo.
%PS% -File "%~dp0start-reroute.ps1"
echo.
pause
goto menu

:stop_reroute
cls
echo.
echo  Closing public collaborator reroute...
echo.
%PS% -File "%~dp0stop-reroute.ps1"
echo.
pause
goto menu

:show_link
cls
echo.
echo  Latest collaborator link
echo  ------------------------
echo.
if exist "%ROOT%\.reroute\public-url.txt" (
  type "%ROOT%\.reroute\public-url.txt"
  echo.
) else (
  echo  No public link is active yet. Use option 3 first.
)
echo.
pause
goto menu

:open_local
cls
echo.
echo  Opening local Armortel project...
start "" "http://localhost:5175"
echo.
pause
goto menu

:goodbye
cls
echo.
echo  Armortel Control Center closed.
echo.
endlocal
