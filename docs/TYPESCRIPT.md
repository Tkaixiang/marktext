# TypeScript Migration Plan

This document outlines a comprehensive, step-by-step plan for converting MarkText from JavaScript to TypeScript.

## Overview

**Current State:**
- ~289 JavaScript files
- ~47 Vue components (SFC with script blocks)
- ~52,500 lines of code
- Three distinct processes: Main (CommonJS), Preload (CommonJS), Renderer (ESM)
- Muya core with strict API boundaries (no Node.js/Electron APIs)

**Target State:**
- Full TypeScript support across all processes
- Type-safe IPC communication
- Type definitions for Muya plugin API
- Gradual migration allowing incremental progress
- Maintained build performance

## Phase 0: Preparation and Setup

### 0.1 Install TypeScript Dependencies

```bash
npm install --save-dev typescript @types/node @types/electron
```

### 0.2 Install Additional Type Definitions

```bash
npm install --save-dev \
  @types/fs-extra \
  @types/dompurify \
  @types/katex \
  @types/underscore \
  @types/turndown \
  @types/prismjs \
  @types/codemirror \
  @types/dom-autoscroller \
  @vue/tsconfig \
  vue-tsc
```

### 0.3 Create TypeScript Configuration Files

Create three separate `tsconfig.json` files for the three different compilation targets:

**`tsconfig.json` (Root - for IDE support):**
```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/renderer/src/*"],
      "common/*": ["src/common/*"],
      "muya/*": ["src/muya/*"],
      "main_renderer/*": ["src/main/*"]
    }
  },
  "include": [
    "src/**/*",
    "src/**/*.vue"
  ],
  "references": [
    { "path": "./tsconfig.main.json" },
    { "path": "./tsconfig.preload.json" },
    { "path": "./tsconfig.renderer.json" }
  ]
}
```

**`tsconfig.main.json` (Main Process - CommonJS):**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "types": ["node", "electron"]
  },
  "include": [
    "src/main/**/*",
    "src/common/**/*"
  ],
  "exclude": [
    "src/muya/**/*",
    "src/renderer/**/*",
    "src/preload/**/*"
  ]
}
```

**`tsconfig.preload.json` (Preload Process - CommonJS):**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ES2022", "DOM"],
    "types": ["node", "electron"]
  },
  "include": [
    "src/preload/**/*",
    "src/common/**/*"
  ]
}
```

**`tsconfig.renderer.json` (Renderer Process - ESM):**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["node"],
    "jsx": "preserve"
  },
  "include": [
    "src/renderer/**/*",
    "src/muya/**/*",
    "src/common/**/*"
  ]
}
```

### 0.4 Update electron-vite Configuration

Rename `electron.vite.config.js` to `electron.vite.config.ts` and update:

```typescript
import { resolve, dirname } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import renderer from 'vite-plugin-electron-renderer'
import svgLoader from 'vite-svg-loader'
import postcssPresetEnv from 'postcss-preset-env'
import packageJson from './package.json'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['electron-store']
      },
      rollupOptions: {
        external: []
      }
    },
    define: {
      MARKTEXT_VERSION: JSON.stringify(packageJson.version),
      MARKTEXT_VERSION_STRING: JSON.stringify(`v${packageJson.version}`)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src'),
        common: resolve(__dirname, 'src/common'),
        muya: resolve(__dirname, 'src/muya'),
        main_renderer: resolve(__dirname, 'src/main')
      },
      extensions: ['.ts', '.mjs', '.js', '.json']
    }
  },
  preload: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src'),
        common: resolve(__dirname, 'src/common'),
        muya: resolve(__dirname, 'src/muya'),
        main_renderer: resolve(__dirname, 'src/main')
      },
      extensions: ['.ts', '.mjs', '.js', '.json']
    }
  },
  renderer: {
    assetsInclude: ['**/*.md'],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src'),
        common: resolve(__dirname, 'src/common'),
        muya: resolve(__dirname, 'src/muya'),
        main_renderer: resolve(__dirname, 'src/main')
      },
      extensions: ['.ts', '.mjs', '.js', '.json', '.vue']
    },
    plugins: [
      vue(),
      svgLoader(),
      renderer({
        nodeIntegration: true
      })
    ],
    css: {
      postcss: {
        plugins: [
          postcssPresetEnv({
            stage: 0,
            features: { 'nesting-rules': true }
          })
        ]
      }
    }
  }
})
```

### 0.5 Update package.json Scripts

Add TypeScript-related scripts:

```json
{
  "scripts": {
    "typecheck": "vue-tsc --noEmit && tsc --project tsconfig.main.json --noEmit && tsc --project tsconfig.preload.json --noEmit",
    "typecheck:main": "tsc --project tsconfig.main.json --noEmit",
    "typecheck:preload": "tsc --project tsconfig.preload.json --noEmit",
    "typecheck:renderer": "vue-tsc --noEmit"
  }
}
```

### 0.6 Create Global Type Declaration Files

**`src/types/global.d.ts`:**
```typescript
// Global type declarations for MarkText

