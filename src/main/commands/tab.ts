import { BrowserWindow } from 'electron'
import COMMAND_CONSTANTS from 'common/commands/constants'
import type { CommandManagerClass } from './index'

const COMMANDS = COMMAND_CONSTANTS

const switchToLeftTab = (win: BrowserWindow): void => {
  if (win && win.webContents) {
    win.webContents.send('mt::tabs-cycle-left')
  }
}

const switchToRightTab = (win: BrowserWindow): void => {
  if (win && win.webContents) {
    win.webContents.send('mt::tabs-cycle-right')
  }
}

const switchTabByIndex = (win: BrowserWindow, index: number): void => {
  if (win && win.webContents) {
    win.webContents.send('mt::switch-tab-by-index', index)
  }
}

export const loadTabCommands = (commandManager: CommandManagerClass): void => {
  commandManager.add(COMMANDS.TABS_CYCLE_BACKWARD, switchToLeftTab)
  commandManager.add(COMMANDS.TABS_CYCLE_FORWARD, switchToRightTab)
  commandManager.add(COMMANDS.TABS_SWITCH_TO_LEFT, switchToLeftTab)
  commandManager.add(COMMANDS.TABS_SWITCH_TO_RIGHT, switchToRightTab)
  commandManager.add(COMMANDS.TABS_SWITCH_TO_FIRST, (win: BrowserWindow) => switchTabByIndex(win, 0))
  commandManager.add(COMMANDS.TABS_SWITCH_TO_SECOND, (win: BrowserWindow) => switchTabByIndex(win, 1))
  commandManager.add(COMMANDS.TABS_SWITCH_TO_THIRD, (win: BrowserWindow) => switchTabByIndex(win, 2))
  commandManager.add(COMMANDS.TABS_SWITCH_TO_FOURTH, (win: BrowserWindow) => switchTabByIndex(win, 3))
  commandManager.add(COMMANDS.TABS_SWITCH_TO_FIFTH, (win: BrowserWindow) => switchTabByIndex(win, 4))
  commandManager.add(COMMANDS.TABS_SWITCH_TO_SIXTH, (win: BrowserWindow) => switchTabByIndex(win, 5))
  commandManager.add(COMMANDS.TABS_SWITCH_TO_SEVENTH, (win: BrowserWindow) => switchTabByIndex(win, 6))
  commandManager.add(COMMANDS.TABS_SWITCH_TO_EIGHTH, (win: BrowserWindow) => switchTabByIndex(win, 7))
  commandManager.add(COMMANDS.TABS_SWITCH_TO_NINTH, (win: BrowserWindow) => switchTabByIndex(win, 8))
  commandManager.add(COMMANDS.TABS_SWITCH_TO_TENTH, (win: BrowserWindow) => switchTabByIndex(win, 9))
}
