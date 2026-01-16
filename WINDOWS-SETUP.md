# MarkText - Windows Developer Setup Guide

Complete guide for running MarkText in developer mode on Windows.

---

## Prerequisites

### 1. Install Node.js

**Required Version**: Node.js 18.x or 20.x LTS

**Download**: https://nodejs.org/

**Installation Steps**:
1. Download the Windows Installer (.msi)
2. Run the installer
3. ✅ Check "Automatically install necessary tools" (includes build tools)
4. Complete installation
5. Restart your terminal/command prompt

**Verify Installation**:
```cmd
node --version
npm --version
```

Should show:
```
v20.x.x
10.x.x
```

### 2. Install Git (Optional but Recommended)

**Download**: https://git-scm.com/download/win

Needed if you want to clone the repository or use version control.

---

## Quick Start (Recommended)

### Option 1: Automatic Setup (Easiest)

**Double-click**: `setup-and-run.bat`

This script will:
- ✅ Check Node.js and npm
- ✅ Install all dependencies
- ✅ Verify critical packages
- ✅ Start developer mode automatically

**First time**: Takes 2-5 minutes to install dependencies
**After first run**: Starts immediately

### Option 2: Quick Start (After First Setup)

**Double-click**: `quick-start.bat`

Use this after the first setup for faster startup.

### Option 3: Manual Commands

Open Command Prompt or PowerShell in the MarkText directory:

```cmd
# First time only - install dependencies
npm install

# Start developer mode
npm run dev
```

---

## Batch File Guide

### `setup-and-run.bat` - Full Setup ⭐ Recommended for First Run

**What it does**:
- Checks Node.js and npm versions
- Installs/updates dependencies
- Verifies critical packages (Electron, Vue, etc.)
- Starts development server
- Shows helpful error messages

**When to use**:
- First time running MarkText
- After pulling new code changes
- If you deleted `node_modules`
- If something isn't working

**Time**: 2-5 minutes first run, ~10 seconds after

### `start-dev.bat` - Standard Start

**What it does**:
- Quick checks
- Installs dependencies if missing
- Starts dev server

**When to use**:
- Regular development
- Quick testing

**Time**: ~5-10 seconds

### `quick-start.bat` - Fastest Start

**What it does**:
- Minimal checks
- Starts immediately

**When to use**:
- After initial setup
- When you know dependencies are installed
- For rapid testing

**Time**: ~2-3 seconds

---

## What Happens When You Run Dev Mode?

### Step-by-Step Process:

1. **Dependency Check** (first run only)
   - Downloads ~500MB of packages
   - Installs Electron (Chromium + Node.js)
   - Installs Vue.js and dependencies
   - Takes 2-5 minutes

2. **Build Process**
   - Compiles Vue components
   - Bundles JavaScript
   - Processes CSS
   - Takes 10-30 seconds

3. **Server Starts**
   - Development server on port 5173
   - Hot-reload enabled
   - Console shows: "✓ built in XXXms"

4. **App Window Opens**
   - Electron window appears
   - MarkText interface loads
   - Ready to use!

### What You'll See:

```
[Step 1/6] Checking Node.js...
Found Node.js v20.11.0

[Step 2/6] Checking npm...
Found npm 10.2.4

[Step 3/6] Dependency Check...
Dependencies already installed.

[Step 4/6] Installing dependencies...
Dependencies installed successfully!

[Step 5/6] Verifying critical dependencies...
All critical dependencies verified!

[Step 6/6] Starting Developer Mode...

  VITE v5.1.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose

  [Electron] Starting Electron...
  [Electron] Ready
```

**Then**: The MarkText window opens! 🎉

---

## Troubleshooting

### Problem: "Node.js is not installed"

**Solution**:
1. Download Node.js from https://nodejs.org/
2. Install the LTS version (20.x)
3. Restart Command Prompt
4. Run script again

### Problem: "npm install" fails with errors

**Common causes**:
- Antivirus blocking (especially Windows Defender)
- Permissions issues
- Disk space (need ~2GB free)

**Solutions**:

1. **Run as Administrator**:
   - Right-click `setup-and-run.bat`
   - Choose "Run as administrator"

2. **Temporarily disable antivirus** during install

3. **Clear npm cache**:
   ```cmd
   npm cache clean --force
   npm install
   ```

4. **Force reinstall**:
   ```cmd
   rmdir /s /q node_modules
   del package-lock.json
   npm install --force
   ```

### Problem: Port 5173 already in use

