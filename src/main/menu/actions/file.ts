import { rename as fsRename } from 'fs-extra'
import path from 'path'
import { BrowserWindow, app, dialog, shell, ipcMain, IpcMainEvent } from 'electron'
import log from 'electron-log'
import { isDirectory, isFile, exists } from 'common/filesystem'
import { MARKDOWN_EXTENSIONS, isMarkdownFile } from 'common/filesystem/paths'
import { checkUpdates, userSetting } from './marktext'
import { showTabBar } from './view'
import { COMMANDS, CommandManagerClass } from '../../commands'
import { EXTENSION_HASN, PANDOC_EXTENSIONS, URL_REG } from '../../config'
import { normalizeAndResolvePath, writeFile } from '../../filesystem'
import { writeMarkdownFile, IMarkdownDocumentOptions } from '../../filesystem/markdown'
import { getPath, getRecommendTitleFromMarkdownString } from '../../utils'
import pandoc from '../../utils/pandoc'
import { t } from '../../i18n'

// TODO(refactor): "save" and "save as" should be moved to the editor window (editor.js) and
// the renderer should communicate only with the editor window for file relevant stuff.
// E.g. "mt::save-tabs" --> "mt::window-save-tabs$wid:<windowId>"

interface PdfPageOptions {
  pageSize: string
  pageSizeWidth: number
  pageSizeHeight: number
  isLandscape: boolean
}

interface ExportFileOptions {
  type: string
  content?: string
  pathname?: string
  title?: string
  pageOptions?: PdfPageOptions
}

interface UnsavedFile {
  id: string
  filename: string
  pathname: string
  markdown: string
  options: IMarkdownDocumentOptions
  defaultPath: string
}

const getExportExtensionFilter = (type: string) => {
  if (type === 'pdf') {
    return [
      {
        name: 'Portable Document Format',
        extensions: ['pdf']
      }
    ]
  } else if (type === 'styledHtml') {
    return [
      {
        name: 'Hypertext Markup Language',
        extensions: ['html']
      }
    ]
  }

  // Allow all extensions.
  return undefined
}

const getPdfPageOptions = (options: PdfPageOptions | undefined) => {
  if (!options) {
    return {}
  }

  const { pageSize, pageSizeWidth, pageSizeHeight, isLandscape } = options
  if (pageSize === 'custom' && pageSizeWidth && pageSizeHeight) {
    return {
      // Note: mm to microns
      pageSize: { height: pageSizeHeight * 1000, width: pageSizeWidth * 1000 },
      landscape: !!isLandscape
    }
  } else {
    return { pageSize, landscape: !!isLandscape }
  }
}

// Handle the export response from renderer process.
const handleResponseForExport = async (e: IpcMainEvent, { type, content, pathname, title, pageOptions }: ExportFileOptions) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  const extension = EXTENSION_HASN[type as keyof typeof EXTENSION_HASN]
  const dirname = pathname ? path.dirname(pathname) : getPath('documents')
  let nakedFilename = pathname ? path.basename(pathname, '.md') : title
  if (!nakedFilename) {
    nakedFilename = 'Untitled'
  }

  const defaultPath = path.join(dirname, `${nakedFilename}${extension}`)
  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    defaultPath,
    filters: getExportExtensionFilter(type)
  })

  if (filePath && !canceled) {
    try {
      if (type === 'pdf') {
        const options: Electron.PrintToPDFOptions = { printBackground: true }
        Object.assign(options, getPdfPageOptions(pageOptions))
        const data = await win.webContents.printToPDF(options)
        removePrintServiceFromWindow(win)
        await writeFile(filePath, data, extension, 'binary')
      } else {
        if (!content) {
          throw new Error('No HTML content found.')
        }
        await writeFile(filePath, content, extension, 'utf8')
      }
      win.webContents.send('mt::export-success', { type, filePath })
    } catch (err: any) {
      log.error('Error while exporting:', err)
      const ERROR_MSG = err.message || `Error happened when export ${filePath}`
      win.webContents.send('mt::show-notification', {
        title: 'Export failure',
        type: 'error',
        message: ERROR_MSG
      })
    }
  } else {
    // User canceled save dialog
    if (type === 'pdf') {
      removePrintServiceFromWindow(win)
    }
  }
}

const handleResponseForPrint = async (e: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return
  win.webContents.print({ printBackground: true }, () => {
    removePrintServiceFromWindow(win)
  })
}