declare const MARKTEXT_VERSION: string
declare const MARKTEXT_VERSION_STRING: string

// Window augmentation for preload APIs
interface Window {
  electron: {
    ipcRenderer: Electron.IpcRenderer
    shell: Electron.Shell
    clipboard: Electron.Clipboard
    webUtils: Electron.WebUtils
  }
  rgPath: string
  fileUtils: {
    isFile: (path: string) => Promise<boolean>
    isDirectory: (path: string) => Promise<boolean>
    emptyDir: (path: string) => Promise<void>
    copy: (src: string, dest: string) => Promise<void>
    ensureDir: (path: string) => Promise<void>
    outputFile: (path: string, data: any) => Promise<void>
    move: (src: string, dest: string) => Promise<void>
    stat: (path: string) => Promise<any>
    writeFile: (path: string, data: any) => Promise<void>
    readFile: (path: string) => Promise<Buffer>
    ensureDirSync: (path: string) => void
    pathExistsSync: (path: string) => boolean
    isChildOfDirectory: (dir: string, child: string) => boolean
    hasMarkdownExtension: (filename: string) => boolean
    MARKDOWN_INCLUSIONS: string[]
    isSamePathSync: (pathA: string, pathB: string) => boolean
    isImageFile: (filepath: string) => boolean
  }
  path: typeof import('path')
  commandExists: {
    exists: (command: string) => boolean
  }
  i18nUtils: {
    loadTranslations: (locale: string) => Promise<any>
  }
}

// Global marktext namespace
declare global {
  namespace NodeJS {
    interface Global {
      marktext: {
        env: {
          type: string
          [key: string]: any
        }
      }
    }
  }

  var marktext: {
    env: {
      type: string
      [key: string]: any
    }
  }
}

export {}
```

**`src/types/ipc-events.d.ts`:**
```typescript
// Type-safe IPC event definitions
export type IPCEventMap = {
  // Main to Renderer events
  'mt::open-new-tab': [data: any]
  'mt::file-changed': [filepath: string]
  'mt::window-close': []

  // Renderer to Main events
  'app-open-file-by-id': [windowId: number, filepath: string]

  // Add more as you migrate
}

export type IPCEventName = keyof IPCEventMap
```

### 0.7 Update ESLint Configuration

Update `eslint.config.js` to support TypeScript:

```javascript
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue: vuePlugin
    },
    rules: {
      ...vuePlugin.configs['vue3-recommended'].rules
    }
  }
]
```

## Phase 1: Create Type Definitions and Interfaces

### 1.1 Define Core Data Structures

**`src/types/editor.d.ts`:**
```typescript
export interface MarkdownDocument {
  id: string
  filename: string
  pathname: string
  markdown: string
  cursor: CursorPosition | null
  history: any
  encoding: string
  lineEnding: string
  adjustLineEnding: boolean
  isMixedLineEndings: boolean
  textDirection: 'ltr' | 'rtl' | 'auto'
}

export interface CursorPosition {
  anchor: { line: number; ch: number }
  head: { line: number; ch: number }
}

export interface TabState {
  id: string
  label: string
  pathname: string
  markdown: string
  isActive: boolean
  isSaved: boolean
}

