import path from 'path'
import { BrowserWindow, ipcMain, Menu, IpcMainEvent } from 'electron'
import log from 'electron-log'
import { COMMANDS, CommandManagerClass } from '../../commands'
import { searchFilesAndDir, FileInfo } from '../../utils/imagePathAutoComplement'

// TODO(Refactor): Move to filesystem and provide generic API to search files in directories.
ipcMain.on('mt::ask-for-image-auto-path', (e: IpcMainEvent, { pathname, src, id }: { pathname: string; src: string; id: string }) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  if (!src || typeof src !== 'string') {
    win.webContents.send(`mt::response-of-image-path-${id}`, [])
    return
  }

  if (src.endsWith('/') || src.endsWith('\\') || src.endsWith('.')) {
    return win.webContents.send(`mt::response-of-image-path-${id}`, [])
  }
  const fullPath = path.isAbsolute(src) ? src : path.join(path.dirname(pathname), src)
  const dir = path.dirname(fullPath)
  const searchKey = path.basename(fullPath)
  searchFilesAndDir(dir, searchKey)
    .then((files: FileInfo[]) => {
      return win.webContents.send(`mt::response-of-image-path-${id}`, files)
    })
    .catch((err: Error) => {
      log.error(err)
      return win.webContents.send(`mt::response-of-image-path-${id}`, [])
    })
})

// --- Menu actions -------------------------------------------------------------

export const editorUndo = (win: BrowserWindow | undefined) => {
  edit(win, 'undo')
}

export const editorRedo = (win: BrowserWindow | undefined) => {
  edit(win, 'redo')
}

export const editorCopyAsMarkdown = (win: BrowserWindow | undefined) => {
  edit(win, 'copyAsMarkdown')
}

export const editorCopyAsHtml = (win: BrowserWindow | undefined) => {
  edit(win, 'copyAsHtml')
}

export const editorPasteAsPlainText = (win: BrowserWindow | undefined) => {
  edit(win, 'pasteAsPlainText')
}

export const editorSelectAll = (win: BrowserWindow | undefined) => {
  edit(win, 'selectAll')
}

export const editorDuplicate = (win: BrowserWindow | undefined) => {
  edit(win, 'duplicate')
}

export const editorCreateParagraph = (win: BrowserWindow | undefined) => {
  edit(win, 'createParagraph')
}

export const editorDeleteParagraph = (win: BrowserWindow | undefined) => {
  edit(win, 'deleteParagraph')
}

export const editorFind = (win: BrowserWindow | undefined) => {
  edit(win, 'find')
}

export const editorFindNext = (win: BrowserWindow | undefined) => {
  edit(win, 'findNext')
}

export const editorFindPrevious = (win: BrowserWindow | undefined) => {
  edit(win, 'findPrev')
}

export const editorReplace = (win: BrowserWindow | undefined) => {
  edit(win, 'undo')
}

export const findInFolder = (win: BrowserWindow | undefined) => {
  edit(win, 'findInFolder')
}

export const edit = (win: BrowserWindow | undefined, type: string) => {
  if (win && win.webContents) {
    win.webContents.send('mt::editor-edit-action', type)
  }
}

export const nativeCut = (win: BrowserWindow | undefined) => {
  if (win) {
    win.webContents.cut()
  }
}

export const nativeCopy = (win: BrowserWindow | undefined) => {
  if (win) {
    win.webContents.copy()
  }
}

export const nativePaste = (win: BrowserWindow | undefined) => {
  if (win) {
    win.webContents.paste()
  }
}

export const screenshot = (win: BrowserWindow | undefined) => {
  if (win) {
    ipcMain.emit('screen-capture', win)
  }
}

export const lineEnding = (win: BrowserWindow | undefined, lineEnding: string) => {
  if (win && win.webContents) {
    win.webContents.send('mt::set-line-ending', lineEnding)
  }
}

// --- Commands -------------------------------------------------------------

export const loadEditCommands = (commandManager: CommandManagerClass) => {
  commandManager.add(COMMANDS.EDIT_COPY, nativeCopy)
  commandManager.add(COMMANDS.EDIT_COPY_AS_HTML, editorCopyAsHtml)
  commandManager.add(COMMANDS.EDIT_COPY_AS_MARKDOWN, editorCopyAsMarkdown)
  commandManager.add(COMMANDS.EDIT_CREATE_PARAGRAPH, editorCreateParagraph)
  commandManager.add(COMMANDS.EDIT_CUT, nativeCut)
  commandManager.add(COMMANDS.EDIT_DELETE_PARAGRAPH, editorDeleteParagraph)
  commandManager.add(COMMANDS.EDIT_DUPLICATE, editorDuplicate)
  commandManager.add(COMMANDS.EDIT_FIND, editorFind)
  commandManager.add(COMMANDS.EDIT_FIND_IN_FOLDER, findInFolder)
  commandManager.add(COMMANDS.EDIT_FIND_NEXT, editorFindNext)
  commandManager.add(COMMANDS.EDIT_FIND_PREVIOUS, editorFindPrevious)
  commandManager.add(COMMANDS.EDIT_PASTE, nativePaste)
  commandManager.add(COMMANDS.EDIT_PASTE_AS_PLAINTEXT, editorPasteAsPlainText)
  commandManager.add(COMMANDS.EDIT_REDO, editorRedo)
  commandManager.add(COMMANDS.EDIT_REPLACE, editorReplace)
  commandManager.add(COMMANDS.EDIT_SCREENSHOT, screenshot)
  commandManager.add(COMMANDS.EDIT_SELECT_ALL, editorSelectAll)
  commandManager.add(COMMANDS.EDIT_UNDO, editorUndo)
}

// --- IPC events -------------------------------------------------------------

// NOTE: Don't use static `getMenuItemById` here, instead request the menu by
//       window id from `AppMenu` manager.

/**
 * @param {Electron.Menu} applicationMenu
 * @param {boolean} value
 */
export const updateSidebarMenu = (applicationMenu: Menu, value: boolean) => {
  const sideBarMenuItem = applicationMenu.getMenuItemById('sideBarMenuItem')
  if (sideBarMenuItem) {
    sideBarMenuItem.checked = !!value
  }
}
