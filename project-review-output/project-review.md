=== Repository Statistics ===

Total files: 853
Total lines of code: 54818

=== Project Structure ===
.
./.git
./.github
./.github/workflows
./.vscode
./build
./build/icons
./build/icons/128x128
./build/icons/16x16
./build/icons/24x24
./build/icons/256x256
./build/icons/32x32
./build/icons/48x48
./build/icons/512x512
./build/icons/64x64
./build/linux
./build/linux/img
./build/mac
./build/windows
./docs
./docs/assets
./docs/dev
./docs/dev/assets
./docs/dev/code
./docs/i18n
./docs/sponsor
./docs/themeImages
./scripts
./src
./src/common
./src/common/commands
./src/common/filesystem
./src/common/keybinding
./src/main
./src/main/app
./src/main/cli
./src/main/commands
./src/main/contextMenu
./src/main/dataCenter
./src/main/filesystem
./src/main/keyboard
./src/main/menu
./src/main/preferences
./src/main/spellchecker
./src/main/utils
./src/main/windows
./src/muya
./src/muya/lib
./src/muya/themes
./src/preload
./src/renderer
./src/renderer/src
./static
./static/locales
./test
./test/unit

=== Source Code Organization ===

## Main Process (src/main/):
src/main/app/accessor.js
src/main/app/env.js
src/main/app/index.js
src/main/app/paths.js
src/main/app/windowManager.js
src/main/cli/index.js
src/main/cli/parser.js
src/main/commands/file.js
src/main/commands/index.js
src/main/commands/tab.js
src/main/config.js
src/main/contextMenu/editor/index.js
src/main/contextMenu/editor/menuItems.js
src/main/contextMenu/editor/spellcheck.js
src/main/dataCenter/index.js
src/main/exceptionHandler.js
src/main/filesystem/encoding.js
src/main/filesystem/index.js
src/main/filesystem/markdown.js
src/main/filesystem/watcher.js
src/main/globalSetting.js
src/main/i18n.js
src/main/index.js
src/main/keyboard/index.js
src/main/keyboard/keybindingsDarwin.js
src/main/keyboard/keybindingsLinux.js
src/main/keyboard/keybindingsWindows.js
src/main/keyboard/shortcutHandler.js
src/main/menu/actions/edit.js
src/main/menu/actions/file.js
src/main/menu/actions/format.js
src/main/menu/actions/help.js
src/main/menu/actions/index.js
src/main/menu/actions/marktext.js
src/main/menu/actions/paragraph.js
src/main/menu/actions/theme.js
src/main/menu/actions/view.js
src/main/menu/actions/window.js
src/main/menu/index.js
src/main/menu/templates/dock.js
src/main/menu/templates/edit.js
src/main/menu/templates/file.js
src/main/menu/templates/format.js
src/main/menu/templates/help.js
src/main/menu/templates/index.js
src/main/menu/templates/marktext.js
src/main/menu/templates/paragraph.js
src/main/menu/templates/prefEdit.js
src/main/menu/templates/theme.js
src/main/menu/templates/view.js
src/main/menu/templates/window.js
src/main/preferences/index.js
src/main/spellchecker/index.js
src/main/utils/createGitHubIssue.js
src/main/utils/imagePathAutoComplement.js
src/main/utils/index.js
src/main/utils/pandoc.js
src/main/windows/base.js
src/main/windows/editor.js
src/main/windows/setting.js
src/main/windows/utils.js

## Preload Scripts (src/preload/):
src/preload/index.js

## Renderer Process (src/renderer/):
src/renderer/src/Main.vue
src/renderer/src/bootstrap.js
src/renderer/src/config.js
src/renderer/src/main.js

## Configuration Files:
electron-builder.yml
electron.vite.config.js
electron.vite.config.js
eslint.config.js
eslint.config.js
jsconfig.json
package-lock.json
package.json


=== Dependencies Analysis ===

