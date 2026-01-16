// Shim for process - uses window.nodeProcess and window.electron.process exposed via preload
const electronProcess = window.electron?.process || {}
const nodeProcess = window.nodeProcess || {}

const process = {
  platform: electronProcess.platform || nodeProcess.platform || 'win32',
  env: {
    NODE_ENV: import.meta.env.MODE || 'development',
    ...nodeProcess.env,
    ...electronProcess.env
  },
  versions: electronProcess.versions || {},
  type: 'renderer',
  resourcesPath: electronProcess.resourcesPath || '',
  cwd: () => electronProcess.cwd?.() || '/',
  argv: electronProcess.argv || []
}

export default process
