import EventEmitter from 'events'
import { isLinux } from '../config'
import path from 'path'
import { BrowserWindow } from 'electron'

/**
 * A MarkText window.
 * @typedef {BaseWindow} IApplicationWindow
 * @property {number | null} id Identifier (= browserWindow.id) or null during initialization.
 * @property {Electron.BrowserWindow} browserWindow The browse window.
 * @property {WindowLifecycle} lifecycle The window lifecycle state.
 * @property {WindowType} type The window type.
 */

// Window type marktext support.
export enum WindowType {
  BASE = 'base', // You shold never create a `BASE` window.
  EDITOR = 'editor',
  SETTINGS = 'settings'
}

export enum WindowLifecycle {
  NONE = 0,
  LOADING = 1,
  READY = 2,
  QUITTED = 3
}

class BaseWindow extends EventEmitter {
  public id: number | null
  public browserWindow: BrowserWindow | null
  public lifecycle: WindowLifecycle
  public type: WindowType
  protected _accessor: any

  /**
   * @param {Accessor} accessor The application accessor for application instances.
   */
  constructor(accessor: any) {
    super()

    this._accessor = accessor
    this.id = null
    this.browserWindow = null
    this.lifecycle = WindowLifecycle.NONE
    this.type = WindowType.BASE
  }

  bringToFront() {
    const { browserWindow: win } = this
    if (win) {
      if (win.isMinimized()) win.restore()
      if (!win.isVisible()) win.show()
      if (isLinux) {
        win.focus()
      } else {
        win.moveTop()
      }
    }
  }

  reload() {
    if (this.browserWindow) {
      this.browserWindow.reload()
    }
  }

  destroy() {
    this.lifecycle = WindowLifecycle.QUITTED
    this.emit('window-closed')

    this.removeAllListeners()
    if (this.browserWindow) {
      this.browserWindow.destroy()
      this.browserWindow = null
    }
    this.id = null
  }

  // --- private ---------------------------------

  _buildUrlWithSettings(windowId: number | string, env: any, userPreference: any) {
    // NOTE: Only send absolutely necessary values. Full settings are delay loaded.
    const { type } = this
    const { debug, paths } = env
    const { codeFontFamily, codeFontSize, hideScrollbar, theme, titleBarStyle } =
      userPreference.getAll()

    /* eslint-disable */
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? process.env['ELECTRON_RENDERER_URL']
        : `file://${path.join(__dirname, '../renderer/index.html')}` // <-- This points to the path inside the packed ASAR archive, hence it is always correct
    /* eslint-enable */

    const url = new URL(baseUrl!)
    url.searchParams.set('udp', paths.userDataPath)
    url.searchParams.set('debug', debug ? '1' : '0')
    url.searchParams.set('wid', String(windowId))
    url.searchParams.set('type', type)

    // Settings
    url.searchParams.set('cff', codeFontFamily)
    url.searchParams.set('cfs', String(codeFontSize))
    url.searchParams.set('hsb', hideScrollbar ? '1' : '0')
    url.searchParams.set('theme', theme)
    url.searchParams.set('tbs', titleBarStyle)

    return url
  }

  _buildUrlString(windowId: number | string, env: any, userPreference: any) {
    return this._buildUrlWithSettings(windowId, env, userPreference).toString()
  }

  _getPreferredBackgroundColor(theme: string) {
    // Hardcode the theme background color and show the window direct for the fastet window ready time.
    // Later with custom themes we need the background color (e.g. from meta information) and wait
    // that the window is loaded and then pass theme data to the renderer.
    switch (theme) {
      case 'dark':
        return '#282828'
      case 'material-dark':
        return '#34393f'
      case 'ulysses':
        return '#f3f3f3'
      case 'graphite':
        return '#f7f7f7'
      case 'one-dark':
        return '#282c34'
      case 'light':
      default:
        return '#ffffff'
    }
  }
}

export default BaseWindow
