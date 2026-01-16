// Shim for fs - uses window.fileUtils exposed via preload
// This provides minimal fs compatibility for @electron/remote

const fs = {
  existsSync: (filePath) => {
    // Use the preload-exposed fileUtils
    if (window.fileUtils?.isFile) {
      return window.fileUtils.isFile(filePath) || window.fileUtils.isDirectory(filePath)
    }
    // Fallback - assume path exists to avoid breaking @electron/remote initialization
    return true
  },
  readFileSync: (filePath, options) => {
    // Synchronous file reading not available in renderer
    // Return empty for @electron/remote compatibility
    console.warn('fs.readFileSync called in renderer - not supported:', filePath)
    return ''
  },
  writeFileSync: (filePath, data) => {
    console.warn('fs.writeFileSync called in renderer - not supported:', filePath)
  },
  readdirSync: (dirPath) => {
    console.warn('fs.readdirSync called in renderer - not supported:', dirPath)
    return []
  },
  statSync: (filePath) => {
    console.warn('fs.statSync called in renderer - not supported:', filePath)
    return { isDirectory: () => false, isFile: () => true }
  },
  mkdirSync: () => {},
  unlinkSync: () => {},
  rmdirSync: () => {},
  // Promises API
  promises: {
    readFile: async (filePath, options) => {
      console.warn('fs.promises.readFile called in renderer - not supported:', filePath)
      return ''
    },
    writeFile: async (filePath, data) => {
      console.warn('fs.promises.writeFile called in renderer - not supported:', filePath)
    },
    readdir: async (dirPath) => {
      console.warn('fs.promises.readdir called in renderer - not supported:', dirPath)
      return []
    },
    stat: async (filePath) => {
      console.warn('fs.promises.stat called in renderer - not supported:', filePath)
      return { isDirectory: () => false, isFile: () => true }
    },
    mkdir: async () => {},
    unlink: async () => {},
    rmdir: async () => {},
    access: async () => {}
  }
}

export default fs
export const { existsSync, readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, unlinkSync, rmdirSync, promises } = fs
