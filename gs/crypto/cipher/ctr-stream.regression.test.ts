import { Buffer } from 'node:buffer'
import { createCipheriv } from 'node:crypto'
import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import { NewCipher } from '@goscript/crypto/aes/index.js'
import * as io from '@goscript/io/index.js'

import { type Block, NewCTR, StreamReader, StreamWriter } from './index.js'

type IOResult = [number, $.GoError]

const key = Uint8Array.from(Buffer.from('2b7e151628aed2a6abf7158809cf4f3c', 'hex'))
const iv = Uint8Array.from(Buffer.from('f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', 'hex'))
const plaintext = Uint8Array.from(Buffer.from(
  '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e51', 'hex',
))
const ciphertext = Uint8Array.from(Buffer.from(
  '874d6191b620e3261bef6864990db6ce9806f66b7970fdff8617187bb9fffdff', 'hex',
))

function aes(): Block {
  const [block, err] = NewCipher(key)
  expect(err).toBeNull()
  expect(block).not.toBeNull()
  return block!
}

function bytes(value: $.Bytes): number[] {
  return Array.from($.bytesToUint8Array(value))
}

const representations = ['uint8', 'buffer', 'array', 'byte-slice'] as const
function backing(kind: typeof representations[number], length: number): $.Bytes {
  switch (kind) {
    case 'uint8': return new Uint8Array(length)
    case 'buffer': return Buffer.alloc(length)
    case 'array': return Array<number>(length).fill(0)
    case 'byte-slice': return $.makeSlice<number>(length, length + 8, 'byte')
  }
}

function source(data: $.Bytes, chunkSize = 7): io.Reader {
  let offset = 0
  return {
    Read(dst: $.Bytes): IOResult {
      if (offset === $.len(data)) return [0, io.EOF]
      const n = Math.min($.len(dst), chunkSize, $.len(data) - offset)
      $.copyByteRanges(dst, 0, n, data, offset, offset + n)
      offset += n
      return [n, null]
    },
  }
}

function sink(): io.Writer & { data: number[] } {
  return {
    data: [],
    Write(src: $.Bytes): IOResult {
      this.data.push(...bytes(src))
      return [$.len(src), null]
    },
  }
}

