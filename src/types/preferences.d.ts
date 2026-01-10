export interface Preferences {
  autoSave: boolean
  autoSaveDelay: number
  titleBarStyle: 'native' | 'custom'
  openFilesInNewWindow: boolean
  openFolderInNewWindow: boolean
  zoom: number
  hideScrollbar: boolean
  wordWrapInToc: boolean
  fileSortBy: 'created' | 'modification' | 'title'
  startUpAction: 'lastState' | 'folder' | 'blank'
  defaultDirectoryToOpen: string
  treePathExcludePatterns: string[]
  language: string

  editorFontFamily: string
  fontSize: number
  lineHeight: number
  codeFontSize: number
  codeFontFamily: string
  codeBlockLineNumbers: boolean
  trimUnnecessaryCodeBlockEmptyLines: boolean
  wrapCodeBlocks: boolean
  editorLineWidth: string

  autoPairBracket: boolean
  autoPairMarkdownSyntax: boolean
  autoPairQuote: boolean
  endOfLine: 'default' | 'lf' | 'crlf'
  defaultEncoding: string
  autoGuessEncoding: boolean
  trimTrailingNewline: number
  textDirection: 'ltr' | 'rtl'
  hideQuickInsertHint: boolean
  imageInsertAction: 'upload' | 'folder' | 'path'
  imagePreferRelativeDirectory: boolean
  imageRelativeDirectoryName: string
  hideLinkPopup: boolean
  autoCheck: boolean

  preferLooseListItem: boolean
  bulletListMarker: string
  orderListDelimiter: string
  preferHeadingStyle: string
  tabSize: number
  listIndentation: number
  frontmatterType: string
  superSubScript: boolean
  footnote: boolean
  isHtmlEnabled: boolean
  isGitlabCompatibilityEnabled: boolean
  sequenceTheme: string

  theme: string
  followSystemTheme: boolean
  lightModeTheme: string
  darkModeTheme: string
  customCss: string

  spellcheckerEnabled: boolean
  spellcheckerNoUnderline: boolean
  spellcheckerLanguage: string

  sideBarVisibility: boolean
  tabBarVisibility: boolean
  sourceCodeModeEnabled: boolean

  searchExclusions: string[]
  searchMaxFileSize: string
  searchIncludeHidden: boolean
  searchNoIgnore: boolean
  searchFollowSymlinks: boolean

  watcherUsePolling: boolean

  // Non-persistent state (optional or separated?)
  // These seem to be used in the store state but maybe not saved to config.json
  // For now I will include them here or create a separate interface in the store file.
}

export interface ImageBedConfig {
  github: {
    owner: string
    repo: string
    branch: string
  }
}

export interface PreferenceState extends Preferences {
  typewriter: boolean
  focus: boolean
  sourceCode: boolean
  imageFolderPath: string
  webImages: any[]
  cloudImages: any[]
  currentUploader: string
  githubToken: string
  imageBed: ImageBedConfig
  cliScript: string
}
