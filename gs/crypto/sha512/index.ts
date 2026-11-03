import { sha384, sha512, sha512_224, sha512_256 } from '@noble/hashes/sha2.js'

import * as $ from '@goscript/builtin/index.js'
import {
  getHostRuntime,
  type NodeCryptoHash,
} from '@goscript/builtin/hostio.js'

export const Size = 64
export const Size224 = 28
export const Size256 = 32
export const Size384 = 48
export const BlockSize = 128

type ShaAlgorithm = 'sha384' | 'sha512' | 'sha512-224' | 'sha512-256'

class Digest {
  // hash owns only incremental digest state; copies never retain prior input.
  private hash: NodeCryptoHash | ReturnType<typeof sha512.create>

  constructor(
    private readonly algorithm: ShaAlgorithm,
    state?: Digest['hash'],
  ) {
    this.hash = state ?? this.newState()
  }

  Write(p: $.Bytes): [number, $.GoError] {
    const bytes = $.bytesToUint8Array(p)
    this.hash.update(bytes)
    return [bytes.length, null]
  }

  async Sum(b: $.Bytes): Promise<$.Bytes> {
    return appendDigest(b, new Uint8Array(this.copyState().digest()))
  }

  Reset(): void {
    this.hash = this.newState()
  }

  // Clone forks the current state; writes, Sum and Reset stay independent.
  Clone(): [Digest, $.GoError] {
    return [new Digest(this.algorithm, this.copyState()), null]
  }

  // newState keeps native acceleration when the host can copy its state.
  private newState(): Digest['hash'] {
    const native = createNodeHash(this.algorithm)
    if (typeof native?.copy === 'function') return native
    switch (this.algorithm) {
      case 'sha384':
        return sha384.create()
      case 'sha512-224':
        return sha512_224.create()
      case 'sha512-256':
        return sha512_256.create()
      default:
        return sha512.create()
    }
  }

  // copyState copies fixed-size compression state and its partial block only.
  private copyState(): Digest['hash'] {
    return 'clone' in this.hash ? this.hash.clone() : this.hash.copy!()
  }

  Size(): number {
    switch (this.algorithm) {
      case 'sha384':
        return Size384
      case 'sha512-224':
        return Size224
      case 'sha512-256':
        return Size256
      default:
        return Size
    }
  }

  BlockSize(): number {
    return BlockSize
  }
}

export function New(): any {
  return new Digest('sha512')
}

export function New384(): any {
  return new Digest('sha384')
}

export function New512_224(): any {
  return new Digest('sha512-224')
}

export function New512_256(): any {
  return new Digest('sha512-256')
}

export async function Sum384(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha384', data)
}

export async function Sum512(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha512', data)
}

export async function Sum512_224(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha512-224', data)
}

export async function Sum512_256(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha512-256', data)
}

async function sum(
  algorithm: ShaAlgorithm,
  data: $.Bytes,
): Promise<Uint8Array> {
  const hash = createNodeHash(algorithm)
  if (hash != null) {
    return new Uint8Array(hash.update($.bytesToUint8Array(data)).digest())
  }

  const subtle = subtleCrypto()
  if (subtle == null || (algorithm !== 'sha384' && algorithm !== 'sha512')) {
    throw new Error(`crypto/sha512: ${algorithm} digest is unavailable`)
  }

  const digest = await subtle.digest(
    algorithm === 'sha384' ? 'SHA-384' : 'SHA-512',
    $.bytesToUint8Array(data) as BufferSource,
  )
  return new Uint8Array(digest)
}

function appendDigest(prefix: $.Bytes, digest: Uint8Array): $.Bytes {
  return $.appendSlice(prefix as any, digest, $.byteSliceHint) as $.Bytes
}

function createNodeHash(algorithm: ShaAlgorithm): NodeCryptoHash | null {
  const nodeCrypto = getHostRuntime().nodeCrypto
  if (!nodeCrypto?.createHash) {
    return null
  }
  try {
    return nodeCrypto.createHash(algorithm)
  } catch {
    return null
  }
}

function subtleCrypto(): SubtleCrypto | null {
  const crypto = globalThis.crypto
  if (crypto?.subtle && typeof crypto.subtle.digest === 'function') {
    return crypto.subtle
  }
  return null
}
