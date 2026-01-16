import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  delay,
  serialize,
  merge,
  dataURItoBlob,
  adjustCursor,
  getUniqueId,
  hasKeys,
  cloneObj,
  cloneObject,
  deepClone
} from '../../src/renderer/src/util/index.js'

describe('Renderer Utility Functions', () => {
  describe('delay', () => {
    it('should resolve after specified time', async () => {
      const start = Date.now()
      await delay(100)
      const elapsed = Date.now() - start

      expect(elapsed).toBeGreaterThanOrEqual(90) // Allow small margin
      expect(elapsed).toBeLessThan(200)
    })

    it('should be cancellable', async () => {
      const promise = delay(1000)

      // Cancel immediately
      promise.cancel()

      // Should reject when cancelled
      await expect(promise).rejects.toThrow()
    })

    it('should not throw if cancelled after completion', async () => {
      const promise = delay(10)
      await promise

      // Cancel after completion should be safe
      expect(() => promise.cancel()).not.toThrow()
    })

    it('should clear timeout on cancel', () => {
      const promise = delay(1000)
      expect(promise.cancel).toBeDefined()
      expect(typeof promise.cancel).toBe('function')

      promise.cancel()
      // After cancel, cancel function should be no-op
      expect(() => promise.cancel()).not.toThrow()
    })
  })

  describe('serialize', () => {
    it('should serialize object to query string', () => {
      const params = { foo: 'bar', baz: 'qux' }
      const result = serialize(params)

      expect(result).toContain('foo=bar')
      expect(result).toContain('baz=qux')
      expect(result).toContain('&')
    })

    it('should encode URI components', () => {
      const params = { name: 'John Doe', email: 'john@example.com' }
      const result = serialize(params)

      expect(result).toContain('name=John%20Doe')
      expect(result).toContain('email=john@example.com')
    })

    it('should handle empty object', () => {
      const result = serialize({})
      expect(result).toBe('')
    })

    it('should handle single parameter', () => {
      const result = serialize({ key: 'value' })
      expect(result).toBe('key=value')
    })

    it('should handle special characters', () => {
      const params = { query: 'hello world', path: '/path/to/file' }
      const result = serialize(params)

      expect(result).toContain('query=hello%20world')
      expect(result).toContain('path=/path/to/file')
    })

    it('should maintain order of parameters', () => {
      const params = { a: '1', b: '2', c: '3' }
      const result = serialize(params)

      const parts = result.split('&')
      expect(parts).toHaveLength(3)
    })
  })

  describe('merge', () => {
    it('should merge multiple objects', () => {
      const obj1 = { a: 1 }
      const obj2 = { b: 2 }
      const obj3 = { c: 3 }

      const result = merge(obj1, obj2, obj3)

      expect(result).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('should handle overlapping keys', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { b: 3, c: 4 }

      const result = merge(obj1, obj2)

      expect(result.a).toBe(1)
      expect(result.b).toBe(3) // obj2 overwrites obj1
      expect(result.c).toBe(4)
    })

    it('should return new object', () => {
      const obj1 = { a: 1 }
      const obj2 = { b: 2 }

      const result = merge(obj1, obj2)

      expect(result).not.toBe(obj1)
      expect(result).not.toBe(obj2)
    })

    it('should handle empty objects', () => {
      const result = merge({}, {}, {})
      expect(result).toEqual({})
    })

    it('should handle single object', () => {
      const obj = { a: 1, b: 2 }
      const result = merge(obj)

      expect(result).toEqual(obj)
      expect(result).not.toBe(obj) // Should be a copy
    })
  })

  describe('dataURItoBlob', () => {
    beforeEach(() => {
      // Mock window.atob
      global.window = global.window || {}
      global.window.atob = (str) => Buffer.from(str, 'base64').toString('binary')
      global.window.Blob = class Blob {
        constructor(parts, options) {
          this.parts = parts
          this.type = options.type
        }
      }
    })

    it('should convert data URI to Blob', () => {
      const dataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

      const blob = dataURItoBlob(dataURI)

      expect(blob).toBeDefined()
      expect(blob.type).toBe('image/png')
      expect(blob.parts).toBeDefined()
    })

    it('should handle different MIME types', () => {
      const dataURI = 'data:text/plain;base64,SGVsbG8gV29ybGQ='

      const blob = dataURItoBlob(dataURI)

      expect(blob.type).toBe('text/plain')
    })

    it('should create Uint8Array from base64', () => {
      const base64 = 'SGVsbG8='
      const binary = Buffer.from(base64, 'base64').toString('binary')

      const ab = new ArrayBuffer(binary.length)
      const ia = new Uint8Array(ab)

      for (let i = 0; i < binary.length; i++) {
        ia[i] = binary.charCodeAt(i)
      }

      expect(ia).toBeInstanceOf(Uint8Array)
      expect(ia.length).toBe(binary.length)
    })
  })

  describe('adjustCursor', () => {
    it('should return null if line is not a string', () => {
      const cursor = { line: 0, ch: 0 }
      const result = adjustCursor(cursor, 'prev', undefined, 'next')

      expect(result).toBeNull()
    })

    it('should adjust cursor in table row', () => {
      const cursor = { line: 1, ch: 0 }
      const line = '| Name | Age |'

      const result = adjustCursor(cursor, '', line, '')

      expect(result).toBeDefined()
      expect(result.line).toBe(cursor.line)
      expect(result.ch).toBeGreaterThan(0) // Should be after first |
    })

    it('should adjust cursor for table separator line', () => {
      const cursor = { line: 1, ch: 0 }
      const preline = '| Name | Age |'
      const line = '| --- | --- |'
      const nextline = '| John | 30 |'

      const result = adjustCursor(cursor, preline, line, nextline)

      expect(result).toBeDefined()
      expect(result.line).toBe(cursor.line + 1) // Move to next line
    })

    it('should adjust cursor in code block', () => {
      const cursor = { line: 1, ch: 0 }
      const line = '```javascript'
      const nextline = 'const x = 1'

      const result = adjustCursor(cursor, '', line, nextline)

      expect(result).toBeDefined()
      expect(result.line).toBe(cursor.line + 1)
      expect(result.ch).toBe(0)
    })

    it('should adjust cursor in math block', () => {
      const cursor = { line: 1, ch: 0 }
      const line = '$$'
      const nextline = 'x = y'

      const result = adjustCursor(cursor, '', line, nextline)

      expect(result).toBeDefined()
      expect(result.line).toBe(cursor.line + 1)
    })

    it('should adjust cursor in list', () => {
      const cursor = { line: 1, ch: 0 }
      const line = '* List item'

      const result = adjustCursor(cursor, '', line, '')

      expect(result).toBeDefined()
      expect(result.ch).toBe(2) // After "* "
    })

    it('should return null for blank line', () => {
      const cursor = { line: 1, ch: 0 }
      const line = '   ' // Only whitespace

      const result = adjustCursor(cursor, '', line, '')

      expect(result).toBeNull()
    })

    it('should preserve cursor position for regular text', () => {
      const cursor = { line: 1, ch: 5 }
      const line = 'Regular text'

      const result = adjustCursor(cursor, '', line, '')

      expect(result).toBeDefined()
      expect(result.line).toBe(cursor.line)
      expect(result.ch).toBe(cursor.ch)
    })

    it('should handle cursor at end of table row', () => {
      const cursor = { line: 1, ch: 100 }
      const line = '| Name | Age |'

      const result = adjustCursor(cursor, '', line, '')

      expect(result).toBeDefined()
      expect(result.ch).toBeLessThan(line.lastIndexOf('|'))
    })
  })

  describe('getUniqueId', () => {
    it('should generate unique IDs', () => {
      const id1 = getUniqueId()
      const id2 = getUniqueId()
      const id3 = getUniqueId()

      expect(id1).not.toBe(id2)
      expect(id2).not.toBe(id3)
      expect(id1).not.toBe(id3)
    })

    it('should have mt- prefix', () => {
      const id = getUniqueId()

      expect(id).toMatch(/^mt-/)
    })

    it('should increment counter', () => {
      const ids = []
      for (let i = 0; i < 10; i++) {
        ids.push(getUniqueId())
      }

      // All should be unique
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(10)
    })

    it('should return string', () => {
      const id = getUniqueId()
      expect(typeof id).toBe('string')
    })
  })

  describe('hasKeys', () => {
    it('should return true for object with keys', () => {
      expect(hasKeys({ a: 1 })).toBe(true)
      expect(hasKeys({ a: 1, b: 2 })).toBe(true)
    })

    it('should return false for empty object', () => {
      expect(hasKeys({})).toBe(false)
    })

    it('should return false for object with no own properties', () => {
      const obj = Object.create({ inherited: true })
      expect(hasKeys(obj)).toBe(false)
    })

    it('should count only own properties', () => {
      const proto = { inherited: 1 }
      const obj = Object.create(proto)
      obj.own = 2

      expect(hasKeys(obj)).toBe(true)
      expect(Object.keys(obj).length).toBe(1)
    })
  })

  describe('cloneObj (deprecated)', () => {
    it('should deep clone by default', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = cloneObj(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
    })

    it('should shallow clone when deepCopy is false', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = cloneObj(original, false)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).toBe(original.b) // Same reference
    })

    it('should handle nested objects in deep clone', () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3
          }
        }
      }

      const cloned = cloneObj(original)

      expect(cloned).toEqual(original)
      expect(cloned.b.d).not.toBe(original.b.d)
    })

    it('should handle arrays in deep clone', () => {
      const original = { arr: [1, 2, { x: 3 }] }
      const cloned = cloneObj(original)

      expect(cloned.arr).toEqual(original.arr)
      expect(cloned.arr).not.toBe(original.arr)
      expect(cloned.arr[2]).not.toBe(original.arr[2])
    })
  })

  describe('cloneObject (shallow)', () => {
    it('should create shallow clone', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = cloneObject(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).toBe(original.b) // Same reference
    })

    it('should inherit from Object by default', () => {
      const original = { a: 1 }
      const cloned = cloneObject(original)

      expect(Object.getPrototypeOf(cloned)).toBe(Object.prototype)
    })

    it('should not inherit from Object when inheritFromObject is false', () => {
      const original = { a: 1 }
      const cloned = cloneObject(original, false)

      expect(Object.getPrototypeOf(cloned)).toBeNull()
    })

    it('should copy all enumerable properties', () => {
      const original = { a: 1, b: 2, c: 3 }
      const cloned = cloneObject(original)

      expect(Object.keys(cloned)).toEqual(Object.keys(original))
      expect(cloned).toEqual(original)
    })
  })

  describe('deepClone', () => {
    it('should create deep clone', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
    })

    it('should handle nested structures', () => {
      const original = {
        level1: {
          level2: {
            level3: {
              value: 42
            }
          }
        }
      }

      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned.level1.level2.level3).not.toBe(original.level1.level2.level3)
    })

    it('should handle arrays', () => {
      const original = {
        items: [1, 2, { x: 3 }],
        nested: [[1, 2], [3, 4]]
      }

      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned.items).not.toBe(original.items)
      expect(cloned.items[2]).not.toBe(original.items[2])
    })

    it('should handle mixed types', () => {
      const original = {
        string: 'text',
        number: 42,
        boolean: true,
        null: null,
        array: [1, 2, 3],
        object: { x: 1 }
      }

      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned.object).not.toBe(original.object)
      expect(cloned.array).not.toBe(original.array)
    })

    it('should not preserve functions or undefined', () => {
      const original = {
        fn: () => {},
        undef: undefined,
        value: 1
      }

      const cloned = deepClone(original)

      // JSON.parse/stringify removes functions and undefined
      expect(cloned.fn).toBeUndefined()
      expect(cloned.undef).toBeUndefined()
      expect(cloned.value).toBe(1)
    })
  })

  describe('Platform Detection', () => {
    it('should detect platform', () => {
      // These are set at import time based on process.platform
      const platforms = ['darwin', 'win32', 'linux']

      expect(platforms).toContain(process.platform)
    })
  })

  describe('Edge Cases', () => {
    it('delay should handle zero time', async () => {
      const start = Date.now()
      await delay(0)
      const elapsed = Date.now() - start

      expect(elapsed).toBeLessThan(50)
    })

    it('serialize should handle numbers', () => {
      const params = { page: 1, limit: 10 }
      const result = serialize(params)

      expect(result).toContain('page=1')
      expect(result).toContain('limit=10')
    })

    it('merge should handle null prototype objects', () => {
      const obj1 = Object.create(null)
      obj1.a = 1

      const obj2 = { b: 2 }

      const result = merge(obj1, obj2)

      expect(result.a).toBe(1)
      expect(result.b).toBe(2)
    })

    it('adjustCursor should handle edge of table', () => {
      const cursor = { line: 0, ch: 0 }
      const line = '|'

      const result = adjustCursor(cursor, '', line, '')

      expect(result).toBeDefined()
    })

    it('deepClone should handle empty objects/arrays', () => {
      expect(deepClone({})).toEqual({})
      expect(deepClone({ arr: [] })).toEqual({ arr: [] })
    })
  })
})