## Production Dependencies:
    "@electron-toolkit/preload": "^3.0.2",
    "@electron-toolkit/utils": "^4.0.0",
    "@electron/remote": "^2.1.3",
    "@element-plus/icons-vue": "^2.3.2",
    "@hfelix/electron-localshortcut": "^4.0.1",
    "@marktext/file-icons": "^1.0.6",
    "@octokit/rest": "^22.0.1",
    "@popperjs/core": "^2.11.8",
    "@vscode/ripgrep": "^1.17.0",
    "arg": "^5.0.2",
    "axios": "^1.13.2",
    "ced": "^2.0.0",
    "chokidar": "^5.0.0",
    "codemirror": "^5.65.19",
    "command-exists": "^1.2.9",
    "deep-equal": "^2.2.3",
    "dom-autoscroller": "^2.3.4",
    "dompurify": "^3.3.1",
    "dragula": "^3.7.3",
    "electron-log": "^5.4.3",
    "electron-store": "^11.0.2",
    "electron-updater": "^6.6.2",
    "electron-window-state": "^5.0.3",
    "element-plus": "^2.13.0",
    "element-resize-detector": "^1.2.4",
    "execall": "^3.0.0",
    "flowchart.js": "^1.18.0",
    "font-list": "^2.0.1",
    "fs-extra": "^11.3.3",
    "fuzzaldrin": "^2.1.0",
    "github-markdown-css": "^5.8.1",
    "html-tags": "^5.1.0",
    "iso-639-1": "^3.1.5",
    "joplin-turndown-plugin-gfm": "^1.0.12",
    "katex": "^0.16.27",
    "keytar": "^7.9.0",
    "languine": "^3.1.4",
    "mermaid": "^11.12.2",
    "mitt": "^3.0.1",
    "native-keymap": "^3.3.7",
    "pinia": "^3.0.4",
    "prismjs": "^1.30.0",
    "snabbdom": "^3.6.3",
    "snabbdom-to-html": "^7.1.0",
    "snapsvg-cjs": "^0.0.6",
    "source-map-support": "^0.5.21",
    "turndown": "^7.2.2",
    "underscore": "^1.13.7",
    "vega-embed": "^7.1.0",
    "vite-plugin-prismjs": "^0.0.11",
    "vue-i18n": "^11.2.2",
    "vue-router": "^4.6.4",
    "webfontloader": "^1.6.28"
  },

## Development Dependencies Count:
26

## Outdated Packages:
Package                         Current   Wanted   Latest  Location  Depended by
@electron-toolkit/preload       MISSING    3.0.2    3.0.2  -         marktext
@electron-toolkit/utils         MISSING    4.0.0    4.0.0  -         marktext
@electron/remote                MISSING    2.1.3    2.1.3  -         marktext
@element-plus/icons-vue         MISSING    2.3.2    2.3.2  -         marktext
@hfelix/electron-localshortcut  MISSING    4.0.1    4.0.1  -         marktext
@marktext/file-icons            MISSING    1.0.6    1.0.6  -         marktext
@octokit/rest                   MISSING   22.0.1   22.0.1  -         marktext
@popperjs/core                  MISSING   2.11.8   2.11.8  -         marktext
@vscode/ripgrep                 MISSING   1.17.0   1.17.0  -         marktext
arg                             MISSING    5.0.2    5.0.2  -         marktext
axios                           MISSING   1.13.2   1.13.2  -         marktext
ced                             MISSING    2.0.0    2.0.0  -         marktext
chokidar                        MISSING    5.0.0    5.0.0  -         marktext
codemirror                      MISSING  5.65.20    6.0.2  -         marktext
command-exists                  MISSING    1.2.9    1.2.9  -         marktext
deep-equal                      MISSING    2.2.3    2.2.3  -         marktext
dom-autoscroller                MISSING    2.3.4    2.3.4  -         marktext
dompurify                       MISSING    3.3.1    3.3.1  -         marktext
dragula                         MISSING    3.7.3    3.7.3  -         marktext
electron-log                    MISSING    5.4.3    5.4.3  -         marktext
electron-store                  MISSING   11.0.2   11.0.2  -         marktext
electron-updater                MISSING    6.7.3    6.7.3  -         marktext
electron-window-state           MISSING    5.0.3    5.0.3  -         marktext
element-plus                    MISSING   2.13.1   2.13.1  -         marktext
element-resize-detector         MISSING    1.2.4    1.2.4  -         marktext
execall                         MISSING    3.0.0    3.0.0  -         marktext
flowchart.js                    MISSING   1.18.0   1.18.0  -         marktext
font-list                       MISSING    2.0.1    2.0.1  -         marktext
fs-extra                        MISSING   11.3.3   11.3.3  -         marktext


