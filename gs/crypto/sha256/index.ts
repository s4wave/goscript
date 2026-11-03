import { sha224, sha256 } from '@noble/hashes/sha2.js'

import * as $ from '@goscript/builtin/index.js'
import {
  getHostRuntime,
  type NodeCryptoHash,
} from '@goscript/builtin/hostio.js'
import * as crypto from '@goscript/crypto/index.js'

export const Size = 32
export const Size224 = 28
export const BlockSize = 64

type ShaAlgorithm = 'sha224' | 'sha256'

class Sha256Error {
  constructor(private readonly message: string) {}

  Error(): string {
    return this.message
  }
}

class Digest {
  // hash owns only incremental digest state; copies never retain prior input.
  private hash: NodeCryptoHash | ReturnType<typeof sha256.create>

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
    return (this.algorithm === 'sha224' ? sha224 : sha256).create()
  }

  // copyState copies fixed-size compression state and its partial block only.
  private copyState(): Digest['hash'] {
    return 'clone' in this.hash ? this.hash.clone() : this.hash.copy!()
  }

  Size(): number {
    return this.algorithm === 'sha224' ? Size224 : Size
  }

  BlockSize(): number {
    return BlockSize
  }
}

export function New(): any {
  return new Digest('sha256')
}

export function New224(): any {
  return new Digest('sha224')
}

crypto.RegisterHash(crypto.SHA224, New224)
crypto.RegisterHash(crypto.SHA256, New)

export async function Sum224(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha224', data)
}

export async function Sum256(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha256', data)
}

async function sum(
  algorithm: ShaAlgorithm,
  data: $.Bytes,
): Promise<Uint8Array> {
  const hash = createNodeHash(algorithm)
  if (hash != null) {
    return new Uint8Array(hash.update($.bytesToUint8Array(data)).digest())
  }

  if (algorithm === 'sha224') {
    return sha224($.bytesToUint8Array(data))
  }

  const subtle = subtleCrypto()
  if (subtle == null) {
    throw new Error(
      new Sha256Error('crypto/sha256: WebCrypto digest is unavailable').Error(),
    )
  }

  const digest = await subtle.digest(
    'SHA-256',
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
