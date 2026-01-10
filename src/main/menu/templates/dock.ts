import { app, Menu, MenuItemConstructorOptions, BrowserWindow } from 'electron'
import * as actions from '../actions/file'

const dockMenuTemplate: MenuItemConstructorOptions[] = [{
  label: 'Open...',
  click (menuItem, browserWindow) {
    if (browserWindow) {
      actions.openFile(browserWindow as BrowserWindow)
    } else {
      actions.newEditorWindow()
    }
  }
}, {
  label: 'Clear Recent',
  click () {
    app.clearRecentDocuments()
  }
}]

const dockMenu = Menu.buildFromTemplate(dockMenuTemplate)

export default dockMenu