describe('CTR storage and counter regressions', () => {
  it.each(['Buffer', 'Buffer.subarray'] as const)('owns a copy of a %s IV', (kind) => {
    const storage = Buffer.alloc(32, 0xa5)
    const supplied = kind === 'Buffer' ? Buffer.from(iv) : storage.subarray(7, 23)
    supplied.set(iv)
    const snapshot = new Uint8Array(supplied)
    const storageSnapshot = new Uint8Array(storage)
    const block = aes()
    const first = NewCTR(block, supplied)
    const second = NewCTR(block, supplied)
    const a = new Uint8Array(plaintext.length)
    const b = new Uint8Array(plaintext.length)

    first.XORKeyStream(a.subarray(0, 5), plaintext.subarray(0, 5))
    second.XORKeyStream(b, plaintext)
    first.XORKeyStream(a.subarray(5), plaintext.subarray(5))
    expect(bytes(a)).toEqual(bytes(ciphertext))
    expect(bytes(b)).toEqual(bytes(ciphertext))
    expect(bytes(supplied)).toEqual(bytes(snapshot))
    expect(bytes(storage)).toEqual(bytes(storageSnapshot))

    const recovered = new Uint8Array(a.length)
    NewCTR(block, supplied).XORKeyStream(recovered, a)
    expect(bytes(recovered)).toEqual(bytes(plaintext))
  })

  it.each(representations)('does not retain a mutable %s IV', (kind) => {
    const supplied = backing(kind, iv.length)
    $.copy(supplied, iv)
    const stream = NewCTR(aes(), supplied)
    $.copy(supplied, new Uint8Array(iv.length))
    const out = new Uint8Array(plaintext.length)
    stream.XORKeyStream(out, plaintext)
    expect(bytes(out)).toEqual(bytes(ciphertext))
  })

  for (const kind of representations) {
    it.each([1, -1])(`rejects shifted ${kind} overlap (%i) before advancing`, (shift) => {
      const storage = backing(kind, plaintext.length + 1)
      const input = $.goSlice(storage, shift > 0 ? 0 : 1, shift > 0 ? 32 : 33)
      const output = $.goSlice(storage, shift > 0 ? 1 : 0, shift > 0 ? 33 : 32)
      $.copy(input, plaintext)
      const before = bytes(storage)
      const stream = NewCTR(aes(), iv)
      expect(() => stream.XORKeyStream(output, input)).toThrow('invalid buffer overlap')
      expect(bytes(storage)).toEqual(before)
      const out = new Uint8Array(plaintext.length)
      stream.XORKeyStream(out, plaintext)
      expect(bytes(out)).toEqual(bytes(ciphertext))
    })

    it(`accepts distinct ${kind} views with the same starting address`, () => {
      const storage = backing(kind, 48)
      $.copy(storage, plaintext)
      const input = $.goSlice(storage, 0, 32)
      const output = $.goSlice(storage, 0, 48)
      NewCTR(aes(), iv).XORKeyStream(output, input)
      expect(bytes($.goSlice(storage, 0, 32))).toEqual(bytes(ciphertext))
      expect(bytes($.goSlice(storage, 32))).toEqual(Array<number>(16).fill(0))
    })

    it(`ignores overlap with the unused ${kind} destination tail`, () => {
      const storage = backing(kind, 64)
      const input = $.goSlice(storage, 32, 64)
      $.copy(input, plaintext)
      NewCTR(aes(), iv).XORKeyStream(storage, input)
      expect(bytes($.goSlice(storage, 0, 32))).toEqual(bytes(ciphertext))
      expect(bytes(input)).toEqual(bytes(plaintext))
    })
  }

  it('does not consume keystream after empty input or a short destination', () => {
    const stream = NewCTR(aes(), iv)
    const out = new Uint8Array(plaintext.length)
    stream.XORKeyStream(null, null)
    stream.XORKeyStream(out, new Uint8Array(0))
    stream.XORKeyStream(out.subarray(0, 5), plaintext.subarray(0, 5))
    const before = bytes(out)
    expect(() => stream.XORKeyStream(out.subarray(5, 6), plaintext.subarray(5))).toThrow(
      'output smaller than input',
    )
    expect(bytes(out)).toEqual(before)
    stream.XORKeyStream(out.subarray(5), plaintext.subarray(5))
    expect(bytes(out)).toEqual(bytes(ciphertext))
  })

  it('carries and wraps a non-AES counter in big-endian order', () => {
    const block: Block = {
      BlockSize: () => 2,
      Encrypt: (dst, src) => { $.copy(dst, src) },
      Decrypt: () => { throw new Error('CTR must not call Decrypt') },
    }
    const out = new Uint8Array(8)
    const stream = NewCTR(block, new Uint8Array([0xff, 0xfe]))
    for (let i = 0; i < out.length; i++) {
      stream.XORKeyStream(out.subarray(i, i + 1), new Uint8Array(1))
    }
    expect(bytes(out)).toEqual([255, 254, 255, 255, 0, 0, 0, 1])
  })

  it('rejects nil blocks and invalid block sizes', () => {
    expect(() => NewCTR(null, iv)).toThrow('nil block')
    for (const size of [0, -1, 1.5, Number.NaN]) {
      const block: Block = {
        BlockSize: () => size,
        Encrypt: () => { throw new Error('unexpected Encrypt') },
        Decrypt: () => { throw new Error('unexpected Decrypt') },
      }
      expect(() => NewCTR(block, null)).toThrow('invalid block size')
    }
  })

  it.each([16, 24, 32])('matches Node CTR for a %i-byte AES key and chunk boundaries', (keySize) => {
    const testKey = Uint8Array.from({ length: keySize }, (_, i) => (i * 13 + 3) & 255)
    const [block, err] = NewCipher(testKey)
    expect(err).toBeNull()
    for (const length of [0, 1, 15, 16, 17, 31, 32, 33, 255, 512, 1025]) {
      const input = Uint8Array.from({ length }, (_, i) => (i * 29 + 7) & 255)
      const nonce = new Uint8Array(16).fill(255)
      const reference = createCipheriv(`aes-${keySize * 8}-ctr`, testKey, nonce)
      const expected = Buffer.concat([reference.update(input), reference.final()])
      for (const chunk of [1, 5, 16, 17, 31, 256]) {
        const stream = NewCTR(block, nonce)
        const out = new Uint8Array(length + 3).fill(0xa5)
        for (let offset = 0; offset < length; offset += chunk) {
          const end = Math.min(offset + chunk, length)
          stream.XORKeyStream(out.subarray(offset, end), input.subarray(offset, end))
        }
        expect(bytes(out.subarray(0, length))).toEqual(bytes(expected))
        expect(bytes(out.subarray(length))).toEqual([0xa5, 0xa5, 0xa5])
      }
    }
  })
})

