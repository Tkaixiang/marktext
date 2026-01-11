import { delay } from '@/util'
import bus from '../bus'
import getCommandDescriptionById from './descriptions'
import { t } from '../i18n'
import type { EditorState, Subcommand } from './lineEnding'

const descriptions = ['Trim all trailing newlines', 'Ensure single newline', 'Disabled']

class TrailingNewlineCommand {
  id: string
  description: string
  placeholder: string
  subcommands: Subcommand[]
  subcommandSelectedIndex: number
  private _editorState: EditorState

  constructor(editorState: EditorState) {
    this.id = 'file.trailing-newline'
    this.description = getCommandDescriptionById('file.trailing-newline')
    this.placeholder = t('commandPalette.placeholders.selectOption')
    this.subcommands = []
    this.subcommandSelectedIndex = -1

    // Reference to editor state.
    this._editorState = editorState
  }

  run = async (): Promise<void> => {
    const trimTrailingNewline = this._editorState.currentFile?.trimTrailingNewline
    let index = trimTrailingNewline ?? 2
    if (index !== 0 && index !== 1) {
      index = 2
    }

    this.subcommands = [
      {
        id: 'file.trailing-newline-trim',
        description: descriptions[0],
        value: 0
      },
      {
        id: 'file.trailing-newline-single',
        description: descriptions[1],
        value: 1
      },
      {
        id: 'file.trailing-newline-disabled',
        description: descriptions[2],
        value: 3
      }
    ]
    this.subcommands[index].description = `${descriptions[index]} - current`
    this.subcommandSelectedIndex = index
  }

  execute = async (): Promise<void> => {
    // Timeout to hide the command palette and then show again to prevent issues.
    await delay(100)
    bus.emit('show-command-palette', this)
  }

  executeSubcommand = async (_id: string, value: number): Promise<void> => {
    bus.emit('mt::set-final-newline', value)
  }

  unload = (): void => {}
}

export default TrailingNewlineCommand
