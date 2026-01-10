import { BrowserWindow } from 'electron'

export const showAboutDialog = (win: BrowserWindow): void => {
  if (win && win.webContents) {
    win.webContents.send('mt::about-dialog')
  }
}

export const showTweetDialog = (win: BrowserWindow, type: string): void => {
  if (win && win.webContents) {
    win.webContents.send('mt::tweet', type)
  }
}
