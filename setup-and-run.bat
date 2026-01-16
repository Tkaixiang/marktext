@echo off
REM ============================================
REM MarkText Complete Setup and Run Script
REM Handles full installation and startup
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo MarkText - Complete Setup and Run
echo ==========================================
echo.

REM Set colors (if supported)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "RESET=[0m"

REM Check Node.js version
echo [Step 1/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%ERROR: Node.js not found!%RESET%
    echo.
    echo Please install Node.js 18.x or 20.x LTS from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=1 delims=v" %%a in ('node --version') do set NODE_VERSION=%%a
echo %GREEN%Found Node.js %NODE_VERSION%%RESET%
echo.

REM Check npm
echo [Step 2/6] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%ERROR: npm not found!%RESET%
    pause
    exit /b 1
)

for /f %%a in ('npm --version') do set NPM_VERSION=%%a
echo %GREEN%Found npm %NPM_VERSION%%RESET%
echo.

REM Clean install option
echo [Step 3/6] Dependency Check...
if exist "node_modules\" (
    echo Found existing node_modules directory.
    echo.
    choice /C YN /M "Do you want to do a fresh install (Y) or use existing (N)"
    if !errorlevel! equ 1 (
        echo.
        echo Removing old node_modules...
        rmdir /s /q node_modules
        if exist "package-lock.json" del package-lock.json
    )
)

REM Install dependencies
echo.
echo [Step 4/6] Installing dependencies...
if not exist "node_modules\" (
    echo This will take 2-5 minutes...
    echo.

    REM Try npm install
    npm install

    if !errorlevel! neq 0 (
        echo.
        echo %YELLOW%WARNING: npm install completed with warnings%RESET%
        echo This is normal - some optional dependencies may fail.
        echo.
        echo The app should still work!
        echo.
        timeout /t 3 >nul
    ) else (
        echo %GREEN%Dependencies installed successfully!%RESET%
    )
) else (
    echo %GREEN%Dependencies already installed.%RESET%
)
echo.

REM Verify critical dependencies
echo [Step 5/6] Verifying critical dependencies...
set "DEPS_OK=1"

if not exist "node_modules\electron\dist\electron.exe" (
    echo %RED%ERROR: Electron not found!%RESET%
    set "DEPS_OK=0"
)

if not exist "node_modules\electron-vite\" (
    echo %RED%ERROR: electron-vite not found!%RESET%
    set "DEPS_OK=0"
)

if not exist "node_modules\vue\" (
    echo %RED%ERROR: Vue.js not found!%RESET%
    set "DEPS_OK=0"
)

if !DEPS_OK! equ 0 (
    echo.
    echo %RED%Critical dependencies missing!%RESET%
    echo.
    echo Try running: npm install --force
    echo.
    pause
    exit /b 1
)

echo %GREEN%All critical dependencies verified!%RESET%
echo.

REM Start development mode
echo [Step 6/6] Starting Developer Mode...
echo.
echo ==========================================
echo Starting MarkText Development Server
echo ==========================================
echo.
echo The application window will open shortly.
echo.
echo %YELLOW%Tips:%RESET%
echo   - Press Ctrl+C to stop the server
echo   - Changes to code will auto-reload
echo   - Check console for any errors
echo.
echo ==========================================
echo.

REM Run with better error handling
npm run dev

set "EXIT_CODE=!errorlevel!"

if !EXIT_CODE! neq 0 (
    echo.
    echo ==========================================
    echo %RED%ERROR: Failed to start developer mode%RESET%
    echo ==========================================
    echo.
    echo Exit code: !EXIT_CODE!
    echo.
    echo Common solutions:
    echo   1. Port conflict - Close any apps using port 5173
    echo   2. Try: npm install --force
    echo   3. Delete node_modules and run this script again
    echo   4. Check if antivirus is blocking Electron
    echo.
    echo For help, check: docs/TROUBLESHOOTING.md
    echo.
) else (
    echo.
    echo ==========================================
    echo Development server stopped normally.
    echo ==========================================
    echo.
)

pause
endlocal
