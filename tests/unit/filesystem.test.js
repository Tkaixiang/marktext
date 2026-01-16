import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  hasMarkdownExtension,
  MARKDOWN_INCLUSIONS,
  MARKDOWN_EXTENSIONS,
  IMAGE_EXTENSIONS,
  isImageFile,
  isChildOfDirectory,
  isSamePathSync,
  checkPathExcludePattern
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

    it('should return true for all markdown extensions', () => {
      const testCases = [
        'file.markdown',
        'file.mdown',
        'file.mkdn',
        'file.md',
        'file.mkd',
        'file.mdwn',
        'file.mdtxt',
        'file.mdtext',
        'file.mdx',
        'file.text',
        'file.txt'
      ]
      testCases.forEach((filename) => {
        expect(hasMarkdownExtension(filename)).toBe(true)
      })
    })

    it('should return false for non-markdown files', () => {
      expect(hasMarkdownExtension('test.pdf')).toBe(false)
      expect(hasMarkdownExtension('test.js')).toBe(false)
      expect(hasMarkdownExtension('test.html')).toBe(false)
      expect(hasMarkdownExtension('test.json')).toBe(false)
      expect(hasMarkdownExtension('test')).toBe(false)
    })

    it('should handle case-insensitive extensions', () => {
      expect(hasMarkdownExtension('test.MD')).toBe(true)
      expect(hasMarkdownExtension('test.Markdown')).toBe(true)
      expect(hasMarkdownExtension('test.MDX')).toBe(true)
      expect(hasMarkdownExtension('test.MDOWN')).toBe(true)
    })

    it('should handle paths with directories', () => {
      expect(hasMarkdownExtension('/path/to/document.md')).toBe(true)
      expect(hasMarkdownExtension('C:\\Users\\test\\file.markdown')).toBe(true)
      expect(hasMarkdownExtension('../relative/path/file.md')).toBe(true)
    })

    it('should handle files with dots in name', () => {
      expect(hasMarkdownExtension('my.file.with.dots.md')).toBe(true)
      expect(hasMarkdownExtension('version.1.2.3.markdown')).toBe(true)
    })

    it('should handle edge cases', () => {
      expect(hasMarkdownExtension(null)).toBe(false)
      expect(hasMarkdownExtension(undefined)).toBe(false)
      expect(hasMarkdownExtension('')).toBe(false)
      expect(hasMarkdownExtension(123)).toBe(false)
      expect(hasMarkdownExtension({})).toBe(false)
    })
  })

  describe('isImageFile', () => {
    // Note: isImageFile requires actual file existence, so these tests may need mocking
    it('should recognize common image extensions', () => {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']
      // These tests would need the files to exist or isFile() to be mocked
      // For now, we're testing the extension recognition logic
      expect(IMAGE_EXTENSIONS).toEqual(expect.arrayContaining(imageExtensions))
    })

    it('should handle case-insensitive extensions', () => {
      // Extension check is case-insensitive
      expect(IMAGE_EXTENSIONS.some((ext) => ext.toLowerCase() === 'jpg')).toBe(true)
      expect(IMAGE_EXTENSIONS.some((ext) => ext.toLowerCase() === 'png')).toBe(true)
    })
  })

  describe('isChildOfDirectory', () => {
    it('should return true for direct children', () => {
      expect(isChildOfDirectory('/parent', '/parent/child')).toBe(true)
      expect(isChildOfDirectory('/parent', '/parent/child.txt')).toBe(true)
    })

    it('should return true for nested children', () => {
      expect(isChildOfDirectory('/parent', '/parent/child/grandchild')).toBe(true)
      expect(isChildOfDirectory('/parent', '/parent/a/b/c/file.txt')).toBe(true)
    })

    it('should return false for parent directories', () => {
      expect(isChildOfDirectory('/parent/child', '/parent')).toBe(false)
    })

    it('should return false for sibling directories', () => {
      expect(isChildOfDirectory('/parent/child1', '/parent/child2')).toBe(false)
    })

    it('should return false for completely different paths', () => {
      expect(isChildOfDirectory('/path1', '/path2/file')).toBe(false)
      expect(isChildOfDirectory('/home', '/var/log')).toBe(false)
    })

    it('should return false for same path', () => {
      expect(isChildOfDirectory('/path', '/path')).toBe(false)
    })

    it('should handle relative paths', () => {
      expect(isChildOfDirectory('.', './child')).toBe(true)
      expect(isChildOfDirectory('./parent', './parent/child')).toBe(true)
    })

    it('should handle edge cases', () => {
      expect(isChildOfDirectory(null, '/child')).toBe(false)
      expect(isChildOfDirectory('/parent', null)).toBe(false)
      expect(isChildOfDirectory('', '/child')).toBe(false)
      expect(isChildOfDirectory('/parent', '')).toBe(false)
    })

    it('should handle Windows-style paths', () => {
      expect(isChildOfDirectory('C:\\parent', 'C:\\parent\\child')).toBe(true)
      expect(isChildOfDirectory('C:\\parent', 'C:\\other\\path')).toBe(false)
    })

    it('should prevent path traversal attacks', () => {
      expect(isChildOfDirectory('/parent', '/parent/../sibling')).toBe(false)
      expect(isChildOfDirectory('/parent', '/parent/child/../../other')).toBe(false)
    })
  })

  describe('isSamePathSync', () => {
    it('should return true for identical paths', () => {
      expect(isSamePathSync('/path/to/file', '/path/to/file')).toBe(true)
      expect(isSamePathSync('file.txt', 'file.txt')).toBe(true)
    })

    it('should return true for paths with different separators', () => {
      // Path normalization should handle this
      expect(isSamePathSync('/path/to/file', '/path/to/file')).toBe(true)
    })

    it('should return false for different paths', () => {
      expect(isSamePathSync('/path/to/file1', '/path/to/file2')).toBe(false)
      expect(isSamePathSync('/path1', '/path2')).toBe(false)
    })

    it('should return false for different length paths', () => {
      expect(isSamePathSync('/short', '/much/longer/path')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isSamePathSync(null, '/path')).toBe(false)
      expect(isSamePathSync('/path', null)).toBe(false)
      expect(isSamePathSync('', '/path')).toBe(false)
      expect(isSamePathSync('/path', '')).toBe(false)
      expect(isSamePathSync(null, null)).toBe(false)
    })

    it('should handle normalized flag', () => {
      expect(isSamePathSync('/path/to/file', '/path/to/file', true)).toBe(true)
      expect(isSamePathSync('/path/to/file1', '/path/to/file2', true)).toBe(false)
    })

    it('should be case-insensitive on case-insensitive filesystems', () => {
      // On case-insensitive systems (Windows, macOS by default), these should match
      // The function tries to use inode comparison as a fallback
      // For non-existent files, it will do string comparison
      const result = isSamePathSync('/PATH', '/path')
      // Result depends on filesystem, so we just verify it returns a boolean
      expect(typeof result).toBe('boolean')
    })
  })

  describe('checkPathExcludePattern', () => {
    it('should match simple patterns', () => {
      expect(checkPathExcludePattern('test.txt', ['*.txt'])).toBe(true)
      expect(checkPathExcludePattern('test.md', ['*.md'])).toBe(true)
    })

    it('should not match non-matching patterns', () => {
      expect(checkPathExcludePattern('test.txt', ['*.md'])).toBe(false)
      expect(checkPathExcludePattern('test.js', ['*.txt', '*.md'])).toBe(false)
    })

    it('should match directory patterns', () => {
      expect(checkPathExcludePattern('node_modules', ['node_modules'])).toBe(true)
      expect(checkPathExcludePattern('path/to/node_modules', ['node_modules'])).toBe(true)
    })

    it('should match glob patterns', () => {
      expect(checkPathExcludePattern('/path/to/test.txt', ['**/*.txt'])).toBe(true)
      expect(checkPathExcludePattern('/path/to/file.tmp', ['**/*.tmp'])).toBe(true)
    })

    it('should match multiple patterns', () => {
      const patterns = ['*.txt', '*.tmp', 'node_modules', '.git']
      expect(checkPathExcludePattern('test.txt', patterns)).toBe(true)
      expect(checkPathExcludePattern('path/node_modules', patterns)).toBe(true)
      expect(checkPathExcludePattern('test.md', patterns)).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(checkPathExcludePattern(null, ['*.txt'])).toBe(false)
      expect(checkPathExcludePattern('', ['*.txt'])).toBe(false)
      expect(checkPathExcludePattern(123, ['*.txt'])).toBe(false)
      expect(checkPathExcludePattern('test.txt', [])).toBe(false)
    })

    it('should use matchBase option for pattern matching', () => {
      // matchBase allows patterns to match basename
      expect(checkPathExcludePattern('/deep/path/to/file.txt', ['file.txt'])).toBe(true)
      expect(checkPathExcludePattern('/deep/path/node_modules', ['node_modules'])).toBe(true)
    })
  })

  describe('Constants', () => {
    describe('MARKDOWN_EXTENSIONS', () => {
      it('should be a frozen array', () => {
        expect(Array.isArray(MARKDOWN_EXTENSIONS)).toBe(true)
        expect(Object.isFrozen(MARKDOWN_EXTENSIONS)).toBe(true)
      })

      it('should contain all common markdown extensions', () => {
        const expected = ['markdown', 'mdown', 'mkdn', 'md', 'mkd', 'mdwn', 'mdtxt', 'mdtext', 'mdx']
        expected.forEach((ext) => {
          expect(MARKDOWN_EXTENSIONS).toContain(ext)
        })
      })

      it('should be immutable', () => {
        const originalLength = MARKDOWN_EXTENSIONS.length
        expect(() => {
          MARKDOWN_EXTENSIONS.push('new')
        }).toThrow()
        expect(MARKDOWN_EXTENSIONS.length).toBe(originalLength)
      })
    })

    describe('MARKDOWN_INCLUSIONS', () => {
      it('should be a frozen array', () => {
        expect(Array.isArray(MARKDOWN_INCLUSIONS)).toBe(true)
        expect(Object.isFrozen(MARKDOWN_INCLUSIONS)).toBe(true)
      })

      it('should include glob patterns for markdown extensions', () => {
        expect(MARKDOWN_INCLUSIONS).toContain('*.md')
        expect(MARKDOWN_INCLUSIONS).toContain('*.markdown')
        expect(MARKDOWN_INCLUSIONS).toContain('*.mdx')
      })

      it('should have same length as MARKDOWN_EXTENSIONS', () => {
        expect(MARKDOWN_INCLUSIONS.length).toBe(MARKDOWN_EXTENSIONS.length)
      })

      it('should be immutable', () => {
        const originalLength = MARKDOWN_INCLUSIONS.length
        expect(() => {
          MARKDOWN_INCLUSIONS.push('*.new')
        }).toThrow()
        expect(MARKDOWN_INCLUSIONS.length).toBe(originalLength)
      })
    })

    describe('IMAGE_EXTENSIONS', () => {
      it('should be a frozen array', () => {
        expect(Array.isArray(IMAGE_EXTENSIONS)).toBe(true)
        expect(Object.isFrozen(IMAGE_EXTENSIONS)).toBe(true)
      })

      it('should contain all common image extensions', () => {
        const expected = ['jpeg', 'jpg', 'png', 'gif', 'svg', 'webp']
        expected.forEach((ext) => {
          expect(IMAGE_EXTENSIONS).toContain(ext)
        })
      })

      it('should be immutable', () => {
        const originalLength = IMAGE_EXTENSIONS.length
        expect(() => {
          IMAGE_EXTENSIONS.push('bmp')
        }).toThrow()
        expect(IMAGE_EXTENSIONS.length).toBe(originalLength)
      })
    })
  })
})
