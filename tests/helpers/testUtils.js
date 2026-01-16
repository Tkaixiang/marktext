import { vi } from 'vitest'

/**
 * Test Utilities and Mock Helpers for MarkText
 *
 * This module provides reusable test utilities, mocks, and helpers
 * for testing MarkText components and utilities.
 */

// ============================================================================
// Window API Mocks
// ============================================================================

/**
 * Creates a mock for window.fileUtils API (exposed via preload)
 */
export const createFileUtilsMock = () => ({
  isFile: vi.fn((path) => typeof path === 'string' && path.endsWith('.md')),
  isDirectory: vi.fn((path) => typeof path === 'string' && !path.includes('.')),
  emptyDir: vi.fn().mockResolvedValue(undefined),
  copy: vi.fn().mockResolvedValue(undefined),
  ensureDir: vi.fn().mockResolvedValue(undefined),
  outputFile: vi.fn().mockResolvedValue(undefined),
  move: vi.fn().mockResolvedValue(undefined),
  stat: vi.fn().mockResolvedValue({ size: 1024, mtime: new Date() }),
  writeFile: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn().mockResolvedValue('mock file content'),
  ensureDirSync: vi.fn(),
  pathExistsSync: vi.fn((path) => true),
  unlink: vi.fn().mockResolvedValue(undefined),
  statSync: vi.fn((path) => ({ size: 1024, mode: 0o644, isFile: () => true })),
  constants: {
    S_IXUSR: 0o100,
    S_IXGRP: 0o010,
    S_IXOTH: 0o001
  },
  isChildOfDirectory: vi.fn((dir, child) => child.startsWith(dir)),
  hasMarkdownExtension: vi.fn((path) => /\.(md|markdown)$/i.test(path)),
  MARKDOWN_INCLUSIONS: ['*.md', '*.markdown'],
  isSamePathSync: vi.fn((a, b) => a === b),
  isImageFile: vi.fn((path) => /\.(jpg|png|gif|svg|webp)$/i.test(path))
})

/**
 * Creates a mock for window.path API (Node.js path module)
 */
export const createPathMock = () => ({
  join: vi.fn((...parts) => parts.join('/')),
  resolve: vi.fn((...parts) => '/' + parts.join('/')),
  dirname: vi.fn((p) => p.substring(0, p.lastIndexOf('/'))),
  basename: vi.fn((p) => p.substring(p.lastIndexOf('/') + 1)),
  extname: vi.fn((p) => {
    const idx = p.lastIndexOf('.')
    return idx >= 0 ? p.substring(idx) : ''
  }),
  relative: vi.fn((from, to) => to.replace(from + '/', '')),
  isAbsolute: vi.fn((p) => p.startsWith('/') || /^[A-Z]:/.test(p)),
  normalize: vi.fn((p) => p)
})

/**
 * Creates a mock for window.electron API (IPC communication)
 */
export const createElectronMock = () => ({
  ipcRenderer: {
    send: vi.fn(),
    sendSync: vi.fn(),
    invoke: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    once: vi.fn(),
    removeListener: vi.fn(),
    removeAllListeners: vi.fn()
  },
  shell: {
    openExternal: vi.fn().mockResolvedValue(undefined),
    showItemInFolder: vi.fn()
  },
  clipboard: {
    writeText: vi.fn(),
    readText: vi.fn(() => 'mocked clipboard text')
  }
})

/**
 * Creates a mock for window.crypto API
 */
export const createCryptoMock = () => ({
  createHash: vi.fn((algorithm) => ({
    update: vi.fn(function(content, encoding) {
      this._content = content
      this._encoding = encoding
      return this
    }),
    digest: vi.fn(function(format) {
      return `${this._content}-hash`
    })
  }))
})

/**
 * Creates a mock for window.Buffer API
 */
export const createBufferMock = () => ({
  from: vi.fn((data, encoding) => {
    if (typeof data === 'string') {
      return {
        toString: vi.fn((enc) => enc === 'base64' ? btoa(data) : data),
        length: data.length
      }
    }
    return { toString: vi.fn(), length: 0 }
  })
})

/**
 * Creates a mock for window.process API
 */
export const createProcessMock = () => ({
  platform: 'linux',
  env: {
    HOME: '/home/user',
    PATH: '/usr/bin:/bin',
    NODE_ENV: 'test'
  }
})

/**
 * Sets up all window mocks at once
 * @param {object} overrides - Override specific mocks
 */
export const setupWindowMocks = (overrides = {}) => {
  global.window = global.window || {}

  global.window.fileUtils = overrides.fileUtils || createFileUtilsMock()
  global.window.path = overrides.path || createPathMock()
  global.window.electron = overrides.electron || createElectronMock()
  global.window.crypto = overrides.crypto || createCryptoMock()
  global.window.Buffer = overrides.Buffer || createBufferMock()
  global.window.process = overrides.process || createProcessMock()
  global.window.os = overrides.os || { tmpdir: vi.fn(() => '/tmp') }
  global.window.childProcess = overrides.childProcess || {
    exec: vi.fn((cmd, opts, cb) => cb(null, 'success', '')),
    execFile: vi.fn((file, args, opts, cb) => cb(null, 'success', ''))
  }
  global.window.commandExists = overrides.commandExists || {
    exists: vi.fn(() => true)
  }

  return global.window
}

/**
 * Clears all window mocks
 */
export const clearWindowMocks = () => {
  if (global.window) {
    Object.keys(global.window).forEach(key => {
      if (global.window[key] && typeof global.window[key] === 'object') {
        Object.keys(global.window[key]).forEach(method => {
          if (typeof global.window[key][method]?.mockClear === 'function') {
            global.window[key][method].mockClear()
          }
        })
      }
    })
  }
}

