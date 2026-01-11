import * as contextMenu from './actions'
import { t } from '../../i18n'

export interface MenuItem {
  type?: string
  label?: string
  id?: string
  enabled?: boolean
  click?: () => void
}

// NOTE: This are mutable fields that may change at runtime.

export const SEPARATOR: MenuItem = {
  type: 'separator'
}

// Use function form to avoid calling translation function at module load time
export const getNEW_FILE = (): MenuItem => ({
  label: t('contextMenu.sideBar.newFile'),
  id: 'newFileMenuItem',
  click(): void {
    contextMenu.newFile()
  }
})

export const getNEW_DIRECTORY = (): MenuItem => ({
  label: t('contextMenu.sideBar.newDirectory'),
  id: 'newDirectoryMenuItem',
  click(): void {
    contextMenu.newDirectory()
  }
})

export const getCOPY = (): MenuItem => ({
  label: t('contextMenu.sideBar.copy'),
  id: 'copyMenuItem',
  click(): void {
    contextMenu.copy()
  }
})

export const getCUT = (): MenuItem => ({
  label: t('contextMenu.sideBar.cut'),
  id: 'cutMenuItem',
  click(): void {
    contextMenu.cut()
  }
})

export const getPASTE = (): MenuItem => ({
  label: t('contextMenu.sideBar.paste'),
  id: 'pasteMenuItem',
  click(): void {
    contextMenu.paste()
  }
})

export const getRENAME = (): MenuItem => ({
  label: t('contextMenu.sideBar.rename'),
  id: 'renameMenuItem',
  click(): void {
    contextMenu.rename()
  }
})

export const getDELETE = (): MenuItem => ({
  label: t('contextMenu.sideBar.moveToTrash'),
  id: 'deleteMenuItem',
  click(): void {
    contextMenu.remove()
  }
})

export const getSHOW_IN_FOLDER = (): MenuItem => ({
  label: t('contextMenu.sideBar.showInFolder'),
  id: 'showInFolderMenuItem',
  click(): void {
    contextMenu.showInFolder()
  }
})

// For backwards compatibility, keep original exports
export const NEW_FILE = getNEW_FILE()
export const NEW_DIRECTORY = getNEW_DIRECTORY()
export const COPY = getCOPY()
export const CUT = getCUT()
export const PASTE = getPASTE()
export const RENAME = getRENAME()
export const DELETE = getDELETE()
export const SHOW_IN_FOLDER = getSHOW_IN_FOLDER()
