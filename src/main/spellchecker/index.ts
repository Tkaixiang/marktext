import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
import log from 'electron-log'
import { isOsx } from '../config'

/**
 * Add the given word to the spellchecker dictionary.
 *
 * @param {BrowserWindow} win The browser window.
 * @param {string} word The word to add.
 * @returns {boolean} Whether the word was added.
 */
export const addToDictionary = (win: BrowserWindow, word: string): boolean => {
  return win.webContents.session.addWordToSpellCheckerDictionary(word)
}

/**
 * Remove the given word from the spellchecker dictionary.
 *
 * @param {BrowserWindow} win The browser window.
 * @param {string} word The word to remove.
 * @returns {boolean} Whether the word was removed.
 */
export const removeFromDictionary = (win: BrowserWindow, word: string): boolean => {
  return win.webContents.session.removeWordFromSpellCheckerDictionary(word)
}

/**
 * Returns a list of all words in the custom dictionary.
 *
 * @param {BrowserWindow} win The browser window.
 * @returns {Promise<string[]>} List of custom dictionary words.
 */
export const getCustomDictionaryWords = async (win: BrowserWindow): Promise<string[]> => {
  return win.webContents.session.listWordsInSpellCheckerDictionary()
}

/**
 * Sets whether to enable the builtin spell checker.
 *
 * @param {BrowserWindow} win The browser window.
 * @param {boolean} enabled Whether to enable the builtin spell checker.
 */
export const setSpellCheckerEnabled = (win: BrowserWindow, enabled: boolean): boolean => {
  win.webContents.session.setSpellCheckerEnabled(enabled)
  return win.webContents.session.isSpellCheckerEnabled() === enabled
}

/**
 * Switch the spellchecker to the given language and enable the builtin spell checker.
 *
 * @param {BrowserWindow} win The browser window.
 * @param {string} word The word to remove.
 * @throws Throws an exception if the language cannot be set.
 */
export const switchLanguage = (win: BrowserWindow, lang: string): void => {
  win.webContents.session.setSpellCheckerLanguages([lang])
}

/**
 *
 * @param {BrowserWindow} win The browser window.
 * @returns {string[]} List of available spellchecker languages or an empty array on macOS.
 */
export const getAvailableDictionaries = (win: BrowserWindow): string[] => {
  if (!win.webContents.session.isSpellCheckerEnabled()) {
    console.warn('Spell Checker not available but dictionaries requested.')
    return []
  } else if (isOsx) {
    // NB: On macOS the OS spellchecker is used and will detect the language automatically.
    return []
  }

  const availableLanguages = win.webContents.session.availableSpellCheckerLanguages

  return availableLanguages.length > 0 ? availableLanguages : ['en-US']
}

export default () => {
  ipcMain.handle('mt::spellchecker-remove-word', async (e: IpcMainInvokeEvent, word: string) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win) {
      return removeFromDictionary(win, word)
    }
    return false
  })
  ipcMain.handle('mt::spellchecker-switch-language', async (e: IpcMainInvokeEvent, lang: string) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win) {
      switchLanguage(win, lang)
    }
    return null
  })
  ipcMain.handle('mt::spellchecker-get-available-dictionaries', async (e: IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win) {
      return getAvailableDictionaries(win)
    }
    return []
  })
  // NOTE: We have to set a language or call `switchLanguage` on Linux and Windows.
  ipcMain.handle('mt::spellchecker-set-enabled', async (e: IpcMainInvokeEvent, enabled: boolean) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win) {
      if (!setSpellCheckerEnabled(win, enabled)) {
        log.warn(`Failed to (de-)activate spell checking on editor (id=${win.id}).`)
        return false
      }
      return true
    }
    return false
  })
  ipcMain.handle('mt::spellchecker-get-custom-dictionary-words', async (e: IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    if (win) {
      return getCustomDictionaryWords(win)
    }
    return []
  })
}
