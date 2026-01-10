import { BrowserWindow, Menu } from 'electron'
import { COMMANDS, CommandManagerClass } from '../../commands'

const MENU_ID_FORMAT_MAP = Object.freeze({
  strongMenuItem: 'strong',
  emphasisMenuItem: 'em',
  inlineCodeMenuItem: 'inline_code',
  strikeMenuItem: 'del',
  hyperlinkMenuItem: 'link',
  imageMenuItem: 'image',
  inlineMathMenuItem: 'inline_math'
})

const format = (win: BrowserWindow, type: string): void => {
  if (win && win.webContents) {
    win.webContents.send('mt::editor-format-action', { type })
  }
}

export const clearFormat = (win: BrowserWindow): void => {
  format(win, 'clear')
}

export const emphasis = (win: BrowserWindow): void => {
  format(win, 'em')
}

export const highlight = (win: BrowserWindow): void => {
  format(win, 'mark')
}

export const hyperlink = (win: BrowserWindow): void => {
  format(win, 'link')
}

export const image = (win: BrowserWindow): void => {
  format(win, 'image')
}

export const inlineCode = (win: BrowserWindow): void => {
  format(win, 'inline_code')
}

export const inlineMath = (win: BrowserWindow): void => {
  format(win, 'inline_math')
}

export const strikethrough = (win: BrowserWindow): void => {
  format(win, 'del')
}

export const strong = (win: BrowserWindow): void => {
  format(win, 'strong')
}

export const subscript = (win: BrowserWindow): void => {
  format(win, 'sub')
}

export const superscript = (win: BrowserWindow): void => {
  format(win, 'sup')
}

export const underline = (win: BrowserWindow): void => {
  format(win, 'u')
}

// --- Commands -------------------------------------------------------------

export const loadFormatCommands = (commandManager: CommandManagerClass): void => {
  commandManager.add(COMMANDS.FORMAT_CLEAR_FORMAT, clearFormat)
  commandManager.add(COMMANDS.FORMAT_EMPHASIS, emphasis)
  commandManager.add(COMMANDS.FORMAT_HIGHLIGHT, highlight)
  commandManager.add(COMMANDS.FORMAT_HYPERLINK, hyperlink)
  commandManager.add(COMMANDS.FORMAT_IMAGE, image)
  commandManager.add(COMMANDS.FORMAT_INLINE_CODE, inlineCode)
  commandManager.add(COMMANDS.FORMAT_INLINE_MATH, inlineMath)
  commandManager.add(COMMANDS.FORMAT_STRIKE, strikethrough)
  commandManager.add(COMMANDS.FORMAT_STRONG, strong)
  commandManager.add(COMMANDS.FORMAT_SUBSCRIPT, subscript)
  commandManager.add(COMMANDS.FORMAT_SUPERSCRIPT, superscript)
  commandManager.add(COMMANDS.FORMAT_UNDERLINE, underline)
}

// --- IPC events -------------------------------------------------------------

// NOTE: Don't use static `getMenuItemById` here, instead request the menu by
//       window id from `AppMenu` manager.

/**
 * Update format menu entires from given state.
 *
 * @param {Electron.Menu} applicationMenu The application menu instance.
 * @param {Object.<string, boolean>} formats A object map with selected formats.
 */
export const updateFormatMenu = (applicationMenu: Menu, formats: Record<string, boolean>): void => {
  const formatMenuItem = applicationMenu.getMenuItemById('formatMenuItem')
  if (formatMenuItem && formatMenuItem.submenu) {
    formatMenuItem.submenu.items.forEach(item => (item.checked = false))
    formatMenuItem.submenu.items
      .forEach(item => {
        if (item.id && formats[MENU_ID_FORMAT_MAP[item.id as keyof typeof MENU_ID_FORMAT_MAP]]) {
          item.checked = true
        }
      })
  }
}