const handleResponseForSave = async (e: IpcMainEvent, id: string, filename: string, pathname: string, markdown: string, options: IMarkdownDocumentOptions, defaultPath: string) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  let recommendFilename = getRecommendTitleFromMarkdownString(markdown)
  if (!recommendFilename) {
    recommendFilename = filename || 'Untitled'
  }

  // If the file doesn't exist on disk add it to the recently used documents later
  // and execute file from filesystem watcher for a short time. The file may exists
  // on disk nevertheless but is already tracked by MarkText.
  const alreadyExistOnDisk = !!pathname

  let filePath: string | undefined = pathname

  if (!filePath) {
    const { filePath: dialogPath, canceled } = await dialog.showSaveDialog(win, {
      defaultPath: path.join(defaultPath || getPath('documents'), `${recommendFilename}.md`)
    })

    if (dialogPath && !canceled) {
      filePath = dialogPath
    }
  }

  // Save dialog canceled by user - no error.
  if (!filePath) {
    return Promise.resolve()
  }

  filePath = path.resolve(filePath)
  const extension = path.extname(filePath) || '.md'
  filePath = !filePath.endsWith(extension) ? (filePath += extension) : filePath
  return writeMarkdownFile(filePath, markdown, options)
    .then(() => {
      if (!win || win.isDestroyed()) return id

      if (!alreadyExistOnDisk) {
        ipcMain.emit('window-add-file-path', win.id, filePath)
        ipcMain.emit('menu-add-recently-used', filePath)

        const filename = path.basename(filePath!)
        win.webContents.send('mt::set-pathname', { id, pathname: filePath, filename })
      } else {
        ipcMain.emit('window-file-saved', win.id, filePath)
        win.webContents.send('mt::tab-saved', id)
      }
      return id
    })
    .catch((err) => {
      log.error('Error while saving:', err)
      if (win && !win.isDestroyed()) {
        win.webContents.send('mt::tab-save-failure', id, err.message)
      }
    })
}

const showUnsavedFilesMessage = async (win: BrowserWindow, files: UnsavedFile[]) => {
  const { response } = await dialog.showMessageBox(win, {
    type: 'warning',
    buttons: [t('dialog.save'), t('dialog.dontSave'), t('dialog.cancel')],
    defaultId: 0,
    message: t('dialog.saveChanges', {
      count: files.length,
      type: files.length === 1 ? t('dialog.file') : t('dialog.files'),
      files: files.map((f) => f.filename).join('\n')
    }),
    detail: t('dialog.changesWillBeLost'),
    cancelId: 2,
    noLink: true
  })

  switch (response) {
    case 0:
      return new Promise<{ needSave: boolean }>((resolve) => {
        setTimeout(() => {
          resolve({ needSave: true })
        })
      })
    case 1:
      return { needSave: false }
    default:
      return null
  }
}

const noticePandocNotFound = (win: BrowserWindow) => {
  return win.webContents.send('mt::pandoc-not-exists', {
    title: t('dialog.importWarning'),
    type: 'warning',
    message: t('dialog.installPandoc'),
    time: 10000
  })
}

const openPandocFile = async (windowId: number, pathname: string) => {
  try {
    const converter = pandoc(pathname, 'markdown')
    const data = await converter()
    ipcMain.emit('app-open-markdown-by-id', windowId, data)
  } catch (err) {
    log.error('Error while converting file:', err)
  }
}

const removePrintServiceFromWindow = (win: BrowserWindow) => {
  // remove print service content and restore GUI
  if (win && !win.isDestroyed()) {
    win.webContents.send('mt::print-service-clearup')
  }
}

// --- events -----------------------------------

ipcMain.on('mt::save-tabs', (e: IpcMainEvent, unsavedFiles: UnsavedFile[]) => {
  Promise.all(
    unsavedFiles.map((file) =>
      handleResponseForSave(
        e,
        file.id,
        file.filename,
        file.pathname,
        file.markdown,
        file.options,
        file.defaultPath
      )
    )
  ).catch(log.error)
})

