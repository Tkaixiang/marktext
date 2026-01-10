import { Menu, MenuItemConstructorOptions, BrowserWindow } from 'electron'
import { minimizeWindow, toggleAlwaysOnTop, toggleFullScreen } from '../actions/window'
import { zoomIn, zoomOut } from '../../windows/utils'
import { isOsx } from '../../config'
import { t } from '../../i18n'

export default function(keybindings: any): MenuItemConstructorOptions {
    const menu: MenuItemConstructorOptions = {
        label: t('menu.window.title'),
        role: 'window',
        submenu: [{
            label: t('menu.window.minimize'),
            accelerator: keybindings.getAccelerator('window.minimize'),
            click(menuItem, browserWindow) {
                minimizeWindow(browserWindow as BrowserWindow)
            }
        }, {
            id: 'alwaysOnTopMenuItem',
            label: t('menu.window.alwaysOnTop'),
            type: 'checkbox',
            accelerator: keybindings.getAccelerator('window.toggle-always-on-top'),
            click(menuItem, browserWindow) {
                toggleAlwaysOnTop(browserWindow as BrowserWindow)
            }
        }, {
            type: 'separator'
        }, {
            label: t('menu.window.zoomIn'),
            accelerator: keybindings.getAccelerator('window.zoomIn'),
            click(menuItem, browserWindow) {
                zoomIn(browserWindow as BrowserWindow)
            }
        }, {
            label: t('menu.window.zoomOut'),
            accelerator: keybindings.getAccelerator('window.zoomOut'),
            click(menuItem, browserWindow) {
                zoomOut(browserWindow as BrowserWindow)
            }
        }, {
            type: 'separator'
        }, {
            label: t('menu.window.fullScreen'),
            accelerator: keybindings.getAccelerator('window.toggle-full-screen'),
            click(item, browserWindow) {
                if (browserWindow) {
                    toggleFullScreen(browserWindow as BrowserWindow)
                }
            }
        }]
    }

    const submenu = menu.submenu as MenuItemConstructorOptions[]

    if (isOsx) {
        submenu.push({
            label: t('menu.window.bringAllToFront'),
            click() {
                Menu.sendActionToFirstResponder('arrangeInFront:')
            }
        })
    }
    return menu
}
