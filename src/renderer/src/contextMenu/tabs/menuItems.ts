import * as contextMenu from './actions'
import { t } from '../../i18n'

export interface MenuItem {
  type?: string
  label?: string
  id?: string
  enabled?: boolean
  click?: (menuItem: MenuItemWithTabId) => void
}

export interface MenuItemWithTabId extends Electron.MenuItem {
  _tabId?: string
}

// NOTE: This are mutable fields that may change at runtime.

export const SEPARATOR: MenuItem = {
  type: 'separator'
}

// Use function form to avoid calling translation function at module load time
export const getCLOSE_THIS = (): MenuItem => ({
  label: t('contextMenu.tabs.close'),
  id: 'closeThisTab',
  click(menuItem: MenuItemWithTabId): void {
    contextMenu.closeThis(menuItem._tabId || '')
  }
})

export const getCLOSE_OTHERS = (): MenuItem => ({
  label: t('contextMenu.tabs.closeOthers'),
  id: 'closeOtherTabs',
  click(menuItem: MenuItemWithTabId): void {
    contextMenu.closeOthers(menuItem._tabId || '')
  }
})

export const getCLOSE_SAVED = (): MenuItem => ({
  label: t('contextMenu.tabs.closeSavedTabs'),
  id: 'closeSavedTabs',
  click(): void {
    contextMenu.closeSaved()
  }
})

export const getCLOSE_ALL = (): MenuItem => ({
  label: t('contextMenu.tabs.closeAllTabs'),
  id: 'closeAllTabs',
  click(): void {
    contextMenu.closeAll()
  }
})

export const getRENAME = (): MenuItem => ({
  label: t('contextMenu.tabs.rename'),
  id: 'renameFile',
  click(menuItem: MenuItemWithTabId): void {
    contextMenu.rename(menuItem._tabId || '')
  }
})

export const getCOPY_PATH = (): MenuItem => ({
  label: t('contextMenu.tabs.copyPath'),
  id: 'copyPath',
  click(menuItem: MenuItemWithTabId): void {
    contextMenu.copyPath(menuItem._tabId || '')
  }
})

export const getSHOW_IN_FOLDER = (): MenuItem => ({
  label: t('contextMenu.tabs.showInFolder'),
  id: 'showInFolder',
  click(menuItem: MenuItemWithTabId): void {
    contextMenu.showInFolder(menuItem._tabId || '')
  }
})

// For backwards compatibility, keep original exports
export const CLOSE_THIS = getCLOSE_THIS()
export const CLOSE_OTHERS = getCLOSE_OTHERS()
export const CLOSE_SAVED = getCLOSE_SAVED()
export const CLOSE_ALL = getCLOSE_ALL()
export const RENAME = getRENAME()
export const COPY_PATH = getCOPY_PATH()
export const SHOW_IN_FOLDER = getSHOW_IN_FOLDER()
