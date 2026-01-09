import fs from 'fs'
import path from 'path'
import EventEmitter from 'events'
import { BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron'
import keytar from 'keytar'
import schema from './schema.json'
import Store from 'electron-store'
import log from 'electron-log'
import { ensureDirSync } from 'common/filesystem'
import { IMAGE_EXTENSIONS } from 'common/filesystem/paths'

const DATA_CENTER_NAME = 'dataCenter'

interface Paths {
  dataCenterPath: string
  userDataPath: string
}

class DataCenter extends EventEmitter {
  public dataCenterPath: string
  public userDataPath: string
  public serviceName: string
  public encryptKeys: string[]
  public hasDataCenterFile: boolean
  public store: any // ElectronStore is not typed correctly in v11?

  constructor(paths: Paths) {
    super()

    const { dataCenterPath, userDataPath } = paths
    this.dataCenterPath = dataCenterPath
    this.userDataPath = userDataPath
    this.serviceName = 'marktext'
    this.encryptKeys = ['githubToken']
    this.hasDataCenterFile = fs.existsSync(
      path.join(this.dataCenterPath, `./${DATA_CENTER_NAME}.json`)
    )
    this.store = new Store({
      schema,
      name: DATA_CENTER_NAME
    })

    this.init()
  }

  init() {
    const defaultData = {
      imageFolderPath: path.join(this.userDataPath, 'images'),
      screenshotFolderPath: path.join(this.userDataPath, 'screenshot'),
      webImages: [],
      cloudImages: [],
      currentUploader: 'none',
      imageBed: {
        github: {
          owner: '',
          repo: '',
          branch: ''
        }
      }
    }

    if (!this.hasDataCenterFile) {
      this.store.set(defaultData)
      ensureDirSync(this.store.get('screenshotFolderPath') as string)
    }
    this._listenForIpcMain()
  }

  async getAll() {
    const { serviceName, encryptKeys } = this
    const data = this.store.store
    try {
      const encryptData = await Promise.all(
        encryptKeys.map((key) => {
          return keytar.getPassword(serviceName, key)
        })
      )
      const encryptObj = encryptKeys.reduce((acc, k, i) => {
        return {
          ...acc,
          [k]: encryptData[i]
        }
      }, {})

      return Object.assign(data, encryptObj)
    } catch (err) {
      log.error('Failed to decrypt secure keys:', err)
      return data
    }
  }

  addImage(key: string, url: string) {
    const items = this.store.get(key) as any[]
    const alreadyHas = items.some((item) => item.url === url)
    let item
    if (alreadyHas) {
      item = items.find((item) => item.url === url)
      item.timeStamp = +new Date()
    } else {
      item = {
        url,
        timeStamp: +new Date()
      }
      items.push(item)
    }

    ipcMain.emit('broadcast-web-image-added', { type: key, item })
    return this.store.set(key, items)
  }

  removeImage(type: string, url: string) {
    const items = this.store.get(type) as any[]
    // @ts-ignore
    const index = items.indexOf(url)
    const item = items[index]
    if (index === -1) return
    items.splice(index, 1)
    ipcMain.emit('broadcast-web-image-removed', { type, item })
    return this.store.set(type, items)
  }

  /**
   *
   * @param {string} key
   * return a promise
   */
  getItem(key: string) {
    const { encryptKeys, serviceName } = this
    if (encryptKeys.includes(key)) {
      return keytar.getPassword(serviceName, key)
    } else {
      const value = this.store.get(key)
      return Promise.resolve(value)
    }
  }

  async setItem(key: string, value: any) {
    const { encryptKeys, serviceName } = this
    if (key === 'screenshotFolderPath') {
      ensureDirSync(value)
    }
    ipcMain.emit('broadcast-user-data-changed', { [key]: value })
    if (encryptKeys.includes(key)) {
      try {
        return await keytar.setPassword(serviceName, key, value)
      } catch (err) {
        log.error('Keytar error:', err)
      }
    } else {
      return this.store.set(key, value)
    }
  }

  /**
   * Change multiple setting entries.
   *
   * @param {Object.<string, *>} settings A settings object or subset object with key/value entries.
   */
  setItems(settings: any) {
    if (!settings) {
      log.error('Cannot change settings without entires: object is undefined or null.')
      return
    }

    Object.keys(settings).forEach((key) => {
      this.setItem(key, settings[key])
    })
  }

  _listenForIpcMain() {
    // local main events
    ipcMain.on('set-image-folder-path', (newPath: any) => {
      this.setItem('imageFolderPath', newPath)
    })

    // events from renderer process
    ipcMain.on('mt::ask-for-user-data', async (e: IpcMainEvent) => {
      const win = BrowserWindow.fromWebContents(e.sender)
      const userData = await this.getAll()
      if (win) {
        win.webContents.send('mt::user-preference', userData)
      }
    })

    ipcMain.on(
      'mt::ask-for-modify-image-folder-path',
      async (e: IpcMainEvent, imagePath: string) => {
        if (!imagePath) {
          const win = BrowserWindow.fromWebContents(e.sender)
          if (!win) return
          const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory', 'createDirectory']
          })
          // @ts-ignore
          if (result.filePaths && result.filePaths[0]) {
            // @ts-ignore
            imagePath = result.filePaths[0]
          }
        }
        if (imagePath) {
          this.setItem('imageFolderPath', imagePath)
        }
      }
    )

    ipcMain.on('mt::set-user-data', (e: IpcMainEvent, userData: any) => {
      this.setItems(userData)
    })

    // TODO: Replace sync. call.
    ipcMain.on('mt::ask-for-image-path', async (e: IpcMainEvent) => {
      const win = BrowserWindow.fromWebContents(e.sender)
      if (!win) return
      const result = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [
          {
            name: 'Images',
            extensions: IMAGE_EXTENSIONS as string[]
          }
        ]
      })

      // @ts-ignore
      if (result.filePaths && result.filePaths[0]) {
        // @ts-ignore
        e.returnValue = result.filePaths[0]
      } else {
        e.returnValue = ''
      }
    })
  }
}

export default DataCenter
