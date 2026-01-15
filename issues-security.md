# Security Issues - MarkText

## Critical Security Findings

### 1. nodeIntegration Enabled (CRITICAL)

**Location**: `electron.vite.config.js:66`

**Issue**: The vite-plugin-electron-renderer is configured with `nodeIntegration: true`, which exposes all Node.js APIs to the renderer process without isolation.

**Risk Level**: CRITICAL

**Impact**:
- Any XSS vulnerability in the renderer could lead to full system compromise
- Malicious markdown content could potentially execute arbitrary Node.js code
- Bypasses Electron's security model

**Recommendation**:
```javascript
// REMOVE this from electron.vite.config.js:
renderer({
  nodeIntegration: true  // ❌ DANGEROUS
})

// INSTEAD, use contextBridge in preload scripts:
// See: https://www.electronjs.org/docs/latest/tutorial/context-isolation
```

**Action Items**:
1. Audit all renderer code for Node.js API usage
2. Move Node.js operations to main process with IPC
3. Expose only necessary APIs via contextBridge in preload
4. Set `nodeIntegration: false` (or remove, as false is default)
5. Ensure `contextIsolation: true` in BrowserWindow creation
6. Test all functionality after changes

---

### 2. Context Isolation & Sandbox Settings

**Status**: Needs Verification

**Action Required**: Verify in main process window creation:

```javascript
// Ensure these settings in BrowserWindow creation:
{
  webPreferences: {
    contextIsolation: true,  // ✓ Must be true
    nodeIntegration: false,   // ✓ Must be false
    sandbox: true,            // ✓ Should be true
    preload: path.join(__dirname, 'preload.js')
  }
}
```

---

### 3. IPC Communication Security

**Status**: Needs Review

**Recommendation**: Audit all IPC handlers for:
- Input validation
- Authorization checks
- Sanitization of file paths
- Preventing path traversal attacks
- Validating allowed operations

**Example Secure Pattern**:
```javascript
// In main process:
ipcMain.handle('read-file', async (event, filePath) => {
  // ✓ Validate input
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path')
  }
  
  // ✓ Prevent path traversal
  const safePath = path.normalize(filePath)
  if (safePath.includes('..')) {
    throw new Error('Invalid path')
  }
  
  // ✓ Check permissions
  // ... implementation
})
```

---

### 4. Dependency Security Audit

**Action Required**: Run security audit

```bash
npm audit --production
npm audit fix
```

Review all vulnerabilities and update dependencies with known security issues.

---

### 5. Content Security Policy (CSP)

**Status**: Not Verified

**Recommendation**: Implement CSP headers for renderer process:

```javascript
// In main process when creating window:
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ["default-src 'self'"]
    }
  })
})
```

---

## Security Best Practices Checklist

- [ ] Disable nodeIntegration
- [ ] Enable contextIsolation
- [ ] Enable sandbox mode
- [ ] Use contextBridge for IPC
- [ ] Validate all IPC input
- [ ] Implement CSP headers
- [ ] Review and update dependencies
- [ ] Sanitize user content (markdown)
- [ ] Use HTTPS for all remote content
- [ ] Implement code signing for releases

---

## Resources

- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
- [IPC Security](https://www.electronjs.org/docs/latest/tutorial/ipc)
