@echo off
REM ============================================
REM MarkText Developer Mode Startup Script
REM Windows Batch File
REM ============================================

echo.
echo ========================================
echo MarkText Developer Mode Launcher
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Recommended: Node.js 18.x or 20.x LTS
    echo.
    pause
    exit /b 1
)

echo Found Node.js version:
node --version
echo.

REM Check if npm is installed
echo [2/5] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    echo.
    echo npm should come with Node.js. Please reinstall Node.js.
    echo.
    pause
    exit /b 1
)

echo Found npm version:
npm --version
echo.

REM Check if node_modules exists
echo [3/5] Checking dependencies...
if not exist "node_modules\" (
    echo Dependencies not found. Installing...
    echo This may take a few minutes...
    echo.

    npm install

    if %errorlevel% neq 0 (
        echo.
        echo WARNING: Some dependencies failed to install.
        echo This is expected due to optional native modules.
        echo The app should still work!
        echo.
        pause
    )
) else (
    echo Dependencies already installed.
    echo.
)

REM Check if electron-vite is available
echo [4/5] Verifying electron-vite...
if not exist "node_modules\.bin\electron-vite.cmd" (
    echo ERROR: electron-vite not found!
    echo.
    echo Running: npm install electron-vite --save-dev
    npm install electron-vite --save-dev

    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Failed to install electron-vite
        echo.
        pause
        exit /b 1
    )
)
echo electron-vite is ready.
echo.

REM Start the development server
echo [5/5] Starting MarkText in developer mode...
echo.
echo ========================================
echo Starting development server...
echo The app window will open shortly.
echo.
echo Press Ctrl+C to stop the server.
echo ========================================
echo.

npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo ERROR: Failed to start developer mode
    echo ========================================
    echo.
    echo Common issues:
    echo   1. Port 5173 might be in use
    echo   2. Missing dependencies
    echo   3. Build configuration issues
    echo.
    echo Try running: npm install
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Development server stopped.
echo ========================================
echo.
pause
