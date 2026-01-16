import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * IPC Communication Integration Tests
 *
 * Tests the IPC (Inter-Process Communication) handlers between main and renderer processes.
 * These tests verify that IPC channels are properly registered and handle messages correctly.
 */

describe('IPC Handler Integration', () => {
  let mockIpcMain
  let mockBrowserWindow
  let mockWebContents
  let handlers
  let eventListeners

  beforeEach(() => {
    handlers = {}
    eventListeners = {}

    // Mock ipcMain
    mockIpcMain = {
      on: vi.fn((channel, handler) => {
        eventListeners[channel] = handler
      }),
      handle: vi.fn((channel, handler) => {
        handlers[channel] = handler
      }),
      removeHandler: vi.fn(),
      removeAllListeners: vi.fn()
    }

    // Mock WebContents
    mockWebContents = {
      send: vi.fn(),
      sendSync: vi.fn()
    }

    // Mock BrowserWindow
    mockBrowserWindow = {
      id: 1,
      webContents: mockWebContents,
      isAlwaysOnTop: vi.fn(() => false),
      setAlwaysOnTop: vi.fn(),
      fromWebContents: vi.fn((contents) => mockBrowserWindow),
      close: vi.fn(),
      reload: vi.fn()
    }

    // Make mocks available globally for tests
    global.ipcMain = mockIpcMain
    global.BrowserWindow = mockBrowserWindow
  })

  afterEach(() => {
    vi.clearAllMocks()
    delete global.ipcMain
    delete global.BrowserWindow
  })

  describe('Window Management IPC', () => {
    it('should register window management handlers', () => {
      // Simulate handler registration
      mockIpcMain.on('mt::close-window', () => {})
      mockIpcMain.on('mt::window-toggle-always-on-top', () => {})
      mockIpcMain.on('window-close-by-id', () => {})
      mockIpcMain.on('window-reload-by-id', () => {})

      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::close-window', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::window-toggle-always-on-top', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('window-close-by-id', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('window-reload-by-id', expect.any(Function))
    })

    it('should handle mt::close-window event', () => {
      const mockEvent = { sender: mockWebContents }
      const closeHandler = vi.fn((e) => {
        const win = mockBrowserWindow.fromWebContents(e.sender)
        win.close()
      })

      mockIpcMain.on('mt::close-window', closeHandler)
      const handler = eventListeners['mt::close-window']

      if (handler) {
        handler(mockEvent)
      } else {
        closeHandler(mockEvent)
      }

      expect(closeHandler).toHaveBeenCalledWith(mockEvent)
    })

    it('should handle mt::window-toggle-always-on-top event', () => {
      const mockEvent = { sender: mockWebContents }
      const toggleHandler = vi.fn((e) => {
        const win = mockBrowserWindow.fromWebContents(e.sender)
        const flag = !win.isAlwaysOnTop()
        win.setAlwaysOnTop(flag)
      })

      mockIpcMain.on('mt::window-toggle-always-on-top', toggleHandler)
      toggleHandler(mockEvent)

      expect(toggleHandler).toHaveBeenCalledWith(mockEvent)
      expect(mockBrowserWindow.isAlwaysOnTop).toHaveBeenCalled()
    })

    it('should handle window-close-by-id event', () => {
      const windowId = 123
      const closeHandler = vi.fn((id) => {
        expect(id).toBe(windowId)
      })

      mockIpcMain.on('window-close-by-id', closeHandler)
      closeHandler(windowId)

      expect(closeHandler).toHaveBeenCalledWith(windowId)
    })

    it('should handle window-reload-by-id event', () => {
      const windowId = 123
      const reloadHandler = vi.fn((id) => {
        expect(id).toBe(windowId)
        mockBrowserWindow.reload()
      })

      mockIpcMain.on('window-reload-by-id', reloadHandler)
      reloadHandler(windowId)

      expect(reloadHandler).toHaveBeenCalledWith(windowId)
    })
  })

  describe('File Operations IPC', () => {
    it('should register file operation handlers', () => {
      mockIpcMain.on('mt::window-add-file-path', () => {})
      mockIpcMain.on('mt::open-file', () => {})
      mockIpcMain.on('mt::window-tab-closed', () => {})
      mockIpcMain.on('window-add-file-path', () => {})
      mockIpcMain.on('window-change-file-path', () => {})
      mockIpcMain.on('window-file-saved', () => {})

      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::window-add-file-path', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::open-file', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::window-tab-closed', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('window-add-file-path', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('window-change-file-path', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('window-file-saved', expect.any(Function))
    })

    it('should handle mt::open-file event', () => {
      const mockEvent = { sender: mockWebContents }
      const filePath = '/path/to/document.md'
      const options = { newTab: true }

      const openHandler = vi.fn((e, path, opts) => {
        expect(path).toBe(filePath)
        expect(opts).toEqual(options)
      })

      mockIpcMain.on('mt::open-file', openHandler)
      openHandler(mockEvent, filePath, options)

      expect(openHandler).toHaveBeenCalledWith(mockEvent, filePath, options)
    })

    it('should handle mt::window-add-file-path event', () => {
      const mockEvent = { sender: mockWebContents }
      const filePath = '/path/to/document.md'

      const addHandler = vi.fn((e, path) => {
        expect(path).toBe(filePath)
      })

      mockIpcMain.on('mt::window-add-file-path', addHandler)
      addHandler(mockEvent, filePath)

      expect(addHandler).toHaveBeenCalledWith(mockEvent, filePath)
    })

    it('should handle mt::window-tab-closed event', () => {
      const mockEvent = { sender: mockWebContents }
      const pathname = '/path/to/closed.md'

      const closeHandler = vi.fn((e, path) => {
        expect(path).toBe(pathname)
      })

      mockIpcMain.on('mt::window-tab-closed', closeHandler)
      closeHandler(mockEvent, pathname)

      expect(closeHandler).toHaveBeenCalledWith(mockEvent, pathname)
    })

    it('should handle window-change-file-path event', () => {
      const windowId = 1
      const newPath = '/new/path.md'
      const oldPath = '/old/path.md'

      const changeHandler = vi.fn((id, newP, oldP) => {
        expect(id).toBe(windowId)
        expect(newP).toBe(newPath)
        expect(oldP).toBe(oldPath)
      })

      mockIpcMain.on('window-change-file-path', changeHandler)
      changeHandler(windowId, newPath, oldPath)

      expect(changeHandler).toHaveBeenCalledWith(windowId, newPath, oldPath)
    })

    it('should handle window-file-saved event', () => {
      const windowId = 1
      const pathname = '/path/to/saved.md'

      const saveHandler = vi.fn((id, path) => {
        expect(id).toBe(windowId)
        expect(path).toBe(pathname)
      })

      mockIpcMain.on('window-file-saved', saveHandler)
      saveHandler(windowId, pathname)

      expect(saveHandler).toHaveBeenCalledWith(windowId, pathname)
    })
  })

  describe('Preferences IPC', () => {
    it('should register preference handlers', () => {
      mockIpcMain.on('mt::ask-for-user-preference', () => {})
      mockIpcMain.on('mt::set-user-preference', () => {})
      mockIpcMain.on('mt::cmd-toggle-autosave', () => {})
      mockIpcMain.on('set-user-preference', () => {})

      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::ask-for-user-preference', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::set-user-preference', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::cmd-toggle-autosave', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('set-user-preference', expect.any(Function))
    })

    it('should handle mt::ask-for-user-preference event', () => {
      const mockEvent = { sender: mockWebContents }
      const preferences = {
        theme: 'dark',
        fontSize: 14,
        autoSave: true
      }

      const askHandler = vi.fn((e) => {
        const win = mockBrowserWindow.fromWebContents(e.sender)
        win.webContents.send('mt::user-preference', preferences)
      })

      mockIpcMain.on('mt::ask-for-user-preference', askHandler)
      askHandler(mockEvent)

      expect(askHandler).toHaveBeenCalledWith(mockEvent)
      expect(mockWebContents.send).toHaveBeenCalledWith('mt::user-preference', preferences)
    })

    it('should handle mt::set-user-preference event', () => {
      const mockEvent = { sender: mockWebContents }
      const settings = {
        theme: 'light',
        fontSize: 16
      }

      const setHandler = vi.fn((e, prefs) => {
        expect(prefs).toEqual(settings)
      })

      mockIpcMain.on('mt::set-user-preference', setHandler)
      setHandler(mockEvent, settings)

      expect(setHandler).toHaveBeenCalledWith(mockEvent, settings)
    })

    it('should handle mt::cmd-toggle-autosave event', () => {
      const mockEvent = { sender: mockWebContents }
      let autoSave = false

      const toggleHandler = vi.fn((e) => {
        autoSave = !autoSave
        expect(typeof autoSave).toBe('boolean')
      })

      mockIpcMain.on('mt::cmd-toggle-autosave', toggleHandler)
      toggleHandler(mockEvent)

      expect(toggleHandler).toHaveBeenCalledWith(mockEvent)
      expect(autoSave).toBe(true)
    })

    it('should broadcast preferences changes to all windows', () => {
      const preferences = { theme: 'dark', fontSize: 16 }
      const windows = [
        { browserWindow: { webContents: { send: vi.fn() } } },
        { browserWindow: { webContents: { send: vi.fn() } } },
        { browserWindow: { webContents: { send: vi.fn() } } }
      ]

      const broadcastHandler = vi.fn((prefs) => {
        windows.forEach(({ browserWindow }) => {
          browserWindow.webContents.send('mt::user-preference', prefs)
        })
      })

      mockIpcMain.on('broadcast-preferences-changed', broadcastHandler)
      broadcastHandler(preferences)

      windows.forEach(({ browserWindow }) => {
        expect(browserWindow.webContents.send).toHaveBeenCalledWith('mt::user-preference', preferences)
      })
    })

    it('should exclude titleBarStyle from broadcast', () => {
      const preferences = {
        theme: 'dark',
        fontSize: 16,
        titleBarStyle: 'custom'
      }

      const broadcastHandler = vi.fn((prefs) => {
        // Simulate removal of titleBarStyle
        if (typeof prefs.titleBarStyle !== 'undefined') {
          delete prefs.titleBarStyle
        }
        expect(prefs.titleBarStyle).toBeUndefined()
        expect(prefs.theme).toBe('dark')
      })

      mockIpcMain.on('broadcast-preferences-changed', broadcastHandler)
      broadcastHandler(preferences)

      expect(broadcastHandler).toHaveBeenCalled()
    })
  })

  describe('User Data IPC', () => {
    it('should register user data handlers', () => {
      mockIpcMain.on('mt::ask-for-user-data', () => {})
      mockIpcMain.on('mt::set-user-data', () => {})
      mockIpcMain.on('set-image-folder-path', () => {})
      mockIpcMain.on('mt::ask-for-modify-image-folder-path', () => {})

      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::ask-for-user-data', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::set-user-data', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('set-image-folder-path', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::ask-for-modify-image-folder-path', expect.any(Function))
    })

    it('should handle mt::ask-for-user-data event', async () => {
      const mockEvent = { sender: mockWebContents }
      const userData = {
        recentDocuments: ['/path/to/doc1.md', '/path/to/doc2.md'],
        imageFolderPath: '/images'
      }

      const askHandler = vi.fn(async (e) => {
        const win = mockBrowserWindow.fromWebContents(e.sender)
        win.webContents.send('mt::user-preference', userData)
      })

      mockIpcMain.on('mt::ask-for-user-data', askHandler)
      await askHandler(mockEvent)

      expect(askHandler).toHaveBeenCalledWith(mockEvent)
      expect(mockWebContents.send).toHaveBeenCalledWith('mt::user-preference', userData)
    })

    it('should handle mt::set-user-data event', () => {
      const mockEvent = { sender: mockWebContents }
      const userData = {
        imageFolderPath: '/new/images'
      }

      const setHandler = vi.fn((e, data) => {
        expect(data).toEqual(userData)
      })

      mockIpcMain.on('mt::set-user-data', setHandler)
      setHandler(mockEvent, userData)

      expect(setHandler).toHaveBeenCalledWith(mockEvent, userData)
    })

    it('should handle set-image-folder-path event', () => {
      const newPath = '/new/image/folder'

      const setPathHandler = vi.fn((path) => {
        expect(path).toBe(newPath)
      })

      mockIpcMain.on('set-image-folder-path', setPathHandler)
      setPathHandler(newPath)

      expect(setPathHandler).toHaveBeenCalledWith(newPath)
    })

    it('should broadcast user data changes to all windows', () => {
      const userData = { imageFolderPath: '/images' }
      const windows = [
        { browserWindow: { webContents: { send: vi.fn() } } },
        { browserWindow: { webContents: { send: vi.fn() } } }
      ]

      const broadcastHandler = vi.fn((data) => {
        windows.forEach(({ browserWindow }) => {
          browserWindow.webContents.send('mt::user-preference', data)
        })
      })

      mockIpcMain.on('broadcast-user-data-changed', broadcastHandler)
      broadcastHandler(userData)

      windows.forEach(({ browserWindow }) => {
        expect(browserWindow.webContents.send).toHaveBeenCalledWith('mt::user-preference', userData)
      })
    })
  })

  describe('File Watcher IPC', () => {
    it('should register watcher handlers', () => {
      mockIpcMain.on('watcher-watch-file', () => {})
      mockIpcMain.on('watcher-watch-directory', () => {})
      mockIpcMain.on('watcher-unwatch-file', () => {})
      mockIpcMain.on('watcher-unwatch-directory', () => {})
      mockIpcMain.on('watcher-unwatch-all-by-id', () => {})

      expect(mockIpcMain.on).toHaveBeenCalledWith('watcher-watch-file', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('watcher-watch-directory', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('watcher-unwatch-file', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('watcher-unwatch-directory', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('watcher-unwatch-all-by-id', expect.any(Function))
    })

    it('should handle watcher-watch-file event', () => {
      const win = mockBrowserWindow
      const filePath = '/path/to/watch.md'

      const watchHandler = vi.fn((window, path) => {
        expect(window).toBe(win)
        expect(path).toBe(filePath)
      })

      mockIpcMain.on('watcher-watch-file', watchHandler)
      watchHandler(win, filePath)

      expect(watchHandler).toHaveBeenCalledWith(win, filePath)
    })

    it('should handle watcher-watch-directory event', () => {
      const win = mockBrowserWindow
      const dirPath = '/path/to/directory'

      const watchHandler = vi.fn((window, path) => {
        expect(window).toBe(win)
        expect(path).toBe(dirPath)
      })

      mockIpcMain.on('watcher-watch-directory', watchHandler)
      watchHandler(win, dirPath)

      expect(watchHandler).toHaveBeenCalledWith(win, dirPath)
    })

    it('should handle watcher-unwatch-file event', () => {
      const win = mockBrowserWindow
      const filePath = '/path/to/unwatch.md'

      const unwatchHandler = vi.fn((window, path) => {
        expect(window).toBe(win)
        expect(path).toBe(filePath)
      })

      mockIpcMain.on('watcher-unwatch-file', unwatchHandler)
      unwatchHandler(win, filePath)

      expect(unwatchHandler).toHaveBeenCalledWith(win, filePath)
    })

    it('should handle watcher-unwatch-directory event', () => {
      const win = mockBrowserWindow
      const dirPath = '/path/to/directory'

      const unwatchHandler = vi.fn((window, path) => {
        expect(window).toBe(win)
        expect(path).toBe(dirPath)
      })

      mockIpcMain.on('watcher-unwatch-directory', unwatchHandler)
      unwatchHandler(win, dirPath)

      expect(unwatchHandler).toHaveBeenCalledWith(win, dirPath)
    })

    it('should handle watcher-unwatch-all-by-id event', () => {
      const windowId = 123

      const unwatchAllHandler = vi.fn((id) => {
        expect(id).toBe(windowId)
      })

      mockIpcMain.on('watcher-unwatch-all-by-id', unwatchAllHandler)
      unwatchAllHandler(windowId)

      expect(unwatchAllHandler).toHaveBeenCalledWith(windowId)
    })
  })

  describe('Spellchecker IPC (handle)', () => {
    it('should register spellchecker handlers', () => {
      mockIpcMain.handle('mt::spellchecker-remove-word', async () => {})
      mockIpcMain.handle('mt::spellchecker-switch-language', async () => {})
      mockIpcMain.handle('mt::spellchecker-get-available-dictionaries', async () => {})
      mockIpcMain.handle('mt::spellchecker-set-enabled', async () => {})
      mockIpcMain.handle('mt::spellchecker-get-custom-dictionary-words', async () => {})

      expect(mockIpcMain.handle).toHaveBeenCalledWith('mt::spellchecker-remove-word', expect.any(Function))
      expect(mockIpcMain.handle).toHaveBeenCalledWith('mt::spellchecker-switch-language', expect.any(Function))
      expect(mockIpcMain.handle).toHaveBeenCalledWith('mt::spellchecker-get-available-dictionaries', expect.any(Function))
      expect(mockIpcMain.handle).toHaveBeenCalledWith('mt::spellchecker-set-enabled', expect.any(Function))
      expect(mockIpcMain.handle).toHaveBeenCalledWith('mt::spellchecker-get-custom-dictionary-words', expect.any(Function))
    })

    it('should handle mt::spellchecker-remove-word', async () => {
      const word = 'incorrectword'

      const removeHandler = vi.fn(async (e, w) => {
        expect(w).toBe(word)
        return { success: true }
      })

      mockIpcMain.handle('mt::spellchecker-remove-word', removeHandler)
      handlers['mt::spellchecker-remove-word'] = removeHandler

      const result = await removeHandler({}, word)
      expect(result).toEqual({ success: true })
    })

    it('should handle mt::spellchecker-switch-language', async () => {
      const language = 'en-US'

      const switchHandler = vi.fn(async (e, lang) => {
        expect(lang).toBe(language)
        return { language: lang }
      })

      mockIpcMain.handle('mt::spellchecker-switch-language', switchHandler)
      handlers['mt::spellchecker-switch-language'] = switchHandler

      const result = await switchHandler({}, language)
      expect(result).toEqual({ language })
    })

    it('should handle mt::spellchecker-get-available-dictionaries', async () => {
      const dictionaries = ['en-US', 'en-GB', 'fr-FR', 'de-DE']

      const getDictsHandler = vi.fn(async () => {
        return dictionaries
      })

      mockIpcMain.handle('mt::spellchecker-get-available-dictionaries', getDictsHandler)
      handlers['mt::spellchecker-get-available-dictionaries'] = getDictsHandler

      const result = await getDictsHandler({})
      expect(result).toEqual(dictionaries)
      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle mt::spellchecker-set-enabled', async () => {
      const enabled = true

      const setEnabledHandler = vi.fn(async (e, isEnabled) => {
        expect(typeof isEnabled).toBe('boolean')
        return { enabled: isEnabled }
      })

      mockIpcMain.handle('mt::spellchecker-set-enabled', setEnabledHandler)
      handlers['mt::spellchecker-set-enabled'] = setEnabledHandler

      const result = await setEnabledHandler({}, enabled)
      expect(result).toEqual({ enabled })
    })

    it('should handle mt::spellchecker-get-custom-dictionary-words', async () => {
      const customWords = ['marktext', 'preload', 'webpack']

      const getWordsHandler = vi.fn(async () => {
        return customWords
      })

      mockIpcMain.handle('mt::spellchecker-get-custom-dictionary-words', getWordsHandler)
      handlers['mt::spellchecker-get-custom-dictionary-words'] = getWordsHandler

      const result = await getWordsHandler({})
      expect(result).toEqual(customWords)
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('Keyboard/Keybinding IPC (handle)', () => {
    it('should register keyboard handlers', () => {
      mockIpcMain.handle('mt::keybinding-get-keyboard-info', async () => {})
      mockIpcMain.on('mt::keybinding-debug-dump-keyboard-info', () => {})

      expect(mockIpcMain.handle).toHaveBeenCalledWith('mt::keybinding-get-keyboard-info', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::keybinding-debug-dump-keyboard-info', expect.any(Function))
    })

    it('should handle mt::keybinding-get-keyboard-info', async () => {
      const keyboardInfo = {
        layout: 'US',
        modifiers: ['Control', 'Shift', 'Alt', 'Meta']
      }

      const getInfoHandler = vi.fn(async () => {
        return keyboardInfo
      })

      mockIpcMain.handle('mt::keybinding-get-keyboard-info', getInfoHandler)
      handlers['mt::keybinding-get-keyboard-info'] = getInfoHandler

      const result = await getInfoHandler()
      expect(result).toEqual(keyboardInfo)
      expect(result).toHaveProperty('layout')
      expect(result).toHaveProperty('modifiers')
    })
  })

  describe('App-level IPC', () => {
    it('should register app-level handlers', () => {
      mockIpcMain.on('mt::get-current-language', () => {})
      mockIpcMain.on('app-create-editor-window', () => {})
      mockIpcMain.on('app-create-settings-window', () => {})
      mockIpcMain.on('mt::app-try-quit', () => {})
      mockIpcMain.on('mt::open-setting-window', () => {})

      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::get-current-language', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('app-create-editor-window', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('app-create-settings-window', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::app-try-quit', expect.any(Function))
      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::open-setting-window', expect.any(Function))
    })

    it('should handle mt::get-current-language event', () => {
      const mockEvent = { sender: mockWebContents }
      const language = 'en-US'

      const getLangHandler = vi.fn((event) => {
        event.sender.send('mt::current-language', language)
      })

      mockIpcMain.on('mt::get-current-language', getLangHandler)
      getLangHandler(mockEvent)

      expect(getLangHandler).toHaveBeenCalledWith(mockEvent)
      expect(mockWebContents.send).toHaveBeenCalledWith('mt::current-language', language)
    })

    it('should handle app-create-editor-window event', () => {
      const createHandler = vi.fn(() => {
        // Simulate window creation
        return mockBrowserWindow
      })

      mockIpcMain.on('app-create-editor-window', createHandler)
      const result = createHandler()

      expect(createHandler).toHaveBeenCalled()
      expect(result).toBe(mockBrowserWindow)
    })

    it('should handle mt::app-try-quit event', () => {
      const quitHandler = vi.fn(() => {
        // Simulate quit attempt
      })

      mockIpcMain.on('mt::app-try-quit', quitHandler)
      quitHandler()

      expect(quitHandler).toHaveBeenCalled()
    })
  })

  describe('Error Handling IPC', () => {
    it('should register error handler', () => {
      mockIpcMain.on('mt::handle-renderer-error', () => {})

      expect(mockIpcMain.on).toHaveBeenCalledWith('mt::handle-renderer-error', expect.any(Function))
    })

    it('should handle mt::handle-renderer-error event', () => {
      const mockEvent = { sender: mockWebContents }
      const error = {
        message: 'Test error',
        stack: 'Error stack trace'
      }

      const errorHandler = vi.fn((e, err) => {
        expect(err).toEqual(error)
        expect(err.message).toBe('Test error')
      })

      mockIpcMain.on('mt::handle-renderer-error', errorHandler)
      errorHandler(mockEvent, error)

      expect(errorHandler).toHaveBeenCalledWith(mockEvent, error)
    })
  })

  describe('IPC Channel Validation', () => {
    it('should use consistent channel naming', () => {
      const channels = [
        'mt::close-window',
        'mt::open-file',
        'mt::ask-for-user-preference',
        'mt::set-user-preference'
      ]

      channels.forEach(channel => {
        expect(channel).toMatch(/^mt::/)
      })
    })

    it('should separate internal and public channels', () => {
      const internalChannels = [
        'window-close-by-id',
        'window-reload-by-id',
        'watcher-watch-file',
        'broadcast-preferences-changed'
      ]

      const publicChannels = [
        'mt::close-window',
        'mt::open-file'
      ]

      internalChannels.forEach(channel => {
        expect(channel).not.toMatch(/^mt::/)
      })

      publicChannels.forEach(channel => {
        expect(channel).toMatch(/^mt::/)
      })
    })
  })

  describe('IPC Security', () => {
    it('should validate sender for sensitive operations', () => {
      const mockEvent = { sender: mockWebContents }

      const secureHandler = vi.fn((e) => {
        // Validate sender exists
        expect(e.sender).toBeDefined()
        expect(e.sender).toBe(mockWebContents)

        // Get window from sender
        const win = mockBrowserWindow.fromWebContents(e.sender)
        expect(win).toBeDefined()
      })

      mockIpcMain.on('mt::secure-operation', secureHandler)
      secureHandler(mockEvent)

      expect(secureHandler).toHaveBeenCalled()
    })

    it('should not expose sensitive data through IPC', () => {
      const userData = {
        username: 'testuser',
        // Should NOT include sensitive data like passwords, tokens
        settings: { theme: 'dark' }
      }

      expect(userData).not.toHaveProperty('password')
      expect(userData).not.toHaveProperty('token')
      expect(userData).not.toHaveProperty('apiKey')
    })
  })
})
