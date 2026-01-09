import { getTranslation } from '../common/i18n'
import { BrowserWindow } from 'electron'

// 当前语言设置（可以从配置文件或用户设置中获取）
let currentLanguage = 'en'

/**
 * 获取翻译文本
 * @param {string} key - 翻译键
 * @param {object} params - 参数对象
 * @returns {string} 翻译后的文本
 */
export function t(key: string, params: Record<string, any> = {}): string {
  return getTranslation(key, currentLanguage, params)
}

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
export function getCurrentLanguage(): string {
  return currentLanguage
}

/**
 * 设置语言
 * @param {string} language - 语言代码
 */
export function setLanguage(language: string): void {
  currentLanguage = language

  const windows = BrowserWindow.getAllWindows()
  windows.forEach((window) => {
    if (window && !window.isDestroyed()) {
      window.webContents.send('language-changed', language)
    }
  })
}
