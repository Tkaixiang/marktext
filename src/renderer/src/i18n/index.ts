import { createI18n, I18n } from 'vue-i18n'
import bus from '../bus'

// Import translation file directly
import enTranslations from '../../../../static/locales/en.json'

// Create Vue i18n instance
const i18n: I18n = createI18n({
  legacy: false,
  locale: 'en', // default is en
  fallbackLocale: 'en',
  messages: { en: enTranslations }, // Load en by default only
  // Disable linking functionality to avoid @ symbol being misinterpreted
  modifiers: {
    '@': () => '@'
  },
  // Disable plural parsing
  pluralRules: {},
  // Custom message compiler to handle | character
  messageCompiler: {
    compile: (message: string) => {
      // If message contains | character, return original string without plural parsing
      if (typeof message === 'string' && message.includes('|')) {
        return () => message
      }
      // For other messages, use default compilation
      return null
    }
  }
})

// Export translation function - fix: properly handle Vue i18n v9+ global getter
export const t = (key: string, ...args: unknown[]): string => {
  // Check if i18n instance is available
  if (!i18n) {
    console.warn('⚠️ i18n instance not available, using English fallback')
    return key
  }

  try {
    // Correctly access global property
    if (!i18n.global) {
      console.warn('⚠️ i18n.global not ready yet, falling back to EN')
      return key
    }

    return i18n.global.t(key, ...args) as string
  } catch (error) {
    console.error('❌ Translation function error:', error)
    return key
  }
}

// Export language setting function
export const setLanguage = (locale: string): void => {
  if (!locale) return
  if (!i18n.global.availableLocales.includes(locale)) {
    // Locale not yet available, need to get it from the main process
    const translation = window.i18nUtils.loadTranslations(locale)
    if (!translation) return // Failed to load locale file, error msg should be in the loadTranslations function

    // Add the loaded locale to i18n instance
    i18n.global.setLocaleMessage(locale, translation)
    console.log(`🌐 Loaded and set new locale: ${locale}`)
  }
  i18n.global.locale.value = locale
}

// Export get current language function
export const getCurrentLanguage = (): string => i18n.global.locale.value as string

// Export i18n instance (named export and default export)
export { i18n }
export default i18n

// Listen for language changes
if (window.electron && window.electron.ipcRenderer) {
  window.electron.ipcRenderer.on('language-changed', (_event: unknown, newLocale: string) => {
    setLanguage(newLocale)
    bus.emit('language-changed', newLocale)
  })

  // Request current language setting on startup
  window.electron.ipcRenderer.send('mt::get-current-language')
  window.electron.ipcRenderer.on('mt::current-language', (_event: unknown, language: string) => {
    setLanguage(language)
    bus.emit('language-changed', language)
  })
}
