import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import * as io from './io.js'
type Result = [number, $.GoError]

describe('I/O copy and exact-read contracts', () => {
  it('ReadAtLeast drops any error once its minimum is satisfied', async () => {
    const failure = $.newError('terminal read error')
    for (const err of [failure, io.EOF, null]) {
      const r: io.Reader = { Read(p): Result { $.copy(p, new Uint8Array([1, 2, 3])); return [3, err] } }
      expect(await io.ReadAtLeast(r, new Uint8Array(5), 2)).toEqual([3, null])
      expect(await io.ReadFull(r, new Uint8Array(3))).toEqual([3, null])
    }
  })
  it('preserves errors on genuinely short reads', async () => {
    const failure = $.newError('failed early')
    expect(await io.ReadFull({ Read: (): Result => [0, io.EOF] }, new Uint8Array(3))).toEqual([0, io.EOF])
    expect(await io.ReadFull({ Read: (): Result => [1, io.EOF] }, new Uint8Array(3))).toEqual([1, io.ErrUnexpectedEOF])
    expect(await io.ReadFull({ Read: (): Result => [1, failure] }, new Uint8Array(3))).toEqual([1, failure])
  })
  it('rejects empty CopyBuffer scratch storage before touching either endpoint', async () => {
    let calls = 0
    const r = { Read: (): Result => { calls++; return [0, io.EOF] } }
    const w = { Write: (p: $.Bytes): Result => { calls++; return [$.len(p), null] } }
    for (const buf of [new Uint8Array(0), []]) {
      await expect(io.CopyBuffer(w, r, buf)).rejects.toThrow('empty buffer in CopyBuffer')
    }
    expect(calls).toBe(0)
  })
  it('rejects empty scratch storage before optimized copy methods', async () => {
    let calls = 0
    const r = {
      Read: (): Result => [0, io.EOF],
      WriteTo: (): [bigint, $.GoError] => { calls++; return [0n, null] },
    }
    const w = {
      Write: (p: $.Bytes): Result => [$.len(p), null],
      ReadFrom: (): [bigint, $.GoError] => { calls++; return [0n, null] },
    }
    await expect(io.CopyBuffer(w, r, new Uint8Array(0))).rejects.toThrow('empty buffer in CopyBuffer')
    expect(calls).toBe(0)
    expect(await io.CopyBuffer(w, r, null)).toEqual([0n, null])
    expect(calls).toBe(1)
  })
  it('distinguishes invalid write counts from legitimate short writes', async () => {
    for (const count of [-1, 4]) {
      const [n, err] = await io.Copy({ Write: (): Result => [count, null] }, { Read: (): Result => [3, io.EOF] })
      expect(n).toBe(0n)
      expect(err?.Error()).toBe('invalid Write result')
      expect(err).not.toBe(io.ErrShortWrite)
    }
    const failure = $.newError('writer failed')
    expect(await io.Copy({ Write: (): Result => [4, failure] }, { Read: (): Result => [3, io.EOF] })).toEqual([0n, failure])
    expect(await io.Copy({ Write: (): Result => [2, null] }, { Read: (): Result => [3, io.EOF] })).toEqual([2n, io.ErrShortWrite])
  })
})
