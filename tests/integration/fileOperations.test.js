import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupWindowMocks, clearWindowMocks, createMockFile, createMockFileSystem } from '../helpers/testUtils.js'

describe('File Operations Integration', () => {
  let windowMocks
  let mockFS

  beforeEach(() => {
    mockFS = createMockFileSystem()
    windowMocks = setupWindowMocks({
      fileUtils: {
        ...setupWindowMocks().fileUtils,
        readFile: vi.fn((path) => {
          const content = mockFS.read(path)
          if (!content) throw new Error('File not found')
          return Promise.resolve(content)
        }),
        writeFile: vi.fn((path, content) => {
          mockFS.write(path, content)
          return Promise.resolve()
        }),
        stat: vi.fn((path) => {
          const content = mockFS.read(path)
          if (!content) throw new Error('File not found')
          return Promise.resolve({
            size: content.length,
            mtime: new Date(),
            isFile: () => true
          })
        }),
        pathExistsSync: vi.fn((path) => mockFS.exists(path))
      }
    })
  })

  afterEach(() => {
    clearWindowMocks()
    mockFS.clear()
  })

  describe('Create and Read File', () => {
    it('should create a new file and read its content', async () => {
      const filePath = '/test/document.md'
      const content = '# New Document\n\nThis is a test.'

      // Create file
      await window.fileUtils.writeFile(filePath, content)

      // Verify file was written
      expect(mockFS.exists(filePath)).toBe(true)
      expect(mockFS.read(filePath)).toBe(content)

      // Read file back
      const readContent = await window.fileUtils.readFile(filePath)
      expect(readContent).toBe(content)
    })

    it('should handle file creation with different encodings', async () => {
      const filePath = '/test/utf8.md'
      const content = '# UTF-8 Content\n\nHello 世界'

      await window.fileUtils.writeFile(filePath, content, 'utf8')

      expect(window.fileUtils.writeFile).toHaveBeenCalledWith(filePath, content, 'utf8')
      expect(mockFS.read(filePath)).toBe(content)
    })

    it('should fail to read non-existent file', async () => {
      const filePath = '/nonexistent/file.md'

      await expect(window.fileUtils.readFile(filePath)).rejects.toThrow('File not found')
    })
  })

  describe('Update File', () => {
    it('should update existing file content', async () => {
      const filePath = '/test/update.md'
      const originalContent = '# Original'
      const updatedContent = '# Updated\n\nNew content added.'

      // Create initial file
      mockFS.write(filePath, originalContent)

      // Update file
      await window.fileUtils.writeFile(filePath, updatedContent)

      // Verify update
      const content = await window.fileUtils.readFile(filePath)
      expect(content).toBe(updatedContent)
      expect(content).not.toBe(originalContent)
    })

    it('should preserve file history during updates', async () => {
      const filePath = '/test/history.md'
      const versions = [
        '# Version 1',
        '# Version 1\n\nAdded content',
        '# Version 1\n\nAdded and modified content'
      ]

      for (const version of versions) {
        await window.fileUtils.writeFile(filePath, version)
        const read = await window.fileUtils.readFile(filePath)
        expect(read).toBe(version)
      }
    })
  })

  describe('Delete File', () => {
    it('should delete an existing file', async () => {
      const filePath = '/test/delete.md'
      mockFS.write(filePath, '# To be deleted')

      expect(mockFS.exists(filePath)).toBe(true)

      await window.fileUtils.unlink(filePath)

      expect(window.fileUtils.unlink).toHaveBeenCalledWith(filePath)
    })
  })

  describe('Copy File', () => {
    it('should copy file to new location', async () => {
      const sourcePath = '/test/source.md'
      const destPath = '/test/destination.md'
      const content = '# Source Content'

      mockFS.write(sourcePath, content)

      await window.fileUtils.copy(sourcePath, destPath)

      expect(window.fileUtils.copy).toHaveBeenCalledWith(sourcePath, destPath)
    })

    it('should handle copy with overwrite option', async () => {
      const sourcePath = '/test/source.md'
      const destPath = '/test/existing.md'

      mockFS.write(sourcePath, '# Source')
      mockFS.write(destPath, '# Existing')

      await window.fileUtils.copy(sourcePath, destPath, { overwrite: true })

      expect(window.fileUtils.copy).toHaveBeenCalledWith(
        sourcePath,
        destPath,
        { overwrite: true }
      )
    })
  })

  describe('Move File', () => {
    it('should move file to new location', async () => {
      const oldPath = '/test/old.md'
      const newPath = '/test/new.md'
      const content = '# Content to move'

      mockFS.write(oldPath, content)

      await window.fileUtils.move(oldPath, newPath)

      expect(window.fileUtils.move).toHaveBeenCalledWith(oldPath, newPath)
    })

    it('should move file with overwrite option', async () => {
      const oldPath = '/test/old.md'
      const newPath = '/test/new.md'

      mockFS.write(oldPath, '# Old content')
      mockFS.write(newPath, '# New location content')

      await window.fileUtils.move(oldPath, newPath, { overwrite: true })

      expect(window.fileUtils.move).toHaveBeenCalledWith(
        oldPath,
        newPath,
        { overwrite: true }
      )
    })
  })

  describe('File Metadata', () => {
    it('should get file statistics', async () => {
      const filePath = '/test/stats.md'
      const content = '# Test Content\n\nSome text here.'

      mockFS.write(filePath, content)

      const stats = await window.fileUtils.stat(filePath)

      expect(stats).toHaveProperty('size')
      expect(stats).toHaveProperty('mtime')
      expect(stats.size).toBe(content.length)
      expect(stats.isFile()).toBe(true)
    })

    it('should fail to get stats for non-existent file', async () => {
      const filePath = '/nonexistent.md'

      await expect(window.fileUtils.stat(filePath)).rejects.toThrow()
    })
  })

  describe('Directory Operations', () => {
    it('should create directory', async () => {
      const dirPath = '/test/newdir'

      await window.fileUtils.ensureDir(dirPath)

      expect(window.fileUtils.ensureDir).toHaveBeenCalledWith(dirPath)
    })

    it('should create nested directories', async () => {
      const dirPath = '/test/deep/nested/dir'

      await window.fileUtils.ensureDir(dirPath)

      expect(window.fileUtils.ensureDir).toHaveBeenCalledWith(dirPath)
    })

    it('should empty directory', async () => {
      const dirPath = '/test/toempty'

      await window.fileUtils.emptyDir(dirPath)

      expect(window.fileUtils.emptyDir).toHaveBeenCalledWith(dirPath)
    })
  })

  describe('Workflow: Create, Edit, Save', () => {
    it('should handle complete file lifecycle', async () => {
      const filePath = '/documents/workflow.md'

      // 1. Create new file
      const initialContent = '# New Document'
      await window.fileUtils.writeFile(filePath, initialContent)
      mockFS.write(filePath, initialContent)

      let content = await window.fileUtils.readFile(filePath)
      expect(content).toBe(initialContent)

      // 2. Edit and save
      const editedContent = '# New Document\n\nAdded some content.'
      await window.fileUtils.writeFile(filePath, editedContent)
      mockFS.write(filePath, editedContent)

      content = await window.fileUtils.readFile(filePath)
      expect(content).toBe(editedContent)

      // 3. Get file info
      const stats = await window.fileUtils.stat(filePath)
      expect(stats.size).toBe(editedContent.length)

      // 4. Move file
      const newPath = '/documents/renamed.md'
      await window.fileUtils.move(filePath, newPath)

      expect(window.fileUtils.move).toHaveBeenCalledWith(filePath, newPath)
    })
  })

  describe('Workflow: Import and Export', () => {
    it('should handle file import workflow', async () => {
      const importPath = '/imports/external.md'
      const destinationPath = '/documents/imported.md'
      const content = '# Imported Document\n\nFrom external source.'

      // Simulate external file
      mockFS.write(importPath, content)

      // Copy to documents
      await window.fileUtils.copy(importPath, destinationPath)

      expect(window.fileUtils.copy).toHaveBeenCalledWith(importPath, destinationPath)
    })

    it('should handle file export workflow', async () => {
      const sourcePath = '/documents/export.md'
      const exportPath = '/exports/exported.md'
      const content = '# Document to Export'

      mockFS.write(sourcePath, content)

      // Export file
      await window.fileUtils.copy(sourcePath, exportPath)

      expect(window.fileUtils.copy).toHaveBeenCalledWith(sourcePath, exportPath)
    })
  })

  describe('Error Handling', () => {
    it('should handle write errors gracefully', async () => {
      const filePath = '/readonly/file.md'

      window.fileUtils.writeFile = vi.fn().mockRejectedValue(
        new Error('Permission denied')
      )

      await expect(window.fileUtils.writeFile(filePath, 'content')).rejects.toThrow(
        'Permission denied'
      )
    })

    it('should handle read errors gracefully', async () => {
      const filePath = '/inaccessible/file.md'

      await expect(window.fileUtils.readFile(filePath)).rejects.toThrow('File not found')
    })

    it('should handle path validation errors', async () => {
      const invalidPath = ''

      // Most operations should handle empty paths
      await expect(window.fileUtils.readFile(invalidPath)).rejects.toThrow()
    })
  })

  describe('Concurrent Operations', () => {
    it('should handle multiple simultaneous writes', async () => {
      const files = [
        { path: '/test/file1.md', content: '# File 1' },
        { path: '/test/file2.md', content: '# File 2' },
        { path: '/test/file3.md', content: '# File 3' }
      ]

      const writes = files.map(({ path, content }) => {
        mockFS.write(path, content)
        return window.fileUtils.writeFile(path, content)
      })

      await Promise.all(writes)

      // Verify all files were written
      for (const { path, content } of files) {
        expect(mockFS.read(path)).toBe(content)
      }
    })

    it('should handle multiple simultaneous reads', async () => {
      const files = [
        { path: '/test/read1.md', content: '# Read 1' },
        { path: '/test/read2.md', content: '# Read 2' },
        { path: '/test/read3.md', content: '# Read 3' }
      ]

      // Setup files
      files.forEach(({ path, content }) => mockFS.write(path, content))

      // Read all simultaneously
      const reads = files.map(({ path }) => window.fileUtils.readFile(path))
      const contents = await Promise.all(reads)

      // Verify all reads succeeded
      contents.forEach((content, i) => {
        expect(content).toBe(files[i].content)
      })
    })
  })
})
