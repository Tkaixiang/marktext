import { shell, ipcMain, IpcMainInvokeEvent, IpcMainEvent } from 'electron'
import log from 'electron-log'
import EventEmitter from 'events'
import fsPromises from 'fs/promises'
import { getCurrentKeyboardLayout, getKeyMap, onDidChangeKeyboardLayout, IKeyboardMapping, IKeyboardLayoutInfo } from 'native-keymap'
import os from 'os'
import path from 'path'

export interface NativeKeyMapInfo {
  layout: IKeyboardLayoutInfo
  keymap: IKeyboardMapping
}

let currentKeyboardInfo: NativeKeyMapInfo | null = null
const loadKeyboardInfo = () => {
  currentKeyboardInfo = {
    layout: getCurrentKeyboardLayout(),
    keymap: getKeyMap()
  }
  return currentKeyboardInfo
}

export const getKeyboardInfo = () => {
  if (!currentKeyboardInfo) {
    return loadKeyboardInfo()
  }
  return currentKeyboardInfo
}

const KEYBOARD_LAYOUT_MONITOR_CHANNEL_ID = 'onDidChangeKeyboardLayout'
class KeyboardLayoutMonitor extends EventEmitter {
  private _isSubscribed: boolean
  private _emitTimer: NodeJS.Timeout | null

  constructor() {
    super()
    this._isSubscribed = false
    this._emitTimer = null
  }

  // @ts-ignore: Override matches runtime usage but conflicts with strictly typed EventEmitter
  addListener(callback: (info: NativeKeyMapInfo) => void): this {
    this._ensureNativeListener()
    super.addListener(KEYBOARD_LAYOUT_MONITOR_CHANNEL_ID, callback)
    return this
  }

  // @ts-ignore: Override matches runtime usage but conflicts with strictly typed EventEmitter
  removeListener(callback: (...args: any[]) => void): this {
    super.removeListener(KEYBOARD_LAYOUT_MONITOR_CHANNEL_ID, callback)
    return this
  }

  _ensureNativeListener() {
    if (!this._isSubscribed) {
      this._isSubscribed = true
      onDidChangeKeyboardLayout(() => {
        // The keyboard layout change event may be emitted multiple times.
        if (this._emitTimer) {
          clearTimeout(this._emitTimer)
        }
        this._emitTimer = setTimeout(() => {
          this.emit(KEYBOARD_LAYOUT_MONITOR_CHANNEL_ID, loadKeyboardInfo())
          this._emitTimer = null
        }, 150)
      })
    }
  }
}

// Export a single-instance of the monitor.
export const keyboardLayoutMonitor = new KeyboardLayoutMonitor()

export const registerKeyboardListeners = () => {
  ipcMain.handle('mt::keybinding-get-keyboard-info', async () => {
    return getKeyboardInfo()
  })
  ipcMain.on('mt::keybinding-debug-dump-keyboard-info', async () => {
    const dumpPath = path.join(os.tmpdir(), 'marktext_keyboard_info.json')
    const content = JSON.stringify(getKeyboardInfo(), null, 2)
    fsPromises
      .writeFile(dumpPath, content, 'utf8')
      .then(() => {
        shell.openPath(dumpPath)
      })
      .catch((error) => {
        log.error('Error dumping keyboard information:', error)
      })
  })
}