ipcMain.on('mt::save-and-close-tabs', async (e: IpcMainEvent, unsavedFiles: UnsavedFile[]) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  const userResult = await showUnsavedFilesMessage(win, unsavedFiles)
  if (!userResult) {
    return
  }

  const { needSave } = userResult
  if (needSave) {
    Promise.all(
      unsavedFiles.map((file) =>
        handleResponseForSave(
          e,
          file.id,
          file.filename,
          file.pathname,
          file.markdown,
          file.options,
          file.defaultPath
        )
      )
    )
      .then((arr) => {
        const tabIds = arr.filter((id) => id != null)
        if (win && !win.isDestroyed()) {
          win.webContents.send('mt::force-close-tabs-by-id', tabIds)
        }
      })
      .catch((err) => {
        log.error('Error while save all:', err)
      })
  } else {
    const tabIds = unsavedFiles.map((f) => f.id)
    win.webContents.send('mt::force-close-tabs-by-id', tabIds)
  }
})

ipcMain.on(
  'mt::response-file-save-as',
  async (e: IpcMainEvent, id: string, filename: string, pathname: string, markdown: string, options: IMarkdownDocumentOptions, defaultPath: string) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (!win) return

    let recommendFilename = getRecommendTitleFromMarkdownString(markdown)
    if (!recommendFilename) {
      recommendFilename = filename || 'Untitled'
    }

    // If the file doesn't exist on disk add it to the recently used documents later
    // and execute file from filesystem watcher for a short time. The file may exists
    // on disk nevertheless but is already tracked by MarkText.
    const alreadyExistOnDisk = !!pathname

    let { filePath, canceled } = await dialog.showSaveDialog(win, {
      defaultPath:
        pathname || path.join(defaultPath || getPath('documents'), `${recommendFilename}.md`)
    })

    if (filePath && !canceled) {
      filePath = path.resolve(filePath)
      writeMarkdownFile(filePath, markdown, options)
        .then(() => {
          if (!win || win.isDestroyed()) return

          if (!alreadyExistOnDisk) {
            ipcMain.emit('window-add-file-path', win.id, filePath)
            ipcMain.emit('menu-add-recently-used', filePath)

            const filename = path.basename(filePath!)
            win.webContents.send('mt::set-pathname', { id, pathname: filePath, filename })
          } else if (pathname !== filePath) {
            // Update window file list and watcher.
            ipcMain.emit('window-change-file-path', win.id, filePath, pathname)

            const filename = path.basename(filePath!)
            win.webContents.send('mt::set-pathname', { id, pathname: filePath, filename })
          } else {
            ipcMain.emit('window-file-saved', win.id, filePath)
            win.webContents.send('mt::tab-saved', id)
          }
        })
        .catch((err) => {
          log.error('Error while save as:', err)
          if (win && !win.isDestroyed()) {
            win.webContents.send('mt::tab-save-failure', id, err.message)
          }
        })
    }
  }
)

ipcMain.on('mt::close-window-confirm', async (e: IpcMainEvent, unsavedFiles: UnsavedFile[]) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  const userResult = await showUnsavedFilesMessage(win, unsavedFiles)
  if (!userResult) {
    return
  }

  const { needSave } = userResult
  if (needSave) {
    Promise.all(
      unsavedFiles.map((file) =>
        handleResponseForSave(
          e,
          file.id,
          file.filename,
          file.pathname,
          file.markdown,
          file.options,
          file.defaultPath
        )
      )
    )
      .then(() => {
        ipcMain.emit('window-close-by-id', win.id)
      })
      .catch((err) => {
        log.error('Error while saving before quit:', err)

        // Notify user about the problem.
        dialog
          .showMessageBox(win, {
            type: 'error',
            buttons: [t('dialog.close'), t('dialog.keepOpen')],
            message: t('dialog.saveFailure'),
            detail: err.message
          })
          .then(({ response }) => {
            if (win.id && response === 0) {
              ipcMain.emit('window-close-by-id', win.id)
            }
          })
      })
  } else {
    ipcMain.emit('window-close-by-id', win.id)
  }
})

ipcMain.on('mt::response-file-save', handleResponseForSave)

ipcMain.on('mt::response-export', handleResponseForExport)

ipcMain.on('mt::response-print', handleResponseForPrint)

ipcMain.on('mt::window::drop', async (e: IpcMainEvent, fileList: string[]) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  for (const file of fileList) {
    if (isMarkdownFile(file)) {
      openFileOrFolder(win, file)
      continue
    }

    // Try to import the file
    if (PANDOC_EXTENSIONS.some((ext) => file.endsWith(ext))) {
      const existsPandoc = pandoc.exists()
      if (!existsPandoc) {
        noticePandocNotFound(win)
      } else {
        openPandocFile(win.id, file)
      }
      break
    }
  }
})

