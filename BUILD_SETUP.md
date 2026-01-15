# MarkText Build Environment Setup Guide

## Summary

This document describes the successful build environment setup for the MarkText Electron application after diagnosing and fixing various dependency issues.

## Environment Details

### System Configuration
- **OS**: Linux (Ubuntu Noble 24.04)
- **Node.js**: v22.22.0
- **npm**: 10.9.4
- **Python**: 3.11.14
- **Package Manager**: npm (package-lock.json)
- **Electron**: 39.2.7
- **electron-vite**: 5.0.0
- **Vue**: 3.5.26

### Build Tools Installed
- gcc, g++, make (build-essential)
- Python 3.11.14

## Issues Found and Fixed

### 1. Missing System Dependencies for Native Modules

**Issue**: Native Node.js modules (`native-keymap`, `keytar`) failed to build due to missing system libraries.

**Errors**:
```
Package xkbfile was not found in the pkg-config search path
Package 'libsecret-1', required by 'virtual:world', not found
```

**Solution**: Installed required Linux development libraries:
```bash
apt-get install -y libx11-dev libxkbfile-dev libsecret-1-dev libgtk-3-dev
```

**Libraries Installed**:
- `libx11-dev` - X11 development files (already present)
- `libxkbfile-dev` - X keyboard file library (for native-keymap)
- `libsecret-1-dev` - Secret service library (for keytar credential storage)
- `libgtk-3-dev` - GTK+ 3.0 development files (for Electron)

### 2. Network Restrictions on Electron Binary Downloads

**Issue**: Direct `npm install` failed when trying to download Electron binaries and headers:
```
RequestError: read ECONNRESET
403 response downloading https://www.electronjs.org/headers/v39.2.7/node-v39.2.7-headers.tar.gz
```

**Root Cause**: Network proxy or firewall restrictions blocking access to electronjs.org

**Workaround Applied**:
```bash
npm install --ignore-scripts
```

This installs all packages without running post-install scripts (which download Electron binaries).

**Trade-off**: Native modules requiring Electron headers cannot be fully rebuilt without the headers. However, the core build system (`electron-vite build`) works successfully.

### 3. Native Module Rebuild Limitations

**Issue**: `npx @electron/rebuild` failed due to inability to download Electron headers.

**Current Status**:
- ✅ Main application builds successfully
- ✅ Renderer, preload, and main process all compile
- ⚠️ Some native modules (ced, keytar, native-keymap) may not be fully optimized for Electron

**Impact**: The application can be built and potentially run, but some native features may have limitations:
- `keytar` - Secure credential storage
- `native-keymap` - Keyboard layout detection
- `ced` - Character encoding detection
- `font-list` - Font enumeration

## Successful Build Process

### Step 1: Install System Dependencies
```bash
# Install Linux development libraries
sudo apt-get update
sudo apt-get install -y libx11-dev libxkbfile-dev libsecret-1-dev libgtk-3-dev
```

### Step 2: Install Node Dependencies (Skip Post-Install Scripts)
```bash
# Clean install without running post-install scripts
npm install --ignore-scripts
```

### Step 3: Build with electron-vite
```bash
# Build the application
npm run build
```

**Build Output**:
```
✓ out/main/index.js      1.2 MB
✓ out/preload/index.js   55 KB
✓ out/renderer/          878 asset files
```

## Verification

### Build Output Structure
```
out/
├── main/
│   └── index.js (1.2MB) - Main Electron process
├── preload/
│   └── index.js (55KB) - Preload scripts
└── renderer/
    ├── index.html - Entry point
    └── assets/ - 878 compiled assets
```

### Package Configuration Verified
- ✅ `package.json` "main" field points to `./out/main/index.js`
- ✅ electron-vite.config.js properly configured
- ✅ Main/Preload: CommonJS output
- ✅ Renderer: ES Modules output
- ✅ Vue 3 + Vite integration working

## Known Limitations

### 1. Electron Binary Not Downloaded
The Electron binary itself is not downloaded when using `--ignore-scripts`. This means:

- ❌ Cannot run `npm start` or `npm run dev` directly
- ❌ Cannot create distributable packages with `electron-builder`

**To Run in Development**:
If Electron binary is needed, you would need to either:
1. Manually download Electron for your platform
2. Use a different network/proxy configuration
3. Use an Electron mirror (if accessible):
   ```bash
   ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install
   ```

### 2. Native Module Optimization
Native modules are installed but not rebuilt for Electron's specific ABI. They may:
- Fall back to prebuilt binaries (if available)
- Use Node.js binaries (may cause compatibility issues)
- Fail at runtime if no compatible binary exists

## Alternative Build Approaches

### If Network Access to electronjs.org is Available

```bash
# Standard full install
npm install

# Rebuild native modules for Electron
npm run rebuild-native
# or
npx @electron/rebuild -f

# Build application
npm run build

# Create distributable
npm run build:linux  # or build:win, build:mac
```

### For Production Builds

```bash
# Run locale minification
npm run minify-locales

# Rebuild native modules
npm run rebuild-native

# Build application code
npm run build

# Package for Linux
npm run build:linux
```

## Quick Reference

### Prerequisites Checklist
- ✅ Node.js 18+ (tested with 22.22.0)
- ✅ npm 9+ (tested with 10.9.4)
- ✅ Python 3.x (tested with 3.11.14)
- ✅ build-essential (gcc, g++, make)
- ✅ libxkbfile-dev
- ✅ libsecret-1-dev
- ✅ libgtk-3-dev

### Essential Commands
```bash
# Install dependencies (with network restrictions)
npm install --ignore-scripts

# Build application
npm run build

# Verify build output
ls -lh out/main/index.js out/preload/index.js
ls out/renderer/assets | wc -l

# If Electron binary is available
npm run dev             # Development mode
npm run start           # Preview built app
npm run build:linux     # Create distributable
```

## Troubleshooting

### Issue: "Cannot find module 'electron'"
**Cause**: Electron binary not installed
**Fix**: Either accept network restrictions and only build (not run), or resolve network access to download Electron

### Issue: Native module errors at runtime
**Cause**: Modules not rebuilt for Electron
**Fix**: If Electron headers accessible:
```bash
npx @electron/rebuild -f
```

### Issue: "Package xkbfile was not found"
**Cause**: Missing system library
**Fix**:
```bash
sudo apt-get install -y libxkbfile-dev
```

### Issue: "Package 'libsecret-1' not found"
**Cause**: Missing system library
**Fix**:
```bash
sudo apt-get install -y libsecret-1-dev
```

## Build Environment Status

✅ **Build System**: Working
✅ **Development Libraries**: Installed
✅ **Node Dependencies**: Installed
✅ **Application Build**: Successful
⚠️ **Electron Runtime**: Not available (network restrictions)
⚠️ **Native Modules**: Not fully optimized

## Next Steps

1. ✅ Basic build environment is functional
2. ⚠️ To run the application, resolve Electron binary download
3. ⚠️ To optimize native modules, resolve Electron headers download
4. ⚠️ To create distributables, ensure full electron-builder setup

## References

- [electron-vite Documentation](https://electron-vite.org/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [MarkText Repository](https://github.com/ispyisail/marktext)

---

**Last Updated**: 2026-01-15
**Build Tested**: ✅ Successful
**Status**: Development build environment ready
