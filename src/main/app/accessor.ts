import WindowManager from '../app/windowManager'
import Preference from '../preferences'
import DataCenter from '../dataCenter'
import Keybindings from '../keyboard/shortcutHandler'
import AppMenu from '../menu'
import { loadMenuCommands } from '../menu/actions'
import { CommandManager, loadDefaultCommands } from '../commands'
import { AppEnvironment } from './env'

class Accessor {
  public env: AppEnvironment
  public paths: any
  public preferences: Preference
  public dataCenter: DataCenter
  public commandManager: any
  public keybindings: Keybindings
  public menu: AppMenu
  public windowManager: WindowManager

  /**
   * @param {AppEnvironment} appEnvironment The application environment instance.
   */
  constructor (appEnvironment: AppEnvironment) {
    const userDataPath = appEnvironment.paths.userDataPath

    this.env = appEnvironment
    this.paths = appEnvironment.paths // export paths to make it better accessible

    // @ts-ignore
    this.preferences = new Preference(this.paths)
    // @ts-ignore
    this.dataCenter = new DataCenter(this.paths)

    this.commandManager = CommandManager
    this._loadCommands()

    // @ts-ignore
    this.keybindings = new Keybindings(this.commandManager, appEnvironment)
    // @ts-ignore
    this.menu = new AppMenu(this.preferences, this.keybindings, userDataPath)
    this.windowManager = new WindowManager(this.menu, this.preferences)
  }

  _loadCommands () {
    const { commandManager } = this
    loadDefaultCommands(commandManager)
    loadMenuCommands(commandManager)

    if (this.env.isDevMode) {
      commandManager.__verifyDefaultCommands()
    }
  }
}

export default Accessor
