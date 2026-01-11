import log from 'electron-log/renderer'
import RendererPaths from './node/paths'

type ExceptionLogger = (s: unknown) => void

let exceptionLogger: ExceptionLogger = (s) => console.error(s)

const configureLogger = (): void => {
  log.transports.console.level = process.env.NODE_ENV === 'development' ? 'info' : false // mirror to window console
  exceptionLogger = log.error
}

interface ParsedUrlArgs {
  type: string | null
  debug: boolean
  userDataPath: string | null
  windowId: number
  initialState: {
    codeFontFamily: string | null
    codeFontSize: string | null
    hideScrollbar: boolean
    theme: string | null
    titleBarStyle: string | null
  }
}

const parseUrlArgs = (): ParsedUrlArgs => {
  const params = new URLSearchParams(window.location.search)
  const codeFontFamily = params.get('cff')
  const codeFontSize = params.get('cfs')
  const debug = params.get('debug') === '1'
  const hideScrollbar = params.get('hsb') === '1'
  const theme = params.get('theme')
  const titleBarStyle = params.get('tbs')
  const userDataPath = params.get('udp')
  const windowId = Number(params.get('wid'))
  const type = params.get('type')

  if (Number.isNaN(windowId)) {
    throw new Error('Error while parsing URL arguments: windowId!')
  }

  return {
    type,
    debug,
    userDataPath,
    windowId,
    initialState: {
      codeFontFamily,
      codeFontSize,
      hideScrollbar,
      theme,
      titleBarStyle
    }
  }
}

interface ErrorLike {
  message: string
  name: string
  stack?: string
}

const handleRendererError = (event: ErrorEvent | PromiseRejectionEvent): void => {
  const error = 'error' in event ? event.error : (event as PromiseRejectionEvent).reason
  if (error) {
    const { message, name, stack } = error as ErrorLike
    const copy = {
      message,
      name,
      stack
    }

    exceptionLogger(error)

    // Pass exception to main process exception handler to show a error dialog.
    window.electron.ipcRenderer.send('mt::handle-renderer-error', copy)
  } else {
    console.error(event)
  }
}

export interface MarktextGlobal {
  initialState: ParsedUrlArgs['initialState']
  env: {
    debug: boolean
    paths: RendererPaths
    windowId: number
    type: string | null
  }
  paths: RendererPaths
}

const bootstrapRenderer = (): void => {
  // Register renderer exception handler
  window.addEventListener('error', handleRendererError)
  window.addEventListener('unhandledrejection', handleRendererError)

  const { debug, initialState, userDataPath, windowId, type } = parseUrlArgs()
  const paths = new RendererPaths(userDataPath || '')
  const marktext: MarktextGlobal = {
    initialState,
    env: {
      debug,
      paths,
      windowId,
      type
    },
    paths
  }
  ;(global as any).marktext = marktext

  configureLogger()
}

export default bootstrapRenderer
