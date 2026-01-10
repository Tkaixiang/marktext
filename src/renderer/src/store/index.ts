import { createPinia, defineStore } from 'pinia'

const pinia = createPinia()

interface MainState {
  platform: string
  appVersion: string
  windowActive: boolean
  init: boolean
}

// Main store for global states
export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    platform: window.electron.process.platform, // platform of system `darwin` | `win32` | `linux`
    appVersion: window.electron.process.env.MARKTEXT_VERSION_STRING, // MarkText version string
    windowActive: true, // whether current window is active or focused
    init: false // whether MarkText is initialized
  }),

  getters: {
    // Add any getters here if needed
  },

  actions: {
    SET_WIN_STATUS(status: boolean) {
      this.windowActive = status
    },

    SET_INITIALIZED() {
      this.init = true
    },

    LISTEN_WIN_STATUS() {
      window.electron.ipcRenderer.on('mt::window-active-status', (_, { status }: { status: boolean }) => {
        this.windowActive = status
      })
    }
  }
})

export default pinia
