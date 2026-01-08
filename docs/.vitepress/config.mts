import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MarkText',
  description: 'Next generation markdown editor',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/BASICS' }
    ],

    sidebar: [
      {
        items: [
          { text: 'Basics', link: '/BASICS' },
          { text: 'FAQ', link: '/FAQ' },
          { text: 'Installation (Linux)', link: '/LINUX' },
          { text: 'Portable Mode', link: '/PORTABLE' }
        ]
      },
      {
        text: 'Translations',
        collapsed: true,
        items: [
          { text: '简体中文', link: '/i18n/README-zh_cn' },
          { text: '繁體中文', link: '/i18n/README-zh_tw' },
          { text: 'Deutsch', link: '/i18n/README-de' },
          { text: 'Español', link: '/i18n/README-es' },
          { text: 'Français', link: '/i18n/README-fr' },
          { text: '日本語', link: '/i18n/README-jp' },
          { text: '한국어', link: '/i18n/README-kr' },
          { text: 'Português', link: '/i18n/README-pt' }
        ]
      },
      {
        text: 'Editing',
        items: [
          { text: 'Editing in Depth', link: '/EDITING' },
          { text: 'Markdown Syntax', link: '/MARKDOWN_SYNTAX' },
          { text: 'Images', link: '/IMAGES' },
          { text: 'Image Uploader', link: '/IMAGE_UPLOADER_CONFIGRATION' },
          { text: 'Spelling', link: '/SPELLING' }
        ]
      },
      {
        text: 'Customization',
        items: [
          { text: 'Preferences', link: '/PREFERENCES' },
          { text: 'Themes', link: '/THEMES' },
          { text: 'Export Themes', link: '/EXPORT_THEMES' }
        ]
      },
      {
        text: 'Key Bindings',
        items: [
          { text: 'General', link: '/KEYBINDINGS' },
          { text: 'Windows', link: '/KEYBINDINGS_WINDOWS' },
          { text: 'Linux', link: '/KEYBINDINGS_LINUX' },
          { text: 'macOS', link: '/KEYBINDINGS_OSX' }
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'CLI', link: '/CLI' },
          { text: 'Export', link: '/EXPORT' },
          { text: 'Environment Variables', link: '/ENVIRONMENT' },
          { text: 'App Data Directory', link: '/APPLICATION_DATA_DIRECTORY' },
          { text: 'I18n Validation', link: '/i18n-validation' }
        ]
      },
      {
        text: 'Development',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/dev/README' },
          { text: 'Architecture', link: '/dev/ARCHITECTURE' },
          { text: 'Build Instructions', link: '/dev/BUILD' },
          { text: 'Debugging', link: '/dev/DEBUGGING' },
          { text: 'Interface', link: '/dev/INTERFACE' },
          { text: 'Linux Dev', link: '/dev/LINUX_DEV' },
          { text: 'Release', link: '/dev/RELEASE' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/marktext/marktext' }],
    search: {
      provider: 'local'
    }
  }
})