export interface EditorState {
  currentFile: MarkdownDocument | null
  tabs: TabState[]
  searchKey: string
  replaceKey: string
}
```

**`src/types/muya.d.ts`:**
```typescript
export interface MuyaOptions {
  markdown?: string
  preferLooseListItem?: boolean
  autoPairBracket?: boolean
  autoPairMarkdownSyntax?: boolean
  autoPairQuote?: boolean
  bulletListMarker?: string
  orderListDelimiter?: string
  tabSize?: number
  fontSize?: number
  lineHeight?: number
  codeBlockLineNumbers?: boolean
  trimUnnecessaryCodeBlockEmptyLines?: boolean
  hideQuickInsertHint?: boolean
  imageAction?: (image: File) => Promise<string>
  t?: (key: string) => string
}

export interface MuyaBlock {
  key: string
  type: string
  text: string
  children?: MuyaBlock[]
  parent?: MuyaBlock
}

export interface MuyaPlugin {
  pluginName: string
  new (muya: Muya, options?: any): any
}

export class Muya {
  static plugins: Array<{ plugin: MuyaPlugin; options: any }>
  static use(plugin: MuyaPlugin, options?: any): void

  constructor(container: HTMLElement | string, options?: MuyaOptions)

  markdown: string
  container: HTMLElement
  contentState: any
  eventCenter: any

  getMarkdown(): string
  setMarkdown(markdown: string, cursor?: any): void
  focus(): void
  blur(): void
  destroy(): void
}
```

**`src/types/preferences.d.ts`:**
```typescript
export interface Preferences {
  autoSave: boolean
  autoSaveDelay: number
  titleBarStyle: 'native' | 'custom'
  theme: string
  fontSize: number
  lineHeight: number
  editorFontFamily: string
  codeFontFamily: string
  autoGuessEncoding: boolean
  defaultEncoding: string
  defaultDirectoryToOpen: string
  language: string
  spellChecker: {
    enabled: boolean
    language: string
  }
  imageInsertAction: 'upload' | 'folder' | 'path'
}
```

### 1.2 Define IPC Type Helpers

**`src/types/ipc-helpers.d.ts`:**
```typescript
import type { IpcMain, IpcRenderer } from 'electron'
import type { IPCEventMap, IPCEventName } from './ipc-events'

// Type-safe IPC wrappers
export interface TypedIpcMain extends IpcMain {
  on<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcMainEvent, ...args: IPCEventMap[K]) => void
  ): this

  once<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcMainEvent, ...args: IPCEventMap[K]) => void
  ): this

  handle<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcMainInvokeEvent, ...args: IPCEventMap[K]) => Promise<any> | any
  ): void
}

