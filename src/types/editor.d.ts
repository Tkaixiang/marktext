export interface MarkdownDocument {
  id: string
  filename: string
  pathname: string
  markdown: string
  cursor: CursorPosition | null
  history: any
  encoding: string
  lineEnding: string
  adjustLineEnding: boolean
  isMixedLineEndings: boolean
  textDirection: 'ltr' | 'rtl' | 'auto'
}

export interface CursorPosition {
  anchor: { line: number; ch: number }
  head: { line: number; ch: number }
}

export interface TabState {
  id: string
  label: string
  pathname: string
  markdown: string
  isActive: boolean
  isSaved: boolean
}

export interface EditorState {
  currentFile: MarkdownDocument | null
  tabs: TabState[]
  searchKey: string
  replaceKey: string
}
