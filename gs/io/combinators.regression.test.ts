import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import * as io from './io.js'

type Result = [number, $.GoError]
function source(text: string, withEOF = true): io.SyncReader {
  const data = new TextEncoder().encode(text)
  let offset = 0
  return { Read(p): Result {
    if (offset === data.length) return [0, io.EOF]
    const n = $.copy(p, data.subarray(offset))
    offset += n
    return [n, withEOF && offset === data.length ? io.EOF : null]
  } }
}
const text = (b: $.Bytes) => new TextDecoder().decode($.bytesToUint8Array(b))

describe('I/O combinator data and scheduling contracts', () => {
  it('delivers intermediate data+EOF before touching the next reader', () => {
    let laterReads = 0
    const tail = source('tail')
    const reader = io.MultiReader(source('head'), { Read(p): Result { laterReads++; return tail.Read(p) } })
    const buf = new Uint8Array(16)
    expect(reader.Read(buf)).toEqual([4, null])
    expect(text(buf.subarray(0, 4))).toBe('head')
    expect(laterReads).toBe(0)
    expect(reader.Read(buf)).toEqual([4, io.EOF])
    expect(text(buf.subarray(0, 4))).toBe('tail')
    expect(reader.Read(buf)).toEqual([0, io.EOF])
  })
  it('skips many empty readers iteratively', () => {
    const reader = io.MultiReader(...Array.from({ length: 20000 }, () => source('')), source('x'))
    const p = new Uint8Array(1)
    expect(reader.Read(p)).toEqual([1, io.EOF])
    expect(text(p)).toBe('x')
  })
  it('keeps LimitedReader and TeeReader synchronous under MultiReader', () => {
    const teeBytes: number[] = []
    const limit: io.Reader = io.LimitReader(source('abcd', false), 2n)
    const tee: io.Reader = io.TeeReader(source('ef'), { Write(p): Result {
      teeBytes.push(...$.bytesToUint8Array(p)); return [$.len(p), null]
    } })
    const reader = io.MultiReader(limit, tee)
    const p = new Uint8Array(8)
    expect(reader.Read(p)).toEqual([2, null])
    expect(text(p.subarray(0, 2))).toBe('ab')
    expect(reader.Read(p)).toEqual([2, io.EOF])
    expect(teeBytes).toEqual([101, 102])
  })
  it('updates a LimitedReader limit only when an async read settles', async () => {
    let complete!: (result: Result) => void
    const reader = new io.LimitedReader({ Read: (_p: $.Bytes) => new Promise<Result>((resolve) => { complete = resolve }) }, 3n)
    const pending = reader.Read(new Uint8Array(4))
    expect(reader.N).toBe(3n)
    complete([2, null])
    expect(await pending).toEqual([2, null])
    expect(reader.N).toBe(1n)
  })
  it('handles thenables and data+EOF through ReadAll', async () => {
    const first = source('first')
    const reader = io.MultiReader({ Read(p: $.Bytes): PromiseLike<Result> {
      return { then: (fulfilled, rejected) => Promise.resolve(first.Read(p)).then(fulfilled, rejected) }
    } }, source('second'))
    const [data, err] = await io.ReadAll(reader)
    expect(err).toBeNull()
    expect(text(data)).toBe('firstsecond')
  })
  it('keeps synchronous MultiWriter results synchronous and stops at short writes', () => {
    const order: number[] = []
    const writer: io.Writer = io.MultiWriter(
      { Write(p): Result { order.push(1); return [$.len(p), null] } },
      { Write(): Result { order.push(2); return [1, null] } },
      { Write(p): Result { order.push(3); return [$.len(p), null] } },
    )
    expect(writer.Write(new Uint8Array(3))).toEqual([1, io.ErrShortWrite])
    expect(order).toEqual([1, 2])
    expect(io.MultiWriter().Write(new Uint8Array(2))).toEqual([2, null])
  })
  it('awaits an asynchronous writer before invoking the next writer', async () => {
    let complete!: (result: Result) => void
    const order: number[] = []
    const writer = io.MultiWriter(
      { Write: (_p: $.Bytes) => { order.push(1); return new Promise<Result>((resolve) => { complete = resolve }) } },
      { Write(p: $.Bytes): Result { order.push(2); return [$.len(p), null] } },
    )
    const pending = writer.Write(new Uint8Array(3))
    expect(order).toEqual([1])
    complete([3, null])
    expect(await pending).toEqual([3, null])
    expect(order).toEqual([1, 2])
  })
  it('returns the tee writer count and original error', async () => {
    const failure = $.newError('tee failed')
    const sync = io.TeeReader(source('abcd'), { Write: (): Result => [1, failure] })
    expect(sync.Read(new Uint8Array(8))).toEqual([1, failure])
    const asyncReader = io.TeeReader(source('abcd'), { Write: async (): Promise<Result> => [2, failure] })
    expect(await asyncReader.Read(new Uint8Array(8))).toEqual([2, failure])
  })
  it('does not write zero-byte reads or replace the read error', () => {
    const failure = $.newError('read failed')
    const reader = io.TeeReader({ Read: (): Result => [0, failure] }, { Write(): Result { throw new Error('unexpected write') } })
    expect(reader.Read(new Uint8Array(8))).toEqual([0, failure])
  })
  it('does not swallow reader/writer promise rejections', async () => {
    const failure = new Error('rejected')
    const reader = io.MultiReader({ Read: (_p: $.Bytes) => Promise.reject<Result>(failure) })
    await expect(Promise.resolve(reader.Read(null))).rejects.toBe(failure)
    const writer = io.MultiWriter({ Write: (_p: $.Bytes) => Promise.reject<Result>(failure) })
    await expect(Promise.resolve(writer.Write(null))).rejects.toBe(failure)
  })
})