export interface TypedIpcRenderer extends IpcRenderer {
  on<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcRendererEvent, ...args: IPCEventMap[K]) => void
  ): this

  once<K extends IPCEventName>(
    channel: K,
    listener: (event: Electron.IpcRendererEvent, ...args: IPCEventMap[K]) => void
  ): this

  send<K extends IPCEventName>(channel: K, ...args: IPCEventMap[K]): void

  invoke<K extends IPCEventName>(channel: K, ...args: IPCEventMap[K]): Promise<any>
}
```

## Phase 2: Migration Strategy

### 2.1 Migration Order

Migrate in this order to minimize breaking changes:

1. **Common utilities** (`src/common/`) - Used by all processes
2. **Type definitions for stores** - Pinia store types
3. **Preload script** (`src/preload/`) - Small, self-contained
4. **Main process** (`src/main/`) - Bottom-up approach
5. **Muya core** (`src/muya/`) - Critical path, careful migration
6. **Renderer/Vue components** (`src/renderer/`) - Last, benefits from all previous types

### 2.2 Incremental Migration Approach

Use the **"allowJs: true"** strategy:

1. Add `"allowJs": true` to all tsconfig files during migration
2. Migrate files one at a time
3. Keep `.js` and `.ts` files coexisting
4. Once all files are migrated, remove `"allowJs": true`

Update tsconfig files:
```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false
  }
}
```

### 2.3 File Naming Convention

- Rename `.js` → `.ts`
- Rename `.vue` with `<script>` → `<script lang="ts">`
- Keep `.jsx` as `.jsx` unless converting to `.tsx`

## Phase 3: Detailed Migration Steps

### 3.1 Common Module Migration

Start with utility files that have few dependencies:

**Priority order:**
1. `src/common/encoding.js` → `encoding.ts`
2. `src/common/envPaths.js` → `envPaths.ts`
3. `src/common/i18n.js` → `i18n.ts`
4. `src/common/filesystem/*.js` → `*.ts`
5. `src/common/keybinding/*.js` → `*.ts`
6. `src/common/commands/*.js` → `*.ts`

**Example migration (`src/common/encoding.ts`):**

Before:
```javascript
export const detectEncoding = (buffer) => {
  // implementation
}
```

After:
```typescript
export const detectEncoding = (buffer: Buffer): string => {
  // implementation
}
```

### 3.2 Preload Script Migration

Migrate `src/preload/index.js` → `index.ts`:

**Key changes:**
- Type the contextBridge APIs
- Use the Window interface augmentation
- Type all filesystem utilities

```typescript
import { contextBridge, shell, clipboard, webUtils } from 'electron'
import type { Shell, Clipboard, WebUtils } from 'electron'
// ... rest of types
```

### 3.3 Main Process Migration

**Bottom-up approach:**

1. **Utilities first** (`src/main/utils/*.js`)
2. **Data structures** (`src/main/dataCenter/*.js`)
3. **Filesystem handlers** (`src/main/filesystem/*.js`)
4. **Window management** (`src/main/windows/*.js`)
5. **Menu system** (`src/main/menu/*.js`)
6. **App controller** (`src/main/app/*.js`)
7. **Entry point** (`src/main/index.js`)

**Example: Window Manager (`src/main/app/windowManager.ts`):**

```typescript
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'

export interface EditorWindow extends BrowserWindow {
  id: number
  // Add custom properties
}

export class WindowManager {
  private windows: Map<number, EditorWindow>

  constructor() {
    this.windows = new Map()
  }

  createWindow(options?: BrowserWindowConstructorOptions): EditorWindow {
    // Implementation with proper typing
  }
}
```

### 3.4 Pinia Store Migration

Migrate Pinia stores to use TypeScript's type inference:

**Example: `src/renderer/src/store/editor.ts`:**

```typescript
import { defineStore } from 'pinia'
import type { MarkdownDocument, TabState, EditorState } from '@/types/editor'

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    currentFile: null,
    tabs: [],
    searchKey: '',
    replaceKey: ''
  }),

  getters: {
    activeTab: (state): TabState | undefined => {
      return state.tabs.find(tab => tab.isActive)
    },

    hasUnsavedChanges: (state): boolean => {
      return state.tabs.some(tab => !tab.isSaved)
    }
  },

  actions: {
    setCurrentFile(file: MarkdownDocument | null): void {
      this.currentFile = file
    },

    addTab(tab: TabState): void {
      this.tabs.push(tab)
    },

    closeTab(tabId: string): void {
      const index = this.tabs.findIndex(t => t.id === tabId)
      if (index !== -1) {
        this.tabs.splice(index, 1)
      }
    }
  }
})

// Export type for use in components
export type EditorStore = ReturnType<typeof useEditorStore>
```

### 3.5 Vue Component Migration

Migrate Vue components to use `<script setup lang="ts">`:

**Example: Component with Pinia:**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEditorStore } from '@/store/editor'
import type { TabState } from '@/types/editor'

const editorStore = useEditorStore()

const activeTab = computed<TabState | undefined>(() => editorStore.activeTab)
const tabs = computed<TabState[]>(() => editorStore.tabs)

const searchQuery = ref<string>('')

const handleTabClick = (tabId: string): void => {
  // Implementation
}

const closeTab = (tabId: string): void => {
  editorStore.closeTab(tabId)
}
</script>

<template>
  <div class="tabs">
    <div
      v-for="tab in tabs"
      :key="tab.id"
      :class="{ active: tab.isActive }"
      @click="handleTabClick(tab.id)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>
```

### 3.6 Muya Core Migration

**Special considerations for Muya:**
- No Node.js or Electron types
- Pure DOM/BOM types only
- Plugin system needs careful typing

**Create Muya-specific tsconfig:**

`src/muya/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": [],
    "noImplicitAny": false
  },
  "include": ["./**/*"],
  "exclude": ["../../src/main/**/*", "../../src/preload/**/*"]
}
```

**Migration order for Muya:**
1. `lib/config/` - Configuration and constants
2. `lib/utils/` - Utility functions
3. `lib/parser/` - Markdown parsers
4. `lib/contentState/` - Core state management
5. `lib/eventHandler/` - Event handlers
6. `lib/ui/` - UI components
7. `lib/index.js` → `index.ts` - Main entry point

### 3.7 Complex Type Scenarios

**Handling Vue component refs:**
```typescript
import { ref } from 'vue'
import type { Ref } from 'vue'

