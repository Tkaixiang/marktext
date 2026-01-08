// Global type declarations for MarkText

declare const MARKTEXT_VERSION: string
declare const MARKTEXT_VERSION_STRING: string

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
  namespace NodeJS {
    interface Global {
      marktext: {
        env: {
          type: string
          [key: string]: any
        }
      }
    }
  }

  var marktext: {
    env: {
      type: string
      [key: string]: any
    }
  }
}

export {}
