import { ENCODING_NAME_MAP, getEncodingName } from 'common/encoding'
import { delay } from '@/util'
import bus from '../bus'
import getCommandDescriptionById from './descriptions'
import { t } from '../i18n'
import type { EditorState, Subcommand } from './lineEnding'

class FileEncodingCommand {
  id: string
  description: string
  placeholder: string
  subcommands: Subcommand[]
  subcommandSelectedIndex: number
  private _editorState: EditorState

  constructor(editorState: EditorState) {
    this.id = 'file.change-encoding'
    this.description = getCommandDescriptionById('file.change-encoding')
    this.placeholder = t('commandPalette.placeholders.selectOption')

    this.subcommands = []
    this.subcommandSelectedIndex = -1

    // Reference to editor state.
    this._editorState = editorState
  }

  run = async (): Promise<void> => {
    this.subcommands = []
    this.subcommandSelectedIndex = -1

    // Load encoding from current tab to highlight it.
    const encodingObj = this._getCurrentEncoding()
    const { encoding, isBom } = encodingObj

    // NOTE: We support UTF-BOM encodings but don't allow to set them.
    if (isBom) {
      this.subcommandSelectedIndex = 0
      this.subcommands.push({
        id: `${encoding}-bom`,
        description: `${getEncodingName(encodingObj)} - current`
      })
    }

    let i = 0
    for (const [key, value] of Object.entries(ENCODING_NAME_MAP)) {
      const isTabEncoding = !isBom && key === encoding
      const item: Subcommand = {
        id: key,
        description: isTabEncoding ? `${value} - current` : value
      }
      if (isTabEncoding) {
        // Highlight current encoding and set it as first entry.
        this.subcommandSelectedIndex = i
        this.subcommands.unshift(item)
      } else {
        this.subcommands.push(item)
      }
      ++i
    }
  }

  execute = async (): Promise<void> => {
    // Timeout to hide the command palette and then show again to prevent issues.
    await delay(100)
    bus.emit('show-command-palette', this)
  }

  executeSubcommand = async (id: string): Promise<void> => {
    // NOTE: We support UTF-BOM encodings but don't allow to set them.
    if (!id.endsWith('-bom')) {
      bus.emit('mt::set-file-encoding', id)
    }
  }

  unload = (): void => {
    this.subcommands = []
  }

  private _getCurrentEncoding = (): { encoding: string; isBom?: boolean } => {
    const { _editorState } = this
    const { currentFile } = _editorState
    if (currentFile) {
      return currentFile.encoding
    }
    return { encoding: '' }
  }
}

export default FileEncodingCommand
