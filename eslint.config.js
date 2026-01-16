import eslintJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginHtml from 'eslint-plugin-html'
import pluginI18nJson from 'eslint-plugin-i18n-json'
import pluginJsonc from 'eslint-plugin-jsonc'
import neostandard from 'neostandard'
import babelParser from '@babel/eslint-parser'
const { configs: js } = eslintJs

export default [
  // 0. ESLint core recommended rules

  js.recommended,
  // 1. Use neostandard instead
  ...neostandard(),

  ...pluginVue.configs['flat/recommended'],

  // 3. Your custom overrides
  {
    plugins: {
      html: pluginHtml
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        MARKTEXT_VERSION_STRING: 'readonly',
        MARKTEXT_VERSION: 'readonly',
        __static: 'readonly'
      }
    },
    rules: {
      // Style rules
      indent: ['error', 2, { SwitchCase: 1, ignoreComments: true }],
      semi: ['error', 'never'],
      'space-before-function-paren': ['error', 'never'],
      'arrow-parens': 'off',

      // Error prevention
      'no-return-await': 'error',
      'no-return-assign': 'error',
      'no-new': 'error',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      // Console statements - warn in dev, error in production
      'no-console': process.env.NODE_ENV === 'production' ? ['error', {
        allow: ['warn', 'error']
      }] : 'off',

      // Code quality improvements
      'complexity': ['warn', { max: 20 }],
      'max-depth': ['warn', { max: 4 }],
      'max-lines-per-function': ['warn', {
        max: 150,
        skipBlankLines: true,
        skipComments: true
      }],
      'max-params': ['warn', { max: 5 }],

      // Best practices
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',

      // Security
      'no-unsafe-optional-chaining': 'error',

      // Existing overrides
      'require-atomic-updates': 'off',
      'prefer-const': 'off',
      'no-mixed-operators': 'off',
      'no-prototype-builtins': 'off'
    },
    ignores: ['node_modules', 'src/muya/dist/**/*', 'src/muya/webpack.config.js']
  },

  // 4. JSON files basic validation
  ...pluginJsonc.configs['flat/recommended-with-json'],

  // 5. i18n JSON files validation
  {
    files: ['src/shared/i18n/locales/*.json'],
    plugins: {
      'i18n-json': pluginI18nJson
    },
    rules: {
      'i18n-json/valid-json': 'error',
      'i18n-json/sorted-keys': 'warn',
      'i18n-json/identical-keys': [
        'error',
        {
          filePath: 'src/shared/i18n/locales/en.json'
        }
      ]
    }
  }
]
