import { defineStore } from 'pinia'
import notice from '../services/notification'

export const useAutoUpdatesStore = defineStore('autoUpdates', {
  state: () => ({}),
  actions: {
    LISTEN_FOR_UPDATE() {
      window.electron.ipcRenderer.on('mt::UPDATE_ERROR', (_, message) => {
        notice.notify({
          title: 'Update',
          type: 'error',
          time: 10000,
          message: message as string
        })
      })
      window.electron.ipcRenderer.on('mt::UPDATE_NOT_AVAILABLE', (_, message) => {
        notice.notify({
          title: 'Update not Available',
          type: 'primary',
          message: message as string
        })
      })
      window.electron.ipcRenderer.on('mt::UPDATE_DOWNLOADED', (_, message) => {
        notice.notify({
          title: 'Update Downloaded',
          type: 'info',
          message: message as string
        })
      })
      window.electron.ipcRenderer.on('mt::UPDATE_AVAILABLE', (_, message) => {
        notice
          .notify({
            title: 'Update Available',
            type: 'primary',
            message: message as string,
            showConfirm: true
          })
          .then(() => {
            const needUpdate = true
            window.electron.ipcRenderer.send('mt::NEED_UPDATE', { needUpdate })
          })
          .catch(() => {
            const needUpdate = false
            window.electron.ipcRenderer.send('mt::NEED_UPDATE', { needUpdate })
          })
      })
    }
  }
})