**Solution**:
```cmd
# Find what's using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

Or just reboot your computer.

### Problem: "electron.exe" not found

**Solution**:
```cmd
# Reinstall Electron specifically
npm install electron --save-dev
```

### Problem: Window opens but app doesn't load

**Possible causes**:
- Build errors
- Missing dependencies

**Solution**:
1. Check the terminal for error messages
2. Look at the Electron console (F12 in the app)
3. Try clean reinstall:
   ```cmd
   rmdir /s /q node_modules
   npm install
   npm run dev
   ```

### Problem: "Python not found" or build tool errors

Some native modules need build tools.

**Solution**:
```cmd
# Install Windows Build Tools (run as Administrator)
npm install --global windows-build-tools
```

Or install Visual Studio Build Tools:
https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022

### Problem: Very slow installation

**Causes**:
- Slow internet
- Windows Defender scanning each file
- Disk I/O

**Solutions**:
- Use wired connection
- Temporarily disable real-time scanning
- Install on SSD if possible

---

## Development Tips

### Hot Reload

When you change code:
- **Save the file**
- **App automatically reloads** (usually within 1 second)
- No need to restart!

### DevTools

Press **F12** in the MarkText window to open Chrome DevTools:
- Console: See errors and logs
- Elements: Inspect HTML/CSS
- Network: Monitor requests
- Sources: Debug JavaScript

### Stop the Server

**In terminal**: Press `Ctrl+C`
**Close app**: Window closes but server keeps running (use Ctrl+C)

### Logs

Server logs appear in the terminal:
```
[vite] hmr update /src/renderer/App.vue
[Electron] page loaded
```

### Making Changes

1. Edit source files in `src/`
2. Save
3. Watch terminal for build success
4. App reloads automatically
5. Test your changes

---

## File Structure (Important for Development)

```
marktext/
├── src/
│   ├── main/          ← Electron main process (Node.js)
│   ├── renderer/      ← UI code (Vue.js)
│   └── preload/       ← Bridge between main and renderer
├── tests/             ← Test files (649+ tests!)
├── node_modules/      ← Dependencies (auto-generated)
├── out/               ← Build output (created by npm run build)
├── start-dev.bat      ← Quick start script
├── setup-and-run.bat  ← Full setup script
└── quick-start.bat    ← Fastest start

Edit files in src/ - they auto-reload!
Don't edit files in out/ or node_modules/
```

---

## Common Commands

### Development
```cmd
npm run dev          # Start developer mode (hot reload)
npm run start        # Preview built app
```

### Building
```cmd
npm run build        # Build for production
npm run build:win    # Create Windows installer
```

### Testing
```cmd
npm test             # Run test suite (649+ tests)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Code Quality
```cmd
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix issues
npm run format       # Format code with Prettier
```

---

## Performance Tips

### First Run Optimization

1. **Disable antivirus temporarily** during `npm install`
2. **Use SSD** if available
3. **Close other apps** to free RAM
4. **Use wired internet** for faster downloads

### Ongoing Development

1. **Keep dependencies updated**:
   ```cmd
   npm update
   ```

2. **Clear cache** if experiencing issues:
   ```cmd
   npm cache clean --force
   ```

3. **Rebuild native modules** after Node.js updates:
   ```cmd
   npm run rebuild-native
   ```

---

## System Requirements

### Minimum
- **OS**: Windows 10 or later
- **RAM**: 4GB
- **Disk**: 2GB free space
- **CPU**: Dual-core processor

### Recommended
- **OS**: Windows 11
- **RAM**: 8GB or more
- **Disk**: SSD with 5GB free
- **CPU**: Quad-core processor
- **Internet**: Broadband (for initial install)

---

## Getting Help

### Check Logs
1. **Terminal output**: Look for error messages
2. **DevTools Console**: Press F12 in app
3. **Log files**: Check `%APPDATA%/MarkText/logs/`

### Common Error Messages

| Error | Solution |
|-------|----------|
| `ENOENT` | File not found - check paths |
| `EACCES` | Permission denied - run as admin |
| `EADDRINUSE` | Port in use - close other apps |
| `MODULE_NOT_FOUND` | Dependency missing - run `npm install` |

### Still Having Issues?

1. **Clean reinstall**:
   ```cmd
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

2. **Check Node.js version**:
   ```cmd
   node --version
   ```
   Should be 18.x or 20.x

3. **Update npm**:
   ```cmd
   npm install -g npm@latest
   ```

4. **Restart computer** (seriously, it helps!)

---

## Quick Reference Card

### First Time Setup
```cmd
1. Install Node.js 20.x LTS
2. Double-click: setup-and-run.bat
3. Wait 2-5 minutes
4. MarkText opens!
```

### Daily Development
```cmd
1. Double-click: quick-start.bat
   OR
   npm run dev
2. Edit files in src/
3. Press Ctrl+C to stop
```

### If Something Breaks
```cmd
1. Delete node_modules folder
2. Run: setup-and-run.bat
3. Problem solved!
```

---

## Success Checklist

- ✅ Node.js 18.x or 20.x installed
- ✅ `node --version` works
- ✅ `npm --version` works
- ✅ Can run `setup-and-run.bat`
- ✅ Dependencies install successfully
- ✅ `npm run dev` starts server
- ✅ MarkText window opens
- ✅ Can edit files and see changes

**All checked?** You're ready to develop! 🎉

---

## What's Next?

After successful setup:

1. **Explore the code**: Check `src/renderer/` for Vue components
2. **Make a change**: Edit a file and watch it reload
3. **Run tests**: Try `npm test` to see 649+ tests pass
4. **Read docs**: Check other `.md` files for more info
5. **Have fun!**: Build something awesome! 🚀

---

**Need more help?** Check:
- `README.md` - Project overview
- `TESTING-GUIDE.md` - Testing documentation
- `WEEK-4-COMPLETE-SUMMARY.md` - Recent improvements

**Happy coding!** 💻✨
