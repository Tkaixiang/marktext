import { app, MenuItemConstructorOptions, BrowserWindow } from 'electron'
import * as actions from '../actions/file'
import { userSetting } from '../actions/marktext'
import { isOsx } from '../../config'
import { t } from '../../i18n'

export default function (keybindings: any, userPreference: any, recentlyUsedFiles: string[]): MenuItemConstructorOptions {
  const { autoSave } = userPreference.getAll()
  const fileMenu: MenuItemConstructorOptions = {
    label: t('menu.file.file'),
    submenu: [
      {
        label: t('menu.file.newTab'),
        accelerator: keybindings.getAccelerator('file.new-tab'),
        click(menuItem, browserWindow) {
          actions.newBlankTab(browserWindow as BrowserWindow)
        }
      },
      {
        label: t('menu.file.newWindow'),
        accelerator: keybindings.getAccelerator('file.new-window'),
        click(menuItem, browserWindow) {
          actions.newEditorWindow()
        }
      },
      {
        type: 'separator'
      },
      {
        label: t('menu.file.openFile'),
        accelerator: keybindings.getAccelerator('file.open-file'),
        click(menuItem, browserWindow) {
          actions.openFile(browserWindow as BrowserWindow)
        }
      },
      {
        label: t('menu.file.openFolder'),
        accelerator: keybindings.getAccelerator('file.open-folder'),
        click(menuItem, browserWindow) {
          actions.openFolder(browserWindow as BrowserWindow)
        }
      }
    ]
  }

  const submenu = fileMenu.submenu as MenuItemConstructorOptions[]

  if (!isOsx) {
    const recentlyUsedMenu: MenuItemConstructorOptions = {
      label: t('menu.file.openRecent'),
      submenu: []
    }

    const recentSubmenu = recentlyUsedMenu.submenu as MenuItemConstructorOptions[]

    for (const item of recentlyUsedFiles) {
      recentSubmenu.push({
        label: item,
        click(menuItem, browserWindow) {
          actions.openFileOrFolder(browserWindow as BrowserWindow, menuItem.label!)
        }
      })
    }

    recentSubmenu.push(
      {
        type: 'separator',
        visible: recentlyUsedFiles.length > 0
      },
      {
        label: t('menu.file.clearRecentlyUsed'),
        enabled: recentlyUsedFiles.length > 0,
        click(menuItem, browserWindow) {
          actions.clearRecentlyUsed()
        }
      }
    )
    submenu.push(recentlyUsedMenu)
  } else {
    submenu.push({
      role: 'recentDocuments',
      submenu: [
        {
          role: 'clearRecentDocuments'
        }
      ]
    })
  }

  submenu.push(
    {
      type: 'separator'
    },
    {
      label: t('menu.file.save'),
      accelerator: keybindings.getAccelerator('file.save'),
      click(menuItem, browserWindow) {
        actions.save(browserWindow as BrowserWindow)
      }
    },
    {
      label: t('menu.file.saveAs'),
      accelerator: keybindings.getAccelerator('file.save-as'),
      click(menuItem, browserWindow) {
        actions.saveAs(browserWindow as BrowserWindow)
      }
    },
    {
      label: t('menu.file.autoSave'),
      type: 'checkbox',
      checked: autoSave,
      id: 'autoSaveMenuItem',
      click(menuItem, browserWindow) {
        actions.autoSave(menuItem, browserWindow as BrowserWindow)
      }
    },
    {
      type: 'separator'
    },
    {
      label: t('menu.file.moveTo'),
      accelerator: keybindings.getAccelerator('file.move-file'),
      click(menuItem, browserWindow) {
        actions.moveTo(browserWindow as BrowserWindow)
      }
    },
    {
      label: t('menu.file.rename'),
      accelerator: keybindings.getAccelerator('file.rename-file'),
      click(menuItem, browserWindow) {
        actions.rename(browserWindow as BrowserWindow)
      }
    },
    {
      type: 'separator'
    },
    {
      label: t('menu.file.import'),
      click(menuItem, browserWindow) {
        actions.importFile(browserWindow as BrowserWindow)
      }
    },
    {
      label: t('menu.file.export'),
      submenu: [
        {
          label: t('menu.file.exportHtml'),
          click(menuItem, browserWindow) {
            actions.exportFile(browserWindow as BrowserWindow, 'styledHtml')
          }
        },
        {
          label: t('menu.file.exportPdf'),
          accelerator: keybindings.getAccelerator('file.export-file.pdf'),
          click(menuItem, browserWindow) {
            actions.exportFile(browserWindow as BrowserWindow, 'pdf')
          }
        }
      ]
    },
    {
      label: t('menu.file.print'),
      accelerator: keybindings.getAccelerator('file.print'),
      click(menuItem, browserWindow) {
        actions.printDocument(browserWindow as BrowserWindow)
      }
    },
    {
      type: 'separator',
      visible: !isOsx
    },
    {
      label: t('menu.file.preferences'),
      accelerator: keybindings.getAccelerator('file.preferences'),
      visible: !isOsx,
      click() {
        userSetting()
      }
    },
    {
      type: 'separator'
    },
    {
      label: t('menu.file.closeTab'),
      accelerator: keybindings.getAccelerator('file.close-tab'),
      click(menuItem, browserWindow) {
        actions.closeTab(browserWindow as BrowserWindow)
      }
    },
    {
      label: t('menu.file.closeWindow'),
      accelerator: keybindings.getAccelerator('file.close-window'),
      click(menuItem, browserWindow) {
        actions.closeWindow(browserWindow as BrowserWindow)
      }
    },
    {
      type: 'separator',
      visible: !isOsx
    },
    {
      label: t('menu.file.quit'),
      accelerator: keybindings.getAccelerator('file.quit'),
      visible: !isOsx,
      click: app.quit
    }
  )
  return fileMenu
}
