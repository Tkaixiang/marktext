import { app } from 'electron'

const ID_PREFIX = 'mt-'
let id = 0

export const getUniqueId = (): string => {
  return `${ID_PREFIX}${id++}`
}

// TODO: Remove this function and load the recommend title from the editor (renderer) when
// requesting the document to save/export.
export const getRecommendTitleFromMarkdownString = (markdown: string): string => {
  // NOTE: We should read the title from the renderer cache because this regex matches in
  // code blocks too.
  const tokens = markdown.match(/#{1,6} {1,}(.*\S.*)(?:\n|$)/g)
  if (!tokens) return ''
  const headers = tokens.map(t => {
    const matches = t.trim().match(/(#{1,6}) {1,}(.+)/)
    if (!matches) return { level: 999, content: '' }
    // @ts-ignore
    const level = matches[1].length
    // @ts-ignore
    const content = matches[2].trim()
    return {
      level,
      content
    }
  })

  const sortedHeaders = headers.sort((a, b) => a.level - b.level)
  if (sortedHeaders.length === 0) return ''
  // @ts-ignore
  return sortedHeaders[0].content
}

/**
 * Returns a special directory path for the requested name.
 *
 * NOTE: Do not use "userData" to get the user data path, instead use AppPaths!
 *
 * @param {string} name The special directory name.
 * @returns {string} The resolved special directory path.
 */
export const getPath = (name: any): string => {
  if (name === 'userData') {
    throw new Error('Do not use "getPath" for user data path!')
  }
  return app.getPath(name)
}

export const hasSameKeys = (a: object, b: object): boolean => {
  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()
  return JSON.stringify(aKeys) === JSON.stringify(bKeys)
}

export const getLogLevel = (): string => {
  // @ts-ignore
  if (!global.MARKTEXT_DEBUG_VERBOSE || typeof global.MARKTEXT_DEBUG_VERBOSE !== 'number' ||
    // @ts-ignore
    global.MARKTEXT_DEBUG_VERBOSE <= 0) {
    return process.env.NODE_ENV === 'development' ? 'debug' : 'info'
    // @ts-ignore
  } else if (global.MARKTEXT_DEBUG_VERBOSE === 1) {
    return 'verbose'
    // @ts-ignore
  } else if (global.MARKTEXT_DEBUG_VERBOSE === 2) {
    return 'debug'
  }
  return 'silly' // >= 3
}