ipcMain.on('mt::rename', async (e: IpcMainEvent, { id, pathname, newPathname }: { id: string; pathname: string; newPathname: string }) => {
  if (pathname === newPathname) return
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  const doRename = () => {
    fsRename(pathname, newPathname, (err) => {
      if (err) {
        log.error(`mt::rename: Cannot rename "${pathname}" to "${newPathname}".\n${err.stack}`)
        return
      }

      ipcMain.emit('window-change-file-path', win.id, newPathname, pathname)
      e.sender.send('mt::set-pathname', {
        id,
        pathname: newPathname,
        filename: path.basename(newPathname)
      })
    })
  }

  if (!(await exists(newPathname))) {
    doRename()
  } else {
    const { response } = await dialog.showMessageBox(win, {
      type: 'warning',
      buttons: [t('dialog.replace'), t('dialog.cancel')],
      defaultId: 1,
      message: t('dialog.fileExists', { filename: path.basename(newPathname) }),
      cancelId: 1,
      noLink: true
    })

    if (response === 0) {
      doRename()
    }
  }
})

ipcMain.on('mt::response-file-move-to', async (e: IpcMainEvent, { id, pathname }: { id: string; pathname: string }) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    buttonLabel: 'Move to',
    nameFieldLabel: 'Filename:',
    defaultPath: pathname
  })

  if (filePath && !canceled) {
    fsRename(pathname, filePath, (err) => {
      if (err) {
        log.error(`mt::rename: Cannot rename "${pathname}" to "${filePath}".\n${err.stack}`)
        return
      }

      ipcMain.emit('window-change-file-path', win.id, filePath, pathname)
      e.sender.send('mt::set-pathname', {
        id,
        pathname: filePath,
        filename: path.basename(filePath)
      })
    })
  }
})

ipcMain.on('mt::ask-for-open-project-in-sidebar', async (e: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (!win) return

  const { filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory', 'createDirectory']
  })

  if (filePaths && filePaths[0]) {
    const resolvedPath = normalizeAndResolvePath(filePaths[0])
    ipcMain.emit('app-open-directory-by-id', win.id, resolvedPath, true)
  }
})

ipcMain.on('mt::format-link-click', (e: IpcMainEvent, { data, dirname }: { data: { href: string; text: string }; dirname: string }) => {
  if (!data || (!data.href && !data.text)) {
    return
  }

  const urlCandidate = data.href || data.text
  if (URL_REG.test(urlCandidate)) {
    shell.openExternal(urlCandidate)
    return
  } else if (/^[a-z0-9]+:\/\//i.test(urlCandidate)) {
    // Prevent other URLs.
    return
  }

  const href = data.href
  if (!href) {
    return
  }

  let pathname: string | null = null
  if (path.isAbsolute(href)) {
    pathname = href
  } else if (dirname && !path.isAbsolute(href)) {
    pathname = path.join(dirname, href)
  }

  if (pathname) {
    pathname = path.normalize(pathname)
    if (isMarkdownFile(pathname)) {
      const win = BrowserWindow.fromWebContents(e.sender)
      if (win) {
        openFileOrFolder(win, pathname)
      }
    } else {
      shell.openPath(pathname)
    }
  }
})

// --- commands -------------------------------------

ipcMain.on('mt::cmd-open-file', (e: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (win) {
    openFile(win)
  }
})

ipcMain.on('mt::cmd-new-editor-window', () => {
  newEditorWindow()
})

ipcMain.on('mt::cmd-open-folder', (e: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (win) {
    openFolder(win)
  }
})

ipcMain.on('mt::cmd-close-window', (e: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (win) {
    win.close()
  }
})

ipcMain.on('mt::cmd-import-file', (e: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(e.sender)
  if (win) {
    importFile(win)
  }
})

// --- menu -------------------------------------

export const exportFile = (win: BrowserWindow | undefined, type: string) => {
  if (win && win.webContents) {
    win.webContents.send('mt::show-export-dialog', type)
  }
}

export const importFile = async (win: BrowserWindow | undefined) => {
  if (!win) return

  const existsPandoc = pandoc.exists()

  if (!existsPandoc) {
    return noticePandocNotFound(win)
  }

  const { filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      {
        name: 'All Files',
        extensions: [...PANDOC_EXTENSIONS]
      }
    ]
  })

  if (filePaths && filePaths[0]) {
    openPandocFile(win.id, filePaths[0])
  }
}

export const printDocument = (win: BrowserWindow | undefined) => {
  if (win) {
    win.webContents.send('mt::show-export-dialog', 'print')
  }
}

