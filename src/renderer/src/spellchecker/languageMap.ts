import langMap from 'iso-639-1'

interface HunspellLanguageItem {
  label: string
  value: string
}

/**
 * Return the native language name by language code.
 *
 * @param languageCode The ISO two or four-letter language code (e.g. en, en-US) or BCP-47 code.
 */
export const getLanguageName = (languageCode: string): string | null => {
  if (!languageCode || languageCode.length < 2) {
    return null
  }

  let language = ''

  // First try to get an exact language via 4-letter ISO code.
  if (languageCode.length === 5) {
    language = getHunspellLanguageName(languageCode) || ''
    if (language) {
      return language
    }
  }

  language = langMap.getNativeName(languageCode.substr(0, 2))
  if (language) {
    // Add language code to distinguish between native name (en-US, en-GB, ...).
    return `${language} (${languageCode})`
  }
  return `Unknown (${languageCode})`
}

/**
 * Return the native language name by language code for supported Hunspell languages.
 *
 * @param langCode The ISO 4-letter language code.
 */
const getHunspellLanguageName = (langCode: string): string | null => {
  const item = HUNSPELL_DICTIONARY_LANGUAGE_MAP.find((item) => item.value === langCode)
  if (!item) {
    return null
  }
  return item.label
}

// All available Hunspell dictionary languages - modified to support English only
const HUNSPELL_DICTIONARY_LANGUAGE_MAP: readonly HunspellLanguageItem[] = Object.freeze([
  {
    label: 'English (en-US)', // English
    value: 'en-US'
  }
])
