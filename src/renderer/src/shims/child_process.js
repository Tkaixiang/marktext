// Shim for child_process - uses window.childProcess exposed via preload

const childProcess = {
  exec: (command, options, callback) => {
    return window.childProcess?.exec(command, options, callback)
  },
  execFile: (file, args, options, callback) => {
    return window.childProcess?.execFile(file, args, options, callback)
  },
  spawn: (command, args, options) => {
    return window.childProcess?.spawn(command, args, options)
  },
  // Stub for fork - not supported in renderer
  fork: () => {
    console.warn('child_process.fork is not supported in renderer')
    return null
  },
  // Stub for execSync - not supported in renderer
  execSync: () => {
    console.warn('child_process.execSync is not supported in renderer')
    return ''
  },
  // Stub for spawnSync - not supported in renderer
  spawnSync: () => {
    console.warn('child_process.spawnSync is not supported in renderer')
    return { status: 1, stdout: '', stderr: '' }
  }
}

export default childProcess
export const { exec, execFile, spawn, fork, execSync, spawnSync } = childProcess
