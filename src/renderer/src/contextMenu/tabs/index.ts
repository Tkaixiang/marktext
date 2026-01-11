import { getCurrentWindow, Menu as RemoteMenu, MenuItem as RemoteMenuItem } from '@electron/remote'
import {
  SEPARATOR,
  getCLOSE_THIS,
  getCLOSE_OTHERS,
  getCLOSE_SAVED,
  getCLOSE_ALL,
  getRENAME,
  getCOPY_PATH,
  getSHOW_IN_FOLDER,
  MenuItem,
  MenuItemWithTabId
} from './menuItems'

export interface Tab {
  id: string
  pathname: string | null
}

export const showContextMenu = (event: MouseEvent, tab: Tab): void => {
  const menu = new RemoteMenu()
  const win = getCurrentWindow()
  const { pathname } = tab
  // Dynamically get menu items to ensure correct translations
  const closeThis = getCLOSE_THIS()
  const closeOthers = getCLOSE_OTHERS()
  const closeSaved = getCLOSE_SAVED()
  const closeAll = getCLOSE_ALL()
  const rename = getRENAME()
  const copyPath = getCOPY_PATH()
  const showInFolder = getSHOW_IN_FOLDER()

  const CONTEXT_ITEMS: MenuItem[] = [
    closeThis,
    closeOthers,
    closeSaved,
    closeAll,
    SEPARATOR,
    rename,
    copyPath,
    showInFolder
  ]
  const FILE_CONTEXT_ITEMS: MenuItem[] = [rename, copyPath, showInFolder]

  FILE_CONTEXT_ITEMS.forEach((item) => {
    item.enabled = !!pathname
  })

  CONTEXT_ITEMS.forEach((item) => {
    const menuItem = new RemoteMenuItem(item as Electron.MenuItemConstructorOptions) as MenuItemWithTabId
    menuItem._tabId = tab.id
    menu.append(menuItem)
  })
  menu.popup({ window: win, x: event.clientX, y: event.clientY })
}