const editorRef: Ref<HTMLDivElement | null> = ref(null)
```

**Handling Electron events:**
```typescript
import { ipcMain } from 'electron'
import type { IpcMainEvent } from 'electron'

ipcMain.on('mt::some-event', (event: IpcMainEvent, data: unknown) => {
  // Type guard for data
  if (isValidData(data)) {
    // Now data is typed
  }
})
```

**Handling dynamic imports:**
```typescript
const loadPlugin = async (name: string): Promise<MuyaPlugin> => {
  const module = await import(`./plugins/${name}`)
  return module.default as MuyaPlugin
}
```

## Phase 4: Testing and Validation

### 4.1 Type Checking

After each file migration:

```bash
npm run typecheck
```

After each module migration:

```bash
npm run typecheck:main    # Check main process
npm run typecheck:preload  # Check preload
npm run typecheck:renderer # Check renderer
```

### 4.2 Build Validation

Ensure the build still works:

```bash
npm run build
npm run build:unpack  # Test without packaging
```

### 4.3 Runtime Testing

Test in development mode:

```bash
npm run dev
```

**Critical test areas:**
- File opening/saving
- Tab management
- Preferences changes
- Markdown rendering (Muya)
- IPC communication
- Menu actions

### 4.4 Create Migration Checklist

Track progress in a file like `TYPESCRIPT_MIGRATION_STATUS.md`:

```markdown
## Migration Status

### Common (src/common/)
- [x] encoding.ts
- [x] envPaths.ts
- [ ] i18n.ts
- [ ] filesystem/

### Main Process (src/main/)
- [ ] utils/
- [ ] dataCenter/
...

### Tests Passing
- [x] Build succeeds
- [x] App launches
- [ ] File operations work
- [ ] Preferences work
...
```

## Phase 5: Strictness and Quality Improvements

### 5.1 Enable Strict Mode Gradually

Start with loose settings, then tighten:

**Stage 1 - Current:**
```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false
  }
}
```

**Stage 2 - After basic migration:**
```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,
    "strictNullChecks": false
  }
}
```

**Stage 3 - Final:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 5.2 Remove "any" Types

Search and replace `any` with proper types:

```bash
# Find all "any" usage
grep -r ": any" src/
```

### 5.3 Add JSDoc Comments

For public APIs, add JSDoc with types:

```typescript
/**
 * Opens a markdown file and adds it to the editor
 * @param filepath - Absolute path to the markdown file
 * @param windowId - Optional window ID to open the file in
 * @returns Promise resolving to the document ID
 */
export async function openMarkdownFile(
  filepath: string,
  windowId?: number
): Promise<string> {
  // Implementation
}
```

## Phase 6: Common Pitfalls and Solutions

### 6.1 Module Format Issues

**Problem:** CommonJS vs ESM conflicts

**Solution:**
```typescript
// For main/preload (CommonJS), use require for some modules
const fsExtra = require('fs-extra')

// For renderer (ESM), use import
import fsExtra from 'fs-extra'
```

### 6.2 Vue Component Props

**Problem:** Typing component props

**Solution:**
```typescript
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  onSave?: (data: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'close'): void
}>()
</script>
```

### 6.3 Pinia Store Type Access

**Problem:** Accessing store types in components

**Solution:**
```typescript
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/store/editor'

const editorStore = useEditorStore()
const { currentFile, tabs } = storeToRefs(editorStore)
// Now currentFile and tabs are properly typed refs
```

### 6.4 IPC Type Safety

**Problem:** Untyped IPC communication

**Solution:** Use the typed wrappers from Phase 1.2:
```typescript
import type { TypedIpcMain } from '@/types/ipc-helpers'

const ipcMain = require('electron').ipcMain as TypedIpcMain

