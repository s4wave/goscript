import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import { NewCipher } from '@goscript/crypto/aes/index.js'

import {
  NewCTR,
  NewGCMWithRandomNonce,
  StreamReader,
  StreamWriter,
} from './index.js'

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function hex(value: string): Uint8Array {
  const out = new Uint8Array(value.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(value.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

describe('crypto/cipher override', () => {
  it('seals and opens GCM payloads with a prepended random nonce', async () => {
    const [block, blockErr] = NewCipher(new Uint8Array(16))
    expect(blockErr).toBeNull()
    const [aead, aeadErr] = NewGCMWithRandomNonce(block)
    expect(aeadErr).toBeNull()
    expect(aead?.NonceSize()).toBe(0)
    expect(aead?.Overhead()).toBe(28)

    const plaintext = $.stringToBytes('goscript')
    const additionalData = $.stringToBytes('quic token')
    const sealed = await aead!.Seal(null, null, plaintext, additionalData)
    expect($.len(sealed)).toBe($.len(plaintext) + 28)

    const [opened, openErr] = await aead!.Open(
      null,
      null,
      sealed,
      additionalData,
    )
    expect(openErr).toBeNull()
    expect($.bytesToUint8Array(opened)).toEqual(
      $.bytesToUint8Array(plaintext),
    )
  })

  it('rejects non-empty explicit nonces', async () => {
    const [block] = NewCipher(new Uint8Array(16))
    const [aead] = NewGCMWithRandomNonce(block)

    await expect(
      aead!.Seal(null, new Uint8Array([1]), null, null),
    ).rejects.toThrow(
      'crypto/cipher: non-empty nonce passed to GCMWithRandomNonce',
    )
  })
})

describe('crypto/cipher CTR override', () => {
  // NIST SP 800-38A F.5.1 CTR-AES128.Encrypt vector 2.
  const key = hex('2b7e151628aed2a6abf7158809cf4f3c')
  const iv = hex('f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff')
  const plaintext = hex(
    '6bc1bee22e409f96e93d7e117393172a' +
      'ae2d8a571e03ac9c9eb76fac45af8e51',
  )
  const ciphertext = hex(
    '874d6191b620e3261bef6864990db6ce' +
      '9806f66b7970fdff8617187bb9fffdff',
  )

  it('produces the NIST CTR-AES128 vector', () => {
    const [block, err] = NewCipher(key)
    expect(err).toBeNull()
    const stream = NewCTR(block, iv)
    const dst = new Uint8Array(plaintext.length)
    stream.XORKeyStream(dst, plaintext)
    expect(toHex(dst)).toBe(toHex(ciphertext))
  })

  it('round-trips through XORKeyStream', () => {
    const [block] = NewCipher(key)
    const stream = NewCTR(block, iv)
    const dst = new Uint8Array(plaintext.length)
    stream.XORKeyStream(dst, plaintext)
    const round = new Uint8Array(plaintext.length)
    NewCTR(block, iv).XORKeyStream(round, dst)
    expect(toHex(round)).toBe(toHex(plaintext))
  })

  it('keeps the counter across partial-block XORKeyStream calls', () => {
    const [block] = NewCipher(key)
    const stream = NewCTR(block, iv)
    const whole = new Uint8Array(plaintext.length)
    NewCTR(block, iv).XORKeyStream(whole, plaintext)

    const split = new Uint8Array(plaintext.length)
    stream.XORKeyStream(split.subarray(0, 5), plaintext.subarray(0, 5))
    stream.XORKeyStream(split.subarray(5), plaintext.subarray(5))
    expect(toHex(split)).toBe(toHex(whole))
  })

  it('XORs in place when dst and src alias the same buffer', () => {
    const [block] = NewCipher(key)
    const stream = NewCTR(block, iv)
    const buf = plaintext.slice()
    stream.XORKeyStream(buf, buf)
    expect(toHex(buf)).toBe(toHex(ciphertext))
  })

  it('rejects an IV that does not match the block size', () => {
    const [block] = NewCipher(key)
    expect(() => NewCTR(block, new Uint8Array(8))).toThrow(
      'cipher.NewCTR: IV length must equal block size',
    )
  })

  it('writes encrypted bytes through a StreamWriter', async () => {
    const [block] = NewCipher(key)
    const stream = NewCTR(block, iv)
    const written: Uint8Array[] = []
    const writer = {
      Write(p: $.Bytes): [number, $.GoError] {
        written.push(new Uint8Array($.bytesToUint8Array(p)))
        return [$.len(p), null]
      },
    }
    const sw = new StreamWriter({ S: stream, W: writer })
    const [n, err] = await sw.Write(plaintext)
    expect(err).toBeNull()
    expect(n).toBe(plaintext.length)
    expect(toHex(written[0])).toBe(toHex(ciphertext))
  })

  it('reads and decrypts through a StreamReader', async () => {
    const [block] = NewCipher(key)
    const encrypted = new Uint8Array(plaintext.length)
    NewCTR(block, iv).XORKeyStream(encrypted, plaintext)
    const reader = {
      pos: 0,
      Read(p: $.Bytes): [number, $.GoError] {
        const n = Math.min(7, encrypted.length - this.pos)
        $.copyByteRanges(p, 0, n, encrypted, this.pos, this.pos + n)
        this.pos += n
        return [n, null]
      },
    }
    const sr = new StreamReader({ S: NewCTR(block, iv), R: reader })
    const dst = new Uint8Array(plaintext.length)
    let total = 0
    while (total < plaintext.length) {
      const [n] = await sr.Read($.goSlice(dst, total))
      if (n === 0) break
      total += n
    }
    expect(total).toBe(plaintext.length)
    expect(toHex(dst)).toBe(toHex(plaintext))
  })
})
