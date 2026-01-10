import { Menu, BrowserWindow } from 'electron'
import { isOsx } from '../../config'
import { COMMANDS, CommandManagerClass } from '../../commands'
import { zoomIn, zoomOut } from '../../windows/utils'
import { ipcMain } from 'electron'

export const minimizeWindow = (win: BrowserWindow): void => {
  if (win) {
    if (isOsx) {
      Menu.sendActionToFirstResponder('performMiniaturize:')
    } else {
      win.minimize()
    }
  }
}

export const toggleAlwaysOnTop = (win: BrowserWindow): void => {
  if (win) {
    ipcMain.emit('window-toggle-always-on-top', win)
  }
}

export const toggleFullScreen = (win: BrowserWindow): void => {
  if (win) {
    win.setFullScreen(!win.isFullScreen())
  }
}

// --- Commands -------------------------------------------------------------

export const loadWindowCommands = (commandManager: CommandManagerClass): void => {
  commandManager.add(COMMANDS.WINDOW_MINIMIZE, minimizeWindow)
  commandManager.add(COMMANDS.WINDOW_TOGGLE_ALWAYS_ON_TOP, toggleAlwaysOnTop)
  commandManager.add(COMMANDS.WINDOW_TOGGLE_FULL_SCREEN, toggleFullScreen)
  commandManager.add(COMMANDS.WINDOW_ZOOM_IN, zoomIn)
  commandManager.add(COMMANDS.WINDOW_ZOOM_OUT, zoomOut)
}
