// Shim for fs/promises - provides async fs operations via preload
const fsPromises = {
  readFile: async (filePath, options) => {
    console.warn('fs/promises.readFile called in renderer - not supported:', filePath)
    return ''
  },
  writeFile: async (filePath, data) => {
    console.warn('fs/promises.writeFile called in renderer - not supported:', filePath)
  },
  readdir: async (dirPath) => {
    console.warn('fs/promises.readdir called in renderer - not supported:', dirPath)
    return []
  },
  stat: async (filePath) => {
    console.warn('fs/promises.stat called in renderer - not supported:', filePath)
    return { isDirectory: () => false, isFile: () => true }
  },
  mkdir: async () => {},
  unlink: async () => {},
  rmdir: async () => {},
  access: async () => {},
  copyFile: async () => {},
  rename: async () => {}
}

export default fsPromises
export const { readFile, writeFile, readdir, stat, mkdir, unlink, rmdir, access, copyFile, rename } = fsPromises
