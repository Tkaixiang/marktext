import { describe, it, expect } from 'vitest'
import { ENCODING_NAME_MAP, getEncodingName } from '../../src/common/encoding.js'

describe('Encoding Utilities', () => {
  describe('ENCODING_NAME_MAP', () => {
    it('should be a frozen object', () => {
      expect(typeof ENCODING_NAME_MAP).toBe('object')
      expect(Object.isFrozen(ENCODING_NAME_MAP)).toBe(true)
    })

    it('should contain UTF-8 encoding', () => {
      expect(ENCODING_NAME_MAP.utf8).toBe('UTF-8')
    })

    it('should contain UTF-16 encodings', () => {
      expect(ENCODING_NAME_MAP.utf16be).toBe('UTF-16 BE')
      expect(ENCODING_NAME_MAP.utf16le).toBe('UTF-16 LE')
    })

    it('should contain UTF-32 encodings', () => {
      expect(ENCODING_NAME_MAP.utf32be).toBe('UTF-32 BE')
      expect(ENCODING_NAME_MAP.utf32le).toBe('UTF-32 LE')
    })

    it('should contain Western encodings', () => {
      expect(ENCODING_NAME_MAP.ascii).toBe('Western (ISO 8859-1)')
      expect(ENCODING_NAME_MAP.latin3).toBe('Western (ISO 8859-3)')
      expect(ENCODING_NAME_MAP.iso885915).toBe('Western (ISO 8859-15)')
      expect(ENCODING_NAME_MAP.cp1252).toBe('Western (Windows 1252)')
    })

    it('should contain Arabic encodings', () => {
      expect(ENCODING_NAME_MAP.arabic).toBe('Arabic (ISO 8859-6)')
      expect(ENCODING_NAME_MAP.cp1256).toBe('Arabic (Windows 1256)')
    })

    it('should contain Baltic encodings', () => {
      expect(ENCODING_NAME_MAP.latin4).toBe('Baltic (ISO 8859-4)')
      expect(ENCODING_NAME_MAP.cp1257).toBe('Baltic (Windows 1257)')
    })

    it('should contain Central European encodings', () => {
      expect(ENCODING_NAME_MAP.iso88592).toBe('Central European (ISO 8859-2)')
      expect(ENCODING_NAME_MAP.windows1250).toBe('Central European (Windows 1250)')
    })

    it('should contain Cyrillic encodings', () => {
      expect(ENCODING_NAME_MAP.cp866).toBe('Cyrillic (CP 866)')
      expect(ENCODING_NAME_MAP.iso88595).toBe('Cyrillic (ISO 8859-5)')
      expect(ENCODING_NAME_MAP.koi8r).toBe('Cyrillic (KOI8-R)')
      expect(ENCODING_NAME_MAP.koi8u).toBe('Cyrillic (KOI8-U)')
      expect(ENCODING_NAME_MAP.cp1251).toBe('Cyrillic (Windows 1251)')
    })

    it('should contain Greek encodings', () => {
      expect(ENCODING_NAME_MAP.greek).toBe('Greek (ISO 8859-7)')
      expect(ENCODING_NAME_MAP.cp1253).toBe('Greek (Windows 1253)')
    })

    it('should contain Hebrew encodings', () => {
      expect(ENCODING_NAME_MAP.hebrew).toBe('Hebrew (ISO 8859-8)')
      expect(ENCODING_NAME_MAP.cp1255).toBe('Hebrew (Windows 1255)')
    })

    it('should contain Turkish encodings', () => {
      expect(ENCODING_NAME_MAP.latin5).toBe('Turkish (ISO 8859-9)')
      expect(ENCODING_NAME_MAP.cp1254).toBe('Turkish (Windows 1254)')
    })

    it('should contain Chinese encodings', () => {
      expect(ENCODING_NAME_MAP.gb2312).toBe('Simplified Chinese (GB2312)')
      expect(ENCODING_NAME_MAP.gb18030).toBe('Simplified Chinese (GB18030)')
      expect(ENCODING_NAME_MAP.gbk).toBe('Simplified Chinese (GBK)')
      expect(ENCODING_NAME_MAP.big5).toBe('Traditional Chinese (Big5)')
      expect(ENCODING_NAME_MAP.big5hkscs).toBe('Traditional Chinese (Big5-HKSCS)')
    })

    it('should contain Japanese encodings', () => {
      expect(ENCODING_NAME_MAP.shiftjis).toBe('Japanese (Shift JIS)')
      expect(ENCODING_NAME_MAP.eucjp).toBe('Japanese (EUC-JP)')
    })

    it('should contain Korean encoding', () => {
      expect(ENCODING_NAME_MAP.euckr).toBe('Korean (EUC-KR)')
    })

    it('should contain Nordic encoding', () => {
      expect(ENCODING_NAME_MAP.latin6).toBe('Nordic (ISO 8859-10)')
    })

    it('should be immutable', () => {
      expect(() => {
        ENCODING_NAME_MAP.newEncoding = 'New'
      }).toThrow()
    })

    it('should have at least 37 encodings', () => {
      const encodingCount = Object.keys(ENCODING_NAME_MAP).length
      expect(encodingCount).toBeGreaterThanOrEqual(37)
    })
  })

  describe('getEncodingName', () => {
    it('should return encoding name from map', () => {
      const enc = { encoding: 'utf8', isBom: false }
      expect(getEncodingName(enc)).toBe('UTF-8')
    })

    it('should return encoding name with BOM suffix when isBom is true', () => {
      const enc = { encoding: 'utf8', isBom: true }
      expect(getEncodingName(enc)).toBe('UTF-8 with BOM')
    })

    it('should handle UTF-16 encodings', () => {
      const enc1 = { encoding: 'utf16be', isBom: false }
      const enc2 = { encoding: 'utf16le', isBom: false }

      expect(getEncodingName(enc1)).toBe('UTF-16 BE')
      expect(getEncodingName(enc2)).toBe('UTF-16 LE')
    })

    it('should handle UTF-16 with BOM', () => {
      const enc = { encoding: 'utf16le', isBom: true }
      expect(getEncodingName(enc)).toBe('UTF-16 LE with BOM')
    })

    it('should return original encoding if not in map', () => {
      const enc = { encoding: 'unknown-encoding', isBom: false }
      expect(getEncodingName(enc)).toBe('unknown-encoding')
    })

    it('should add BOM suffix to unknown encodings', () => {
      const enc = { encoding: 'custom', isBom: true }
      expect(getEncodingName(enc)).toBe('custom with BOM')
    })

    it('should handle all Western encodings', () => {
      const encodings = ['ascii', 'latin3', 'iso885915', 'cp1252']
      encodings.forEach((encoding) => {
        const enc = { encoding, isBom: false }
        const name = getEncodingName(enc)
        expect(name).toContain('Western')
      })
    })

    it('should handle all Chinese encodings', () => {
      const simplifiedEncodings = ['gb2312', 'gb18030', 'gbk']
      simplifiedEncodings.forEach((encoding) => {
        const enc = { encoding, isBom: false }
        const name = getEncodingName(enc)
        expect(name).toContain('Simplified Chinese')
      })

      const traditionalEncodings = ['big5', 'big5hkscs']
      traditionalEncodings.forEach((encoding) => {
        const enc = { encoding, isBom: false }
        const name = getEncodingName(enc)
        expect(name).toContain('Traditional Chinese')
      })
    })

    it('should handle Japanese encodings', () => {
      const japaneseEncodings = ['shiftjis', 'eucjp']
      japaneseEncodings.forEach((encoding) => {
        const enc = { encoding, isBom: false }
        const name = getEncodingName(enc)
        expect(name).toContain('Japanese')
      })
    })

    it('should handle Korean encoding', () => {
      const enc = { encoding: 'euckr', isBom: false }
      expect(getEncodingName(enc)).toBe('Korean (EUC-KR)')
    })

    it('should handle BOM variations', () => {
      const enc1 = { encoding: 'utf8', isBom: false }
      const enc2 = { encoding: 'utf8', isBom: true }

      const name1 = getEncodingName(enc1)
      const name2 = getEncodingName(enc2)

      expect(name1).toBe('UTF-8')
      expect(name2).toBe('UTF-8 with BOM')
      expect(name2).toContain(name1)
    })

    it('should not add duplicate BOM suffixes', () => {
      const enc = { encoding: 'utf8', isBom: true }
      const name = getEncodingName(enc)

      // Should contain ' with BOM' exactly once
      const bomCount = (name.match(/with BOM/g) || []).length
      expect(bomCount).toBe(1)
    })
  })

  describe('Encoding Coverage', () => {
    it('should cover major encoding families', () => {
      const families = {
        'UTF': ['utf8', 'utf16be', 'utf16le', 'utf32be', 'utf32le'],
        'Western': ['ascii', 'latin3', 'iso885915', 'cp1252'],
        'Cyrillic': ['cp866', 'iso88595', 'koi8r', 'koi8u', 'cp1251'],
        'Arabic': ['arabic', 'cp1256'],
        'Chinese': ['gb2312', 'gb18030', 'gbk', 'big5', 'big5hkscs'],
        'Japanese': ['shiftjis', 'eucjp'],
        'Korean': ['euckr']
      }

      Object.entries(families).forEach(([family, encodings]) => {
        encodings.forEach((encoding) => {
          expect(ENCODING_NAME_MAP[encoding]).toBeTruthy()
        })
      })
    })

    it('should have human-readable names for all encodings', () => {
      Object.values(ENCODING_NAME_MAP).forEach((name) => {
        expect(typeof name).toBe('string')
        expect(name.length).toBeGreaterThan(0)
        // Should contain either a region/language or technical specification
        expect(
          name.includes('(') || name.includes('UTF') || name.includes('ASCII')
        ).toBe(true)
      })
    })
  })
})
