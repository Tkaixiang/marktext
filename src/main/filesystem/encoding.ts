// @ts-ignore
import ced from 'ced'

const CED_ICONV_ENCODINGS: Record<string, string> = {
  'BIG5-CP950': 'big5',
  KSC: 'euckr',
  'ISO-2022-KR': 'euckr',
  GB: 'gb2312',
  ISO_2022_CN: 'gb2312',

  Unicode: 'utf8',

  // Map ASCII, subsets of utf-8 to UTF-8,
  JIS: 'utf8',
  SJS: 'utf8',
  shiftjis: 'utf8',
  'ASCII-7-bit': 'utf8',
  ASCII: 'utf8',
  MACINTOSH: 'utf8'
}

// Byte Order Mark's to detect endianness and encoding.
const BOM_ENCODINGS: Record<string, number[]> = {
  utf8: [0xef, 0xbb, 0xbf],
  utf16be: [0xfe, 0xff],
  utf16le: [0xff, 0xfe]
}

const checkSequence = (buffer: Buffer, sequence: number[]) => {
  if (buffer.length < sequence.length) {
    return false
  }
  return sequence.every((v, i) => v === buffer[i])
}

export interface Encoding {
  encoding: string
  isBom: boolean
}

/**
 * Guess the encoding from the buffer.
 *
 * @param {Buffer} buffer
 * @param {boolean} autoGuessEncoding
 * @returns {Encoding}
 */
export const guessEncoding = (buffer: Buffer, autoGuessEncoding: boolean): Encoding => {
  let isBom = false
  let encoding = 'utf8'

  // Detect UTF8- and UTF16-BOM encodings.
  for (const [key, value] of Object.entries(BOM_ENCODINGS)) {
    if (checkSequence(buffer, value)) {
      return { encoding: key, isBom: true }
    }
  }

  // // Try to detect binary files. Text files should not containt four 0x00 characters.
  // let zeroSeenCounter = 0
  // for (let i = 0; i < Math.min(buffer.byteLength, 256); ++i) {
  //   if (buffer[i] === 0x00) {
  //     if (zeroSeenCounter >= 3) {
  //       return { encoding: 'binary', isBom: false }
  //     }
  //     zeroSeenCounter++
  //   } else {
  //     zeroSeenCounter = 0
  //   }
  // }

  // Auto guess encoding, otherwise use UTF8.
  if (autoGuessEncoding) {
    encoding = ced(buffer)
    if (CED_ICONV_ENCODINGS[encoding]) {
      encoding = CED_ICONV_ENCODINGS[encoding]!
    } else {
      encoding = encoding.toLowerCase().replace(/-_/g, '')
    }
  }
  return { encoding, isBom }
}
