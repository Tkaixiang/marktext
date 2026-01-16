// Shim for @electron/remote - uses window.remote exposed via preload
// This redirects @electron/remote imports to use the preload-exposed APIs

// Get the current window (BrowserWindow instance)
export const getCurrentWindow = () => {
  return window.remote?.getCurrentWindow()
}

// Menu class wrapper
export class Menu {
  constructor() {
    this._items = []
  }

  append(menuItem) {
    this._items.push(menuItem)
  }

  insert(pos, menuItem) {
    this._items.splice(pos, 0, menuItem)
  }

  popup(options) {
    // Build native menu from items and show it
    const template = this._items.map(item => item._options || item)
    const nativeMenu = window.remote?.Menu?.buildFromTemplate(template)
    if (nativeMenu && nativeMenu.popup) {
      nativeMenu.popup(options)
    }
  }

  static buildFromTemplate(template) {
    return window.remote?.Menu?.buildFromTemplate(template)
  }

  static getApplicationMenu() {
    return window.remote?.Menu?.getApplicationMenu()
  }

  static setApplicationMenu(menu) {
    return window.remote?.Menu?.setApplicationMenu(menu)
  }
}

// MenuItem class wrapper
export class MenuItem {
  constructor(options) {
    this._options = options
  }

  get label() { return this._options.label }
  get click() { return this._options.click }
  get type() { return this._options.type }
  get role() { return this._options.role }
  get accelerator() { return this._options.accelerator }
  get enabled() { return this._options.enabled !== false }
  get visible() { return this._options.visible !== false }
  get checked() { return this._options.checked }
  get submenu() { return this._options.submenu }
}

// Clipboard from remote
export const clipboard = window.remote?.clipboard || {
  readText: () => '',
  writeText: () => {},
  readHTML: () => '',
  writeHTML: () => {},
  readImage: () => null,
  writeImage: () => {},
  readRTF: () => '',
  writeRTF: () => {},
  clear: () => {},
  availableFormats: () => [],
  has: () => false,
  read: () => '',
  readBuffer: () => null,
  writeBuffer: () => {},
  write: () => {},
  readBookmark: () => ({ title: '', url: '' }),
  writeBookmark: () => {},
  readFindText: () => '',
  writeFindText: () => {}
}

// Default export with all remote functionality
export default {
  getCurrentWindow,
  Menu,
  MenuItem,
  clipboard
}
