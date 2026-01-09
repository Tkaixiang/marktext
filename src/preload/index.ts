import { contextBridge, shell, clipboard, webUtils } from 'electron'
import fs from 'fs-extra'
import { isFile, isDirectory, ensureDirSync } from 'common/filesystem'
import { electronAPI } from '@electron-toolkit/preload'
import {
  isChildOfDirectory,
  hasMarkdownExtension,
  MARKDOWN_INCLUSIONS,
  isSamePathSync,
  isImageFile
} from 'common/filesystem/paths'
import { rgPath } from '@vscode/ripgrep'
import path from 'path'
import commandExists from 'command-exists'
import { loadTranslations } from '../common/i18n'

const i18nUtils = {
  loadTranslations
}

const customElectronAPI = {
  shell,
  clipboard,
  webUtils
}

const fileUtilsAPI = {
  isFile: (path: string) => isFile(path),
  isDirectory: (path: string) => isDirectory(path),
  emptyDir: (path: string) => fs.emptyDir(path),
  copy: (src: string, dest: string) => fs.copy(src, dest),
  ensureDir: (path: string) => fs.ensureDir(path),
  outputFile: (path: string, data: any) => fs.outputFile(path, data),
  move: (src: string, dest: string) => fs.move(src, dest),
  stat: (path: string) => fs.stat(path),
  writeFile: (path: string, data: any) => fs.writeFile(path, data),
  readFile: (path: string) => fs.readFile(path),
  ensureDirSync: (path: string) => ensureDirSync(path),
  pathExistsSync: (path: string) => fs.pathExistsSync(path),
  isChildOfDirectory: (dir: string, child: string) => isChildOfDirectory(dir, child),
  hasMarkdownExtension: (filename: string) => hasMarkdownExtension(filename),
  MARKDOWN_INCLUSIONS,
  isSamePathSync: (pathA: string, pathB: string) => isSamePathSync(pathA, pathB),
  isImageFile: (filepath: string) => isImageFile(filepath)
}

const commandAPI = {
  exists: (command: string) => {
    try {
      // 先尝试使用 command-exists 检查
      if (commandExists.sync(command)) {
        return true
      }

      // 对于 picgo，额外检查常见安装路径
      if (command === 'picgo' && process.platform === 'darwin') {
        const commonPaths = [
          '/usr/local/bin/picgo',
          '/opt/homebrew/bin/picgo',
          `${process.env.HOME}/.npm-global/bin/picgo`,
          `${process.env.HOME}/.npm/bin/picgo`,
          '/usr/local/lib/node_modules/.bin/picgo'
        ]

        for (const picgoPath of commonPaths) {
          if (fs.pathExistsSync(picgoPath)) {
            console.log(`Found picgo at: ${picgoPath}`)
            return true
          }
        }
      }

      return false
    } catch (error) {
      console.error('Error checking command existence:', error)
      return false
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ...customElectronAPI
    })
    contextBridge.exposeInMainWorld('rgPath', rgPath)
    contextBridge.exposeInMainWorld('fileUtils', fileUtilsAPI)
    contextBridge.exposeInMainWorld('path', path)
    contextBridge.exposeInMainWorld('commandExists', commandAPI)
    contextBridge.exposeInMainWorld('i18nUtils', i18nUtils)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = { ...electronAPI, ...customElectronAPI }
  // @ts-ignore (define in dts)
  window.rgPath = rgPath
  // @ts-ignore (define in dts)
  window.fileUtils = fileUtilsAPI
  // @ts-ignore (define in dts)
  window.path = path
  // @ts-ignore (define in dts)
  window.commandExists = commandAPI
  // @ts-ignore (define in dts)
  window.i18nUtils = i18nUtils
}