=== Security Audit ===

npm warn config production Use `--omit=dev` instead.
found 0 vulnerabilities

=== Build Configuration ===

## electron.vite.config.js present


=== Main Process Architecture ===

## Main Process Entry Point:
src/main/commands/index.js

## IPC Communication Handlers:
src/main/app/index.js
src/main/app/windowManager.js
src/main/contextMenu/editor/spellcheck.js
src/main/dataCenter/index.js
src/main/exceptionHandler.js
src/main/keyboard/index.js
src/main/menu/actions/edit.js
src/main/menu/actions/file.js
src/main/menu/actions/marktext.js
src/main/menu/actions/theme.js
src/main/menu/actions/view.js
src/main/menu/actions/window.js
src/main/menu/index.js
src/main/preferences/index.js
src/main/spellchecker/index.js
src/main/windows/editor.js
src/main/windows/setting.js

## Window Management:
src/main/app/index.js
src/main/app/windowManager.js
src/main/dataCenter/index.js
src/main/i18n.js
src/main/keyboard/shortcutHandler.js
src/main/menu/actions/edit.js
src/main/menu/actions/file.js
src/main/menu/actions/marktext.js
src/main/menu/index.js
src/main/preferences/index.js
src/main/spellchecker/index.js
src/main/windows/base.js
src/main/windows/editor.js
src/main/windows/setting.js


=== Preload Scripts ===

## Preload Entry Points:
src/preload/index.js

## Context Bridge APIs:
Total API exposures: 6


=== Renderer Process Architecture ===

## Vue Components:
Total components: 47

## State Management (Pinia stores):
src/renderer/src/store/preferences.js
src/renderer/src/store/autoUpdates.js
src/renderer/src/store/notification.js
src/renderer/src/store/commandCenter.js
src/renderer/src/store/listenForMain.js
src/renderer/src/store/tweet.js
src/renderer/src/store/help.js
src/renderer/src/store/treeCtrl.js
src/renderer/src/store/project.js
src/renderer/src/store/index.js
src/renderer/src/store/layout.js
src/renderer/src/store/editor.js

## Router Configuration:
src/renderer/src/router


=== Shared Code & Utilities ===

## Utility Functions:
src/common/commands/constants.js
src/common/filesystem/paths.js
src/common/filesystem/index.js
src/common/envPaths.js
src/common/keybinding/index.js
src/common/i18n.js
src/common/encoding.js
src/renderer/src/commands/utils.js
src/renderer/src/util/dompurify.js
src/renderer/src/util/theme.js
src/renderer/src/util/listToTree.js
src/renderer/src/util/themeColor.js
src/renderer/src/util/fileSystem.js
src/renderer/src/util/markdownToHtml.js
src/renderer/src/util/day.js
src/renderer/src/util/index.js
src/renderer/src/util/clipboard.js
src/renderer/src/util/fs-extra-polyfill.js
src/renderer/src/util/pdf.js
src/main/windows/utils.js
src/main/utils/imagePathAutoComplement.js
src/main/utils/createGitHubIssue.js
src/main/utils/index.js
src/main/utils/pandoc.js
src/muya/lib/utils/dompurify.js
src/muya/lib/utils/markdownFile.js
src/muya/lib/utils/exportHtml.js
src/muya/lib/utils/importMarkdown.js
src/muya/lib/utils/getParentCheckBox.js
src/muya/lib/utils/getLinkInfo.js


=== Code Quality Tools ===

## ESLint Configuration:
Using eslint.config.js (flat config)

## ESLint Results:

> marktext@0.18.6 lint
> eslint --cache .


Oops! Something went wrong! :(

ESLint: 9.39.2

Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@eslint/js' imported from /home/user/marktext/eslint.config.js
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:314:9)
    at packageResolve (node:internal/modules/esm/resolve:767:81)
    at moduleResolve (node:internal/modules/esm/resolve:853:18)
    at defaultResolve (node:internal/modules/esm/resolve:983:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:731:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:708:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:310:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:182:49)
(node:9552) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/user/marktext/eslint.config.js?mtime=1768514298000 is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /home/user/marktext/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)


=== Code Complexity ===

