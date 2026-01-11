import EnvPaths from 'common/envPaths'

// "vscode-ripgrep" is unpacked out of asar because of the binary.
const rgDiskPath = window.rgPath.replace(/\bapp\.asar\b/, 'app.asar.unpacked')

class RendererPaths extends EnvPaths {
  private _ripgrepBinaryPath: string

  /**
   * Configure and sets all application paths.
   *
   * @param userDataPath The user data path.
   */
  constructor(userDataPath: string) {
    if (!userDataPath) {
      throw new Error('No user data path is given.')
    }

    // Initialize environment paths
    super(userDataPath)

    // Allow to use a local ripgrep binary (e.g. an optimized version).
    if (process.env.MARKTEXT_RIPGREP_PATH) {
      // NOTE: Binary must be a compatible version, otherwise the searcher may fail.
      this._ripgrepBinaryPath = process.env.MARKTEXT_RIPGREP_PATH
    } else {
      this._ripgrepBinaryPath = rgDiskPath
    }
  }

  // Returns the path to ripgrep on disk.
  get ripgrepBinaryPath(): string {
    return this._ripgrepBinaryPath
  }
}

export default RendererPaths
