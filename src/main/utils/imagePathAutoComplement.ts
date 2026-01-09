import fs from 'fs'
import path from 'path'
import { filter } from 'fuzzaldrin'
import log from 'electron-log'
import { isDirectory, isFile } from 'common/filesystem'
import { IMAGE_EXTENSIONS } from 'common/filesystem/paths'
import { BLACK_LIST } from '../config'

// TODO(need::refactor): Refactor this file. Just return an array of directories and files without caching and watching?

interface FileInfo {
  file: string
  type: string
}

// TODO: rebuild cache @jocs
const IMAGE_PATH = new Map<string, FileInfo[]>()
export const watchers = new Map<string, fs.FSWatcher>()

const filesHandler = (files: string[], directory: string, key?: string) => {
  const IMAGE_REG = new RegExp('(' + IMAGE_EXTENSIONS.join('|') + ')$', 'i')
  const onlyDirAndImage = files
    .map(file => {
      const fullPath = path.join(directory, file)
      let type = ''
      if (isDirectory(fullPath)) {
        type = 'directory'
      } else if (isFile(fullPath) && IMAGE_REG.test(file)) {
        type = 'image'
      }
      return {
        file,
        type
      }
    })
    .filter(({
      file,
      type
    }) => {
      if (BLACK_LIST.includes(file)) return false
      return type === 'directory' || type === 'image'
    })

  IMAGE_PATH.set(directory, onlyDirAndImage)
  if (key !== undefined) {
    return filter(onlyDirAndImage, key, {
      key: 'file'
    })
  }
  return onlyDirAndImage
}

const rebuild = (directory: string) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      log.error('imagePathAutoComplement::rebuild:', err)
    } else {
      filesHandler(files, directory)
    }
  })
}

const watchDirectory = (directory: string) => {
  if (watchers.has(directory)) return // Do not duplicate watch the same directory
  const watcher = fs.watch(directory, (eventType, filename) => {
    if (eventType === 'rename') {
      rebuild(directory)
    }
  })
  watchers.set(directory, watcher)
}

export const searchFilesAndDir = (directory: string, key: string): Promise<FileInfo[]> => {
  let result: FileInfo[] = []
  if (IMAGE_PATH.has(directory)) {
    // @ts-ignore
    result = filter(IMAGE_PATH.get(directory), key, { key: 'file' })
    return Promise.resolve(result)
  } else {
    return new Promise((resolve, reject) => {
      fs.readdir(directory, (err, files) => {
        if (err) {
          reject(err)
        } else {
          // @ts-ignore
          result = filesHandler(files, directory, key)
          watchDirectory(directory)
          resolve(result)
        }
      })
    })
  }
}
