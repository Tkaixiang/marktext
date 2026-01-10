// NOTE: This are mutable fields that may change at runtime.

import { t } from '../../i18n'
import { BrowserWindow, MenuItemConstructorOptions, BaseWindow } from 'electron'

// 使用函数形式避免模块加载时调用翻译函数
export const getCUT = (): MenuItemConstructorOptions => ({
  label: t('contextMenu.cut'),
  id: 'cutMenuItem',
  role: 'cut'
})

export const getCOPY = (): MenuItemConstructorOptions => ({
  label: t('contextMenu.copy'),
  id: 'copyMenuItem',
  role: 'copy'
})

export const getPASTE = (): MenuItemConstructorOptions => ({
  label: t('contextMenu.paste'),
  id: 'pasteMenuItem',
  role: 'paste'
})

export const getCOPY_AS_MARKDOWN = (): MenuItemConstructorOptions => ({
  label: t('contextMenu.copyAsMarkdown'),
  id: 'copyAsMarkdownMenuItem',
  click (menuItem, targetWindow) {
    if (targetWindow && targetWindow instanceof BrowserWindow) {
      targetWindow.webContents.send('mt::cm-copy-as-markdown')
    }
  }
})

export const getCOPY_AS_HTML = (): MenuItemConstructorOptions => ({
  label: t('contextMenu.copyAsHtml'),
  id: 'copyAsHtmlMenuItem',
  click (menuItem, targetWindow) {
    if (targetWindow && targetWindow instanceof BrowserWindow) {
      targetWindow.webContents.send('mt::cm-copy-as-html')
    }
  }
})

export const getPASTE_AS_PLAIN_TEXT = (): MenuItemConstructorOptions => ({
  label: t('contextMenu.pasteAsPlainText'),
  id: 'pasteAsPlainTextMenuItem',
  click (menuItem, targetWindow) {
    if (targetWindow && targetWindow instanceof BrowserWindow) {
      targetWindow.webContents.send('mt::cm-paste-as-plain-text')
    }
  }
})

export const getINSERT_BEFORE = (): MenuItemConstructorOptions => ({
  label: t('contextMenu.insertParagraphBefore'),
  id: 'insertParagraphBeforeMenuItem',
  click (menuItem, targetWindow) {
    if (targetWindow && targetWindow instanceof BrowserWindow) {
      targetWindow.webContents.send('mt::cm-insert-paragraph', 'before')
    }
  }
})

export const getINSERT_AFTER = (): MenuItemConstructorOptions => ({
  label: t('contextMenu.insertParagraphAfter'),
  id: 'insertParagraphAfterMenuItem',
  click (menuItem, targetWindow) {
    if (targetWindow && targetWindow instanceof BrowserWindow) {
      targetWindow.webContents.send('mt::cm-insert-paragraph', 'after')
    }
  }
})

// 为了向后兼容，保留原有的导出
export const CUT = getCUT()
export const COPY = getCOPY()
export const PASTE = getPASTE()
export const COPY_AS_MARKDOWN = getCOPY_AS_MARKDOWN()
export const COPY_AS_HTML = getCOPY_AS_HTML()
export const PASTE_AS_PLAIN_TEXT = getPASTE_AS_PLAIN_TEXT()
export const INSERT_BEFORE = getINSERT_BEFORE()
export const INSERT_AFTER = getINSERT_AFTER()

export const SEPARATOR: MenuItemConstructorOptions = {
  type: 'separator'
}
