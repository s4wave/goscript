import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import * as io from './io.js'
type Result = [number, $.GoError]
async function settled<T>(pending: PromiseLike<T> | T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([Promise.resolve(pending), new Promise<T>((_resolve, reject) => {
      timer = setTimeout(() => reject(new Error('pipe operation did not settle')), 1000)
    })])
  } finally { if (timer !== undefined) clearTimeout(timer) }
}

describe('pipe close and rendezvous contracts', () => {
  it('returns a reader close error to a blocked writer with its partial count', async () => {
    const [r, w] = io.Pipe()
    const failure = $.newError('reader cancelled')
    const writing = Promise.resolve(w.Write(new Uint8Array([1, 2, 3, 4])))
    expect(await r.Read(new Uint8Array(2))).toEqual([2, null])
    expect(r.CloseWithError(failure)).toBeNull()
    expect(await settled(writing)).toEqual([2, failure])
    expect(await w.Write(new Uint8Array(1))).toEqual([0, failure])
    expect(await r.Read(new Uint8Array(1))).toEqual([0, io.ErrClosedPipe])
  })
  it('writer close releases blocked writes without requiring another read', async () => {
    const [r, w] = io.Pipe()
    const failure = $.newError('writer cancelled')
    const writing = Promise.resolve(w.Write(new Uint8Array([1, 2, 3])))
    expect(await r.Read(new Uint8Array(1))).toEqual([1, null])
    w.CloseWithError(failure)
    expect(await settled(writing)).toEqual([1, io.ErrClosedPipe])
    expect(await r.Read(new Uint8Array(8))).toEqual([0, failure])
    expect(await w.Write(new Uint8Array(1))).toEqual([0, io.ErrClosedPipe])
  })
  it('preserves the first close error on each half', async () => {
    const first = $.newError('first')
    const later = $.newError('later')
    const [r1, w1] = io.Pipe()
    r1.CloseWithError(first); r1.CloseWithError(later); r1.Close()
    expect(await w1.Write(null)).toEqual([0, first])
    const [r2, w2] = io.Pipe()
    w2.CloseWithError(first); w2.CloseWithError(later); w2.Close()
    expect(await r2.Read(null)).toEqual([0, first])
    r2.CloseWithError(later)
    expect(await r2.Read(null)).toEqual([0, io.ErrClosedPipe])
    expect(await w2.Write(null)).toEqual([0, io.ErrClosedPipe])
  })
  it('empty writes and reads rendezvous rather than succeeding early', async () => {
    const [r, w] = io.Pipe()
    let finished = false
    const writing = Promise.resolve(w.Write(null)).then((result) => { finished = true; return result })
    try {
      await Promise.resolve(); await Promise.resolve(); await Promise.resolve()
      expect(finished).toBe(false)
      expect(await settled(r.Read(null))).toEqual([0, null])
      expect(await settled(writing)).toEqual([0, null])
    } finally { r.Close(); w.Close() }
  })
  it('a zero-byte read does not acknowledge a nonempty write', async () => {
    const [r, w] = io.Pipe()
    let finished = false
    const writing = Promise.resolve(w.Write(new Uint8Array([9]))).then((result) => { finished = true; return result })
    try {
      expect(await r.Read(null)).toEqual([0, null])
      expect(finished).toBe(false)
      const p = new Uint8Array(1)
      expect(await r.Read(p)).toEqual([1, null])
      expect(p[0]).toBe(9)
      expect(await settled(writing)).toEqual([1, null])
    } finally { r.Close(); w.Close() }
  })
  it('writer close wakes zero-length blocked reads with EOF', async () => {
    const [r, w] = io.Pipe()
    const reading = Promise.resolve(r.Read(null))
    w.Close()
    expect(await settled(reading)).toEqual([0, io.EOF])
  })
  it('releases every queued write, preserving each accepted count', async () => {
    const [r, w] = io.Pipe()
    const failure = $.newError('stop')
    const first = Promise.resolve(w.Write(new Uint8Array([1, 2])))
    const second = Promise.resolve(w.Write(new Uint8Array([3, 4])))
    expect(await r.Read(new Uint8Array(1))).toEqual([1, null])
    r.CloseWithError(failure)
    expect(await settled(first)).toEqual([1, failure])
    expect(await settled(second)).toEqual([0, failure])
  })
})
