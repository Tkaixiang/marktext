import path from 'path'
import { shell, MenuItemConstructorOptions, BrowserWindow } from 'electron'
import { isFile } from 'common/filesystem'
import * as actions from '../actions/help'
import { checkUpdates } from '../actions/marktext'
import { t } from '../../i18n'

/// Check whether the package is updatable at runtime.
const isUpdatable = (): boolean => {
  // TODO: If not updatable, allow to check whether there is a new version available.

  const resFile = isFile(path.join(process.resourcesPath, 'app-update.yml'))
  if (!resFile) {
    // No update resource file available.
    return false
  } else if (process.env.APPIMAGE) {
    // We are running as AppImage.
    return true
  } else if (process.platform === 'win32' && isFile(path.join(process.resourcesPath, 'md.ico'))) {
    // Windows is a little but tricky. The update resource file is always available and
    // there is no way to check the target type at runtime (electron-builder#4119).
    // As workaround we check whether "md.ico" exists that is only included in the setup.
    return true
  }

  // Otherwise assume that we cannot perform an auto update (standalone binary, archives,
  // packed for package manager).
  return false
}

export default function (): MenuItemConstructorOptions {
  const helpMenu: MenuItemConstructorOptions = {
    label: t('menu.help.help'),
    role: 'help',
    submenu: [
      {
        label: t('menu.help.markdownReference'),
        click() {
          shell.openExternal(
            'https://github.com/Tkaixiang/marktext/blob/trunk/docs/MARKDOWN_SYNTAX.md'
          )
        }
      },
      {
        label: t('menu.help.changelog'),
        click() {
          shell.openExternal('https://github.com/Tkaixiang/marktext/releases')
        }
      },
      {
        type: 'separator'
      },
      {
        label: t('menu.help.askQuestion'),
        click() {
          shell.openExternal('https://github.com/Tkaixiang/marktext/discussions')
        }
      },
      {
        label: t('menu.help.reportBug'),
        click() {
          shell.openExternal('https://github.com/Tkaixiang/marktext/issues')
        }
      },
      {
        label: t('menu.help.viewSource'),
        click() {
          shell.openExternal('https://github.com/Tkaixiang/marktext')
        }
      },
      {
        type: 'separator'
      },
      {
        label: t('menu.help.license'),
        click() {
          shell.openExternal('https://github.com/Tkaixiang/marktext/blob/trunk/LICENSE')
        }
      }
    ]
  }

  const submenu = helpMenu.submenu as MenuItemConstructorOptions[]

  if (isUpdatable()) {
    submenu.push(
      {
        type: 'separator'
      },
      {
        label: t('menu.help.checkUpdates'),
        click(menuItem, browserWindow) {
          checkUpdates(browserWindow as BrowserWindow)
        }
      }
    )
  }

  if (process.platform !== 'darwin') {
    submenu.push(
      {
        type: 'separator'
      },
      {
        label: t('menu.help.about'),
        click(menuItem, browserWindow) {
          actions.showAboutDialog(browserWindow as BrowserWindow)
        }
      }
    )
  }
  return helpMenu
}
