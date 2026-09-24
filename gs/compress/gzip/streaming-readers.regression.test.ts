import { Buffer } from 'node:buffer'
import { deflateSync, gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'
import * as gzip from './index.js'
import * as zlib from '../zlib/index.js'

function source(data: Uint8Array, async = false, eofWithData = false) {
  let position = 0
  let calls = 0
  return {
    get position() { return position },
    get calls() { return calls },
    Read(p: $.Bytes): io.Awaitable<io.IOResult> {
      const read = (): io.IOResult => {
        calls++
        const n = $.copy(p, data.subarray(position))
        position += n
        return [n, n === 0 || (eofWithData && position === data.length) ? io.EOF : null]
      }
      return async ? Promise.resolve().then(read) : read()
    },
  }
}
function exactSource(data: Uint8Array) {
  let position = 0
  return {
    get position() { return position },
    Read(_p: $.Bytes): io.IOResult { throw new Error('must use ByteReader to preserve frame boundary') },
    ReadByte(): io.IOResult { return position === data.length ? [0, io.EOF] : [data[position++], null] },
  }
}
function seekableSource(data: Uint8Array) {
  let position = 0
  return {
    get position() { return position },
    Read(p: $.Bytes): io.IOResult {
      const n = $.copy(p, data.subarray(position))
      position += n
      return [n, n === 0 ? io.EOF : null]
    },
    ReadByte(): io.IOResult { throw new Error('must read seekable input in bulk') },
    Seek(offset: bigint, whence: number): [bigint, $.GoError] {
      if (whence !== io.SeekCurrent) throw new Error('unexpected whence')
      position += Number(offset)
      return [BigInt(position), null]
    },
  }
}
const asBytes = (p: $.Bytes) => new Uint8Array($.bytesToUint8Array(p))

for (const [name, codec, encode] of [['gzip', gzip, gzipSync], ['zlib', zlib, deflateSync]] as const) {
  describe(`${name} incremental reader`, () => {
    for (const async of [false, true]) {
      it.each(['array', 'slice', 'buffer', 'typed', 'byte-slice'])(`writes logical destinations (async=${async}) %s`, async kind => {
        const input = source(encode(Buffer.from('abc')), async, true)
        const [reader, err] = await codec.NewReader(input)
        expect(err).toBeNull()
        const backing: $.Bytes = kind === 'byte-slice' ? $.makeSlice<number>(5, 7, 'byte') : kind === 'buffer' ? Buffer.alloc(5, 0xa5) : kind === 'typed' ? new Uint8Array(5).fill(0xa5) : [0xa5, 0xa5, 0xa5, 0xa5, 0xa5]
        $.copy(backing, new Uint8Array(5).fill(0xa5))
        const destination = kind === 'array' ? backing : $.goSlice(backing, 1, 4)
        const [n, readErr] = await reader!.Read(destination)
        expect(n).toBe(3)
        expect(readErr === null || readErr === io.EOF).toBe(true)
        expect(Array.from(backing!)).toEqual(kind === 'array' ? [97, 98, 99, 0xa5, 0xa5] : [0xa5, 97, 98, 99, 0xa5])
        expect(await reader!.Read(new Uint8Array(1))).toEqual([0, io.EOF])
        expect(await reader!.Close()).toBeNull()
      })
    }
    it('does not buffer the whole compressed stream or reinflate prefixes', async () => {
      const data = new Uint8Array(256 * 1024)
      let x = 123
      for (let i = 0; i < data.length; i++) { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; data[i] = x }
      const encoded = encode(data)
      const input = source(encoded)
      const [reader, err] = await codec.NewReader(input)
      expect(err).toBeNull()
      expect(input.calls).toBe(1)
      expect(input.position).toBe(32 * 1024)
      const first = new Uint8Array(7)
      expect((await reader!.Read(first))[0]).toBe(7)
      expect(input.calls).toBe(1)
      expect(first).toEqual(data.subarray(0, 7))
      const [remaining, readErr] = await io.ReadAll(reader!)
      expect(readErr).toBeNull()
      expect(asBytes(remaining)).toEqual(data.subarray(7))
      expect(input.calls).toBeLessThanOrEqual(Math.ceil(encoded.length / (32 * 1024)) + 1)
    })
    it('leaves trailing protocol bytes unread on a ByteReader', async () => {
      const encoded = encode(Buffer.from('one frame'))
      const input = exactSource(Buffer.concat([encoded, Buffer.from('trailing')]))
      const [reader, err] = await codec.NewReader(input)
      expect(err).toBeNull()
      if (reader instanceof gzip.Reader) reader.Multistream(false)
      const [out, readErr] = await io.ReadAll(reader!)
      expect(readErr).toBeNull()
      expect(Buffer.from(asBytes(out)).toString()).toBe('one frame')
      expect(input.position).toBe(encoded.length)
      expect(await reader!.Close()).toBeNull()
      expect(input.ReadByte()).toEqual([116, null])
    })
    it('reads a seekable ByteReader in bulk and rewinds to the frame boundary', async () => {
      const encoded = encode(Buffer.from('one frame'))
      const input = seekableSource(Buffer.concat([encoded, Buffer.from('trailing')]))
      const [reader, err] = await codec.NewReader(input)
      expect(err).toBeNull()
      if (reader instanceof gzip.Reader) reader.Multistream(false)
      const [out, readErr] = await io.ReadAll(reader!)
      expect(readErr).toBeNull()
      expect(Buffer.from(asBytes(out)).toString()).toBe('one frame')
      expect(input.position).toBe(encoded.length)
    })
    it('keeps checksum failures sticky and preserves delivered data', async () => {
      const encoded = encode(Buffer.from('payload'))
      encoded[encoded.length - 1] ^= 1
      const [reader, err] = await codec.NewReader(source(encoded))
      expect(err).toBeNull()
      const [data, failure] = await io.ReadAll(reader!)
      expect(failure).toBe(codec.ErrChecksum)
      expect(Buffer.from(asBytes(data)).toString()).toBe('payload')
      const untouched = new Uint8Array(12).fill(0xa5)
      expect(await reader!.Read(untouched)).toEqual([0, failure])
      expect(Array.from(untouched)).toEqual(Array(12).fill(0xa5))
    })
    it('reports truncated bodies and trailers instead of successful EOF', async () => {
      const encoded = encode(Buffer.from('payload payload payload'))
      for (const cut of [1, 3, 5]) {
        const [reader, err] = await codec.NewReader(source(encoded.subarray(0, encoded.length - cut)))
        expect(err).toBeNull()
        const [, readErr] = await io.ReadAll(reader!)
        expect(readErr).toBe(io.ErrUnexpectedEOF)
        expect(await reader!.Read(new Uint8Array(4))).toEqual([0, readErr])
      }
    })
    it('discards old output on failed Reset and recovers on a valid Reset', async () => {
      const [base, err] = await codec.NewReader(source(encode(Buffer.from('old data'))))
      expect(err).toBeNull()
      const reader = base as io.ReadCloser & zlib.Resetter
      expect((await reader.Read(new Uint8Array(1)))[0]).toBe(1)
      expect(await reader.Reset(source(Buffer.from('not a valid compressed header')), null)).toBe(codec.ErrHeader)
      expect(await reader.Read(new Uint8Array(10))).toEqual([0, codec.ErrHeader])
      expect(await reader.Reset(source(encode(Buffer.from('new data'))), null)).toBeNull()
      const [out, readErr] = await io.ReadAll(reader)
      expect(readErr).toBeNull()
      expect(Buffer.from(asBytes(out)).toString()).toBe('new data')
    })
    it('exposes a flushed message before the underlying pipe closes', async () => {
      const [readEnd, writeEnd] = io.Pipe()
      const writer = codec.NewWriter(writeEnd)
      try {
        const opening = codec.NewReader(readEnd)
        const writing = writer.Write(Buffer.from('interactive message'))
        const [reader, err] = await opening
        expect(err).toBeNull()
        const out = new Uint8Array(64)
        const reading = reader!.Read(out)
        const flushing = writer.Flush()
        const [[n, readErr], flushErr] = await Promise.all([reading, flushing])
        expect(await writing).toEqual([19, null])
        expect(readErr).toBeNull()
        expect(flushErr).toBeNull()
        expect(Buffer.from(out.subarray(0, n)).toString()).toBe('interactive message')
        const draining = io.ReadAll(reader!)
        expect(await writer.Close()).toBeNull()
        writeEnd.Close()
        expect((await draining)[1]).toBeNull()
      } finally {
        readEnd.Close()
        writeEnd.Close()
      }
    })
    it('preserves an underlying error without reading again', async () => {
      const encoded = encode(Buffer.from('abcdef')).subarray(0, name === 'gzip' ? 12 : 3)
      const failure = $.newError('transport failed')
      let calls = 0
      const [reader, err] = await codec.NewReader({ Read(p): io.IOResult { calls++; return [$.copy(p, encoded), failure] } })
      expect(err).toBeNull()
      expect((await io.ReadAll(reader!))[1]).toBe(failure)
      expect(await reader!.Read(new Uint8Array(1))).toEqual([0, failure])
      expect(calls).toBe(1)
    })
  })
}

it('gzip concatenated members use independent decoder histories and first-member metadata', async () => {
  const members = Array.from({ length: 5 }, (_, i) => Buffer.from(`member ${i}: `.repeat(10000)))
  const data = Buffer.concat(members.map(b => gzipSync(b)))
  const [reader, err] = await gzip.NewReader(source(data, true))
  expect(err).toBeNull()
  const [out, readErr] = await io.ReadAll(reader!)
  expect(readErr).toBeNull()
  expect(Buffer.from(asBytes(out))).toEqual(Buffer.concat(members))
})

it('zlib checks dictionary IDs at construction and decodes with an owned dictionary', async () => {
  const dict = Buffer.from('dictionary entry')
  const encoded = deflateSync(Buffer.from('dictionary entry and payload'), { dictionary: dict })
  expect((await zlib.NewReader(source(encoded)))[1]).toBe(zlib.ErrDictionary)
  expect((await zlib.NewReaderDict(source(encoded), Buffer.from('wrong')))[1]).toBe(zlib.ErrDictionary)
  const [reader, err] = await zlib.NewReaderDict(source(encoded), dict)
  expect(err).toBeNull()
  dict.fill(0)
  const [out, readErr] = await io.ReadAll(reader!)
  expect(readErr).toBeNull()
  expect(Buffer.from(asBytes(out)).toString()).toBe('dictionary entry and payload')
})

it('gzip Close distinguishes DEFLATE errors from wrapper trailer errors', async () => {
  const encoded = gzipSync(Buffer.from('a sufficiently long payload'.repeat(12)))
  for (let length = 10; length < encoded.length; length++) {
    const [reader, err] = await gzip.NewReader(source(encoded.subarray(0, length)))
    expect(err).toBeNull()
    const [, readErr] = await io.ReadAll(reader!)
    expect(readErr).toBe(io.ErrUnexpectedEOF)
    expect(await reader!.Close()).toBe(length < encoded.length - 8 ? io.ErrUnexpectedEOF : null)
  }
  encoded[encoded.length - 1] ^= 1
  const [reader, err] = await gzip.NewReader(source(encoded))
  expect(err).toBeNull()
  expect((await io.ReadAll(reader!))[1]).toBe(gzip.ErrChecksum)
  expect(await reader!.Close()).toBeNull()
})
