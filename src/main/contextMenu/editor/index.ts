import { Menu, MenuItem, BrowserWindow, ContextMenuParams, Event } from 'electron'
import {
  getCUT,
  getCOPY,
  getPASTE,
  getCOPY_AS_MARKDOWN,
  getCOPY_AS_HTML,
  getPASTE_AS_PLAIN_TEXT,
  SEPARATOR,
  getINSERT_BEFORE,
  getINSERT_AFTER
} from './menuItems'
import spellcheckMenuBuilder from './spellcheck'
import { t } from '../../i18n'

// 动态获取菜单项以确保翻译正确
const getContextItems = () => [
  getINSERT_BEFORE(),
  getINSERT_AFTER(),
  SEPARATOR,
  getCUT(),
  getCOPY(),
  getPASTE(),
  SEPARATOR,
  getCOPY_AS_MARKDOWN(),
  getCOPY_AS_HTML(),
  getPASTE_AS_PLAIN_TEXT()
]

const isInsideEditor = (params: ContextMenuParams) => {
  // @ts-ignore: inputFieldType property is missing in Electron types but used in codebase
  const { isEditable, editFlags, inputFieldType } = params
  // WORKAROUND for Electron#32102: `params.spellcheckEnabled` is always false. Try to detect the editor container via other information.
  return isEditable && !inputFieldType && !!editFlags.canEditRichly
}

export const showEditorContextMenu = (win: BrowserWindow, event: Event, params: ContextMenuParams, isSpellcheckerEnabled: boolean) => {
  const {
    isEditable,
    hasImageContents,
    selectionText,
    editFlags,
    misspelledWord,
    dictionarySuggestions
  } = params

  // NOTE: We have to get the word suggestions from this event because `webFrame.getWordSuggestions` and
  //       `webFrame.isWordMisspelled` doesn't work on Windows (Electron#28684).

  // Make sure that the request comes from a contenteditable inside the editor container.
  if (isInsideEditor(params) && !hasImageContents) {
    const hasText = selectionText.trim().length > 0
    const canCopy = hasText && editFlags.canCut && editFlags.canCopy
    // const canPaste = hasText && editFlags.canPaste
    const isMisspelled = isEditable && !!selectionText && !!misspelledWord

    const menu = new Menu()
    if (isSpellcheckerEnabled) {
      const spellingSubmenu = spellcheckMenuBuilder(
        isMisspelled,
        misspelledWord,
        dictionarySuggestions
      )
      menu.append(
        new MenuItem({
          label: t('contextMenu.spelling'),
          submenu: spellingSubmenu
        })
      )
      menu.append(new MenuItem(SEPARATOR))
    }

    const contextItems = getContextItems()
    const copyItems = [contextItems[3], contextItems[4], contextItems[8], contextItems[7]] // CUT, COPY, COPY_AS_HTML, COPY_AS_MARKDOWN
    copyItems.forEach((item) => {
      if (item) item.enabled = canCopy
    })
    contextItems.forEach((item) => {
      if (item) menu.append(new MenuItem(item))
    })
    // @ts-ignore: Event type mismatch in Electron types vs actual usage
    menu.popup([{ window: win, x: event.clientX, y: event.clientY }])
  }
}
