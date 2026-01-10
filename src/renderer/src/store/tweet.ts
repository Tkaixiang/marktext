import { defineStore } from 'pinia'
import bus from '../bus'

export const useTweetStore = defineStore('tweet', {
  state: () => ({}),
  actions: {
    LISTEN_FOR_TWEET() {
      window.electron.ipcRenderer.on('mt::tweet', (e, type) => {
        if (type === 'twitter') {
          bus.emit('tweetDialog')
        }
      })
    }
  }
})
