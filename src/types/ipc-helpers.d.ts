import type { IpcMain, IpcRenderer } from 'electron'
import type { IPCEventMap, IPCEventName } from './ipc-events'

// Type-safe IPC wrappers
export interface TypedIpcMain extends IpcMain {
  on<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcMainEvent, ...args: IPCEventMap[K]) => void
  ): this

  once<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcMainEvent, ...args: IPCEventMap[K]) => void
  ): this

  handle<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: IPCEventMap[K]) => Promise<any> | any
  ): void
}

export interface TypedIpcRenderer extends IpcRenderer {
  on<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcRendererEvent, ...args: IPCEventMap[K]) => void
  ): this

  once<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcRendererEvent, ...args: IPCEventMap[K]) => void
  ): this

  send<K extends IPCEventName>(channel: K, ...args: IPCEventMap[K]): void

  invoke<K extends IPCEventName>(channel: K, ...args: IPCEventMap[K]): Promise<any>
}
