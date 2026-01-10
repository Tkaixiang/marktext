import { defineStore } from 'pinia'
import log from 'electron-log'
import bus from '../bus'
import staticCommands, { RootCommand, getCommandsWithDescriptions } from '../commands'

interface CommandCenterState {
  rootCommand: RootCommand
}

export const useCommandCenterStore = defineStore('commandCenter', {
  state: (): CommandCenterState => ({
    rootCommand: new RootCommand(staticCommands)
  }),
  actions: {
    REGISTER_COMMAND(command: any) {
      this.rootCommand.subcommands.push(command)
    },
    SORT_COMMANDS() {
      this.rootCommand.subcommands.sort((a: any, b: any) =>
        a.description.localeCompare(b.description)
      )
    },
    async LISTEN_COMMAND_CENTER_BUS() {
      // Wait for initial language setup before initializing commands
      let isInitialized = false

      const initializeCommands = async () => {
        if (!isInitialized) {
          this.rootCommand.subcommands = await getCommandsWithDescriptions()
          this.SORT_COMMANDS()
          isInitialized = true
        }
      }

      // Listen for language changes and initialize/update command descriptions
      bus.on('language-changed', async () => {
        // Update all command descriptions when language changes
        this.rootCommand.subcommands = await getCommandsWithDescriptions()
        this.SORT_COMMANDS()
        isInitialized = true
      })

      // Delay initial setup to allow language initialization
      setTimeout(async () => {
        await initializeCommands()
      }, 100)

      // Init stuff
      bus.on('cmd::sort-commands', () => {
        this.SORT_COMMANDS()
      })
      window.electron.ipcRenderer.on('mt::keybindings-response', (e, keybindingMap: any) => {
        const { subcommands } = this.rootCommand
        for (const entry of subcommands) {
          const value = keybindingMap[entry.id]
          if (value) {
            entry.shortcut = normalizeAccelerator(value)
          }
        }
      })

      // Register commands that are created at runtime.
      bus.on('cmd::register-command', (command: any) => {
        this.REGISTER_COMMAND(command)
      })

      // Allow other compontents to execute commands with predefined values.
      bus.on('cmd::execute', (commandId: any) => {
        executeCommand(this, commandId)
      })
      window.electron.ipcRenderer.on('mt::execute-command-by-id', (e, commandId: string) => {
        executeCommand(this, commandId)
      })
    }
  }
})

const executeCommand = (store: any, commandId: string) => {
  const { subcommands } = store.rootCommand
  const command = subcommands.find((c: any) => c.id === commandId)
  if (!command) {
    const errorMsg = `Cannot execute command "${commandId}" because it's missing.`
    log.error(errorMsg)
    throw new Error(errorMsg)
  }
  command.execute()
}

const normalizeAccelerator = (acc: string) => {
  try {
    return acc
      .replace(/cmdorctrl|cmd/i, 'Cmd')
      .replace(/ctrl/i, 'Ctrl')
      .split('+')
  } catch (_) {
    return [acc]
  }
}
