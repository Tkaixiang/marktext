export interface Preferences {
  autoSave: boolean
  autoSaveDelay: number
  titleBarStyle: 'native' | 'custom'
  theme: string
  fontSize: number
  lineHeight: number
  editorFontFamily: string
  codeFontFamily: string
  autoGuessEncoding: boolean
  defaultEncoding: string
  defaultDirectoryToOpen: string
  language: string
  spellChecker: {
    enabled: boolean
    language: string
  }
  imageInsertAction: 'upload' | 'folder' | 'path'
}
