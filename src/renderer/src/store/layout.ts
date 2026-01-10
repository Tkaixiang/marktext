import { defineStore } from 'pinia'
import bus from '../bus'

const width = localStorage.getItem('side-bar-width')
const sideBarWidth = typeof +width === 'number' ? Math.max(+width, 220) : 280

interface LayoutState {
  rightColumn: string
  showSideBar: boolean
  showTabBar: boolean
  sideBarWidth: number
}

interface LayoutOptions {
  rightColumn?: string
  showSideBar?: boolean
  showTabBar?: boolean
  sideBarWidth?: number
  [key: string]: any
}

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    rightColumn: 'files',
    showSideBar: false,
    showTabBar: false,
    sideBarWidth
  }),
  actions: {
    SET_LAYOUT(layout: LayoutOptions) {
      if (layout.showSideBar !== undefined) {
        const { windowId } = global.marktext.env
        window.electron.ipcRenderer.send('mt::update-sidebar-menu', windowId, !!layout.showSideBar)
      }
      Object.assign(this, layout)
    },
    TOGGLE_LAYOUT_ENTRY(entryName: keyof LayoutState) {
      // @ts-ignore
      this[entryName] = !this[entryName]
    },
    SET_SIDE_BAR_WIDTH(width: number | string) {
      const w = Math.max(Number(width), 220)
      // TODO: Add side bar to session (GH#732).
      localStorage.setItem('side-bar-width', String(w))
      this.sideBarWidth = w
    },
    LISTEN_FOR_LAYOUT() {
      window.electron.ipcRenderer.on('mt::set-view-layout', (e, layout: any) => {
        if (layout.rightColumn) {
          this.SET_LAYOUT({
            ...layout,
            rightColumn: layout.rightColumn === this.rightColumn ? '' : layout.rightColumn,
            showSideBar: true
          })
        } else {
          this.SET_LAYOUT(layout)
        }
        this.DISPATCH_LAYOUT_MENU_ITEMS()
      })

      window.electron.ipcRenderer.on('mt::toggle-view-layout-entry', (event, entryName: any) => {
        this.TOGGLE_LAYOUT_ENTRY(entryName)
        this.DISPATCH_LAYOUT_MENU_ITEMS()
      })

      bus.on('view:toggle-layout-entry', (entryName: any) => {
        this.TOGGLE_LAYOUT_ENTRY(entryName)
        const { windowId } = global.marktext.env
        window.electron.ipcRenderer.send('mt::view-layout-changed', windowId, {
          [entryName]: (this as any)[entryName]
        })
      })
    },

    DISPATCH_LAYOUT_MENU_ITEMS() {
      const { windowId } = global.marktext.env
      const { showTabBar, showSideBar } = this
      window.electron.ipcRenderer.send('mt::view-layout-changed', windowId, {
        showTabBar,
        showSideBar
      })
    },

    CHANGE_SIDE_BAR_WIDTH(width: number) {
      this.SET_SIDE_BAR_WIDTH(width)
    }
  }
})
