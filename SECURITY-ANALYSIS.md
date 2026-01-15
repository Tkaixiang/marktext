# MarkText Security Analysis and Remediation Plan

**Date**: 2026-01-15
**Severity**: CRITICAL
**Status**: Requires Immediate Action

## Executive Summary

MarkText currently has **CRITICAL** security vulnerabilities in its Electron configuration that expose the application to arbitrary code execution attacks. The combination of disabled context isolation, enabled Node.js integration, and disabled web security creates a dangerous attack surface.

## Critical Security Issues Identified

### 1. Context Isolation Disabled (CRITICAL)

**Location**: `src/main/config.js:10`
```javascript
contextIsolation: false
```

**Risk Level**: CRITICAL
**Impact**: Complete compromise of security model

**Description**: Context isolation is the primary security feature in Electron that separates the renderer process (which runs untrusted web content) from Node.js APIs. When disabled:
- Renderer code has direct access to Node.js APIs
- Malicious markdown content with XSS could execute arbitrary code
- No protection between web content and system resources
- contextBridge security model is completely bypassed

**Attack Scenario**:
1. User opens a malicious markdown file
2. File contains JavaScript via XSS vector (e.g., `<img src=x onerror="malicious code">`)
3. Malicious code can directly access `require()`, `fs`, `child_process`, etc.
4. Attacker gains full system access

### 2. Node Integration Enabled (CRITICAL)

**Locations**:
- `src/main/config.js:15` - `nodeIntegration: true`
- `electron.vite.config.js:66` - vite-plugin-electron-renderer with `nodeIntegration: true`

**Risk Level**: CRITICAL
**Impact**: Direct Node.js API access from renderer

**Description**: Node integration allows the renderer process to use Node.js APIs directly, which should never be enabled in production Electron applications.

**Why This Matters**:
- Renderer can execute system commands via `child_process`
- Renderer can read/write arbitrary files via `fs`
- Renderer can make network requests bypassing CORS
- Combined with contextIsolation:false, this is extremely dangerous

### 3. Web Security Disabled (HIGH)

**Location**: `src/main/config.js:16`
```javascript
webSecurity: false
```

**Risk Level**: HIGH
**Impact**: Bypasses Chromium's built-in security features

**Description**: Disables Same-Origin Policy, CORS, and other web security features.

**Impact**:
- Renderer can make requests to any domain without CORS restrictions
- Can load resources from arbitrary origins
- Makes XSS attacks more dangerous

## Current IPC and API Exposure

### Preload Script APIs (`src/preload/index.js`)

The preload script properly uses contextBridge, but because `contextIsolation: false`, it falls back to directly setting `window` properties:

**Exposed APIs** (lines 99-104):
```javascript
window.electron = { ...electronAPI, ...customElectronAPI }
window.rgPath = rgPath
window.fileUtils = fileUtilsAPI
window.path = path  // DANGEROUS: Exposes Node.js path module
window.commandExists = commandAPI
window.i18nUtils = i18nUtils
```

**APIs Exposed to Renderer**:

1. **electron** - Electron IPC, shell, clipboard, webUtils
2. **rgPath** - Path to ripgrep binary
3. **fileUtils** - File system operations:
   - `isFile()`, `isDirectory()`, `emptyDir()`, `copy()`, `ensureDir()`
   - `outputFile()`, `move()`, `stat()`, `writeFile()`, `readFile()`
   - `ensureDirSync()`, `pathExistsSync()`
   - Path utilities: `isChildOfDirectory()`, `hasMarkdownExtension()`, etc.
4. **path** - ENTIRE Node.js path module (DANGEROUS)
5. **commandExists** - Check if system commands exist
6. **i18nUtils** - Translation loading

### IPC Handlers in Main Process

**Window Manager IPC** (`src/main/app/windowManager.js`):

Lines 348-462 expose various IPC handlers:
- `mt::window-add-file-path` - Add file to opened files
- `mt::close-window` - Close window
- `mt::open-file` - Open file in tab
- `mt::window-tab-closed` - Handle tab closure
- `mt::window-toggle-always-on-top` - Toggle window on top
- `watcher-*` - File system watching
- `window-*` - Window management
- `broadcast-*` - Broadcast preference changes

## Renderer Files Using Node.js APIs Directly

The following files use Node.js APIs that will need refactoring:

1. `src/renderer/src/bootstrap.js` - Uses `require()` or `process`
2. `src/renderer/src/commands/utils.js`
3. `src/renderer/src/components/editorWithTabs/editor.vue`
4. `src/renderer/src/node/paths.js`
5. `src/renderer/src/prefComponents/common/fontTextBox/index.vue`
6. `src/renderer/src/prefComponents/sideBar/config.js`
7. `src/renderer/src/store/index.js`
8. `src/renderer/src/store/project.js`
9. `src/renderer/src/util/fileSystem.js`
10. `src/renderer/src/util/index.js`

