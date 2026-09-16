import { Buffer } from 'node:buffer'
import { constants, gunzipSync, inflateSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'
import * as time from '@goscript/time/index.js'
import * as gzip from './index.js'
import * as zlib from '../zlib/index.js'

function sink(async = false) {
  const chunks: Uint8Array[] = []
  return {
    chunks,
    Write(p: $.Bytes): io.Awaitable<io.IOResult> {
      const consume = (): io.IOResult => { chunks.push(new Uint8Array($.bytesToUint8Array(p))); return [$.len(p), null] }
      return async ? Promise.resolve().then(consume) : consume()
    },
    bytes: () => Buffer.concat(chunks),
  }
}

for (const [name, codec, decode] of [['gzip', gzip, gunzipSync], ['zlib', zlib, inflateSync]] as const) {
  describe(`${name} incremental writer`, () => {
    it.each([-2, -1, 0, 1, 6, 9])('flushes decodable prefixes and continues at level %s', async (level) => {
      const output = sink()
      const [writer, err] = codec.NewWriterLevel(output, level)
      expect(err).toBeNull()
      expect(await writer!.Flush()).toBeNull()
      expect(decode(output.bytes(), { finishFlush: constants.Z_SYNC_FLUSH }).length).toBe(0)
      const input = Buffer.from('first piece')
      expect(writer!.Write(input)).toEqual([input.length, null])
      input.fill(0)
      expect(await writer!.Flush()).toBeNull()
      expect(decode(output.bytes(), { finishFlush: constants.Z_SYNC_FLUSH }).toString()).toBe('first piece')
      expect(await writer!.Write(Buffer.from(' second piece'))).toEqual([13, null])
      expect(await writer!.Flush()).toBeNull()
      expect(await writer!.Close()).toBeNull()
      expect(decode(output.bytes()).toString()).toBe('first piece second piece')
      const length = output.bytes().length
      expect(await writer!.Close()).toBeNull()
      expect(output.bytes().length).toBe(length)
    })
    it('owns queued Buffer input and serializes async flush/close operations', async () => {
      const output = sink(true)
      const writer = codec.NewWriter(output)
      const input = Buffer.from('snapshot')
      const write = writer.Write(input)
      input.fill(0)
      const flush = writer.Flush()
      const close = writer.Close()
      expect(writer.Close()).toBe(close)
      expect(await write).toEqual([8, null])
      expect(await flush).toBeNull()
      expect(await close).toBeNull()
      expect(decode(output.bytes()).toString()).toBe('snapshot')
    })
    it('retains destination errors and detects short output writes', async () => {
      for (const failure of [null, $.newError('destination failed')]) {
        let calls = 0
        const writer = codec.NewWriter({ Write: (_p): io.IOResult => { calls++; return [1, failure] } })
        const [n, err] = await writer.Write(Buffer.from('payload'))
        expect(n).toBe(0)
        expect(err).toBe(failure ?? io.ErrShortWrite)
        expect(await writer.Flush()).toBe(err)
        expect(await writer.Close()).toBe(err)
        expect(await writer.Close()).toBe(err)
        expect(calls).toBe(1)
        const repaired = sink()
        writer.Reset(repaired)
        expect(await writer.Write(Buffer.from('new stream'))).toEqual([10, null])
        expect(await writer.Close()).toBeNull()
        expect(decode(repaired.bytes()).toString()).toBe('new stream')
      }
    })
    it('keeps output chunks bounded for large incompressible input', async () => {
      const input = new Uint8Array(256 * 1024)
      let x = 12345
      for (let i = 0; i < input.length; i++) { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; input[i] = x }
      const output = sink()
      const writer = codec.NewWriter(output)
      expect(await writer.Write(input)).toEqual([input.length, null])
      expect(output.bytes().length).toBeGreaterThan(32 * 1024)
      expect(await writer.Close()).toBeNull()
      expect(output.chunks.every(c => c.length <= 32 * 1024)).toBe(true)
      expect(new Uint8Array(decode(output.bytes()))).toEqual(input)
    })
    it('writes a valid empty stream and rejects writes after close', async () => {
      const output = sink()
      const writer = codec.NewWriter(output)
      expect(await writer.Close()).toBeNull()
      expect(decode(output.bytes()).length).toBe(0)
      expect((await writer.Write(null))[1]).not.toBeNull()
    })
  })
}

it('zlib snapshots dictionary storage and retains it across Reset', async () => {
  const dictionary = Buffer.from('shared dictionary bytes')
  const expected = Buffer.from(dictionary)
  const output = sink()
  const [writer, err] = zlib.NewWriterLevelDict(output, 9, dictionary)
  expect(err).toBeNull()
  dictionary.fill(0)
  for (let pass = 0; pass < 2; pass++) {
    if (pass) { output.chunks.length = 0; writer!.Reset(output) }
    writer!.Write(expected)
    expect(await writer!.Flush()).toBeNull()
    expect(await writer!.Close()).toBeNull()
    expect(inflateSync(output.bytes(), { dictionary: expected })).toEqual(expected)
  }
})

it('gzip emits and resets header metadata', async () => {
  const output = sink()
  const writer = gzip.NewWriter(output)
  writer.Name = 'caf\xe9'
  writer.Comment = 'comment'
  writer.Extra = new Uint8Array([1, 2, 3])
  writer.OS = 3
  writer.ModTime = time.Unix(123456n, 0n)
  writer.Write(Buffer.from('contents'))
  expect(await writer.Close()).toBeNull()
  const data = output.bytes()
  expect(data[3]).toBe(28)
  expect(data.readUInt32LE(4)).toBe(123456)
  expect(data[9]).toBe(3)
  expect(gunzipSync(data).toString()).toBe('contents')
  writer.Reset(sink())
  expect(writer.Name).toBe('')
  expect(writer.OS).toBe(255)
})
