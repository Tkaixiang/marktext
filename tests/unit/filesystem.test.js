import { describe, it, expect } from 'vitest'
import {
  hasMarkdownExtension,
  MARKDOWN_INCLUSIONS,
  isImageFile
} from '../../src/common/filesystem/paths.js'

describe('Filesystem Path Utilities', () => {
  describe('hasMarkdownExtension', () => {
    it('should return true for .md files', () => {
      expect(hasMarkdownExtension('test.md')).toBe(true)
      expect(hasMarkdownExtension('README.md')).toBe(true)
      expect(hasMarkdownExtension('/path/to/file.md')).toBe(true)
    })

    it('should return true for .markdown files', () => {
      expect(hasMarkdownExtension('test.markdown')).toBe(true)
      expect(hasMarkdownExtension('/path/to/file.markdown')).toBe(true)
    })

    it('should return false for non-markdown files', () => {
      expect(hasMarkdownExtension('test.txt')).toBe(false)
      expect(hasMarkdownExtension('test.js')).toBe(false)
      expect(hasMarkdownExtension('test')).toBe(false)
    })

    it('should handle case-insensitive extensions', () => {
      expect(hasMarkdownExtension('test.MD')).toBe(true)
      expect(hasMarkdownExtension('test.Markdown')).toBe(true)
    })
  })

  describe('isImageFile', () => {
    it('should return true for common image formats', () => {
      expect(isImageFile('photo.jpg')).toBe(true)
      expect(isImageFile('photo.jpeg')).toBe(true)
      expect(isImageFile('photo.png')).toBe(true)
      expect(isImageFile('photo.gif')).toBe(true)
      expect(isImageFile('photo.svg')).toBe(true)
      expect(isImageFile('photo.webp')).toBe(true)
    })

    it('should return false for non-image files', () => {
      expect(isImageFile('document.pdf')).toBe(false)
      expect(isImageFile('text.txt')).toBe(false)
      expect(isImageFile('script.js')).toBe(false)
    })

    it('should handle case-insensitive extensions', () => {
      expect(isImageFile('photo.JPG')).toBe(true)
      expect(isImageFile('photo.PNG')).toBe(true)
    })

    it('should handle paths', () => {
      expect(isImageFile('/path/to/photo.jpg')).toBe(true)
      expect(isImageFile('/path/to/document.txt')).toBe(false)
    })
  })

  describe('MARKDOWN_INCLUSIONS', () => {
    it('should be an array of markdown extensions', () => {
      expect(Array.isArray(MARKDOWN_INCLUSIONS)).toBe(true)
      expect(MARKDOWN_INCLUSIONS.length).toBeGreaterThan(0)
    })

    it('should include common markdown extensions', () => {
      expect(MARKDOWN_INCLUSIONS).toContain('.md')
      expect(MARKDOWN_INCLUSIONS).toContain('.markdown')
    })
  })
})
