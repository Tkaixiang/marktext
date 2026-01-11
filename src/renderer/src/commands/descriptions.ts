import { t } from '../i18n'

type CommandDescriptionMap = Record<string, string>

/**
 * Get command description mapping table
 * This function returns an object containing all command ID to i18n translation key mappings
 * Used to convert command IDs to user-readable description text
 * Note: No longer using Object.freeze to support dynamic language switching
 */
const getCommandDescriptions = (): CommandDescriptionMap => {
  return {
    // ============================================
    // # Application Level Commands
    // ============================================
    'mt.hide': t('commands.mt.hide'),
    'mt.hide-others': t('commands.mt.hideOthers'),

    // ============================================
    // # File Operations
    // ============================================
    // File creation and opening
    'file.new-window': t('commands.file.newWindow'),
    'file.new-tab': t('commands.file.newTab'),
    'file.open-file': t('commands.file.openFile'),
    'file.open-folder': t('commands.file.openFolder'),
    'file.quick-open': t('commands.file.quickOpen'),
    'file.import-file': t('commands.file.importFile'),

    // File saving and export
    'file.save': t('commands.file.save'),
    'file.save-as': t('commands.file.saveAs'),
    'file.export-file': t('commands.file.exportFile'),
    'file.export-file.pdf': t('commands.file.exportFilePdf'),

    // File management
    'file.move-file': t('commands.file.moveFile'),
    'file.rename-file': t('commands.file.renameFile'),
    'file.toggle-auto-save': t('commands.file.toggleAutoSave'),

    // File settings
    'file.change-encoding': t('commands.file.changeEncoding'),
    'file.line-ending': t('commands.file.changeLineEnding'),
    'file.trailing-newline': t('commands.file.trailingNewline'),
    'file.preferences': t('commands.file.preferences'),

    // File operations
    'file.print': t('commands.file.print'),
    'file.zoom': t('commands.file.zoom'),
    'file.check-update': t('commands.file.checkUpdate'),

    // File closing
    'file.close': t('commands.file.closeTab'),
    'file.close-tab': t('commands.file.closeTab'),
    'file.close-window': t('commands.file.closeWindow'),
    'file.quit': t('commands.file.quit'),

    // ============================================
    // # Edit Operations
    // ============================================
    // Undo/Redo
    'edit.undo': t('commands.edit.undo'),
    'edit.redo': t('commands.edit.redo'),

    // Clipboard operations
    'edit.cut': t('commands.edit.cut'),
    'edit.copy': t('commands.edit.copy'),
    'edit.paste': t('commands.edit.paste'),
    'edit.copy-as-markdown': t('commands.edit.copyAsMarkdown'),
    'edit.copy-as-html': t('commands.edit.copyAsHtml'),
    'edit.paste-as-plaintext': t('commands.edit.pasteAsPlaintext'),

    // Selection and duplication
    'edit.select-all': t('commands.edit.selectAll'),
    'edit.duplicate': t('commands.edit.duplicate'),

    // Paragraph operations
    'edit.create-paragraph': t('commands.edit.createParagraph'),
    'edit.delete-paragraph': t('commands.edit.deleteParagraph'),

    // Find and replace
    'edit.find': t('commands.edit.find'),
    'edit.find-next': t('commands.edit.findNext'),
    'edit.find-previous': t('commands.edit.findPrevious'),
    'edit.replace': t('commands.edit.replace'),
    'edit.find-in-folder': t('commands.edit.findInFolder'),

    // Other edit functions
    'edit.screenshot': t('commands.edit.screenshot'),

    // ============================================
    // # Paragraph Formatting
    // ============================================
    // Heading levels
    'paragraph.heading-1': t('commands.paragraph.heading1'),
    'paragraph.heading-2': t('commands.paragraph.heading2'),
    'paragraph.heading-3': t('commands.paragraph.heading3'),
    'paragraph.heading-4': t('commands.paragraph.heading4'),
    'paragraph.heading-5': t('commands.paragraph.heading5'),
    'paragraph.heading-6': t('commands.paragraph.heading6'),
    'paragraph.upgrade-heading': t('commands.paragraph.upgradeHeading'),
    'paragraph.degrade-heading': t('commands.paragraph.degradeHeading'),

    // Block elements
    'paragraph.table': t('commands.paragraph.table'),
    'paragraph.code-fence': t('commands.paragraph.codeFence'),
    'paragraph.quote-block': t('commands.paragraph.quoteBlock'),
    'paragraph.math-block': t('commands.paragraph.mathBlock'),
    'paragraph.html-block': t('commands.paragraph.htmlBlock'),

    // List types
    'paragraph.order-list': t('commands.paragraph.orderList'),
    'paragraph.bullet-list': t('commands.paragraph.bulletList'),
    'paragraph.task-list': t('commands.paragraph.taskList'),
    'paragraph.loose-list-item': t('commands.paragraph.looseListItem'),

    // Paragraph types
    'paragraph.paragraph': t('commands.paragraph.paragraph'),
    'paragraph.reset-paragraph': t('commands.paragraph.resetParagraph'),

    // Dividers and special elements
    'paragraph.horizontal-rule': t('commands.paragraph.horizontalRule'),
    'paragraph.horizontal-line': t('commands.paragraph.horizontalLine'),
    'paragraph.math-formula': t('commands.paragraph.mathFormula'),
    'paragraph.front-matter': t('commands.paragraph.frontMatter'),

    // ============================================
    // # Text Formatting
    // ============================================
    // Basic formatting
    'format.strong': t('commands.format.strong'),
    'format.emphasis': t('commands.format.emphasis'),
    'format.underline': t('commands.format.underline'),
    'format.strike': t('commands.format.strike'),

    // Advanced formatting
    'format.highlight': t('commands.format.highlight'),
    'format.superscript': t('commands.format.superscript'),
    'format.subscript': t('commands.format.subscript'),

    // Inline elements
    'format.inline-code': t('commands.format.inlineCode'),
    'format.inline-math': t('commands.format.inlineMath'),

    // Links and media
    'format.hyperlink': t('commands.format.hyperlink'),
    'format.image': t('commands.format.image'),

    // Format clearing
    'format.clear-format': t('commands.format.clearFormat'),

    // ============================================
    // # Window Management
    // ============================================
    // Window control
    'window.minimize': t('commands.window.minimize'),
    'window.close': t('commands.window.close'),
    'window.toggle-always-on-top': t('commands.window.toggleAlwaysOnTop'),
    'window.toggle-full-screen': t('commands.window.toggleFullScreen'),

    // Window zoom
    'window.zoomIn': t('commands.window.zoomIn'),
    'window.zoomOut': t('commands.window.zoomOut'),

    // Theme settings
    'window.change-theme': t('commands.window.changeTheme'),

    // ============================================
    // # View Controls
    // ============================================
    // Interface toggles
    'view.toggle-sidebar': t('commands.view.toggleSidebar'),
    'view.toggle-tabbar': t('commands.view.toggleTabbar'),
    'view.toggle-toc': t('commands.view.toggleToc'),

    // Edit modes
    'view.toggle-source-code-mode': t('commands.view.toggleSourceCodeMode'),
    'view.source-code-mode': t('commands.view.sourceCodeMode'),
    'view.toggle-typewriter-mode': t('commands.view.toggleTypewriterMode'),
    'view.typewriter-mode': t('commands.view.typewriterMode'),
    'view.toggle-focus-mode': t('commands.view.toggleFocusMode'),
    'view.focus-mode': t('commands.view.focusMode'),

    // View functions
    'view.command-palette': t('commands.view.commandPalette'),
    'view.actual-size': t('commands.view.actualSize'),
    'view.text-direction': t('commands.view.textDirection'),

    // Developer tools
    'view.dev-reload': t('commands.view.devReload'),
    'view.dev-toggle-developer-tools': t('commands.view.devToggleDeveloperTools'),
    'view.toggle-dev-tools': t('commands.view.toggleDevTools'),

    // Menu items (non-commands)
    'view.reload-images': t('commands.view.reloadImages'),

    // ============================================
    // # Tab Management
    // ============================================
    // Tab switching
    'tabs.cycleBackward': t('commands.tabs.cycleBackward'),
    'tabs.cycleForward': t('commands.tabs.cycleForward'),
    'tabs.switchToLeft': t('commands.tabs.switchToLeft'),
    'tabs.switchToRight': t('commands.tabs.switchToRight'),

    // Switch tabs by number
    'tabs.switchToFirst': t('commands.tabs.switchToFirst'),
    'tabs.switchToSecond': t('commands.tabs.switchToSecond'),
    'tabs.switchToThird': t('commands.tabs.switchToThird'),
    'tabs.switchToFourth': t('commands.tabs.switchToFourth'),
    'tabs.switchToFifth': t('commands.tabs.switchToFifth'),
    'tabs.switchToSixth': t('commands.tabs.switchToSixth'),
    'tabs.switchToSeventh': t('commands.tabs.switchToSeventh'),
    'tabs.switchToEighth': t('commands.tabs.switchToEighth'),
    'tabs.switchToNinth': t('commands.tabs.switchToNinth'),
    'tabs.switchToTenth': t('commands.tabs.switchToTenth'),

    // ============================================
    // # Documentation & Help
    // ============================================
    'docs.user-guide': t('commands.docs.userGuide'),
    'docs.markdown-syntax': t('commands.docs.markdownSyntax'),

    // ============================================
    // # Spell Checker
    // ============================================
    'spellchecker.switch-language': t('commands.spellchecker.switchLanguage')
  }
}

/**
 * Get the i18n description text for a command ID
 * @param id - Command ID, format like 'file.save', 'edit.copy' etc.
 * @returns The i18n command description text, or the original ID if not found (for debugging)
 */
const getCommandDescriptionById = (id: string): string => {
  // Get command descriptions on each call to support dynamic language switching
  const commandDescriptions = getCommandDescriptions()
  const description = commandDescriptions[id]

  // Return original ID for debugging if description not found
  return description || id
}

export default getCommandDescriptionById
