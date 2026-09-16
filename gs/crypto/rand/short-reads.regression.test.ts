import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'
import { Int } from './index.js'

class Integer {
  constructor(public value = 0n) {}
  Sign() { return this.value === 0n ? 0 : this.value > 0n ? 1 : -1 }
  BitLen() { return this.value === 0n ? 0 : this.value.toString(2).length }
  SetBytes(data: $.Bytes) {
    this.value = 0n
    for (const b of $.bytesToUint8Array(data)) this.value = (this.value << 8n) | BigInt(b)
    return this
  }
  Cmp(other: Integer) { return this.value === other.value ? 0 : this.value < other.value ? -1 : 1 }
}

describe('crypto/rand.Int exact candidate reads', () => {
  for (const async of [false, true]) {
    it(`fills legal short reads, including a transient empty read (async=${async})`, async () => {
      let calls = 0
      const reader: io.Reader = { Read(p): io.Awaitable<io.IOResult> {
        calls++
        const result: io.IOResult = calls === 1 ? [0, null] : [1, null]
        if (calls > 1) p![0] = calls === 3 ? 7 : 0
        return async ? Promise.resolve(result) : result
      } }
      const [value, err] = await Int(reader, new Integer(65536n))
      expect(err).toBeNull()
      expect(value.value).toBe(7n)
      expect(calls).toBe(3)
    })
  }
  it('drops an accompanying error only when the candidate is full', async () => {
    const failure = $.newError('terminal error')
    for (const terminal of [failure, io.EOF]) {
      const reader: io.SyncReader = { Read(p) { $.copy(p, new Uint8Array($.len(p))); return [$.len(p), terminal] } }
      const [value, err] = await Int(reader, new Integer(65536n))
      expect(err).toBeNull()
      expect(value.value).toBe(0n)
    }
  })
  it('preserves early errors and distinguishes empty and partial EOF', async () => {
    const failure = $.newError('early error')
    for (const [n, terminal, expected] of [[0, io.EOF, io.EOF], [1, io.EOF, io.ErrUnexpectedEOF], [1, failure, failure]] as const) {
      const [value, err] = await Int({ Read: (): io.IOResult => [n, terminal] }, new Integer(65536n))
      expect(value).toBeNull()
      expect(err).toBe(expected)
    }
  })
  it('does not hide promise rejections', async () => {
    const failure = new Error('entropy source rejected')
    await expect(Promise.resolve(Int({ Read: () => Promise.reject(failure) }, new Integer(256n)))).rejects.toBe(failure)
  })
})

 it('uses the minimal candidate width at powers of two and no entropy for max=1', async () => {
   let calls = 0
   const reader: io.SyncReader = { Read(p) {
     calls++
     if ($.len(p) !== 2) throw new Error('wrong candidate width')
     $.copy(p, new Uint8Array([0x12, 0x34]))
     return [2, io.EOF]
   } }
   const [value, err] = await Int(reader, new Integer(65536n))
   expect(err).toBeNull()
   expect(value.value).toBe(0x1234n)
   const [zero, zeroErr] = await Int(reader, new Integer(1n))
   expect(zeroErr).toBeNull()
   expect(zero.value).toBe(0n)
   expect(calls).toBe(1)
 })
 it('panics for non-positive maxima before using the entropy source', () => {
   const reader: io.SyncReader = { Read() { throw new Error('unexpected read') } }
   for (const value of [0n, -1n]) expect(() => Int(reader, new Integer(value))).toThrow('argument to Int is <= 0')
 })
