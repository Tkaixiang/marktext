// Global type declarations for MarkText

// Window augmentation for preload APIs
interface Window {
  electron: {
    ipcRenderer: Electron.IpcRenderer
    shell: Electron.Shell
    clipboard: Electron.Clipboard
    webUtils: Electron.WebUtils
  }
  rgPath: string
  fileUtils: {
    isFile: (path: string) => Promise<boolean>
    isDirectory: (path: string) => Promise<boolean>
    emptyDir: (path: string) => Promise<void>
    copy: (src: string, dest: string) => Promise<void>
    ensureDir: (path: string) => Promise<void>
    outputFile: (path: string, data: any) => Promise<void>
    move: (src: string, dest: string) => Promise<void>
    stat: (path: string) => Promise<any>
    writeFile: (path: string, data: any) => Promise<void>
    readFile: (path: string) => Promise<Buffer>
    ensureDirSync: (path: string) => void
    pathExistsSync: (path: string) => boolean
    isChildOfDirectory: (dir: string, child: string) => boolean
    hasMarkdownExtension: (filename: string) => boolean
    MARKDOWN_INCLUSIONS: string[]
    isSamePathSync: (pathA: string, pathB: string) => boolean
    isImageFile: (filepath: string) => boolean
  }
  path: typeof import('path')
  commandExists: {
    exists: (command: string) => boolean
  }
  i18nUtils: {
    loadTranslations: (locale: string) => Promise<any>
  }
}

// Global marktext namespace
declare global {
  const MARKTEXT_VERSION: string
  const MARKTEXT_VERSION_STRING: string

  namespace NodeJS {
    interface Global {
      marktext: {
        env: {
          type: string
          [key: string]: any
        }
      }
      __static: string
      MARKTEXT_IS_STABLE: boolean
    }
  }

  var marktext: {
    env: {
      type: string
      [key: string]: any
    }
  }
  var __static: string
  var MARKTEXT_IS_STABLE: boolean
}

declare module 'ced' {
  export default function ced(buffer: Buffer): string
}

export {}
