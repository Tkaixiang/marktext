import { BrowserWindow } from 'electron'
import COMMAND_CONSTANTS from 'common/commands/constants'
import type { CommandManagerClass } from './index'

const COMMANDS = COMMAND_CONSTANTS

const openQuickOpenDialog = (win: BrowserWindow): void => {
  if (win && win.webContents) {
    win.webContents.send('mt::execute-command-by-id', 'file.quick-open')
  }
}

export const loadFileCommands = (commandManager: CommandManagerClass): void => {
  commandManager.add(COMMANDS.FILE_QUICK_OPEN, openQuickOpenDialog)
}
