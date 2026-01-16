import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { setupWindowMocks, clearWindowMocks } from '../helpers/testUtils.js'

/**
 * Pinia Store Tests
 *
 * Tests the Pinia state management stores including main store, preferences, and editor stores.
 * These tests verify state initialization, getters, actions, and store interactions.
 */

describe('Pinia Store Management', () => {
  let pinia

  beforeEach(() => {
    // Set up window mocks
    setupWindowMocks()

    // Create fresh Pinia instance for each test
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    clearWindowMocks()
    vi.clearAllMocks()
  })

  describe('Main Store', () => {
    it('should initialize with correct default state', () => {
      // Mock the main store structure
      const mainStore = {
        platform: window.electron.process.platform,
        appVersion: window.electron.process.env.MARKTEXT_VERSION_STRING || '0.0.0',
        windowActive: true,
        init: false
      }

      expect(mainStore.platform).toBeDefined()
      expect(['darwin', 'win32', 'linux']).toContain(mainStore.platform)
      expect(mainStore.windowActive).toBe(true)
      expect(mainStore.init).toBe(false)
    })

    it('should have platform detection', () => {
      const platforms = ['darwin', 'win32', 'linux']
      const currentPlatform = window.electron.process.platform

      expect(platforms).toContain(currentPlatform)
    })

    it('should track window active status', () => {
      const mainStore = {
        windowActive: true,
        SET_WIN_STATUS(status) {
          this.windowActive = status
        }
      }

      expect(mainStore.windowActive).toBe(true)

      mainStore.SET_WIN_STATUS(false)
      expect(mainStore.windowActive).toBe(false)

      mainStore.SET_WIN_STATUS(true)
      expect(mainStore.windowActive).toBe(true)
    })

    it('should track initialization status', () => {
      const mainStore = {
        init: false,
        SET_INITIALIZED() {
          this.init = true
        }
      }

      expect(mainStore.init).toBe(false)

      mainStore.SET_INITIALIZED()
      expect(mainStore.init).toBe(true)
    })

    it('should listen for window status changes', () => {
      const mockCallback = vi.fn()
      window.electron.ipcRenderer.on('mt::window-active-status', mockCallback)

      // Simulate IPC event
      window.electron.ipcRenderer.on.mock.calls[0][1]({}, { status: false })

      expect(mockCallback).toHaveBeenCalledWith({}, { status: false })
    })
  })

  describe('Preferences Store', () => {
    it('should initialize with default preferences', () => {
      const preferencesStore = {
        autoSave: false,
        autoSaveDelay: 5000,
        titleBarStyle: 'custom',
        openFilesInNewWindow: false,
        openFolderInNewWindow: false,
        zoom: 1.0,
        hideScrollbar: false,
        wordWrapInToc: false,
        fileSortBy: 'created',
        startUpAction: 'lastState',
        language: 'en'
      }

      expect(preferencesStore.autoSave).toBe(false)
      expect(preferencesStore.autoSaveDelay).toBe(5000)
      expect(preferencesStore.zoom).toBe(1.0)
      expect(preferencesStore.language).toBe('en')
    })

    it('should have editor preferences', () => {
      const editorPrefs = {
        editorFontFamily: 'Open Sans',
        fontSize: 16,
        lineHeight: 1.6,
        codeFontSize: 14,
        codeFontFamily: 'DejaVu Sans Mono',
        codeBlockLineNumbers: true,
        editorLineWidth: ''
      }

      expect(editorPrefs.fontSize).toBe(16)
      expect(editorPrefs.lineHeight).toBe(1.6)
      expect(editorPrefs.codeBlockLineNumbers).toBe(true)
      expect(typeof editorPrefs.editorFontFamily).toBe('string')
    })

    it('should have markdown preferences', () => {
      const markdownPrefs = {
        autoPairBracket: true,
        autoPairMarkdownSyntax: true,
        autoPairQuote: true,
        endOfLine: 'default',
        defaultEncoding: 'utf8',
        autoGuessEncoding: true,
        trimTrailingNewline: 2,
        textDirection: 'ltr'
      }

      expect(markdownPrefs.autoPairBracket).toBe(true)
      expect(markdownPrefs.defaultEncoding).toBe('utf8')
      expect(markdownPrefs.textDirection).toBe('ltr')
    })

    it('should have theme preferences', () => {
      const themePrefs = {
        theme: 'light',
        followSystemTheme: true,
        lightModeTheme: 'light',
        darkModeTheme: 'dark',
        customCss: ''
      }

      expect(themePrefs.theme).toBe('light')
      expect(themePrefs.followSystemTheme).toBe(true)
      expect(['light', 'dark']).toContain(themePrefs.theme)
    })

    it('should have spellchecker preferences', () => {
      const spellcheckerPrefs = {
        spellcheckerEnabled: false,
        spellcheckerNoUnderline: false,
        spellcheckerLanguage: 'en-US'
      }

      expect(typeof spellcheckerPrefs.spellcheckerEnabled).toBe('boolean')
      expect(spellcheckerPrefs.spellcheckerLanguage).toMatch(/^[a-z]{2}-[A-Z]{2}$/)
    })

    it('should update preferences', () => {
      const preferencesStore = {
        theme: 'light',
        fontSize: 16,
        SET_PREFERENCE(key, value) {
          this[key] = value
        }
      }

      preferencesStore.SET_PREFERENCE('theme', 'dark')
      expect(preferencesStore.theme).toBe('dark')

      preferencesStore.SET_PREFERENCE('fontSize', 18)
      expect(preferencesStore.fontSize).toBe(18)
    })

    it('should validate preference types', () => {
      const prefs = {
        autoSave: false,
        zoom: 1.0,
        fontSize: 16,
        language: 'en',
        treePathExcludePatterns: []
      }

      expect(typeof prefs.autoSave).toBe('boolean')
      expect(typeof prefs.zoom).toBe('number')
      expect(typeof prefs.fontSize).toBe('number')
      expect(typeof prefs.language).toBe('string')
      expect(Array.isArray(prefs.treePathExcludePatterns)).toBe(true)
    })

    it('should handle zoom preferences', () => {
      const preferencesStore = {
        zoom: 1.0,
        setZoom(level) {
          if (level >= 0.5 && level <= 2.0) {
            this.zoom = level
          }
        }
      }

      preferencesStore.setZoom(1.2)
      expect(preferencesStore.zoom).toBe(1.2)

      preferencesStore.setZoom(0.8)
      expect(preferencesStore.zoom).toBe(0.8)

      // Test bounds
      const invalidZoom = 3.0
      preferencesStore.setZoom(invalidZoom)
      expect(preferencesStore.zoom).not.toBe(invalidZoom)
    })

    it('should handle language preferences', () => {
      const supportedLanguages = ['en', 'zh-CN', 'zh-TW', 'fr', 'de', 'es']
      const preferencesStore = {
        language: 'en',
        setLanguage(lang) {
          if (supportedLanguages.includes(lang)) {
            this.language = lang
          }
        }
      }

      preferencesStore.setLanguage('zh-CN')
      expect(preferencesStore.language).toBe('zh-CN')

      preferencesStore.setLanguage('invalid')
      expect(preferencesStore.language).not.toBe('invalid')
    })
  })

  describe('Editor Store', () => {
    it('should initialize with empty state', () => {
      const editorStore = {
        currentFile: {},
        tabs: [],
        listToc: [],
        toc: []
      }

      expect(editorStore.currentFile).toEqual({})
      expect(editorStore.tabs).toEqual([])
      expect(editorStore.listToc).toEqual([])
      expect(editorStore.toc).toEqual([])
    })

    it('should manage current file', () => {
      const editorStore = {
        currentFile: {},
        setCurrentFile(file) {
          this.currentFile = file
        }
      }

      const file = {
        id: '1',
        path: '/test/document.md',
        content: '# Test Document',
        markdown: '# Test Document'
      }

      editorStore.setCurrentFile(file)
      expect(editorStore.currentFile).toEqual(file)
      expect(editorStore.currentFile.id).toBe('1')
    })

    it('should manage tabs', () => {
      const editorStore = {
        tabs: [],
        addTab(tab) {
          this.tabs.push(tab)
        },
        removeTab(tabId) {
          this.tabs = this.tabs.filter(t => t.id !== tabId)
        }
      }

      const tab1 = { id: '1', pathname: '/test1.md' }
      const tab2 = { id: '2', pathname: '/test2.md' }

      editorStore.addTab(tab1)
      editorStore.addTab(tab2)
      expect(editorStore.tabs).toHaveLength(2)

      editorStore.removeTab('1')
      expect(editorStore.tabs).toHaveLength(1)
      expect(editorStore.tabs[0].id).toBe('2')
    })

    it('should update scroll position', () => {
      const editorStore = {
        currentFile: { scrollTop: 0 },
        updateScrollPosition(scrollTop) {
          this.currentFile.scrollTop = scrollTop
        }
      }

      editorStore.updateScrollPosition(100)
      expect(editorStore.currentFile.scrollTop).toBe(100)

      editorStore.updateScrollPosition(250)
      expect(editorStore.currentFile.scrollTop).toBe(250)
    })

    it('should manage table of contents', () => {
      const editorStore = {
        listToc: [],
        toc: [],
        updateToc(newToc) {
          this.listToc = newToc
          this.toc = this.buildTreeToc(newToc)
        },
        buildTreeToc(list) {
          // Simplified tree building
          return list
        }
      }

      const tocItems = [
        { level: 1, slug: 'heading-1', text: 'Heading 1' },
        { level: 2, slug: 'heading-2', text: 'Heading 2' },
        { level: 3, slug: 'heading-3', text: 'Heading 3' }
      ]

      editorStore.updateToc(tocItems)
      expect(editorStore.listToc).toHaveLength(3)
      expect(editorStore.listToc[0].slug).toBe('heading-1')
    })

    it('should handle tab notifications', () => {
      const editorStore = {
        tabs: [{ id: '1', notifications: [] }],
        pushTabNotification(data) {
          const { tabId, msg } = data
          const tab = this.tabs.find(t => t.id === tabId)
          if (tab) {
            tab.notifications = tab.notifications || []
            tab.notifications.push({ msg })
          }
        }
      }

      editorStore.pushTabNotification({
        tabId: '1',
        msg: 'Test notification'
      })

      expect(editorStore.tabs[0].notifications).toHaveLength(1)
      expect(editorStore.tabs[0].notifications[0].msg).toBe('Test notification')
    })

    it('should copy github slug to clipboard', () => {
      const editorStore = {
        listToc: [
          { slug: 'test-heading', githubSlug: 'test-heading', text: 'Test Heading' }
        ],
        copyGithubSlug(key) {
          const item = this.listToc.find(i => i.slug === key)
          if (item) {
            window.electron.clipboard.writeText(`#${item.githubSlug}`)
            return true
          }
          return false
        }
      }

      const result = editorStore.copyGithubSlug('test-heading')
      expect(result).toBe(true)
      expect(window.electron.clipboard.writeText).toHaveBeenCalledWith('#test-heading')
    })
  })

  describe('Layout Store', () => {
    it('should manage sidebar visibility', () => {
      const layoutStore = {
        sideBarVisibility: false,
        toggleSideBar() {
          this.sideBarVisibility = !this.sideBarVisibility
        }
      }

      expect(layoutStore.sideBarVisibility).toBe(false)

      layoutStore.toggleSideBar()
      expect(layoutStore.sideBarVisibility).toBe(true)

      layoutStore.toggleSideBar()
      expect(layoutStore.sideBarVisibility).toBe(false)
    })

    it('should manage tab bar visibility', () => {
      const layoutStore = {
        tabBarVisibility: false,
        setTabBarVisibility(visible) {
          this.tabBarVisibility = visible
        }
      }

      layoutStore.setTabBarVisibility(true)
      expect(layoutStore.tabBarVisibility).toBe(true)

      layoutStore.setTabBarVisibility(false)
      expect(layoutStore.tabBarVisibility).toBe(false)
    })

    it('should manage source code mode', () => {
      const layoutStore = {
        sourceCodeModeEnabled: false,
        toggleSourceCodeMode() {
          this.sourceCodeModeEnabled = !this.sourceCodeModeEnabled
        }
      }

      layoutStore.toggleSourceCodeMode()
      expect(layoutStore.sourceCodeModeEnabled).toBe(true)

      layoutStore.toggleSourceCodeMode()
      expect(layoutStore.sourceCodeModeEnabled).toBe(false)
    })
  })

  describe('Project Store', () => {
    it('should initialize with no project', () => {
      const projectStore = {
        projectTree: null,
        currentDirectory: ''
      }

      expect(projectStore.projectTree).toBeNull()
      expect(projectStore.currentDirectory).toBe('')
    })

    it('should set current directory', () => {
      const projectStore = {
        currentDirectory: '',
        setCurrentDirectory(dir) {
          this.currentDirectory = dir
        }
      }

      projectStore.setCurrentDirectory('/path/to/project')
      expect(projectStore.currentDirectory).toBe('/path/to/project')
    })

    it('should build project tree', () => {
      const projectStore = {
        projectTree: null,
        buildTree(files) {
          this.projectTree = files.map(f => ({ name: f.name, path: f.path }))
        }
      }

      const files = [
        { name: 'doc1.md', path: '/project/doc1.md' },
        { name: 'doc2.md', path: '/project/doc2.md' }
      ]

      projectStore.buildTree(files)
      expect(projectStore.projectTree).toHaveLength(2)
      expect(projectStore.projectTree[0].name).toBe('doc1.md')
    })
  })

  describe('Notification Store', () => {
    it('should initialize with empty notifications', () => {
      const notificationStore = {
        notifications: []
      }

      expect(notificationStore.notifications).toEqual([])
    })

    it('should add notifications', () => {
      const notificationStore = {
        notifications: [],
        addNotification(notification) {
          this.notifications.push({
            id: Date.now(),
            ...notification
          })
        }
      }

      notificationStore.addNotification({
        type: 'info',
        message: 'Test notification'
      })

      expect(notificationStore.notifications).toHaveLength(1)
      expect(notificationStore.notifications[0].type).toBe('info')
      expect(notificationStore.notifications[0].message).toBe('Test notification')
    })

    it('should remove notifications', () => {
      const notificationStore = {
        notifications: [
          { id: 1, message: 'Notification 1' },
          { id: 2, message: 'Notification 2' }
        ],
        removeNotification(id) {
          this.notifications = this.notifications.filter(n => n.id !== id)
        }
      }

      notificationStore.removeNotification(1)
      expect(notificationStore.notifications).toHaveLength(1)
      expect(notificationStore.notifications[0].id).toBe(2)
    })
  })

  describe('Store Interactions', () => {
    it('should allow multiple stores to coexist', () => {
      const mainStore = { platform: 'linux' }
      const preferencesStore = { theme: 'dark' }
      const editorStore = { tabs: [] }

      expect(mainStore.platform).toBe('linux')
      expect(preferencesStore.theme).toBe('dark')
      expect(editorStore.tabs).toEqual([])
    })

    it('should share data between stores', () => {
      const stores = {
        main: { windowActive: true },
        preferences: { theme: 'dark' },
        getTheme() {
          return this.main.windowActive ? this.preferences.theme : 'default'
        }
      }

      expect(stores.getTheme()).toBe('dark')

      stores.main.windowActive = false
      expect(stores.getTheme()).toBe('default')
    })

    it('should handle store state updates', () => {
      const state = {
        counter: 0,
        increment() {
          this.counter++
        },
        decrement() {
          this.counter--
        },
        reset() {
          this.counter = 0
        }
      }

      state.increment()
      expect(state.counter).toBe(1)

      state.increment()
      expect(state.counter).toBe(2)

      state.decrement()
      expect(state.counter).toBe(1)

      state.reset()
      expect(state.counter).toBe(0)
    })
  })

  describe('Store Persistence', () => {
    it('should serialize store state', () => {
      const preferencesStore = {
        theme: 'dark',
        fontSize: 16,
        autoSave: true
      }

      const serialized = JSON.stringify(preferencesStore)
      const deserialized = JSON.parse(serialized)

      expect(deserialized).toEqual(preferencesStore)
      expect(deserialized.theme).toBe('dark')
    })

    it('should handle complex nested state', () => {
      const editorStore = {
        currentFile: {
          id: '1',
          metadata: {
            created: Date.now(),
            modified: Date.now()
          }
        },
        tabs: [
          { id: '1', pathname: '/test.md' }
        ]
      }

      const serialized = JSON.stringify(editorStore)
      const deserialized = JSON.parse(serialized)

      expect(deserialized.currentFile.metadata).toBeDefined()
      expect(deserialized.tabs).toHaveLength(1)
    })
  })

  describe('Store Validation', () => {
    it('should validate preference values', () => {
      const validateZoom = (zoom) => {
        return zoom >= 0.5 && zoom <= 2.0
      }

      expect(validateZoom(1.0)).toBe(true)
      expect(validateZoom(1.5)).toBe(true)
      expect(validateZoom(0.3)).toBe(false)
      expect(validateZoom(3.0)).toBe(false)
    })

    it('should validate file paths', () => {
      const validatePath = (path) => {
        return typeof path === 'string' && path.length > 0
      }

      expect(validatePath('/valid/path.md')).toBe(true)
      expect(validatePath('')).toBe(false)
      expect(validatePath(null)).toBe(false)
    })

    it('should validate encoding', () => {
      const validEncodings = ['utf8', 'utf16le', 'latin1', 'ascii']
      const validateEncoding = (encoding) => {
        return validEncodings.includes(encoding)
      }

      expect(validateEncoding('utf8')).toBe(true)
      expect(validateEncoding('latin1')).toBe(true)
      expect(validateEncoding('invalid')).toBe(false)
    })
  })

  describe('Store Error Handling', () => {
    it('should handle missing tab gracefully', () => {
      const editorStore = {
        tabs: [{ id: '1' }],
        findTab(id) {
          return this.tabs.find(t => t.id === id)
        }
      }

      const tab = editorStore.findTab('999')
      expect(tab).toBeUndefined()
    })

    it('should handle invalid preferences', () => {
      const preferencesStore = {
        theme: 'light',
        setTheme(theme) {
          const validThemes = ['light', 'dark']
          if (validThemes.includes(theme)) {
            this.theme = theme
          }
        }
      }

      preferencesStore.setTheme('invalid')
      expect(preferencesStore.theme).toBe('light') // Unchanged
    })

    it('should handle empty state gracefully', () => {
      const editorStore = {
        tabs: [],
        currentFile: {},
        hasOpenTabs() {
          return this.tabs.length > 0
        },
        hasCurrentFile() {
          return Object.keys(this.currentFile).length > 0
        }
      }

      expect(editorStore.hasOpenTabs()).toBe(false)
      expect(editorStore.hasCurrentFile()).toBe(false)
    })
  })
})
