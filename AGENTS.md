## Project Overview

MarkText is a WYSIWYG markdown editor built with Electron, modernized from the original unmaintained repository. This fork migrates from Babel/Webpack to electron-vite, Vue 2 to Vue 3, Vuex to Pinia, and updates all libraries to their latest versions.

## Build System & Module Format

This project uses **electron-vite** with different module formats for different processes:
- **main** and **preload**: Compiled to CommonJS
- **renderer**: ES Modules only (ESM)

When working with dependencies:
- ESM-only modules in main/preload must be excluded from externalization (see `electron.vite.config.js`)
- Legacy CommonJS libraries in renderer may require special handling
- Native modules are compiled using MSVC on Windows and gcc/g++ on Linux (see `.npmrc`)

## Development Commands

```bash
# Install dependencies
npm install

# Development mode (hot reload for renderer only)
npm run dev

# Build for production (includes minifying locales)
npm run build:win    # Windows
npm run build:mac    # MacOS
npm run build:linux  # Linux

# Build without packaging (faster for testing)
npm run build:unpack

# Linting and formatting
npm run lint
npm run format

# Rebuild native modules after Electron version changes
npm run rebuild-native

# Minify locale files (auto-run in production builds)
npm run minify-locales
```

## Prerequisites

- **Node.js**: 22.21.1 (same as current Electron release, other versions may fail with native add-ons)
- **Python**: >= 3.12
- **Windows**: Build Tools for Visual Studio 2022 with MSVC Spectre-Mitigated Libs
- **Linux**: See `docs/dev/LINUX_DEV.md` for additional dependencies

## Architecture

### Three-Part Structure

1. **Muya** (`src/muya/`): The core editor backend
   - Pure JavaScript, BOM and DOM APIs only
   - NO Electron or Node.js APIs allowed
   - Block-based structure for realtime markdown preview
   - Parsing, rendering, and WYSIWYG editing
   - Note: Source-code mode uses CodeMirror, not part of Muya

2. **Main Process** (`src/main/`): Electron main process
   - Full OS access via Electron APIs
   - IO operations, native dialogs, window management
   - Entry point: `src/main/index.js` → `src/main/app/index.js`
   - Key directories:
     - `app/`: Application lifecycle and initialization
     - `windows/`: Window management
     - `menu/`: Application menus
     - `filesystem/`: File operations and watchers
     - `commands/`: Command handlers
     - `preferences/`: User settings management

3. **Renderer Process** (`src/renderer/`): Editor UI
   - Vue 3 components with Pinia state management
   - Entry point: `src/renderer/src/main.js`
   - One renderer process per window
   - Key directories:
     - `components/`: Vue UI components
     - `store/`: Pinia stores (state management)
     - `prefComponents/`: Preference/settings UI components
     - `services/`: Business logic services

### Common Code (`src/common/`)

Shared code requiring only Node.js APIs (no Electron). Can be used by main, preload, or renderer, but NOT by Muya.

## Path Aliases

Configured in `electron.vite.config.js`:
- `@` → `src/renderer/src`
- `common` → `src/common`
- `muya` → `src/muya`
- `main_renderer` → `src/main`

## IPC Communication

Main and renderer processes communicate via IPC with these conventions:
- Event names/channels MUST be prefixed with `mt::` for cross-process events
- Main process listeners: `ipcMain.on('mt::event-name', (event, ...args) => {})`
- Renderer listeners: `ipcRenderer.on('mt::event-name', (event, ...args) => {})`
- Internal main events (no prefix): `ipcMain.emit('event-name', ...args)` (no event parameter)

## State Management

The application uses Pinia stores (Vue 3's state management):
- `store/editor.js`: Main editor state, document management, tabs
- `store/preferences.js`: User preferences
- `store/project.js`: Project/file tree state
- `store/layout.js`: UI layout state
- `store/treeCtrl.js`: File tree control

## Hot Reload Behavior

- **Renderer process**: Hot reloaded automatically, but state loss can cause errors (do full reload if issues occur)
- **Main/Preload processes**: NOT automatically reloaded - must restart dev process (fast with Vite bundling)

## File Opening Flow

Example of the architecture in action:
1. User clicks `File -> Open File` → emits `app-open-file-by-id` event
2. Main process `App` instance finds editor window, calls `openTab`
3. Editor window loads file via `loadMarkdownFile`, adds to filesystem watcher
4. Sends result via `mt::open-new-tab` IPC event to renderer
5. Renderer `store/editor.js` handles event, creates document/tab state
6. Emits `file-changed` event
7. Both Muya and CodeMirror listen and update their views

## Development Notes

- Muya requires refactoring for better modularization and plugin support
- Source-code editor (CodeMirror) is not well-optimized and exists outside Muya's architecture
- The renderer is now fully ES Modules, which required migration work for CommonJS libraries
- Documentation exists at `docs/dev/ARCHITECTURE.md`, `docs/dev/IPC.md`, and other files in `docs/dev/`
