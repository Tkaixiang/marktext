import { MenuItemConstructorOptions, BrowserWindow } from 'electron'
import * as actions from '../actions/view'
import { t } from '../../i18n'

export default function (keybindings: any): MenuItemConstructorOptions {
  const viewMenu: MenuItemConstructorOptions = {
    label: t('menu.view.view'),
    submenu: [{
      label: t('menu.view.commandPalette'),
      accelerator: keybindings.getAccelerator('view.command-palette'),
      click (menuItem, focusedWindow) {
        actions.showCommandPalette(focusedWindow as BrowserWindow)
      }
    }, {
      type: 'separator'
    }, {
      id: 'sourceCodeModeMenuItem',
      label: t('menu.view.sourceCodeMode'),
      accelerator: keybindings.getAccelerator('view.source-code-mode'),
      type: 'checkbox',
      checked: false,
      click (item, focusedWindow) {
        actions.toggleSourceCodeMode(focusedWindow as BrowserWindow)
      }
    }, {
      id: 'typewriterModeMenuItem',
      label: t('menu.view.typewriterMode'),
      accelerator: keybindings.getAccelerator('view.typewriter-mode'),
      type: 'checkbox',
      checked: false,
      click (item, focusedWindow) {
        actions.toggleTypewriterMode(focusedWindow as BrowserWindow)
      }
    }, {
      id: 'focusModeMenuItem',
      label: t('menu.view.focusMode'),
      accelerator: keybindings.getAccelerator('view.focus-mode'),
      type: 'checkbox',
      checked: false,
      click (item, focusedWindow) {
        actions.toggleFocusMode(focusedWindow as BrowserWindow)
      }
    }, {
      type: 'separator'
    }, {
      label: t('menu.view.toggleSidebar'),
      id: 'sideBarMenuItem',
      accelerator: keybindings.getAccelerator('view.toggle-sidebar'),
      type: 'checkbox',
      checked: false,
      click (item, focusedWindow) {
        actions.toggleSidebar(focusedWindow as BrowserWindow)
      }
    }, {
      label: t('menu.view.toggleTabbar'),
      id: 'tabBarMenuItem',
      accelerator: keybindings.getAccelerator('view.toggle-tabbar'),
      type: 'checkbox',
      checked: false,
      click (item, focusedWindow) {
        actions.toggleTabBar(focusedWindow as BrowserWindow)
      }
    }, {
      label: t('menu.view.toggleTableOfContents'),
      id: 'tocMenuItem',
      accelerator: keybindings.getAccelerator('view.toggle-toc'),
      click (_, focusedWindow) {
        actions.showTableOfContents(focusedWindow as BrowserWindow)
      }
    }, {
      label: t('menu.view.reloadImages'),
      accelerator: keybindings.getAccelerator('view.reload-images'),
      click (item, focusedWindow) {
        actions.reloadImageCache(focusedWindow as BrowserWindow)
      }
    }]
  }

  const submenu = viewMenu.submenu as MenuItemConstructorOptions[]

  if (global.MARKTEXT_DEBUG) {
    submenu.push({
      type: 'separator'
    })
    submenu.push({
      label: t('menu.view.showDeveloperTools'),
      accelerator: keybindings.getAccelerator('view.toggle-dev-tools'),
      click (item, win) {
        actions.debugToggleDevTools(win as BrowserWindow)
      }
    })
    submenu.push({
      label: t('menu.view.reloadWindow'),
      accelerator: keybindings.getAccelerator('view.dev-reload'),
      click (item, focusedWindow) {
        actions.debugReloadWindow(focusedWindow as BrowserWindow)
      }
    })
  }

  return viewMenu
}
