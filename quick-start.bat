@echo off
REM ============================================
REM MarkText - Quick Start (Minimal Checks)
REM Use this if dependencies are already installed
REM ============================================

echo.
echo Starting MarkText Developer Mode...
echo.

REM Quick check
if not exist "node_modules\" (
    echo ERROR: Dependencies not installed!
    echo.
    echo Please run: setup-and-run.bat first
    echo.
    pause
    exit /b 1
)

REM Start immediately
npm run dev

pause
