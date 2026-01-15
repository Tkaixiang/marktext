---
layout: home

hero:
  name: 'MarkText'
  text: 'Next generation markdown editor'
  tagline: A simple and elegant open-source markdown editor focused on speed and usability.
  image:
      src: /logo-small.png
      alt: MarkText
  actions:
    - theme: brand
      text: Docs
      link: /BASICS
    - theme: alt
      text: GitHub
      link: https://github.com/marktext/marktext

features:
  - title: Realtime Preview
    details: WYSIWYG and a clean interface for a distraction-free writing experience.
  - title: Markdown Support
    details: Support for CommonMark, GFM, and selective Pandoc markdown.
  - title: Various Themes
    details: 6 aesthetic themes including Cadmium Light, Material Dark, and One Dark.
  - title: Multiple Edit Modes
    details: Source Code, Typewriter, and Focus modes to suit your writing style.
  - title: Math & Formula Support
    details: Support for KaTeX math expressions, emojis, and front matter.
  - title: Export Options
    details: Export your documents to HTML and PDF formats.
  - title: Inline Shortcuts
    details: Improve efficiency with paragraph and inline style shortcuts.
  - title: Image Handling
    details: Paste images directly from the clipboard.
---

<div align="center">
  <p>
    Translations available in:
    <a href="./i18n/README-zh_cn">CN</a> |
    <a href="./i18n/README-zh_tw">TW</a> |
    <a href="./i18n/README-de">DE</a> |
    <a href="./i18n/README-es">ES</a> |
    <a href="./i18n/README-fr">FR</a> |
    <a href="./i18n/README-jp">JP</a> |
    <a href="./i18n/README-kr">KR</a> |
    <a href="./i18n/README-pt">PT</a>
  </p>
</div>

## Installation

::: warning Beta Release
These releases are still in **beta**. Please report any bugs in the [issue tracker](https://github.com/Tkaixiang/marktext/issues).
:::

### Windows

Download the latest installer from the **[Releases Page](https://github.com/Tkaixiang/marktext/releases)**.

- Tested on: `Windows 11`

### Linux

Download `AppImage` or `.deb` packages from the **[Releases Page](https://github.com/Tkaixiang/marktext/releases)**.

- Tested on: `Ubuntu 24.0.2`

**Arch Linux (AUR)**
Available as `marktext-tkaixiang-bin` thanks to [@kromsam](https://github.com/kromsam).
[![AUR version](https://img.shields.io/aur/version/marktext-tkaixiang-bin)](https://aur.archlinux.org/packages/marktext-tkaixiang-bin)

### MacOS

Download from the **[Releases Page](https://github.com/Tkaixiang/marktext/releases)**.

::: danger Notarization Issue
MacOS releases may show "MarkText is damaged and can't be opened" due to a lack of notarization.
[See the fix here](https://github.com/marktext/marktext/issues/3004#issuecomment-1038207300).
:::

---

## Showcase

### Interface

!["MarkText Interface"](/marktext.png)

### Themes

MarkText comes with beautiful themes built-in.

| Light Themes                                               | Dark Themes                                             |
| :--------------------------------------------------------- | :------------------------------------------------------ |
| **Cadmium Light**<br>![](/themeImages/cadmium-light.png)   | **Dark**<br>![](/themeImages/dark.png)                  |
| **Graphite Light**<br>![](/themeImages/graphite-light.png) | **Material Dark**<br>![](/themeImages/materal-dark.png) |
| **Ulysses Light**<br>![](/themeImages/ulysses-light.png)   | **One Dark**<br>![](/themeImages/one-dark.png)          |

### Edit Modes

|   Source Code    |      Typewriter      |      Focus      |
| :--------------: | :------------------: | :-------------: |
| ![](/source.gif) | ![](/typewriter.gif) | ![](/focus.gif) |

---

## Motivation

**Why another fork?**

> "A main gripe I had when looking into `marktext` was that the development framework + environment was aging badly and took forever to compile."

This repository serves as a major "re-write" and modernization of the original MarkText editor.

- **Modern Stack**: Migrated to [electron-vite](https://electron-vite.org/), `Vue3`, and `Pinia`.
- **Fresh Start**: Updated all libraries to their latest possible versions.
- **ESModules**: The renderer process is now fully ESModules only.

If you'd like to help with testing or development, check out the [Developer Documentation](dev/README.md).