export const openFile = async (win: BrowserWindow | undefined) => {
  if (!win) return

  const { filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Markdown document',
        extensions: [...MARKDOWN_EXTENSIONS]
      }
    ]
  })

  if (Array.isArray(filePaths) && filePaths.length > 0) {
    ipcMain.emit('app-open-files-by-id', win.id, filePaths)
  }
}

export const openFolder = async (win: BrowserWindow | undefined) => {
  if (!win) return

  const { filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory', 'createDirectory']
  })

  if (filePaths && filePaths[0]) {
    openFileOrFolder(win, filePaths[0])
  }
}

export const openFileOrFolder = (win: BrowserWindow | undefined, pathname: string) => {
  if (!win) return
  const resolvedPath = normalizeAndResolvePath(pathname)
  if (isFile(resolvedPath)) {
    ipcMain.emit('app-open-file-by-id', win.id, resolvedPath)
  } else if (isDirectory(resolvedPath)) {
    ipcMain.emit('app-open-directory-by-id', win.id, resolvedPath)
  } else {
    console.error(`[ERROR] Cannot open unknown file: "${resolvedPath}"`)
  }
}

export const newBlankTab = (win: BrowserWindow | undefined) => {
  if (win && win.webContents) {
    win.webContents.send('mt::new-untitled-tab')
    showTabBar(win)
  }
}

export const newEditorWindow = () => {
  ipcMain.emit('app-create-editor-window')
}

export const closeTab = (win: BrowserWindow | undefined) => {
  if (win && win.webContents) {
    win.webContents.send('mt::editor-close-tab')
  }
}

export const closeWindow = (win: BrowserWindow | undefined) => {
  if (win) {
    win.close()
  }
}

export const save = (win: BrowserWindow | undefined) => {
  if (win && win.webContents) {
    win.webContents.send('mt::editor-ask-file-save')
  }
}

export const saveAs = (win: BrowserWindow | undefined) => {
  if (win && win.webContents) {
    win.webContents.send('mt::editor-ask-file-save-as')
  }
}

export const exportPDF = (win: BrowserWindow | undefined) => {
  if (win && win.webContents) {
    exportFile(win, 'pdf')
  }
}

export const autoSave = (menuItem: any, browserWindow: BrowserWindow | undefined) => {
  const { checked } = menuItem
  ipcMain.emit('set-user-preference', { autoSave: checked })
}

export const moveTo = (win: BrowserWindow | undefined) => {
  if (win && win.webContents) {
    win.webContents.send('mt::editor-move-file')
  }
}

export const rename = (win: BrowserWindow | undefined) => {
  if (win && win.webContents) {
    win.webContents.send('mt::editor-rename-file')
  }
}

export const clearRecentlyUsed = () => {
  ipcMain.emit('menu-clear-recently-used')
}

// --- Commands -------------------------------------------------------------

export const loadFileCommands = (commandManager: CommandManagerClass) => {
  commandManager.add(COMMANDS.FILE_CHECK_UPDATE, checkUpdates)
  commandManager.add(COMMANDS.FILE_CLOSE_TAB, closeTab)
  commandManager.add(COMMANDS.FILE_CLOSE_WINDOW, closeWindow)
  commandManager.add(COMMANDS.FILE_EXPORT_FILE, exportFile)
  commandManager.add(COMMANDS.FILE_IMPORT_FILE, importFile)
  commandManager.add(COMMANDS.FILE_MOVE_FILE, moveTo)
  commandManager.add(COMMANDS.FILE_NEW_FILE, newEditorWindow)
  commandManager.add(COMMANDS.FILE_NEW_TAB, newBlankTab)
  commandManager.add(COMMANDS.FILE_OPEN_FILE, openFile)
  commandManager.add(COMMANDS.FILE_OPEN_FOLDER, openFolder)
  commandManager.add(COMMANDS.FILE_PREFERENCES, userSetting)
  commandManager.add(COMMANDS.FILE_PRINT, printDocument)
  commandManager.add(COMMANDS.FILE_QUIT, app.quit)
  commandManager.add(COMMANDS.FILE_RENAME_FILE, rename)
  commandManager.add(COMMANDS.FILE_SAVE, save)
  commandManager.add(COMMANDS.FILE_SAVE_AS, saveAs)
  commandManager.add(COMMANDS.FILE_EXPORT_FILE_PDF, exportPDF)
}
