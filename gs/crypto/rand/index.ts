import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'

const base32alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const maxGetRandomValuesBytes = 65536

class RandError {
  constructor(private readonly message: string) {}

  Error(): string {
    return this.message
  }
}

class WebCryptoReader implements io.Reader {
  Read(p: $.Bytes): [number, $.GoError] {
    const err = fillSecureBytes(p)
    if (err != null) {
      return [0, err]
    }
    return [$.len(p), null]
  }
}

export let Reader: io.Reader = new WebCryptoReader()

export function Read(b: $.Bytes): io.Awaitable<io.IOResult> {
  return io.runIO(fill(Reader, b))
}

export function Int(rand: io.Reader | null, max: any): io.Awaitable<[any, $.GoError]> {
  return io.runIO((function* (): Generator<io.Awaitable<io.IOResult>, [any, $.GoError], io.IOResult> {
    if (max == null || typeof max.Sign !== 'function' || max.Sign() <= 0) {
      $.panic('crypto/rand: argument to Int is <= 0')
    }

    let bitLen = max.BitLen()
    // (max-1).BitLen() differs from max.BitLen() exactly at powers of two.
    // Detect that boundary without modifying the caller's big.Int.
    const topBit = new Uint8Array(Math.ceil(bitLen / 8))
    topBit[0] = 1 << ((bitLen - 1) % 8)
    const boundary = new max.constructor()
    boundary.SetBytes(topBit)
    if (boundary.Cmp(max) === 0) bitLen--
    if (bitLen === 0) return [new max.constructor(), null]
    const byteLen = Math.ceil(bitLen / 8)
    const excessBits = byteLen * 8 - bitLen
    const reader = rand ?? Reader

    while (true) {
      const bytes = new Uint8Array(byteLen)
      const [, err] = yield* fill(reader, bytes)
      if (err != null) return [null, err]
      if (excessBits > 0) {
        bytes[0] &= 0xff >>> excessBits
      }

      const candidate = new max.constructor()
      candidate.SetBytes(bytes)
      if (candidate.Cmp(max) < 0) {
        return [candidate, null]
      }
    }
  })())
}

export async function Prime(
  rand: io.Reader | null,
  bits: number,
): Promise<[any, $.GoError]> {
  if (bits < 2) {
    return [
      null,
      new RandError('crypto/rand: prime size must be at least 2-bit'),
    ]
  }

  const bitOffset = bits % 8
  const topBits = bitOffset === 0 ? 8 : bitOffset
  const bytes = new Uint8Array(Math.ceil(bits / 8))
  const reader = rand ?? Reader

  while (true) {
    const err = await readFull(reader, bytes)
    if (err != null) {
      return [null, err]
    }

    bytes[0] &= (1 << topBits) - 1
    if (topBits >= 2) {
      bytes[0] |= 3 << (topBits - 2)
    } else {
      bytes[0] |= 1
      if (bytes.length > 1) {
        bytes[1] |= 0x80
      }
    }
    bytes[bytes.length - 1] |= 1

    const candidate = newBigInt()
    candidate.SetBytes(bytes)
    if (await candidate.ProbablyPrime(20)) {
      return [candidate, null]
    }
  }
}

export async function Text(): Promise<string> {
  const src = new Uint8Array(26)
  const [, err] = await Read(src)
  if (err != null) {
    throw new Error(await err.Error())
  }

  let out = ''
  for (const b of src) {
    out += base32alphabet[b % 32]
  }
  return out
}

function newBigInt(): any {
  const info = $.getTypeByName('big.Int') as
    | { zeroValue?: unknown; ctor?: new () => unknown }
    | undefined
  if (info?.zeroValue !== undefined) {
    return typeof info.zeroValue === 'function' ?
        (info.zeroValue as () => unknown)()
      : info.zeroValue
  }
  if (info?.ctor != null) {
    return new info.ctor()
  }
  throw new Error('crypto/rand: math/big.Int type is not registered')
}

function readFull(reader: io.Reader, dst: Uint8Array): io.Awaitable<$.GoError> {
  return io.mapResult(io.runIO(fill(reader, dst)), ([, err]) => err)
}

// Readers may legally return fewer bytes than requested, or data with an error.
// Candidate generation must fill the entire buffer before using any entropy.
function* fill(
  reader: io.Reader,
  dst: $.Bytes,
): Generator<io.Awaitable<io.IOResult>, io.IOResult, io.IOResult> {
  let offset = 0
  while (offset < $.len(dst)) {
    const [n, err] = yield reader.Read($.goSlice(dst, offset))
    if (!Number.isInteger(n) || n < 0 || n > $.len(dst) - offset) {
      return [offset, new RandError('crypto/rand: invalid Read result')]
    }
    offset += n
    if (offset === $.len(dst)) return [offset, null]
    if (err != null) return [offset, err === io.EOF && offset > 0 ? io.ErrUnexpectedEOF : err]
  }
  return [offset, null]
}

function fillSecureBytes(dst: $.Bytes): $.GoError {
  const length = $.len(dst)
  if (length === 0) {
    return null
  }

  const crypto = secureCrypto()
  if (crypto == null) {
    return new RandError(
      'crypto/rand: Web Crypto getRandomValues is unavailable',
    )
  }

  if (dst instanceof Uint8Array) {
    fillUint8Array(crypto, dst)
    return null
  }

  const tmp = new Uint8Array(length)
  fillUint8Array(crypto, tmp)
  $.copy(dst, tmp)
  return null
}

function fillUint8Array(crypto: Crypto, dst: Uint8Array): void {
  for (let offset = 0; offset < dst.length; offset += maxGetRandomValuesBytes) {
    const chunk = dst.subarray(
      offset,
      Math.min(offset + maxGetRandomValuesBytes, dst.length),
    ) as Uint8Array<ArrayBuffer>
    crypto.getRandomValues(chunk)
  }
}

function secureCrypto(): Crypto | null {
  const crypto = globalThis.crypto
  if (crypto && typeof crypto.getRandomValues === 'function') {
    return crypto
  }
  return null
}
