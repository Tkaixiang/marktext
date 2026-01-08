// Type-safe IPC event definitions
export type IPCEventMap = {
  // Main to Renderer events
  'mt::open-new-tab': [data: any]
  'mt::file-changed': [filepath: string]
  'mt::window-close': []

  // Renderer to Main events
  'app-open-file-by-id': [windowId: number, filepath: string]

  // Add more as you migrate
}

export type IPCEventName = keyof IPCEventMap