## Remediation Plan

### Phase 1: Security Configuration Fixes (IMMEDIATE)

#### Step 1.1: Enable Context Isolation

**File**: `src/main/config.js`

Change:
```javascript
contextIsolation: false,  // CURRENT (INSECURE)
```

To:
```javascript
contextIsolation: true,   // SECURE
```

#### Step 1.2: Disable Node Integration in Renderer

**File**: `src/main/config.js`

Change:
```javascript
nodeIntegration: true,    // CURRENT (INSECURE)
```

To:
```javascript
nodeIntegration: false,   // SECURE
```

**File**: `electron.vite.config.js`

Change:
```javascript
renderer({
  nodeIntegration: true   // CURRENT (INSECURE)
})
```

To:
```javascript
renderer({
  nodeIntegration: false  // SECURE
})
```

#### Step 1.3: Review Web Security Setting

**File**: `src/main/config.js`

Current:
```javascript
webSecurity: false        // INSECURE
```

**Recommendation**: Try to enable web security. If loading local markdown files fails, implement a custom protocol handler instead of disabling web security entirely.

### Phase 2: Update Preload Script (IMMEDIATE)

The preload script already has contextBridge code, so it's prepared. However, we need to ensure all necessary APIs are exposed.

**File**: `src/preload/index.js`

**Issues to Address**:
1. Line 92: Exposing entire `path` module is dangerous
   - **Fix**: Expose only specific path methods needed
2. Ensure all contextBridge APIs match what renderer needs

### Phase 3: Refactor Renderer Code (HIGH PRIORITY)

All renderer files must stop using Node.js APIs directly and use `window.electron.*` or `window.fileUtils.*` instead.

**Example Migration**:

Before (INSECURE):
```javascript
const fs = require('fs')
const path = require('path')
fs.readFileSync(path.join(__dirname, 'file.txt'))
```

After (SECURE):
```javascript
// Use preload-exposed APIs
const content = await window.fileUtils.readFile(
  window.path.join('/some/path', 'file.txt')
)
```

### Phase 4: Add Sandbox (FUTURE)

**File**: `src/main/config.js`

Add:
```javascript
sandbox: true
```

**Note**: This is a future enhancement. Enabling sandbox requires additional work to ensure all preload APIs work correctly.

## Testing Plan

### Security Tests

1. **Test 1: Verify Node.js APIs Not Accessible**
   - Open DevTools in renderer
   - Try `require('fs')` - should fail
   - Try `process.versions` - should be undefined

2. **Test 2: Verify contextBridge APIs Work**
   - Test `window.electron.ipcRenderer`
   - Test `window.fileUtils.readFile()`
   - Test all exposed APIs

3. **Test 3: XSS Protection**
   - Create markdown with `<img src=x onerror="alert(require)">`
   - Verify `require` is undefined and error is caught

### Functional Tests

1. Open/save files
2. File system watching
3. Preferences changes
4. Window management
5. Image uploads
6. Search functionality

## Migration Checklist

- [ ] Fix `contextIsolation` in config.js
- [ ] Fix `nodeIntegration` in config.js
- [ ] Fix `nodeIntegration` in electron.vite.config.js
- [ ] Review and limit exposed `path` APIs in preload
- [ ] Refactor `src/renderer/src/bootstrap.js`
- [ ] Refactor `src/renderer/src/commands/utils.js`
- [ ] Refactor `src/renderer/src/components/editorWithTabs/editor.vue`
- [ ] Refactor `src/renderer/src/node/paths.js`
- [ ] Refactor `src/renderer/src/prefComponents/common/fontTextBox/index.vue`
- [ ] Refactor `src/renderer/src/prefComponents/sideBar/config.js`
- [ ] Refactor `src/renderer/src/store/index.js`
- [ ] Refactor `src/renderer/src/store/project.js`
- [ ] Refactor `src/renderer/src/util/fileSystem.js`
- [ ] Refactor `src/renderer/src/util/index.js`
- [ ] Test all functionality after changes
- [ ] Run security tests
- [ ] Update documentation

## Timeline

- **Day 1**: Fix security configuration + test basic functionality
- **Day 2-3**: Refactor renderer code to use contextBridge APIs
- **Day 4**: Comprehensive testing
- **Day 5**: Code review and documentation

## References

- [Electron Security Best Practices](https://www.electronjs.org/docs/latest/tutorial/security)
- [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
- [Security, Native Capabilities, and Your Responsibility](https://www.electronjs.org/docs/latest/tutorial/security)

## Notes

- **DO NOT** deploy current version to production
- **DO NOT** use `nodeIntegration: true` in any Electron app
- **ALWAYS** use `contextIsolation: true` (default since Electron 12)
- Use contextBridge to expose only necessary APIs to renderer
