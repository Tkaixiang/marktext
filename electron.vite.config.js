import { resolve, dirname } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
// Removed: import renderer from 'vite-plugin-electron-renderer' - using preload APIs instead
import svgLoader from 'vite-svg-loader'
import postcssPresetEnv from 'postcss-preset-env'
import packageJson from './package.json' with { type: 'json' }
import { fileURLToPath } from 'url'
import { builtinModules } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Node.js built-in modules that should remain external in preload
const nodeBuiltins = builtinModules.filter(m => !m.startsWith('_'))

export default defineConfig({
  main: {
    // --> Bundled as CommonJS
    // externalizeDepsPlugin() basically externises all the dependencies from being bundled during build - treating them as runtime dependencies
    // electron-vite still builds the main and preload processes into commonJS
    // hence, we need to "exclude" (in order to NOT externalise) ESonly modules so that they can be converted to commonJS and can be required() afterwards correctly
    build: {
      externalizeDeps: {
        exclude: ['electron-store']
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
      extensions: ['.mjs', '.js', '.json']
    }
  },
  preload: {
    // --> Bundled as CommonJS
    build: {
      // Bundle npm packages, but keep Node.js built-ins and electron external
      externalizeDeps: false,
      rollupOptions: {
        external: [
          'electron',
          // Node.js built-ins must remain external
          ...nodeBuiltins,
          ...nodeBuiltins.map(m => `node:${m}`)
        ]
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src'),
        common: resolve(__dirname, 'src/common'),
        muya: resolve(__dirname, 'src/muya'),
        main_renderer: resolve(__dirname, 'src/main')
      },
      extensions: ['.mjs', '.js', '.json']
    }
  },
  renderer: {
    // --> Bundled as ES Modules
    assetsInclude: ['**/*.md'],
    // Provide process global for @electron/remote and other packages that need it
    define: {
      'process.platform': JSON.stringify(process.platform),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      // @electron/remote needs these Node.js globals
      '__dirname': JSON.stringify(''),
      '__filename': JSON.stringify(''),
      // dragula and other libraries expect global to be defined
      'global': 'window'
    },
    // Pre-bundle CommonJS dependencies
    optimizeDeps: {
      include: [
        'snabbdom',
        'snabbdom-to-html',
        'dragula',
        'crossvent'
      ]
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'src/renderer/src') },
        { find: 'common', replacement: resolve(__dirname, 'src/common') },
        { find: 'muya', replacement: resolve(__dirname, 'src/muya') },
        { find: 'main_renderer', replacement: resolve(__dirname, 'src/main') },
        // Alias Node.js modules to use window APIs from preload
        { find: 'path', replacement: resolve(__dirname, 'src/renderer/src/shims/path.js') },
        { find: 'process', replacement: resolve(__dirname, 'src/renderer/src/shims/process.js') },
        { find: /^fs\/promises$/, replacement: resolve(__dirname, 'src/renderer/src/shims/fs-promises.js') },
        { find: 'fs', replacement: resolve(__dirname, 'src/renderer/src/shims/fs.js') },
        { find: '@electron/remote', replacement: resolve(__dirname, 'src/renderer/src/shims/electron-remote.js') },
        { find: 'child_process', replacement: resolve(__dirname, 'src/renderer/src/shims/child_process.js') }
      ],
      extensions: ['.mjs', '.js', '.json', '.vue']
    },
    plugins: [
      vue(),
      svgLoader()
      // Removed vite-plugin-electron-renderer - using preload-exposed APIs instead
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
