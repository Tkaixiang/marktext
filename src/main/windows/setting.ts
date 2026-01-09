import path from 'path'
import { BrowserWindow, ipcMain, BrowserWindowConstructorOptions } from 'electron'
import { enable as remoteEnable } from '@electron/remote/main'
import { electronLocalshortcut } from '@hfelix/electron-localshortcut'
import BaseWindow, { WindowLifecycle, WindowType } from './base'
import { centerWindowOptions } from './utils'
import { TITLE_BAR_HEIGHT, preferencesWinOptions, isLinux, isOsx } from '../config'
import log from 'electron-log'

class SettingWindow extends BaseWindow {
  /**
   * @param {Accessor} accessor The application accessor for application instances.
   */
  constructor(accessor: any) {
    super(accessor)
    this.type = WindowType.SETTINGS
  }

  /**
   * Creates a new setting window.
   *
   * @param {*} [category] The settings category tab name.
   */
  createWindow(category: string | null = null) {
    const { menu: appMenu, env, keybindings, preferences } = this._accessor
    const winOptions: BrowserWindowConstructorOptions = Object.assign({}, preferencesWinOptions)
    centerWindowOptions(winOptions)
    if (isLinux) {
      // @ts-ignore
      winOptions.icon = path.join(global.__static, 'logo-96px.png')
    }

    // WORKAROUND: Electron has issues with different DPI per monitor when
    // setting a fixed window size.
    winOptions.resizable = true

    // Enable native or custom/frameless window and titlebar
    const { titleBarStyle, theme } = preferences.getAll()
    if (!isOsx) {
      winOptions.titleBarStyle = 'default'
      if (titleBarStyle === 'native') {
        winOptions.frame = true
      }
    }

    winOptions.backgroundColor = this._getPreferredBackgroundColor(theme)
    let win: BrowserWindow | null = (this.browserWindow = new BrowserWindow(winOptions))

    win.webContents.on('did-fail-load', (event, code, desc, url) => {
      log.error(`did-fail-load ${code} ${desc} @ ${url}`)
    })
    win.webContents.on('render-process-gone', (event, details) => {
      log.error(`render-process-gone: ${details.reason} (${details.exitCode})`)
    })

    remoteEnable(win.webContents)
    this.id = win.id

    // Create a menu for the current window
    appMenu.addSettingMenu(win)

    win.once('ready-to-show', () => {
      this.lifecycle = WindowLifecycle.READY
      this.emit('window-ready')
    })

    win.on('focus', () => {
      this.emit('window-focus')
      if (win) {
        win.webContents.send('mt::window-active-status', { status: true })
      }
    })

    // Lost focus
    win.on('blur', () => {
      this.emit('window-blur')
      if (win) {
        win.webContents.send('mt::window-active-status', { status: false })
      }
    })

    // @ts-ignore
    win.on('close', (event) => {
      this.emit('window-close')

      event.preventDefault()
      // @ts-ignore
      if (win) ipcMain.emit('window-close-by-id', win.id)
    })

    // The window is now destroyed.
    win.on('closed', () => {
      this.emit('window-closed')

      // Free window reference
      win = null
    })

    this.lifecycle = WindowLifecycle.LOADING
    // @ts-ignore
    win.loadURL(this._buildUrlString(this.id, env, preferences, category))
    // @ts-ignore
    win.setSheetOffset(TITLE_BAR_HEIGHT)

    const devToolsAccelerator = keybindings.getAccelerator('view.toggle-dev-tools')
    if (env.debug && devToolsAccelerator && win) {
      // @ts-ignore
      electronLocalshortcut.register(win, devToolsAccelerator, () => {
        // @ts-ignore
        if (win) win.webContents.toggleDevTools()
      })
    }
    return win
  }

  _buildUrlString(windowId: number, env: any, userPreference: any, category: string | null = null) {
    const url = this._buildUrlWithSettings(windowId, env, userPreference)
    if (category) {
      // Overwrite type to add category name
      url.searchParams.set('type', `${WindowType.SETTINGS}/${category}`)
    }
    return url.toString()
  }
}

export default SettingWindow
