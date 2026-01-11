interface FsExtraPolyfill {
  ensureDirSync: (dirPath: string) => void
}

const fsExtraPolyfill: FsExtraPolyfill = {
  ensureDirSync: (_dirPath: string): void => {}
}

export default fsExtraPolyfill
