import fs from 'fs'
import path from 'path'

// 支持的语言列表
const SUPPORTED_LANGUAGES: string[] = ['en', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ja', 'ko', 'pt']

// 翻译数据缓存
let translationsCache: Record<string, any> = {}

/**
 * 加载指定语言的翻译文件
 * @param {string} language - 语言代码
 * @returns {object} 翻译数据
 */
function loadTranslations(language: string): any {
  if (translationsCache[language]) {
    return translationsCache[language]
  }

  try {
    // 尝试多个可能的路径

    // Since this script is used in both main and preload processes, we can't use global.__static directly here since it is only for the main process
    const localePath =
      process.env.NODE_ENV === 'development'
        ? path.join(process.cwd(), 'static', 'locales', `${language}.min.json`)
        : path.join(process.resourcesPath, 'static', 'locales', `${language}.min.json`)

    if (!fs.existsSync(localePath)) {
      throw new Error(`Translation file not found for language: ${language}`)
    }

    const content = fs.readFileSync(localePath, 'utf8')

    const translationData = JSON.parse(content)

    translationsCache[language] = translationData
    return translationData
  } catch (error) {
    // 回退到英文
    console.error('Error loading translation:', error)
    if (language !== 'en') {
      return loadTranslations('en')
    }
    return null
  }
}

/**
 * 获取翻译文本
 * @param {string} key - 翻译键，支持点分隔的嵌套键
 * @param {string} language - 语言代码
 * @param {object} params - 参数替换对象
 * @returns {string} 翻译后的文本
 */
function getTranslation(key: string, language: string = 'en', params: Record<string, string> = {}): string {
  const translations = loadTranslations(language)

  // 支持点分隔的嵌套键
  const keys = key.split('.')
  let probe = translations

  for (const k of keys) {
    // Navigate through nested objects until the string
    if (probe && typeof probe === 'object' && k in probe) {
      probe = probe[k]
    } else {
      return key // Unable to find key, return the key itself
    }
  }

  if (typeof probe !== 'string') {
    return key // If the final value is not a string, return the key
  }

  // Parameter substitutions, for example "My name is: {name}"
  for (const [param, replacement] of Object.entries(params)) {
    probe = probe.replace(new RegExp(`\\{${param}\\}`, 'g'), replacement)
  }

  return probe
}

/**
 * 获取支持的语言列表
 * @returns {string[]} 支持的语言代码数组
 */
function getSupportedLanguages(): string[] {
  return [...SUPPORTED_LANGUAGES]
}

/**
 * 检查语言是否支持
 * @param {string} language - 语言代码
 * @returns {boolean} 是否支持
 */
function isLanguageSupported(language: string): boolean {
  return SUPPORTED_LANGUAGES.includes(language)
}

/**
 * 清除翻译缓存
 */
function clearCache(): void {
  translationsCache = {}
}

/**
 * 获取指定语言的所有翻译数据
 * @param {string} language - 语言代码
 * @returns {object} 完整的翻译数据对象
 */
function getAllTranslations(language: string): any {
  return loadTranslations(language)
}

export {
  getTranslation,
  getSupportedLanguages,
  isLanguageSupported,
  clearCache,
  getAllTranslations,
  loadTranslations
}
