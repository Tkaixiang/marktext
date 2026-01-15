#!/bin/bash
# MarkText Build Environment Setup Script
# This script sets up the build environment for MarkText on Linux systems

set -e  # Exit on error

echo "================================================"
echo "MarkText Build Environment Setup"
echo "================================================"
echo ""

# Check if running as root for apt-get commands
if [[ $EUID -ne 0 ]] && ! command -v sudo &> /dev/null; then
   echo "Warning: This script requires root privileges or sudo to install system packages"
   echo "Please run with sudo or as root"
   exit 1
fi

SUDO=""
if [[ $EUID -ne 0 ]]; then
    SUDO="sudo"
fi

# Step 1: Check Node.js version
echo "[1/5] Checking Node.js version..."
NODE_VERSION=$(node --version 2>/dev/null || echo "not installed")
if [[ "$NODE_VERSION" == "not installed" ]]; then
    echo "❌ Node.js is not installed"
    echo "   Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1 | sed 's/v//')
if (( NODE_MAJOR < 18 )); then
    echo "❌ Node.js version $NODE_VERSION is too old"
    echo "   Please upgrade to Node.js 18 or higher"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION (OK)"

# Step 2: Check Python
echo ""
echo "[2/5] Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ $PYTHON_VERSION (OK)"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo "✅ $PYTHON_VERSION (OK)"
else
    echo "❌ Python not found"
    echo "   Installing Python 3..."
    $SUDO apt-get update
    $SUDO apt-get install -y python3
fi

# Step 3: Install system dependencies
echo ""
echo "[3/5] Installing system dependencies..."
echo "   This will install: build-essential, libxkbfile-dev, libsecret-1-dev, libgtk-3-dev"

# Update package list
$SUDO apt-get update

# Install build tools
if ! command -v gcc &> /dev/null; then
    echo "   Installing build-essential..."
    $SUDO apt-get install -y build-essential
else
    echo "✅ build-essential already installed"
fi

# Install required libraries
echo "   Installing development libraries..."
$SUDO apt-get install -y \
    libx11-dev \
    libxkbfile-dev \
    libsecret-1-dev \
    libgtk-3-dev

echo "✅ System dependencies installed"

# Step 4: Install Node.js dependencies
echo ""
echo "[4/5] Installing Node.js dependencies..."
echo "   Note: Using --ignore-scripts to work around Electron download restrictions"

if [ ! -d "node_modules" ]; then
    npm install --ignore-scripts
    echo "✅ Dependencies installed"
else
    echo "⚠️  node_modules already exists. Skipping npm install."
    echo "   To reinstall, run: rm -rf node_modules && npm install --ignore-scripts"
fi

# Step 5: Test build
echo ""
echo "[5/5] Testing build..."
npm run build

# Check if build succeeded
if [ -f "out/main/index.js" ] && [ -f "out/preload/index.js" ] && [ -f "out/renderer/index.html" ]; then
    echo "✅ Build successful!"
    echo ""
    echo "================================================"
    echo "Build Environment Setup Complete!"
    echo "================================================"
    echo ""
    echo "Build output:"
    ls -lh out/main/index.js out/preload/index.js
    echo "Renderer assets: $(ls out/renderer/assets 2>/dev/null | wc -l) files"
    echo ""
    echo "Next steps:"
    echo "  • To rebuild: npm run build"
    echo "  • See BUILD_SETUP.md for detailed documentation"
    echo "  • See known limitations in BUILD_SETUP.md"
else
    echo "❌ Build failed. Check output above for errors."
    exit 1
fi
