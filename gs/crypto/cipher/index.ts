import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'

export type Block = {
  BlockSize(): number
  Decrypt(dst: $.Bytes, src: $.Bytes): void
  Encrypt(dst: $.Bytes, src: $.Bytes): void
}

$.registerInterfaceType('cipher.Block', null, [
  {
    name: 'BlockSize',
    args: [],
    returns: [{ name: '_r0', type: { kind: $.TypeKind.Basic, name: 'int' } }],
  },
  {
    name: 'Decrypt',
    args: [
      {
        name: 'dst',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'src',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [],
  },
  {
    name: 'Encrypt',
    args: [
      {
        name: 'dst',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'src',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [],
  },
])

export type AEAD = {
  NonceSize(): number
  Open(
    dst: $.Bytes,
    nonce: $.Bytes,
    ciphertext: $.Bytes,
    additionalData: $.Bytes,
  ): [$.Bytes, $.GoError] | Promise<[$.Bytes, $.GoError]>
  Overhead(): number
  Seal(
    dst: $.Bytes,
    nonce: $.Bytes,
    plaintext: $.Bytes,
    additionalData: $.Bytes,
  ): $.Bytes | Promise<$.Bytes>
}

$.registerInterfaceType('cipher.AEAD', null, [
  {
    name: 'NonceSize',
    args: [],
    returns: [{ name: '_r0', type: { kind: $.TypeKind.Basic, name: 'int' } }],
  },
  {
    name: 'Open',
    args: [
      {
        name: 'dst',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'nonce',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'ciphertext',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'additionalData',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [
      {
        name: '_r0',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      { name: '_r1', type: 'error' },
    ],
  },
  {
    name: 'Overhead',
    args: [],
    returns: [{ name: '_r0', type: { kind: $.TypeKind.Basic, name: 'int' } }],
  },
  {
    name: 'Seal',
    args: [
      {
        name: 'dst',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'nonce',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'plaintext',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'additionalData',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [
      {
        name: '_r0',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
  },
])

export type Stream = {
  XORKeyStream(dst: $.Bytes, src: $.Bytes): void
}

export type BlockMode = {
  BlockSize(): number
  CryptBlocks(dst: $.Bytes, src: $.Bytes): void
}

type WebCryptoBlock = Block & {
  webCryptoKey(): Promise<CryptoKey>
}

class webCryptoGCM implements AEAD {
  constructor(
    private readonly block: WebCryptoBlock,
    private readonly nonceSize: number,
    private readonly tagSize: number,
  ) {}

  NonceSize(): number {
    return this.nonceSize
  }

  Overhead(): number {
    return this.tagSize
  }

  async Seal(
    dst: $.Bytes,
    nonce: $.Bytes,
    plaintext: $.Bytes,
    additionalData: $.Bytes,
  ): Promise<$.Bytes> {
    if ($.len(nonce) !== this.nonceSize) {
      throw new Error('crypto/cipher: incorrect nonce length given to GCM')
    }
    const encrypted = await globalThis.crypto.subtle.encrypt(
      this.algorithm(nonce, additionalData),
      await this.block.webCryptoKey(),
      $.bytesToUint8Array(plaintext) as BufferSource,
    )
    return appendBytes(dst, new Uint8Array(encrypted))
  }

  async Open(
    dst: $.Bytes,
    nonce: $.Bytes,
    ciphertext: $.Bytes,
    additionalData: $.Bytes,
  ): Promise<[$.Bytes, $.GoError]> {
    if ($.len(nonce) !== this.nonceSize) {
      throw new Error('crypto/cipher: incorrect nonce length given to GCM')
    }
    try {
      const decrypted = await globalThis.crypto.subtle.decrypt(
        this.algorithm(nonce, additionalData),
        await this.block.webCryptoKey(),
        $.bytesToUint8Array(ciphertext) as BufferSource,
      )
      return [appendBytes(dst, new Uint8Array(decrypted)), null]
    } catch {
      return [null, $.newError('cipher: message authentication failed')]
    }
  }

  private algorithm(nonce: $.Bytes, additionalData: $.Bytes): AesGcmParams {
    const params: AesGcmParams = {
      name: 'AES-GCM',
      iv: $.bytesToUint8Array(nonce) as BufferSource,
      tagLength: this.tagSize * 8,
    }
    if ($.len(additionalData) !== 0) {
      params.additionalData = $.bytesToUint8Array(
        additionalData,
      ) as BufferSource
    }
    return params
  }
}

class webCryptoGCMRandomNonce implements AEAD {
  constructor(private readonly gcm: webCryptoGCM) {}

  NonceSize(): number {
    return 0
  }

  Overhead(): number {
    return 28
  }

  async Seal(
    dst: $.Bytes,
    nonce: $.Bytes,
    plaintext: $.Bytes,
    additionalData: $.Bytes,
  ): Promise<$.Bytes> {
    if ($.len(nonce) !== 0) {
      throw new Error(
        'crypto/cipher: non-empty nonce passed to GCMWithRandomNonce',
      )
    }
    const randomNonce = globalThis.crypto.getRandomValues(new Uint8Array(12))
    const ciphertext = await this.gcm.Seal(
      null,
      randomNonce,
      plaintext,
      additionalData,
    )
    return appendBytes(
      appendBytes(dst, randomNonce),
      $.bytesToUint8Array(ciphertext),
    )
  }

  async Open(
    dst: $.Bytes,
    nonce: $.Bytes,
    ciphertext: $.Bytes,
    additionalData: $.Bytes,
  ): Promise<[$.Bytes, $.GoError]> {
    if ($.len(nonce) !== 0) {
      throw new Error(
        'crypto/cipher: non-empty nonce passed to GCMWithRandomNonce',
      )
    }
    if ($.len(ciphertext) < this.Overhead()) {
      return [null, $.newError('cipher: message authentication failed')]
    }
    const bytes = $.bytesToUint8Array(ciphertext)
    return this.gcm.Open(
      dst,
      bytes.subarray(0, 12),
      bytes.subarray(12),
      additionalData,
    )
  }
}

export function NewGCM(block: Block | null): [AEAD | null, $.GoError] {
  return NewGCMWithNonceSize(block, 12)
}

export function NewGCMWithNonceSize(
  block: Block | null,
  size: number,
): [AEAD | null, $.GoError] {
  return newGCM(block, size, 16)
}

export function NewGCMWithTagSize(
  block: Block | null,
  tagSize: number,
): [AEAD | null, $.GoError] {
  if (tagSize < 12 || tagSize > 16) {
    return [null, $.newError('crypto/cipher: incorrect GCM tag size')]
  }
  return newGCM(block, 12, tagSize)
}

export function NewGCMWithRandomNonce(
  block: Block | null,
): [AEAD | null, $.GoError] {
  if (
    block == null ||
    block.BlockSize() !== 16 ||
    !isWebCryptoBlock(block)
  ) {
    return [
      null,
      $.newError('cipher: NewGCMWithRandomNonce requires aes.Block'),
    ]
  }
  return [
    new webCryptoGCMRandomNonce(new webCryptoGCM(block, 12, 16)),
    null,
  ]
}

export function NewCBCDecrypter(_b: Block | null, _iv: $.Bytes): BlockMode {
  throw new Error('crypto/cipher: CBC is not implemented in GoScript')
}

export function NewCBCEncrypter(_b: Block | null, _iv: $.Bytes): BlockMode {
  throw new Error('crypto/cipher: CBC is not implemented in GoScript')
}

export function NewCFBDecrypter(_b: Block | null, _iv: $.Bytes): Stream {
  throw new Error('crypto/cipher: CFB is not implemented in GoScript')
}

export function NewCFBEncrypter(_b: Block | null, _iv: $.Bytes): Stream {
  throw new Error('crypto/cipher: CFB is not implemented in GoScript')
}

// ctrStream implements CTR over an arbitrary Block, retaining unused keystream
// across calls. Only the counter and one block of keystream are buffered.
class ctrStream implements Stream {
  private readonly counter: Uint8Array
  private readonly keystream: Uint8Array
  private keystreamUsed: number

  constructor(
    private readonly block: Block,
    iv: Uint8Array,
  ) {
    // Buffer.slice() aliases its input, unlike Uint8Array.slice().
    this.counter = new Uint8Array(iv)
    this.keystream = new Uint8Array(iv.length)
    this.keystreamUsed = this.keystream.length
  }

  XORKeyStream(dst: $.Bytes, src: $.Bytes): void {
    const n = $.len(src)
    if ($.len(dst) < n) {
      $.panic('crypto/cipher: output smaller than input')
    }
    if (n === 0) {
      return
    }

    // Normalize Go slice headers without copying their contents. Check the
    // original backing ranges before writing or consuming any keystream.
    const input = $.goSlice(src, 0, n)!
    const output = $.goSlice(dst, 0, n)!
    const [srcBacking, srcOffset] = ctrByteRange(input)
    const [dstBacking, dstOffset] = ctrByteRange(output)
    if (
      srcBacking === dstBacking &&
      srcOffset !== dstOffset &&
      srcOffset < dstOffset + n &&
      dstOffset < srcOffset + n
    ) {
      $.panic('crypto/cipher: invalid buffer overlap')
    }

    let done = 0
    while (done < n) {
      if (this.keystreamUsed === this.keystream.length) {
        this.block.Encrypt(this.keystream, this.counter)
        this.keystreamUsed = 0
        this.incrementCounter()
      }
      const chunk = Math.min(this.keystream.length - this.keystreamUsed, n - done)
      for (let i = 0; i < chunk; i++) {
        output[done + i] = input[done + i] ^ this.keystream[this.keystreamUsed + i]
      }
      done += chunk
      this.keystreamUsed += chunk
    }
  }

  private incrementCounter(): void {
    for (let i = this.counter.length - 1; i >= 0; i--) {
      this.counter[i] = (this.counter[i] + 1) & 0xff
      if (this.counter[i] !== 0) {
        break
      }
    }
  }
}

// Keep storage identity separate from the view object. Both typed-array views
// and GoScript's array-backed slice proxies can alias another slice.
function ctrByteRange(bytes: NonNullable<$.Bytes>): [object, number] {
  if (bytes instanceof Uint8Array) {
    return [bytes.buffer, bytes.byteOffset]
  }
  if ($.isSliceProxy(bytes)) {
    const { backing, offset } = bytes.__meta__
    return [backing, offset]
  }
  return [bytes, 0]
}

export function NewCTR(b: Block | null, iv: $.Bytes): Stream {
  if (b == null) {
    $.panic('cipher.NewCTR: nil block')
  }
  const blockSize = b.BlockSize()
  if (!Number.isSafeInteger(blockSize) || blockSize <= 0) {
    $.panic('cipher.NewCTR: invalid block size')
  }
  if ($.len(iv) !== blockSize) {
    $.panic('cipher.NewCTR: IV length must equal block size')
  }
  return new ctrStream(b, $.bytesToUint8Array(iv))
}

export function NewOFB(_b: Block | null, _iv: $.Bytes): Stream {
  throw new Error('crypto/cipher: OFB is not implemented in GoScript')
}

type StreamIOResult = [number, $.GoError]
type StreamReaderSource = {
  Read(dst: $.Bytes): StreamIOResult | PromiseLike<StreamIOResult>
}
type StreamWriterSink = {
  Write(src: $.Bytes): StreamIOResult | PromiseLike<StreamIOResult>
  Close?(): $.GoError | PromiseLike<$.GoError>
}
type MappedIOResult<T> = T extends PromiseLike<StreamIOResult> ?
  Promise<StreamIOResult>
: StreamIOResult

type StreamCloseResult<W> = W extends { Close(): infer Result } ?
  Result | null
: $.GoError

// A synchronous delegate must remain synchronous for io.MultiReader and other
// synchronous consumers. Promise-returning delegates are transformed only after
// settlement. The conditional type preserves that distinction for TS callers.
function mapStreamIOResult<T extends StreamIOResult | PromiseLike<StreamIOResult>>(
  result: T,
  transform: (result: StreamIOResult) => StreamIOResult,
): MappedIOResult<T> {
  return (
    Array.isArray(result) ? transform(result) : Promise.resolve(result).then(transform)
  ) as MappedIOResult<T>
}

export class StreamReader<R extends StreamReaderSource = io.Reader> {
  S: Stream | null
  R: R | null

  constructor(init?: Partial<{ S: Stream | null; R: R | null }>) {
    this.S = init?.S ?? null
    this.R = init?.R ?? null
  }

  Read(dst: $.Bytes): MappedIOResult<ReturnType<R['Read']>> {
    const reader = this.R
    const stream = this.S
    if (reader == null) {
      $.panic('crypto/cipher: StreamReader has nil reader')
    }
    const result = reader.Read(dst) as ReturnType<R['Read']>
    return mapStreamIOResult(result, ([n, err]) => {
      if (stream == null) {
        $.panic('crypto/cipher: StreamReader has nil stream')
      }
      const data = $.goSlice(dst, 0, n)
      stream.XORKeyStream(data, data)
      return [n, err]
    })
  }
}

// As in Go, discard a StreamWriter after a short write: the stream has already
// advanced for all of src. Close only forwards Close; there is nothing to flush.
export class StreamWriter<W extends StreamWriterSink = io.Writer> {
  S: Stream | null
  W: W | null
  Err: $.GoError // Unused; retained for compatibility with Go's public struct.

  constructor(init?: Partial<{ S: Stream | null; W: W | null; Err: $.GoError }>) {
    this.S = init?.S ?? null
    this.W = init?.W ?? null
    this.Err = init?.Err ?? null
  }

  Write(src: $.Bytes): MappedIOResult<ReturnType<W['Write']>> {
    const writer = this.W
    if (this.S == null) {
      $.panic('crypto/cipher: StreamWriter has nil stream')
    }
    const nsrc = $.len(src)
    const ciphertext = new Uint8Array(nsrc)
    this.S.XORKeyStream(ciphertext, src)
    if (writer == null) {
      $.panic('crypto/cipher: StreamWriter has nil writer')
    }
    const result = writer.Write(ciphertext) as ReturnType<W['Write']>
    return mapStreamIOResult(result, ([n, err]) => [
      n,
      n !== nsrc && err == null ? io.ErrShortWrite : err,
    ])
  }

  Close(): StreamCloseResult<W> {
    const writer = this.W
    if (writer != null && typeof writer.Close === 'function') {
      return writer.Close() as StreamCloseResult<W>
    }
    return null as StreamCloseResult<W>
  }
}

function newGCM(
  block: Block | null,
  nonceSize: number,
  tagSize: number,
): [AEAD | null, $.GoError] {
  if (block == null || block.BlockSize() !== 16) {
    return [null, $.newError('cipher: NewGCM requires 128-bit block cipher')]
  }
  if (nonceSize <= 0) {
    return [null, $.newError('crypto/cipher: incorrect GCM nonce size')]
  }
  if (!isWebCryptoBlock(block)) {
    return [
      null,
      $.newError(
        'crypto/cipher: AES-GCM requires a WebCrypto AES block in GoScript',
      ),
    ]
  }
  return [new webCryptoGCM(block, nonceSize, tagSize), null]
}

function isWebCryptoBlock(block: Block): block is WebCryptoBlock {
  return typeof (block as Partial<WebCryptoBlock>).webCryptoKey === 'function'
}

function appendBytes(dst: $.Bytes, bytes: Uint8Array): $.Bytes {
  if (bytes.length === 0) {
    return dst
  }
  if (dst === null || $.cap(dst) === 0) {
    return bytes
  }
  return $.appendSlice(dst, bytes, $.byteSliceHint)
}
