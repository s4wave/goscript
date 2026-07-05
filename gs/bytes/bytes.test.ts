import * as $ from '@goscript/builtin/index.js'
import { Clone, IndexFunc, Replace } from './index.js'
import { describe, expect, test } from 'vitest'

const rep = (s: string, old: string, n: string, count: number): string =>
  $.bytesToString(
    Replace(
      $.stringToBytes(s),
      $.stringToBytes(old),
      $.stringToBytes(n),
      count,
    ),
  )

describe('bytes', () => {
  test('Replace with empty old appends the untouched remainder', () => {
    // Go: bytes.Replace([]byte("abc"), []byte(""), []byte("-"), 2) => "-a-bc".
    expect(rep('abc', '', '-', 2)).toBe('-a-bc')
    expect(rep('abc', '', '-', -1)).toBe('-a-b-c-')
    expect(rep('aaa', 'a', 'b', -1)).toBe('bbb')
  })

  test('Clone preserves nil and gives non-nil bytes independent storage', () => {
    expect(Clone(null)).toBeNull()

    const empty = Clone(new Uint8Array(0))
    expect(empty).not.toBeNull()
    expect($.len(empty)).toBe(0)

    const source = $.stringToBytes('abc')
    const cloned = Clone(source)
    if (cloned === null) {
      throw new Error('Clone returned nil for non-nil input')
    }

    expect($.bytesToString(cloned)).toBe('abc')

    source[0] = 0x7a
    expect($.bytesToString(source)).toBe('zbc')
    expect($.bytesToString(cloned)).toBe('abc')

    cloned[1] = 0x79
    expect($.bytesToString(cloned)).toBe('ayc')
    expect($.bytesToString(source)).toBe('zbc')
  })

  test('IndexFunc accepts generated async-shaped callbacks', () => {
    const predicate: (r: number) => boolean | Promise<boolean> = (r) =>
      r === 0x62

    expect(IndexFunc($.stringToBytes('abc'), predicate)).toBe(1)
  })

  test('IndexFunc rejects actual async callback results', () => {
    expect(() =>
      IndexFunc($.stringToBytes('abc'), async (r) => r === 0x62),
    ).toThrow('bytes: asynchronous callback result is not supported')
  })
})