## Largest Files (potential complexity):
  54101 total
   1877 src/muya/lib/assets/libs/sequence-diagram-snap.js
   1495 src/renderer/src/store/editor.js
   1270 src/renderer/src/components/editorWithTabs/editor.vue
   1201 src/renderer/src/prefComponents/image/components/uploader/index.vue
   1047 src/muya/lib/contentState/paragraphCtrl.js
    825 src/muya/lib/contentState/index.js
    740 src/main/app/index.js
    731 src/renderer/src/commands/index.js
    724 src/muya/lib/parser/marked/lexer.js
    715 src/muya/lib/selection/index.js
    696 src/main/menu/actions/file.js
    695 src/muya/lib/utils/importMarkdown.js
    672 src/muya/lib/contentState/backspaceCtrl.js
    640 src/muya/lib/contentState/enterCtrl.js
    618 src/muya/lib/contentState/updateCtrl.js
    603 src/muya/lib/parser/index.js
    590 src/muya/lib/contentState/pasteCtrl.js
    540 src/renderer/src/components/exportSettings/index.vue
    538 src/muya/lib/index.js
    493 src/main/windows/editor.js
    492 src/muya/lib/contentState/tabCtrl.js
    475 src/main/menu/index.js
    471 src/muya/lib/config/index.js
    465 src/main/app/windowManager.js
    457 src/renderer/src/prefComponents/sideBar/config.js
    454 src/renderer/src/components/search/index.vue
    446 src/muya/lib/utils/exportMarkdown.js
    439 src/renderer/src/components/titleBar/index.vue
    429 src/renderer/src/components/commandPalette/index.vue

## Function Definitions:
Total functions: 1771


=== Technical Debt Markers ===

