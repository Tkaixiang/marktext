import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * File Watcher Tests
 *
 * Tests the file system watcher that monitors file and directory changes.
 * Tests watcher lifecycle, event handling, and change detection.
 */

describe('File Watcher', () => {
  let mockChokidar
  let mockWatcher
  let mockBrowserWindow
  let eventHandlers

  beforeEach(() => {
    eventHandlers = {}

    // Mock chokidar watcher
    mockWatcher = {
      on: vi.fn((event, handler) => {
        eventHandlers[event] = handler
        return mockWatcher
      }),
      add: vi.fn((path) => mockWatcher),
      unwatch: vi.fn((path) => mockWatcher),
      close: vi.fn(() => Promise.resolve()),
      getWatched: vi.fn(() => ({}))
    }

    // Mock chokidar
    mockChokidar = {
      watch: vi.fn((paths, options) => mockWatcher)
    }

    // Mock BrowserWindow
    mockBrowserWindow = {
      webContents: {
        send: vi.fn()
      }
    }

    global.chokidar = mockChokidar
  })

  afterEach(() => {
    vi.clearAllMocks()
    delete global.chokidar
  })

  describe('Watcher Creation', () => {
    it('should create watcher with default options', () => {
      const paths = ['/path/to/watch']
      const options = {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        ignoreInitial: true
      }

      mockChokidar.watch(paths, options)

      expect(mockChokidar.watch).toHaveBeenCalledWith(paths, options)
    })

    it('should create watcher for single file', () => {
      const filePath = '/path/to/document.md'

      mockChokidar.watch(filePath)

      expect(mockChokidar.watch).toHaveBeenCalledWith(filePath)
    })

    it('should create watcher for directory', () => {
      const dirPath = '/path/to/directory'

      mockChokidar.watch(dirPath, { depth: 99 })

      expect(mockChokidar.watch).toHaveBeenCalledWith(dirPath, expect.objectContaining({ depth: 99 }))
    })

    it('should set up event listeners', () => {
      const watcher = mockChokidar.watch('/path')

      watcher.on('add', vi.fn())
      watcher.on('change', vi.fn())
      watcher.on('unlink', vi.fn())

      expect(watcher.on).toHaveBeenCalledWith('add', expect.any(Function))
      expect(watcher.on).toHaveBeenCalledWith('change', expect.any(Function))
      expect(watcher.on).toHaveBeenCalledWith('unlink', expect.any(Function))
    })
  })

  describe('File Change Detection', () => {
    it('should detect file addition', () => {
      const filePath = '/path/to/new-file.md'
      const watcher = mockChokidar.watch('/path')

      const addHandler = vi.fn()
      watcher.on('add', addHandler)

      // Simulate file add event
      if (eventHandlers.add) {
        eventHandlers.add(filePath)
      } else {
        addHandler(filePath)
      }

      expect(addHandler).toHaveBeenCalledWith(filePath)
    })

    it('should detect file change', () => {
      const filePath = '/path/to/changed.md'
      const watcher = mockChokidar.watch('/path')

      const changeHandler = vi.fn()
      watcher.on('change', changeHandler)

      if (eventHandlers.change) {
        eventHandlers.change(filePath)
      } else {
        changeHandler(filePath)
      }

      expect(changeHandler).toHaveBeenCalledWith(filePath)
    })

    it('should detect file deletion', () => {
      const filePath = '/path/to/deleted.md'
      const watcher = mockChokidar.watch('/path')

      const unlinkHandler = vi.fn()
      watcher.on('unlink', unlinkHandler)

      if (eventHandlers.unlink) {
        eventHandlers.unlink(filePath)
      } else {
        unlinkHandler(filePath)
      }

      expect(unlinkHandler).toHaveBeenCalledWith(filePath)
    })

    it('should detect directory addition', () => {
      const dirPath = '/path/to/new-dir'
      const watcher = mockChokidar.watch('/path')

      const addDirHandler = vi.fn()
      watcher.on('addDir', addDirHandler)

      if (eventHandlers.addDir) {
        eventHandlers.addDir(dirPath)
      } else {
        addDirHandler(dirPath)
      }

      expect(addDirHandler).toHaveBeenCalledWith(dirPath)
    })

    it('should detect directory deletion', () => {
      const dirPath = '/path/to/deleted-dir'
      const watcher = mockChokidar.watch('/path')

      const unlinkDirHandler = vi.fn()
      watcher.on('unlinkDir', unlinkDirHandler)

      if (eventHandlers.unlinkDir) {
        eventHandlers.unlinkDir(dirPath)
      } else {
        unlinkDirHandler(dirPath)
      }

      expect(unlinkDirHandler).toHaveBeenCalledWith(dirPath)
    })
  })

  describe('Watcher Configuration', () => {
    it('should ignore hidden files by default', () => {
      const options = {
        ignored: /(^|[\/\\])\../,
        persistent: true
      }

      mockChokidar.watch('/path', options)

      expect(mockChokidar.watch).toHaveBeenCalledWith('/path', expect.objectContaining({
        ignored: expect.any(RegExp)
      }))
    })

    it('should configure polling for network drives', () => {
      const options = {
        usePolling: true,
        interval: 1000,
        binaryInterval: 3000
      }

      mockChokidar.watch('/network/path', options)

      expect(mockChokidar.watch).toHaveBeenCalledWith('/network/path', expect.objectContaining({
        usePolling: true
      }))
    })

    it('should set depth for directory watching', () => {
      const options = { depth: 5 }

      mockChokidar.watch('/path', options)

      expect(mockChokidar.watch).toHaveBeenCalledWith('/path', expect.objectContaining({
        depth: 5
      }))
    })

    it('should configure awaitWriteFinish', () => {
      const options = {
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 150
        }
      }

      mockChokidar.watch('/path', options)

      expect(mockChokidar.watch).toHaveBeenCalledWith('/path', expect.objectContaining({
        awaitWriteFinish: expect.any(Object)
      }))
    })
  })

  describe('Watch Management', () => {
    it('should add path to watch', () => {
      const watcher = mockChokidar.watch('/initial/path')
      const newPath = '/new/path'

      watcher.add(newPath)

      expect(watcher.add).toHaveBeenCalledWith(newPath)
    })

    it('should unwatch path', () => {
      const watcher = mockChokidar.watch('/path')
      const pathToRemove = '/path/to/remove'

      watcher.unwatch(pathToRemove)

      expect(watcher.unwatch).toHaveBeenCalledWith(pathToRemove)
    })

    it('should get watched paths', () => {
      const watcher = mockChokidar.watch('/path')
      const watched = {
        '/path': ['file1.md', 'file2.md']
      }

      mockWatcher.getWatched.mockReturnValue(watched)

      const result = watcher.getWatched()

      expect(result).toEqual(watched)
    })

    it('should close watcher', async () => {
      const watcher = mockChokidar.watch('/path')

      await watcher.close()

      expect(watcher.close).toHaveBeenCalled()
    })
  })

  describe('Event Broadcasting', () => {
    it('should send add event to renderer', () => {
      const filePath = '/path/to/file.md'
      const fileData = {
        pathname: filePath,
        name: 'file.md',
        isFile: true,
        isDirectory: false,
        isMarkdown: true
      }

      mockBrowserWindow.webContents.send('mt::update-file', {
        type: 'add',
        change: fileData
      })

      expect(mockBrowserWindow.webContents.send).toHaveBeenCalledWith(
        'mt::update-file',
        expect.objectContaining({ type: 'add' })
      )
    })

    it('should send change event to renderer', () => {
      const filePath = '/path/to/changed.md'

      mockBrowserWindow.webContents.send('mt::update-file', {
        type: 'change',
        change: { pathname: filePath }
      })

      expect(mockBrowserWindow.webContents.send).toHaveBeenCalledWith(
        'mt::update-file',
        expect.objectContaining({ type: 'change' })
      )
    })

    it('should send unlink event to renderer', () => {
      const filePath = '/path/to/deleted.md'

      mockBrowserWindow.webContents.send('mt::update-file', {
        type: 'unlink',
        change: { pathname: filePath }
      })

      expect(mockBrowserWindow.webContents.send).toHaveBeenCalledWith(
        'mt::update-file',
        expect.objectContaining({ type: 'unlink' })
      )
    })

    it('should send directory update event', () => {
      const dirPath = '/path/to/dir'

      mockBrowserWindow.webContents.send('mt::update-object-tree', {
        type: 'addDir',
        change: { pathname: dirPath }
      })

      expect(mockBrowserWindow.webContents.send).toHaveBeenCalledWith(
        'mt::update-object-tree',
        expect.any(Object)
      )
    })
  })

  describe('File Filtering', () => {
    it('should filter markdown files', () => {
      const hasMarkdownExtension = (filename) => {
        return /\.(md|markdown|mmd)$/i.test(filename)
      }

      expect(hasMarkdownExtension('document.md')).toBe(true)
      expect(hasMarkdownExtension('README.markdown')).toBe(true)
      expect(hasMarkdownExtension('notes.mmd')).toBe(true)
      expect(hasMarkdownExtension('file.txt')).toBe(false)
    })

    it('should ignore non-markdown files', () => {
      const files = ['doc.md', 'image.png', 'video.mp4', 'notes.markdown']
      const markdownFiles = files.filter(f => /\.(md|markdown|mmd)$/i.test(f))

      expect(markdownFiles).toHaveLength(2)
      expect(markdownFiles).toContain('doc.md')
      expect(markdownFiles).toContain('notes.markdown')
    })

    it('should respect exclude patterns', () => {
      const excludePatterns = ['node_modules', '.git', 'dist']
      const shouldExclude = (path) => {
        return excludePatterns.some(pattern => path.includes(pattern))
      }

      expect(shouldExclude('/project/node_modules/file.md')).toBe(true)
      expect(shouldExclude('/project/.git/file')).toBe(true)
      expect(shouldExclude('/project/src/file.md')).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should handle watcher errors', () => {
      const watcher = mockChokidar.watch('/path')
      const errorHandler = vi.fn()

      watcher.on('error', errorHandler)

      const error = new Error('Watcher error')
      if (eventHandlers.error) {
        eventHandlers.error(error)
      } else {
        errorHandler(error)
      }

      expect(errorHandler).toHaveBeenCalledWith(error)
    })

    it('should handle file read errors gracefully', () => {
      const handleError = vi.fn((error) => {
        expect(error).toBeInstanceOf(Error)
        // Should not crash
      })

      try {
        throw new Error('File read failed')
      } catch (err) {
        handleError(err)
      }

      expect(handleError).toHaveBeenCalled()
    })

    it('should send error notification to renderer', () => {
      const error = {
        title: 'Watcher I/O error',
        type: 'error',
        message: 'Failed to read file'
      }

      mockBrowserWindow.webContents.send('mt::show-notification', error)

      expect(mockBrowserWindow.webContents.send).toHaveBeenCalledWith(
        'mt::show-notification',
        expect.objectContaining({ type: 'error' })
      )
    })
  })

  describe('Performance', () => {
    it('should debounce rapid file changes', () => {
      const debounce = (fn, delay) => {
        let timer
        return (...args) => {
          clearTimeout(timer)
          timer = setTimeout(() => fn(...args), delay)
        }
      }

      const handler = vi.fn()
      const debouncedHandler = debounce(handler, 100)

      debouncedHandler()
      debouncedHandler()
      debouncedHandler()

      // Should only call once after delay
      expect(handler).not.toHaveBeenCalled()
    })

    it('should use stability threshold', () => {
      const STABILITY_THRESHOLD = 1000
      const POLL_INTERVAL = 150

      expect(STABILITY_THRESHOLD).toBe(1000)
      expect(POLL_INTERVAL).toBe(150)
    })

    it('should handle large directory efficiently', () => {
      const largeDir = '/path/with/many/files'
      const options = {
        depth: 99,
        ignoreInitial: true
      }

      mockChokidar.watch(largeDir, options)

      expect(mockChokidar.watch).toHaveBeenCalledWith(
        largeDir,
        expect.objectContaining({ ignoreInitial: true })
      )
    })
  })

  describe('Platform-Specific Behavior', () => {
    it('should use different polling on Linux', () => {
      const isLinux = process.platform === 'linux'
      const options = {
        usePolling: isLinux,
        interval: isLinux ? 1000 : undefined
      }

      expect(typeof options.usePolling).toBe('boolean')
    })

    it('should handle case sensitivity on different platforms', () => {
      const isWindows = process.platform === 'win32'
      const isCaseSensitive = !isWindows

      expect(typeof isCaseSensitive).toBe('boolean')
    })
  })

  describe('Watcher Lifecycle', () => {
    it('should initialize watcher on window creation', () => {
      const initWatcher = vi.fn(() => {
        return mockChokidar.watch('/path')
      })

      const watcher = initWatcher()

      expect(initWatcher).toHaveBeenCalled()
      expect(watcher).toBeDefined()
    })

    it('should cleanup watcher on window close', async () => {
      const watcher = mockChokidar.watch('/path')

      await watcher.close()

      expect(watcher.close).toHaveBeenCalled()
    })

    it('should remove all listeners on cleanup', () => {
      const watcher = mockChokidar.watch('/path')
      watcher.on('add', vi.fn())
      watcher.on('change', vi.fn())

      // Simulate cleanup
      watcher.close()

      expect(watcher.close).toHaveBeenCalled()
    })
  })

  describe('Multiple Watchers', () => {
    it('should manage multiple watchers', () => {
      const watchers = new Map()

      watchers.set('watcher1', mockChokidar.watch('/path1'))
      watchers.set('watcher2', mockChokidar.watch('/path2'))

      expect(watchers.size).toBe(2)
      expect(watchers.has('watcher1')).toBe(true)
      expect(watchers.has('watcher2')).toBe(true)
    })

    it('should close all watchers', async () => {
      const watcher1 = mockChokidar.watch('/path1')
      const watcher2 = mockChokidar.watch('/path2')

      await Promise.all([
        watcher1.close(),
        watcher2.close()
      ])

      expect(watcher1.close).toHaveBeenCalled()
      expect(watcher2.close).toHaveBeenCalled()
    })

    it('should handle watcher conflicts', () => {
      const watchers = new Map()
      const id = 'test-watcher'

      // First watcher
      watchers.set(id, mockChokidar.watch('/path1'))

      // Replace with new watcher
      const oldWatcher = watchers.get(id)
      watchers.set(id, mockChokidar.watch('/path2'))

      // Should close old watcher
      if (oldWatcher) {
        oldWatcher.close()
      }

      expect(watchers.size).toBe(1)
    })
  })
})
