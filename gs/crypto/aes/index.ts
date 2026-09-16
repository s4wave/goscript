import * as $ from '@goscript/builtin/index.js'
import type * as cipher from '@goscript/crypto/cipher/index.js'
import { ecb } from '@noble/ciphers/aes.js'

export const BlockSize = 16

export type KeySizeError = number

export class AESBlock implements cipher.Block {
  private keyPromise: Promise<CryptoKey> | null = null

  private readonly key: Uint8Array

  constructor(key: Uint8Array) {
    // Buffer.slice() is a view. Own the key even for direct AESBlock callers.
    this.key = new Uint8Array(key)
  }

  BlockSize(): number {
    return BlockSize
  }

  Encrypt(dst: $.Bytes, src: $.Bytes): void {
    const srcBytes = $.bytesToUint8Array(src)
    if (srcBytes.length < BlockSize) {
      $.panic('crypto/aes: input not full block')
    }
    if ($.len(dst) < BlockSize) {
      $.panic('crypto/aes: output not full block')
    }
    checkBlockOverlap(dst, src)
    const out = ecb(this.key, { disablePadding: true }).encrypt(
      srcBytes.subarray(0, BlockSize),
    )
    $.copy(dst, out)
  }

  Decrypt(dst: $.Bytes, src: $.Bytes): void {
    const srcBytes = $.bytesToUint8Array(src)
    if (srcBytes.length < BlockSize) {
      $.panic('crypto/aes: input not full block')
    }
    if ($.len(dst) < BlockSize) {
      $.panic('crypto/aes: output not full block')
    }
    checkBlockOverlap(dst, src)
    const out = ecb(this.key, { disablePadding: true }).decrypt(
      srcBytes.subarray(0, BlockSize),
    )
    $.copy(dst, out)
  }

  async webCryptoKey(): Promise<CryptoKey> {
    this.keyPromise ??= subtleCrypto().importKey(
      'raw',
      this.key as BufferSource,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt'],
    )
    return this.keyPromise
  }
}

export function KeySizeError_Error(k: KeySizeError): string {
  return `crypto/aes: invalid key size ${k}`
}

export function NewCipher(key: $.Bytes): [cipher.Block | null, $.GoError] {
  const k = $.len(key)
  if (k !== 16 && k !== 24 && k !== 32) {
    return [null, $.newError(KeySizeError_Error(k))]
  }
  return [new AESBlock($.bytesToUint8Array(key)), null]
}

// Check only the block being read/written, not unused source/destination tails.
// Normalization must preserve storage identity; bytesToUint8Array may copy a
// number-backed Go slice and thereby hide an invalid overlap.
function checkBlockOverlap(dst: $.Bytes, src: $.Bytes): void {
  const [srcBacking, srcOffset] = blockByteRange($.goSlice(src, 0, BlockSize)!)
  const [dstBacking, dstOffset] = blockByteRange($.goSlice(dst, 0, BlockSize)!)
  if (
    srcBacking === dstBacking &&
    srcOffset !== dstOffset &&
    srcOffset < dstOffset + BlockSize &&
    dstOffset < srcOffset + BlockSize
  ) {
    $.panic('crypto/aes: invalid buffer overlap')
  }
}

function blockByteRange(bytes: NonNullable<$.Bytes>): [object, number] {
  if (bytes instanceof Uint8Array) {
    return [bytes.buffer, bytes.byteOffset]
  }
  if ($.isSliceProxy(bytes)) {
    const { backing, offset } = bytes.__meta__
    return [backing, offset]
  }
  return [bytes, 0]
}

function subtleCrypto(): SubtleCrypto {
  const subtle = globalThis.crypto?.subtle
  if (subtle == null) {
    throw new Error('crypto/aes: WebCrypto AES-GCM is unavailable')
  }
  return subtle
}