describe('stream I/O compatibility regressions', () => {
  it('exposes mutable, nil-initialized public fields and synchronous interfaces', () => {
    const reader = new StreamReader()
    const writer = new StreamWriter()
    expect(reader.S).toBeNull()
    expect(reader.R).toBeNull()
    expect(writer.S).toBeNull()
    expect(writer.W).toBeNull()
    expect(writer.Err).toBeNull()
    reader.S = NewCTR(aes(), iv)
    reader.R = source(ciphertext, 32)
    const collected = sink()
    writer.S = NewCTR(aes(), iv)
    writer.W = collected
    writer.Err = $.newError('unused public field')

    // These assignments also check the public TypeScript interface surface.
    const r: io.Reader = reader
    const w: io.Writer = writer
    const c: io.Closer = writer
    const out = new Uint8Array(plaintext.length)
    expect(r.Read(out)).toEqual([plaintext.length, null])
    expect(bytes(out)).toEqual(bytes(plaintext))
    expect(w.Write(plaintext)).toEqual([plaintext.length, null])
    expect(collected.data).toEqual(bytes(ciphertext))
    expect(c.Close()).toBeNull()
  })

  it('works through synchronous io.MultiReader', () => {
    const reader: io.Reader = new StreamReader({ S: NewCTR(aes(), iv), R: source(ciphertext) })
    const combined = io.MultiReader(source(new Uint8Array(0)), reader)
    const out = new Uint8Array(plaintext.length)
    let offset = 0
    while (offset < out.length) {
      const [n, err] = combined.Read(out.subarray(offset))
      expect(err).toBeNull()
      expect(n).toBeGreaterThan(0)
      offset += n
    }
    expect(bytes(out)).toEqual(bytes(plaintext))
    expect(combined.Read(new Uint8Array(1))).toEqual([0, io.EOF])
  })

  it('works through io.ReadFull and io.Copy in both directions', async () => {
    const reader: io.Reader = new StreamReader({ S: NewCTR(aes(), iv), R: source(ciphertext) })
    const out = new Uint8Array(plaintext.length)
    expect(await io.ReadFull(reader, out)).toEqual([plaintext.length, null])
    expect(bytes(out)).toEqual(bytes(plaintext))

    const encrypted = sink()
    const writer: io.Writer = new StreamWriter({ S: NewCTR(aes(), iv), W: encrypted })
    expect(await io.Copy(writer, source(plaintext))).toEqual([BigInt(plaintext.length), null])
    expect(encrypted.data).toEqual(bytes(ciphertext))

    const decrypted = sink()
    const decryptor: io.Reader = new StreamReader({ S: NewCTR(aes(), iv), R: source(ciphertext) })
    expect(await io.Copy(decrypted, decryptor)).toEqual([BigInt(plaintext.length), null])
    expect(decrypted.data).toEqual(bytes(plaintext))
  })

  it.each([io.EOF, $.newError('read failed')])('decrypts data returned with an error without touching the tail', (readErr) => {
    const reader = new StreamReader({
      S: NewCTR(aes(), iv),
      R: { Read(dst: $.Bytes): IOResult { $.copy(dst, ciphertext); return [32, readErr] } },
    })
    const out = new Uint8Array(40).fill(0xa5)
    const [n, err] = reader.Read(out)
    expect(n).toBe(32)
    expect(err).toBe(readErr)
    expect(bytes(out.subarray(0, 32))).toEqual(bytes(plaintext))
    expect(bytes(out.subarray(32))).toEqual(Array<number>(8).fill(0xa5))
  })

  it('forwards empty reads to the stream without changing the error', () => {
    const lengths: number[] = []
    const reader = new StreamReader({
      S: { XORKeyStream: (dst, src) => { lengths.push($.len(dst), $.len(src)) } },
      R: { Read: (): IOResult => [0, io.EOF] },
    })
    expect(reader.Read(null)).toEqual([0, io.EOF])
    expect(lengths).toEqual([0, 0])
  })

  it('uses the shared short-write sentinel and never retries', () => {
    let calls = 0
    let advanced = 0
    const writer = new StreamWriter({
      S: { XORKeyStream: (dst, src) => { advanced += $.len(src); $.copy(dst, src) } },
      W: { Write: (): IOResult => { calls++; return [1, null] } },
    })
    const [n, err] = writer.Write(plaintext)
    expect(n).toBe(1)
    expect(err).toBe(io.ErrShortWrite)
    expect(calls).toBe(1)
    expect(advanced).toBe(plaintext.length)
  })

  it('preserves explicit write errors and does not mutate caller input', () => {
    const failure = $.newError('write failed')
    const input = Buffer.from(plaintext)
    const writer = new StreamWriter({
      S: NewCTR(aes(), iv),
      W: {
        Write(data: $.Bytes): IOResult {
          expect(bytes(data)).toEqual(bytes(ciphertext))
          $.copy(data, new Uint8Array($.len(data)))
          return [1, failure]
        },
      },
    })
    const [n, err] = writer.Write(input)
    expect(n).toBe(1)
    expect(err).toBe(failure)
    expect(bytes(input)).toEqual(bytes(plaintext))
  })

  it('forwards Close with its receiver and original error; does not flush', () => {
    const failure = $.newError('close failed')
    const underlying = {
      closes: 0,
      Write: (): IOResult => { throw new Error('Close must not write') },
      Close(): $.GoError { this.closes++; return failure },
    }
    const writer = new StreamWriter({ W: underlying })
    expect(writer.Close()).toBe(failure)
    expect(underlying.closes).toBe(1)
    expect(new StreamWriter().Close()).toBeNull()
    expect(new StreamWriter({ W: sink() }).Close()).toBeNull()
  })

  it('defers transformation for explicitly asynchronous readers', async () => {
    let finish!: () => void
    const reader = new StreamReader({
      S: NewCTR(aes(), iv),
      R: {
        Read(dst: $.Bytes): Promise<IOResult> {
          return new Promise((resolve) => {
            finish = () => { $.copy(dst, ciphertext); resolve([32, io.EOF]) }
          })
        },
      },
    })
    const typed: io.AsyncReader = reader
    const out = new Uint8Array(32)
    const pending: Promise<IOResult> = typed.Read(out)
    expect(bytes(out)).toEqual(Array<number>(32).fill(0))
    finish()
    const [n, err] = await pending
    expect(n).toBe(32)
    expect(err).toBe(io.EOF)
    expect(bytes(out)).toEqual(bytes(plaintext))
  })

  it('preserves async writer results, short-write identity, and async Close', async () => {
    const closeErr = $.newError('async close failed')
    const writer = new StreamWriter({
      S: NewCTR(aes(), iv),
      W: {
        async Write(data: $.Bytes): Promise<IOResult> {
          expect(bytes(data)).toEqual(bytes(ciphertext))
          return [1, null]
        },
        async Close(): Promise<$.GoError> { return closeErr },
      },
    })
    const pending: Promise<IOResult> = writer.Write(plaintext)
    const [n, err] = await pending
    expect(n).toBe(1)
    expect(err).toBe(io.ErrShortWrite)
    const closing: Promise<$.GoError> | null = writer.Close()
    expect(await closing).toBe(closeErr)
  })

  it('preserves promise rejections without transforming unread bytes', async () => {
    const failure = new Error('read rejected')
    let transformed = false
    const reader = new StreamReader({
      S: { XORKeyStream: () => { transformed = true } },
      R: { Read: (): Promise<IOResult> => Promise.reject(failure) },
    })
    await expect(reader.Read(new Uint8Array(32))).rejects.toBe(failure)
    expect(transformed).toBe(false)
  })

  it('supports promise-returning io.Pipe delegates on await-aware paths', async () => {
    // io.Pipe's public signatures are synchronous, but its runtime returns promises.
    const [r, w] = io.Pipe()
    const reader = new StreamReader({ S: NewCTR(aes(), iv), R: r })
    const writer = new StreamWriter({ S: NewCTR(aes(), iv), W: w })
    const out = new Uint8Array(plaintext.length)
    const [readResult, writeResult] = await Promise.all([reader.Read(out), writer.Write(plaintext)])
    expect(readResult).toEqual([plaintext.length, null])
    expect(writeResult).toEqual([plaintext.length, null])
    expect(bytes(out)).toEqual(bytes(plaintext))
    expect(await writer.Close()).toBeNull()
    expect(await reader.Read(new Uint8Array(1))).toEqual([0, io.EOF])
    expect(r.Close()).toBeNull()
  })
})