## TODO/FIXME Comments:
Total markers: 105
src/common/envPaths.js:23:    // TODO(sessions): enable this...
src/renderer/src/commands/index.js:184:  // TODO: Find next/previous doesn't work.
src/renderer/src/commands/utils.js:3:  // TODO: t('commands.utils.todoUpdateCheck')
src/renderer/src/components/editorWithTabs/editor.vue:471:  // TODO(Refactor): Refactor this method.
src/renderer/src/store/help.js:117:  // TODO(refactor:renderer/editor): Replace this function with `createDocumentState`.
src/renderer/src/store/layout.js:26:      // TODO: Add side bar to session (GH#732).
src/renderer/src/prefComponents/keybindings/key-input-dialog.vue:104:    // FIXME: You can still write in the textbox while composition.
src/renderer/src/prefComponents/keybindings/key-input-dialog.vue:143:    // TODO: Show shake animation on error text.
src/renderer/src/prefComponents/image/components/uploader/services.js:1:// TODO: Remove information from other vue source files into this file.
src/renderer/src/prefComponents/general/index.vue:82:        <!-- TODO: The description is very bad and the entry isn't used by the editor. -->
src/renderer/src/prefComponents/editor/index.vue:61:        <!-- FIXME: Disabled due to #1648. -->
src/main/commands/index.js:46:        console.error(`[DEBUG] Default command with id="${id}" isn't available!`)
src/main/preferences/index.js:22:    // TODO: Preferences should not loaded if global.MARKTEXT_SAFE_MODE is set.
src/main/preferences/index.js:77:        // TODO(fxha): For performance reasons, we should try to replace 'electron-store' because
src/main/filesystem/markdown.js:66:  // TODO(@fxha): "safeSaveDocuments" using temporary file and rename syscall.
src/main/filesystem/markdown.js:85:  // TODO: Use streams to not buffer the file multiple times and only guess
src/main/filesystem/watcher.js:11:// TODO(refactor): Please see GH#1035.
src/main/filesystem/watcher.js:34:    // HACK: But this should be removed completely in #1034/#1035.
src/main/filesystem/watcher.js:75:    // HACK: Markdown data should be removed completely in #1034/#1035 and
src/main/filesystem/watcher.js:147:    // TODO: Is it needed to set `watcherUsePolling` ? because macOS need to set to true.
src/main/filesystem/watcher.js:213:        if (global.MARKTEXT_DEBUG_VERBOSE >= 3) {
src/main/filesystem/watcher.js:218:        // TODO: This should also apply to macOS.
src/main/filesystem/watcher.js:219:        // TODO: Do we need to rewatch when the watched directory was renamed?
src/main/filesystem/watcher.js:362:                if (global.MARKTEXT_DEBUG_VERBOSE >= 3) {
src/main/dataCenter/index.js:189:    // TODO: Replace sync. call.
src/main/windows/editor.js:189:      // TODO: Close all watchers etc. Should we do this manually or listen to 'quit' event?
src/main/windows/editor.js:231:    // TODO: Don't allow new files if quitting.
src/main/windows/editor.js:255:    // TODO: Don't allow new files if quitting.
src/main/windows/editor.js:291:    // TODO: Don't allow new files if quitting.
src/main/windows/editor.js:308:    // TODO: Don't allow new files if quitting.
src/main/app/paths.js:28:  // TODO(sessions): enable this...
src/main/app/index.js:604:        // TODO: Do nothing, maybe we'll add screenCapture later on Linux and Windows.
src/main/app/env.js:85:  const debug = args['--debug'] || !!process.env.MARKTEXT_DEBUG || process.env.NODE_ENV !== 'production'
src/main/app/env.js:103:  global.MARKTEXT_DEBUG = debug
src/main/app/env.js:104:  global.MARKTEXT_DEBUG_VERBOSE = verbose
src/main/app/windowManager.js:71:    // TODO(need::refactor): Please see #1035.
src/main/app/windowManager.js:347:    // HACK: Don't use this event! Please see #1034 and #1035
src/main/keyboard/shortcutHandler.js:32:          console.error(`[DEBUG] Command with id="${id}" isn't available for accelerator="${accelerator}".`)
src/main/keyboard/shortcutHandler.js:125:      if (global.MARKTEXT_DEBUG && process.env.MARKTEXT_DEBUG_KEYBOARD) {
src/main/keyboard/shortcutHandler.js:126:        console.log('[DEBUG] Keyboard layout changed:\n', layout)
src/main/utils/imagePathAutoComplement.js:9:// TODO(need::refactor): Refactor this file. Just return an array of directories and files without caching and watching?
src/main/utils/imagePathAutoComplement.js:11:// TODO: rebuild cache @jocs
src/main/utils/index.js:10:// TODO: Remove this function and load the recommend title from the editor (renderer) when
src/main/utils/index.js:49:  if (!global.MARKTEXT_DEBUG_VERBOSE || typeof global.MARKTEXT_DEBUG_VERBOSE !== 'number' ||
src/main/utils/index.js:50:    global.MARKTEXT_DEBUG_VERBOSE <= 0) {
src/main/utils/index.js:52:  } else if (global.MARKTEXT_DEBUG_VERBOSE === 1) {
src/main/utils/index.js:54:  } else if (global.MARKTEXT_DEBUG_VERBOSE === 2) {
src/main/menu/templates/edit.js:136:      // TODO: Remove this menu entry and add it to the command palette (#1408).
src/main/menu/templates/help.js:10:  // TODO: If not updatable, allow to check whether there is a new version available.
src/main/menu/templates/view.js:78:  if (global.MARKTEXT_DEBUG) {


=== Debug Statements ===

## Console Statements:
Total console statements: 137


=== Testing Infrastructure ===

## Test Files:
Total test files: 1
./test/unit/listHelpers.spec.js

## Test Configuration:
No test framework configuration found

## Test Scripts:
No test script defined in package.json


=== Performance Metrics ===

## Bundle Configuration:
No bundle analyzer configured

## Build Output:
Not built yet (no 'out' directory)


=== Asset Analysis ===

## Large Assets (>100KB):
total 526K
-rw-r--r-- 1 root root 7.4K Jan 15 22:23 BUILD_SETUP.md
-rw-r--r-- 1 root root 1.1K Jan 15 21:58 LICENSE
-rw-r--r-- 1 root root 7.5K Jan 15 21:58 README.md
drwxr-xr-x 6 root root 4.0K Jan 15 21:58 build
drwxr-xr-x 7 root root 4.0K Jan 15 21:58 docs
-rwxr-xr-x 1 root root 4.7K Jan 15 21:58 electron-builder.yml
-rw-r--r-- 1 root root 2.5K Jan 15 21:58 electron.vite.config.js
-rw-r--r-- 1 root root 2.0K Jan 15 21:58 eslint.config.js
-rw-r--r-- 1 root root  242 Jan 15 21:58 jsconfig.json
-rw-r--r-- 1 root root 453K Jan 15 22:23 package-lock.json
-rw-r--r-- 1 root root 3.5K Jan 15 21:58 package.json
-rw-r--r-- 1 root root  19K Jan 15 22:28 project-review.md
drwxr-xr-x 2 root root 4.0K Jan 15 22:23 scripts
drwxr-xr-x 7 root root 4.0K Jan 15 21:58 src
drwxr-xr-x 3 root root 4.0K Jan 15 21:58 static
drwxr-xr-x 3 root root 4.0K Jan 15 21:58 test

## Image Files:
Total images: 308


=== Build System ===

## NPM Scripts:
  "scripts": {
    "format": "prettier --write .",
    "lint": "eslint --cache .",
    "start": "electron-vite preview",
    "minify-locales": "node scripts/minify-locales.mjs",
    "rebuild-native": "npx @electron/rebuild -f",
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "build:unpack": "npm run minify-locales && npm run build && electron-builder --dir",
    "build:win": "npm run minify-locales && npx @electron/rebuild && npm run build && electron-builder --win --publish never",
    "build:mac": "npm run minify-locales && npx @electron/rebuild && npm run build && electron-builder --mac --publish never",
    "build:linux": "npm run minify-locales && npx @electron/rebuild && npm run build && electron-builder --linux --publish never"
  },
  "dependencies": {
    "@electron-toolkit/preload": "^3.0.2",
    "@electron-toolkit/utils": "^4.0.0",

## electron-builder Configuration:
electron-builder.yml present


=== CI/CD ===

## GitHub Actions Workflows:
test_pr.yml
build-check.yml
release.yml


=== Documentation ===

## Documentation Files:
./src/renderer/src/prefComponents/theme/theme.md
./src/muya/README.md
./src/muya/lib/parser/marked/README.md
./docs/ENVIRONMENT.md
./docs/KEYBINDINGS_LINUX.md
./docs/EXPORT.md
./docs/PREFERENCES.md
./docs/CLI.md
./docs/MARKDOWN_SYNTAX.md
./docs/LINUX.md
./docs/EXPORT_THEMES.md
./docs/IMAGES.md
./docs/IMAGE_UPLOADER_CONFIGRATION.md
./docs/i18n-validation.md
./docs/SPELLING.md
./docs/APPLICATION_DATA_DIRECTORY.md
./docs/dev/ARCHITECTURE.md
./docs/dev/RELEASE.md
./docs/dev/README.md
./docs/dev/INTERFACE.md
./docs/dev/code/COMMANDS.md
./docs/dev/code/README.md
./docs/dev/code/renderer/editor.md
./docs/dev/code/BLOCK_ADDITION_PROPERTY.md
./docs/dev/code/IPC.md
./docs/dev/BUILD.md
./docs/dev/LINUX_DEV.md
./docs/dev/DEBUGGING.md
./docs/KEYBINDINGS_OSX.md
./docs/BASICS.md

## Developer Documentation:
Total doc files in docs/: 41


=== Code Documentation ===

## JSDoc Coverage:
JSDoc blocks found: 276


=== Security Analysis ===

## Electron Security:
### nodeIntegration settings:
src/main/config.js:15:    nodeIntegration: true,
src/main/config.js:35:    nodeIntegration: true,

### contextIsolation settings:
src/main/config.js:10:    contextIsolation: false,
src/main/config.js:32:    contextIsolation: false,

### sandbox settings:


## Potential Security Issues:
### Potential hardcoded secrets (review manually):
src/renderer/src/codeMirror/overlayMode.js:39:      token (stream, state) {
src/renderer/src/codeMirror/overlayMode.js:47:          state.baseCur = base.token(stream, state.base)
src/renderer/src/codeMirror/overlayMode.js:53:          state.overlayCur = overlay.token(stream, state.overlay)
src/renderer/src/codeMirror/mltiplexMode.js:35:      token (stream, state) {
src/renderer/src/codeMirror/mltiplexMode.js:60:          const outerToken = outer.token(stream, state.outer)
src/renderer/src/codeMirror/mltiplexMode.js:68:            return this.token(stream, state)
src/renderer/src/codeMirror/mltiplexMode.js:77:          let innerToken = curInner.mode.token(stream, state.inner)
src/main/utils/index.js:15:  const tokens = markdown.match(/#{1,6} {1,}(.*\S.*)(?:\n|$)/g)
src/main/utils/index.js:16:  if (!tokens) return ''
src/main/utils/index.js:17:  const headers = tokens.map(t => {
src/muya/lib/ui/imageSelector/index.js:52:        Object.assign(this.state, imageInfo.token.attrs)
src/muya/lib/ui/imageSelector/index.js:183:      const { alt: oldAlt, src: oldSrc, title: oldTitle } = this.imageInfo.token.attrs
src/muya/lib/ui/imageToolbar/index.js:55:    const { attrs } = imageInfo.token
src/muya/lib/assets/libs/sequence-diagram-snap.js:174:            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
src/muya/lib/assets/libs/sequence-diagram-snap.js:176:            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
src/muya/lib/assets/libs/sequence-diagram-snap.js:183:  token location info (@$, _$, etc.): {
src/muya/lib/assets/libs/sequence-diagram-snap.js:192:    token:       (the produced terminal token, if any)
src/muya/lib/assets/libs/sequence-diagram-snap.js:197:    expected:    (string describing the set of expected tokens)
src/muya/lib/assets/libs/sequence-diagram-snap.js:512:          var token
src/muya/lib/assets/libs/sequence-diagram-snap.js:514:            (token = lexer.lex() || EOF),


=== Migration Status ===

## Vue Version:
    "vue": "^3.5.26",

## Potential Vue 2 Patterns:
Count: 0

## API Usage:
Options API components: 1
Composition API components: 46

## Build Tool Migration:
✓ No old Webpack configs found

✓ electron-vite configuration present


=== Dependency Graph ===

## Circular Dependencies Check:
Run 'npx madge --circular src' to detect circular dependencies

## Import Statistics:
Total import statements: 1362
Total require statements: 4


=== Code Anti-Patterns ===

## Global Variables:
Count: 278

## var Declarations (should use let/const):
Count: 116

## Performance Concerns:
### Synchronous File Operations:
Count: 9


=== Recommendations & Action Items ===

## Priority 1: Critical Issues
- [ ] Review and address any security audit findings from npm audit
- [ ] **CRITICAL**: Review nodeIntegration: true setting in electron.vite.config.js - this is a security risk
- [ ] Ensure proper Electron security settings (contextIsolation enabled, sandbox enabled)
- [ ] Review and secure any IPC communication handlers
- [ ] Verify no hardcoded secrets or credentials in source code

## Priority 2: Code Quality
- [ ] Address ESLint errors and warnings
- [ ] Review and prioritize TODO/FIXME comments for resolution
- [ ] Consider adding ESLint rule for console statements in production builds
- [ ] Review largest/most complex files for potential refactoring
- [ ] Replace var declarations with let/const

## Priority 3: Testing
- [ ] **CRITICAL**: No test framework currently configured - add Vitest
- [ ] Add unit tests for critical components and utilities
- [ ] Set up E2E testing with Playwright or Spectron
- [ ] Aim for minimum 60% code coverage
- [ ] Add integration tests for IPC communication
- [ ] Set up CI/CD pipeline to run tests automatically

## Priority 4: Performance
- [ ] Review and optimize large files (>1000 lines)
- [ ] Replace synchronous file operations with async alternatives where possible
- [ ] Consider implementing code splitting for renderer process
- [ ] Add bundle size monitoring
- [ ] Optimize large assets and images

## Priority 5: Migration Completion
- [ ] Verify all components work correctly with Vue 3
- [ ] Migrate remaining Options API components to Composition API (if desired)
- [ ] Remove any old Webpack configurations if present
- [ ] Update documentation to reflect new build system

## Priority 6: Documentation
- [ ] Update README with current build instructions
- [ ] Document architecture and project structure
- [ ] Add JSDoc comments to public APIs and complex functions
- [ ] Create developer onboarding guide
- [ ] Document IPC communication patterns

## Priority 7: Developer Experience
- [ ] Set up pre-commit hooks with husky for linting
- [ ] Configure automated code formatting with prettier (already installed)
- [ ] Add commit message linting
- [ ] Improve error messages and logging
- [ ] Consider adding TypeScript for better type safety

## Priority 8: Build and CI/CD
- [ ] Set up automated builds for multiple platforms
- [ ] Configure release automation
- [ ] Add build time and size monitoring
- [ ] Set up automated dependency updates (Dependabot)
