import {
  THEME_STYLE_ID,
  COMMON_STYLE_ID,
  DEFAULT_CODE_FONT_FAMILY,
  oneDarkThemes,
  railscastsThemes
} from '../config'
import { dark, graphite, materialDark, oneDark, ulysses } from './themeColor'
import { isLinux } from './index'

const ORIGINAL_THEME = '#409EFF'
const patchTheme = (css: string): string => {
  return `@media not print {\n${css}\n}`
}

const getEmojiPickerPatch = (): string => {
  return isLinux
    ? '.ag-emoji-picker section .emoji-wrapper .item span { font-family: sans-serif, "Noto Color Emoji"; }'
    : ''
}

interface ThemeCluster {
  color: string
  variable: string
}

const getThemeCluster = (themeColor: string): ThemeCluster[] => {
  const tintColor = (color: string, tint: number): string => {
    let red = parseInt(color.slice(1, 3), 16)
    let green = parseInt(color.slice(3, 5), 16)
    let blue = parseInt(color.slice(5, 7), 16)
    if (tint === 0) {
      // when primary color is in its rgb space
      return [red, green, blue].join(',')
    } else {
      red += Math.round(tint * (255 - red))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))
      const redHex = red.toString(16)
      const greenHex = green.toString(16)
      const blueHex = blue.toString(16)
      return `#${redHex}${greenHex}${blueHex}`
    }
  }

  const clusters: ThemeCluster[] = [
    {
      color: themeColor,
      variable: 'var(--themeColor)'
    }
  ]
  for (let i = 9; i >= 1; i--) {
    clusters.push({
      color: tintColor(themeColor, Number((i / 10).toFixed(2))),
      variable: `var(--themeColor${10 - i}0)`
    })
  }

  return clusters
}

export type ThemeName = 'light' | 'dark' | 'material-dark' | 'ulysses' | 'graphite' | 'one-dark'

export const addThemeStyle = (theme: ThemeName | string): void => {
  const isCmRailscasts = railscastsThemes.includes(theme)
  const isCmOneDark = oneDarkThemes.includes(theme)
  const isDarkTheme = isCmOneDark || isCmRailscasts
  let themeStyleEle = document.querySelector(`#${THEME_STYLE_ID}`) as HTMLStyleElement | null
  if (!themeStyleEle) {
    themeStyleEle = document.createElement('style')
    themeStyleEle.id = THEME_STYLE_ID
    document.head.appendChild(themeStyleEle)
  }

  switch (theme) {
    case 'light':
      themeStyleEle.innerHTML = ''
      break
    case 'dark':
      themeStyleEle.innerHTML = patchTheme(dark())
      break
    case 'material-dark':
      themeStyleEle.innerHTML = patchTheme(materialDark())
      break
    case 'ulysses':
      themeStyleEle.innerHTML = patchTheme(ulysses())
      break
    case 'graphite':
      themeStyleEle.innerHTML = patchTheme(graphite())
      break
    case 'one-dark':
      themeStyleEle.innerHTML = patchTheme(oneDark())
      break
    default:
      break
  }

  // workaround: use dark icons
  document.body.classList.remove('dark')
  if (isDarkTheme) {
    document.body.classList.add('dark')
  }

  // change CodeMirror theme
  const cm = document.querySelector('.CodeMirror')
  if (cm) {
    cm.classList.remove('cm-s-default')
    cm.classList.remove('cm-s-one-dark')
    cm.classList.remove('cm-s-railscasts')
    if (isCmOneDark) {
      cm.classList.add('cm-s-one-dark')
    } else if (isCmRailscasts) {
      cm.classList.add('cm-s-railscasts')
    } else {
      cm.classList.add('cm-s-default')
    }
  }
}

export const setWrapCodeBlocks = (value: boolean): void => {
  const CODE_WRAP_STYLE_ID = 'ag-code-wrap'
  let result = ''
  if (value) {
    result =
      '.ag-code-content { display: block; white-space: pre-wrap; word-break: break-word; overflow: hidden; }'
  } else {
    result =
      '.ag-code-content { display: block; white-space: pre; word-break: break-word; overflow: auto; }'
  }
  let styleEle = document.querySelector(`#${CODE_WRAP_STYLE_ID}`) as HTMLStyleElement | null
  if (!styleEle) {
    styleEle = document.createElement('style')
    styleEle.setAttribute('id', CODE_WRAP_STYLE_ID)
    document.head.appendChild(styleEle)
  }

  styleEle.innerHTML = result
}

export const setEditorWidth = (value: string): void => {
  const EDITOR_WIDTH_STYLE_ID = 'editor-width'
  let result = ''
  if (value && /^[0-9]+(?:ch|px|%)$/.test(value)) {
    // Overwrite the theme value and add 100px for padding.
    result = `:root { --editorAreaWidth: calc(100px + ${value}); }`
  }
  let styleEle = document.querySelector(`#${EDITOR_WIDTH_STYLE_ID}`) as HTMLStyleElement | null
  if (!styleEle) {
    styleEle = document.createElement('style')
    styleEle.setAttribute('id', EDITOR_WIDTH_STYLE_ID)
    document.head.appendChild(styleEle)
  }

  styleEle.innerHTML = result
}

export interface CommonStyleOptions {
  codeFontFamily: string
  codeFontSize: number
  hideScrollbar: boolean
}

export const addCommonStyle = (options: CommonStyleOptions): void => {
  const { codeFontFamily, codeFontSize, hideScrollbar } = options
  let sheet = document.querySelector(`#${COMMON_STYLE_ID}`) as HTMLStyleElement | null
  if (!sheet) {
    sheet = document.createElement('style')
    sheet.id = COMMON_STYLE_ID
    document.head.appendChild(sheet)
  }

  let scrollbarStyle = ''
  if (hideScrollbar) {
    scrollbarStyle = '::-webkit-scrollbar {display: none;}'
  }

  sheet.innerHTML = `${scrollbarStyle}
span code,
td code,
th code,
code,
code[class*="language-"],
.CodeMirror,
pre.ag-paragraph {
font-family: ${codeFontFamily}, ${DEFAULT_CODE_FONT_FAMILY};
font-size: ${codeFontSize}px;
}

${getEmojiPickerPatch()}
`
}

export interface CustomStyleOptions {
  customCss?: string
}

export const addCustomStyle = (options: CustomStyleOptions): void => {
  const { customCss } = options
  if (!customCss) return

  let customStyleEle = document.querySelector('#custom-styles') as HTMLStyleElement | null
  if (!customStyleEle) {
    customStyleEle = document.createElement('style')
    customStyleEle.id = 'custom-styles'
    document.head.appendChild(customStyleEle)
  }
  customStyleEle.innerHTML = customCss
}

export interface StyleOptions extends CommonStyleOptions, CustomStyleOptions {
  theme: ThemeName | string
}

// Append common sheet and theme at the end of head - order is important.
export const addStyles = (options: StyleOptions): void => {
  const { theme } = options
  addThemeStyle(theme)
  addCommonStyle(options)
}
