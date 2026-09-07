import { afterEach, describe, expect, test, vi } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as io from '@goscript/io/index.js'

import {
  BestCompression,
  BestSpeed,
  DefaultCompression,
  ErrHeader,
  HuffmanOnly,
  NewReader,
  NewWriter,
  NewWriterLevel,
  NoCompression,
} from './index.js'

describe('compress/gzip override', () => {
  test('exports flate compression level constants', () => {
    expect(NoCompression).toBe(0)
    expect(BestSpeed).toBe(1)
    expect(BestCompression).toBe(9)
    expect(DefaultCompression).toBe(-1)
    expect(HuffmanOnly).toBe(-2)
  })

  test('rejects invalid compression levels', () => {
    const buf = $.markAsStructValue(new bytes.Buffer())

    expect(NewWriterLevel(buf, HuffmanOnly)[1]).toBeNull()
    expect(NewWriterLevel(buf, BestCompression)[1]).toBeNull()
    expect(NewWriterLevel(buf, HuffmanOnly - 1)[1]?.Error()).toBe(
      'gzip: invalid compression level: -3',
    )
    expect(NewWriterLevel(buf, BestCompression + 1)[1]?.Error()).toBe(
      'gzip: invalid compression level: 10',
    )
  })

  test('round trips bytes through writer and reader', async () => {
    const input = $.stringToBytes('hello gzip world')
    const buf = $.markAsStructValue(new bytes.Buffer())
    const writer = NewWriter(buf)

    const [written, writeErr] = writer.Write(input)
    expect(writeErr).toBeNull()
    expect(written).toBe(input.length)
    expect(await writer.Close()).toBeNull()

    const [reader, readerErr] = NewReader(bytes.NewReader(buf.Bytes()))
    expect(readerErr).toBeNull()
    expect(reader).not.toBeNull()

    const [out, readErr] = await io.ReadAll(reader!)
    expect(readErr).toBeNull()
    expect($.bytesToString(out)).toBe('hello gzip world')
  })

  test('reader collects bulk input in chunks', async () => {
    const input = $.makeSlice<number>(128 * 1024, undefined, 'byte')
    let state = 0x12345678
    for (let idx = 0; idx < input.length; idx++) {
      state ^= state << 13
      state ^= state >>> 17
      state ^= state << 5
      input[idx] = state & 0xff
    }

    const compressed = $.markAsStructValue(new bytes.Buffer())
    const writer = NewWriter(compressed)
    expect(writer.Write(input)[1]).toBeNull()
    expect(await writer.Close()).toBeNull()

    const source = bytes.NewReader(compressed.Bytes())
    let readCalls = 0
    const observedReader = {
      Read(p: $.Bytes): [number, $.GoError] {
        readCalls++
        return source.Read(p)
      },
    }

    const [reader, readerErr] = NewReader(observedReader as io.Reader)
    expect(readerErr).toBeNull()
    const [out, readErr] = await io.ReadAll(reader!)
    expect(readErr).toBeNull()
    expect($.bytesToUint8Array(out)).toEqual($.bytesToUint8Array(input))
    expect(readCalls).toBeLessThanOrEqual(6)
  })

  test('reader reset accepts async generated readers', async () => {
    const compressed = $.markAsStructValue(new bytes.Buffer())
    const writer = NewWriter(compressed)
    expect(writer.Write($.stringToBytes('async gzip source'))[1]).toBeNull()
    expect(await writer.Close()).toBeNull()

    const source = bytes.NewReader(compressed.Bytes())
    const asyncReader = {
      async Read(p: $.Bytes): Promise<[number, $.GoError]> {
        await Promise.resolve()
        return source.Read(p)
      },
    }

    const [reader, readerErr] = NewReader(asyncReader as io.Reader)
    expect(readerErr).toBeNull()
    const [out, readErr] = await io.ReadAll(reader!)
    expect(readErr).toBeNull()
    expect($.bytesToString(out)).toBe('async gzip source')
  })

  test('invalid gzip bytes return ErrHeader', () => {
    const [reader, err] = NewReader(bytes.NewReader($.stringToBytes('plain')))
    expect(reader).toBeNull()
    expect(err).toBe(ErrHeader)
  })

  describe('native compression streams', () => {
    afterEach(() => vi.unstubAllGlobals())

    test('round trips owned writer bytes through an async reader', async () => {
      vi.stubGlobal('process', { ...process, getBuiltinModule: undefined })
      const input = new Uint8Array(128 * 1024 + 2)
      let state = 0x12345678
      for (let index = 0; index < input.length; index++) {
        state ^= state << 13
        state ^= state >>> 17
        state ^= state << 5
        input[index] = state & 0xff
      }
      const payload = input.subarray(1, -1)
      const expected = payload.slice()
      const compressed = $.markAsStructValue(new bytes.Buffer())
      const writer = NewWriter(compressed)
      expect(writer.Write(payload)).toEqual([payload.length, null])
      payload.fill(0)
      expect(await writer.Close()).toBeNull()

      const source = bytes.NewReader(compressed.Bytes())
      const [reader, readerErr] = NewReader({
        async Read(p: $.Bytes): Promise<[number, $.GoError]> {
          return source.Read(p)
        },
      })
      expect(readerErr).toBeNull()
      const [output, readErr] = await io.ReadAll(reader!)
      expect(readErr).toBeNull()
      expect($.bytesToUint8Array(output)).toEqual(expected)
    })

    test('reports invalid compressed input through Read', async () => {
      vi.stubGlobal('process', { ...process, getBuiltinModule: undefined })
      const [reader, readerErr] = NewReader(
        bytes.NewReader($.stringToBytes('plain')),
      )
      expect(readerErr).toBeNull()
      const [output, readErr] = await io.ReadAll(reader!)
      expect($.len(output)).toBe(0)
      expect(readErr).toBe(ErrHeader)
    })
  })
})
