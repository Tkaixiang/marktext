export interface MuyaOptions {
  markdown?: string
  preferLooseListItem?: boolean
  autoPairBracket?: boolean
  autoPairMarkdownSyntax?: boolean
  autoPairQuote?: boolean
  bulletListMarker?: string
  orderListDelimiter?: string
  tabSize?: number
  fontSize?: number
  lineHeight?: number
  codeBlockLineNumbers?: boolean
  trimUnnecessaryCodeBlockEmptyLines?: boolean
  hideQuickInsertHint?: boolean
  imageAction?: (image: File) => Promise<string>
  t?: (key: string) => string
}

export interface MuyaBlock {
  key: string
  type: string
  text: string
  children?: MuyaBlock[]
  parent?: MuyaBlock
}

export interface MuyaPlugin {
  pluginName: string
  new (muya: Muya, options?: any): any
}

export class Muya {
  static plugins: Array<{ plugin: MuyaPlugin; options: any }>
  static use(plugin: MuyaPlugin, options?: any): void

  constructor(container: HTMLElement | string, options?: MuyaOptions)

  markdown: string
  container: HTMLElement
  contentState: any
  eventCenter: any

  getMarkdown(): string
  setMarkdown(markdown: string, cursor?: any): void
  focus(): void
  blur(): void
  destroy(): void
}