// Now type-checked
ipcMain.on('mt::open-new-tab', (event, data) => {
  // data is properly typed
})
```

### 6.5 Native Module Types

**Problem:** Native modules without type definitions

**Solution:**
```typescript
// Create manual type declaration
declare module 'native-keymap' {
  export function getCurrentKeyboardLayout(): any
  // Add other exports
}
```

## Phase 7: Post-Migration Tasks

### 7.1 Update Documentation

- Update README with TypeScript requirements
- Document new type-checking commands
- Update CLAUDE.md with TypeScript conventions

### 7.2 Update CI/CD

Add type checking to CI pipeline:

```yaml
- name: Type Check
  run: npm run typecheck
```

### 7.3 Configure IDE

Add `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 7.4 Team Guidelines

Create `TYPESCRIPT_GUIDELINES.md`:
- Naming conventions
- When to use `any` vs `unknown`
- How to handle third-party types
- IPC communication patterns

## Estimated Timeline

Based on ~289 JS files and ~47 Vue components:

- **Phase 0 (Setup):** 1-2 days
- **Phase 1 (Type Definitions):** 2-3 days
- **Phase 2 (Strategy):** Planning, ongoing
- **Phase 3.1 (Common):** 3-5 days (~30 files)
- **Phase 3.2 (Preload):** 1 day (2 files)
- **Phase 3.3 (Main):** 10-15 days (~120 files)
- **Phase 3.4 (Stores):** 2-3 days (~13 files)
- **Phase 3.5 (Vue):** 5-7 days (~47 files)
- **Phase 3.6 (Muya):** 7-10 days (~80 files, critical)
- **Phase 4 (Testing):** Ongoing, 3-5 days final validation
- **Phase 5 (Quality):** 3-5 days
- **Phase 6-7 (Cleanup):** 2-3 days

**Total: 6-8 weeks** for full migration with testing

## Success Criteria

The migration is complete when:

- ✅ All `.js` files converted to `.ts`
- ✅ All Vue components use `<script lang="ts">`
- ✅ `npm run typecheck` passes with no errors
- ✅ `strict: true` enabled in all tsconfig files
- ✅ Application builds without errors
- ✅ All runtime tests pass
- ✅ No `any` types except where explicitly documented
- ✅ IPC communication is type-safe
- ✅ Documentation updated

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Pinia TypeScript Support](https://pinia.vuejs.org/core-concepts/#typescript)
- [Electron TypeScript Guide](https://www.electronjs.org/docs/latest/tutorial/typescript)
- [electron-vite TypeScript](https://electron-vite.org/guide/typescript)

## Current Migration Status

### Phase 0: Preparation and Setup
- [x] 0.1 Install TypeScript Dependencies
- [x] 0.2 Install Additional Type Definitions
- [x] 0.3 Create TypeScript Configuration Files
- [x] 0.4 Update electron-vite Configuration
- [x] 0.5 Update package.json Scripts
- [x] 0.6 Create Global Type Declaration Files
- [x] 0.7 Update ESLint Configuration

### Phase 1: Create Type Definitions and Interfaces
- [x] 1.1 Define Core Data Structures
- [x] 1.2 Define IPC Type Helpers

### Phase 3: Detailed Migration Steps

#### 3.1 Common Module Migration
- [x] encoding.ts
- [x] envPaths.ts
- [x] i18n.ts
- [x] filesystem/*.ts
- [x] keybinding/*.ts
- [x] commands/*.ts

#### 3.2 Preload Script Migration
- [x] src/preload/index.ts

#### 3.3 Main Process Migration
- [x] utils/*.ts
- [x] dataCenter/*.ts
- [x] filesystem/*.ts
- [x] windows/*.ts
- [x] menu/*.ts
- [x] app/*.ts
- [x] index.ts
- [x] config.js -> config.ts
- [x] exceptionHandler.js -> exceptionHandler.ts
- [x] globalSetting.js -> globalSetting.ts
- [x] i18n.js -> i18n.ts
- [ ] cli/*.ts
- [x] commands/*.ts
- [x] preferences/*.ts
- [x] spellchecker/*.ts
- [x] contextMenu/*.ts
- [x] keyboard/*.ts
