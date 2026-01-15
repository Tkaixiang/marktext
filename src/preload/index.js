import { contextBridge, shell, clipboard, webUtils } from 'electron'
import fs from 'fs-extra'
import { statSync, constants as fsConstants } from 'fs'
import { exec, execFile } from 'child_process'
import { tmpdir } from 'os'
import crypto from 'crypto'
import { Buffer } from 'buffer'
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
  isFile: (path) => isFile(path),
  isDirectory: (path) => isDirectory(path),
  emptyDir: (path) => fs.emptyDir(path),
  copy: (src, dest, options) => fs.copy(src, dest, options),
  ensureDir: (path) => fs.ensureDir(path),
  outputFile: (path, data) => fs.outputFile(path, data),
  move: (src, dest, options) => fs.move(src, dest, options),
  stat: (path) => fs.stat(path),
  writeFile: (path, data, encoding) => fs.writeFile(path, data, encoding),
  readFile: (path, encoding) => fs.readFile(path, encoding),
  ensureDirSync: (path) => ensureDirSync(path),
  pathExistsSync: (path) => fs.pathExistsSync(path),
  unlink: (path) => fs.unlink(path),
  statSync: (path) => statSync(path),
  constants: fsConstants,
  isChildOfDirectory: (dir, child) => isChildOfDirectory(dir, child),
  hasMarkdownExtension: (filename) => hasMarkdownExtension(filename),
  MARKDOWN_INCLUSIONS,
  isSamePathSync: (pathA, pathB) => isSamePathSync(pathA, pathB),
  isImageFile: (filepath) => isImageFile(filepath)
}

const commandAPI = {
  exists: (command) => {
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

// Crypto utilities API - for hashing operations
const cryptoAPI = {
  createHash: (algorithm) => crypto.createHash(algorithm)
}

// Child process API - for executing external commands (PicGo, custom scripts)
// NOTE: This is potentially dangerous but required for image upload functionality
// These should only be used with validated/sanitized input
const childProcessAPI = {
  exec: (command, options, callback) => exec(command, options, callback),
  execFile: (file, args, options, callback) => execFile(file, args, options, callback)
}

// OS utilities API
const osAPI = {
  tmpdir: () => tmpdir()
}

// Process information API - selectively expose safe process info
const processAPI = {
  platform: process.platform,
  env: {
    HOME: process.env.HOME,
    PATH: process.env.PATH,
    USERPROFILE: process.env.USERPROFILE // For Windows
  }
}

// Buffer API - needed for binary data operations
const bufferAPI = {
  from: (data, encoding) => Buffer.from(data, encoding)
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
    contextBridge.exposeInMainWorld('crypto', cryptoAPI)
    contextBridge.exposeInMainWorld('childProcess', childProcessAPI)
    contextBridge.exposeInMainWorld('os', osAPI)
    contextBridge.exposeInMainWorld('process', processAPI)
    contextBridge.exposeInMainWorld('Buffer', bufferAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // Fallback for when context isolation is disabled (insecure)
  window.electron = { ...electronAPI, ...customElectronAPI }
  window.rgPath = rgPath
  window.fileUtils = fileUtilsAPI
  window.path = path
  window.commandExists = commandAPI
  window.i18nUtils = i18nUtils
  window.crypto = cryptoAPI
  window.childProcess = childProcessAPI
  window.os = osAPI
  window.process = processAPI
  window.Buffer = bufferAPI
}