// ============================================================================
// Test Data Factories
// ============================================================================

/**
 * Creates a mock file object
 */
export const createMockFile = (overrides = {}) => ({
  name: 'test.md',
  path: '/path/to/test.md',
  content: '# Test Markdown',
  size: 1024,
  mtime: new Date(),
  encoding: 'utf8',
  ...overrides
})

/**
 * Creates a mock markdown document
 */
export const createMockMarkdownDoc = (overrides = {}) => ({
  filename: 'test.md',
  markdown: '# Test Document\n\nThis is test content.',
  cursor: { line: 0, ch: 0 },
  history: [],
  pathname: '/path/to/test.md',
  isSaved: true,
  ...overrides
})

/**
 * Creates a mock preference object
 */
export const createMockPreferences = (overrides = {}) => ({
  theme: 'light',
  fontSize: 14,
  codeFontFamily: 'monospace',
  codeFontSize: 14,
  lineHeight: 1.6,
  autoSave: true,
  autoSaveDelay: 5000,
  spellcheckerEnabled: true,
  spellcheckerLanguage: 'en-US',
  ...overrides
})

/**
 * Creates a mock window state
 */
export const createMockWindowState = (overrides = {}) => ({
  id: 1,
  x: 100,
  y: 100,
  width: 1200,
  height: 800,
  isMaximized: false,
  isFullScreen: false,
  ...overrides
})

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Waits for a condition to be true
 * @param {Function} condition - Function that returns true when ready
 * @param {number} timeout - Timeout in milliseconds
 */
export const waitFor = (condition, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval)
        resolve()
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval)
        reject(new Error('Timeout waiting for condition'))
      }
    }, 50)
  })
}

/**
 * Simulates a delay (for testing async operations)
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Creates a mock event object
 */
export const createMockEvent = (type, props = {}) => ({
  type,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: {},
  currentTarget: {},
  ...props
})

/**
 * Captures all calls to a mock function
 */
export const getCallArgs = (mockFn) => {
  return mockFn.mock.calls.map(call => call[0])
}

/**
 * Asserts that a mock was called with specific arguments
 */
export const assertCalledWith = (mockFn, ...expectedArgs) => {
  const calls = mockFn.mock.calls
  const found = calls.some(call =>
    call.length === expectedArgs.length &&
    call.every((arg, i) => arg === expectedArgs[i])
  )
  if (!found) {
    throw new Error(
      `Expected mock to be called with ${JSON.stringify(expectedArgs)}\n` +
      `But was called with: ${JSON.stringify(calls)}`
    )
  }
}

// ============================================================================
// Markdown Test Utilities
// ============================================================================

/**
 * Sample markdown documents for testing
 */
export const SAMPLE_MARKDOWN = {
  simple: '# Hello World\n\nThis is a test.',
  withLinks: '# Links\n\n[Google](https://google.com)\n[GitHub](https://github.com)',
  withImages: '# Images\n\n![Alt text](image.png)\n![Photo](photo.jpg)',
  withCode: '# Code\n\n```javascript\nconst x = 42;\n```',
  withTable: '# Table\n\n| A | B |\n|---|---|\n| 1 | 2 |',
  complex: `# Complex Document

## Section 1

This has **bold** and *italic* text.

### Subsection

- List item 1
- List item 2
- List item 3

\`\`\`javascript
function test() {
  return true;
}
\`\`\`

![Image](test.png)

[Link](https://example.com)
`
}

/**
 * Validates markdown structure
 */
export const validateMarkdown = (markdown) => {
  return {
    hasHeaders: /^#+\s/m.test(markdown),
    hasLinks: /\[.*\]\(.*\)/.test(markdown),
    hasImages: /!\[.*\]\(.*\)/.test(markdown),
    hasCodeBlocks: /```[\s\S]*?```/.test(markdown),
    hasBold: /\*\*.*\*\*/.test(markdown),
    hasItalic: /\*.*\*/.test(markdown),
    hasList: /^[\s]*[-*+]\s/m.test(markdown)
  }
}

// ============================================================================
// File System Test Utilities
// ============================================================================

/**
 * Creates a mock file tree structure
 */
export const createMockFileTree = () => ({
  '/': {
    type: 'directory',
    children: {
      'documents': {
        type: 'directory',
        children: {
          'readme.md': { type: 'file', content: '# README' },
          'notes.md': { type: 'file', content: '# Notes' }
        }
      },
      'images': {
        type: 'directory',
        children: {
          'photo.jpg': { type: 'file', content: '[binary]' }
        }
      },
      'test.md': { type: 'file', content: '# Test' }
    }
  }
})

/**
 * Mock file system operations
 */
export const createMockFileSystem = () => {
  const files = new Map()

  return {
    files,
    exists: (path) => files.has(path),
    read: (path) => files.get(path),
    write: (path, content) => files.set(path, content),
    delete: (path) => files.delete(path),
    list: () => Array.from(files.keys()),
    clear: () => files.clear()
  }
}

// ============================================================================
// Exports
// ============================================================================

export default {
  // Window mocks
  createFileUtilsMock,
  createPathMock,
  createElectronMock,
  createCryptoMock,
  createBufferMock,
  createProcessMock,
  setupWindowMocks,
  clearWindowMocks,

  // Data factories
  createMockFile,
  createMockMarkdownDoc,
  createMockPreferences,
  createMockWindowState,

  // Test helpers
  waitFor,
  delay,
  createMockEvent,
  getCallArgs,
  assertCalledWith,

  // Markdown utilities
  SAMPLE_MARKDOWN,
  validateMarkdown,

  // File system utilities
  createMockFileTree,
  createMockFileSystem
}
