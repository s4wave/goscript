import {
  ZStream,
  Z_BLOCK,
  Z_BUF_ERROR,
  Z_FINISH,
  Z_NEED_DICT,
  Z_NO_FLUSH,
  Z_OK,
  Z_STREAM_END,
  Z_SYNC_FLUSH,
  type Z_FlushMode,
  zlibDeflate,
  zlibDeflateEnd,
  zlibDeflateInit2,
  zlibDeflateSetDictionary,
  zlibInflate,
  zlibInflateEnd,
  zlibInflateInit2,
  zlibInflateSetDictionary,
} from 'pako'

import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'

import { adler32, crc32 } from './checksum.js'

export const chunkSize = 32 * 1024

// released replaces a stream's buffers between operations so the stream does
// not retain the caller's input or a spent output chunk.
const released = new Uint8Array(0)

export type Format = 'gzip' | 'zlib'
type Operation<T> = Generator<io.Awaitable<io.IOResult>, T, io.IOResult>

export type GzipHeader = {
  name: string
  comment: string
  extra: $.Bytes
  time: number
  os: number
}

// A queued operation owns its arguments. Completed synchronous operations do not
// create promises. Reset is only valid after pending operations have settled.
class Serial {
  private pending: Promise<unknown> | null = null

  run<T>(operation: () => io.Awaitable<T>): io.Awaitable<T> {
    const result = this.pending == null ? operation() : this.pending.then(operation)
    if (!io.isAsync(result)) return result
    const tracked = Promise.resolve(result).then(
      value => { if (this.pending === tracked) this.pending = null; return value },
      error => { if (this.pending === tracked) this.pending = null; throw error },
    )
    this.pending = tracked
    return tracked
  }

  assertIdle(): void {
    if (this.pending != null) $.panic('compress: Reset during pending I/O')
  }
}

export function validLevel(level: number): boolean {
  return Number.isInteger(level) && level >= -2 && level <= 9
}

function word(value: number, littleEndian = false): Uint8Array {
  const bytes = new Uint8Array(4)
  new DataView(bytes.buffer).setUint32(0, value >>> 0, littleEndian)
  return bytes
}

function gzipHeader(header: GzipHeader, level: number): [Uint8Array | null, $.GoError] {
  const extra = new Uint8Array($.bytesToUint8Array(header.extra))
  if (extra.length > 65535) return [null, $.newError('gzip.Write: Extra data is too large')]
  for (const value of [header.name, header.comment]) {
    for (const char of value) {
      const code = char.codePointAt(0)!
      if (code === 0 || code > 255) return [null, $.newError('gzip.Write: non-Latin-1 header string')]
    }
  }
  const flags = (header.extra !== null ? 4 : 0) | (header.name ? 8 : 0) | (header.comment ? 16 : 0)
  const out = [31, 139, 8, flags, ...word(header.time > 0 ? header.time : 0, true), level === 9 ? 2 : level === 1 ? 4 : 0, header.os & 255]
  if (header.extra !== null) {
    out.push(extra.length & 255, extra.length >>> 8)
    for (const byte of extra) out.push(byte)
  }
  for (const value of [header.name, header.comment]) {
    if (value) {
      for (const char of value) out.push(char.charCodeAt(0))
      out.push(0)
    }
  }
  return [new Uint8Array(out), null]
}

export class Deflater {
  private stream: ZStream | null = null
  private checksum: number
  private size = 0
  private error: $.GoError = null
  private closed = false
  private closeResult: io.Awaitable<$.GoError> | undefined
  private readonly queue = new Serial()
  private readonly dictionary: Uint8Array | null

  constructor(
    private readonly format: Format,
    private writer: io.Writer | null,
    private readonly level: number,
    dictionary: $.Bytes = null,
    private readonly header?: () => GzipHeader,
  ) {
    this.dictionary = dictionary === null ? null : new Uint8Array($.bytesToUint8Array(dictionary))
    this.checksum = format === 'gzip' ? 0 : 1
  }

  Write(p: $.Bytes): io.Awaitable<io.IOResult> {
    if (this.closed) return [0, this.error ?? $.newError('flate: closed writer')]
    const input = new Uint8Array($.bytesToUint8Array(p))
    return this.queue.run(() => io.runIO(this.process(input, Z_NO_FLUSH)))
  }

  Flush(): io.Awaitable<$.GoError> {
    if (this.closed) return this.error ?? $.newError('flate: closed writer')
    return this.queue.run(() => io.mapResult(io.runIO(this.process(new Uint8Array(0), Z_SYNC_FLUSH)), ([, err]) => err))
  }

  Close(): io.Awaitable<$.GoError> {
    if (this.closeResult !== undefined) return this.closeResult
    this.closed = true
    this.closeResult = this.queue.run(() => io.mapResult(
      io.runIO(this.process(new Uint8Array(0), Z_FINISH)),
      ([, err]) => { this.release(); return err },
    ))
    return this.closeResult
  }

  Reset(writer: io.Writer | null): void {
    this.queue.assertIdle()
    this.release()
    this.writer = writer
    this.size = 0
    this.checksum = this.format === 'gzip' ? 0 : 1
    this.error = null
    this.closed = false
    this.closeResult = undefined
  }

  private release(): void {
    if (this.stream != null) zlibDeflateEnd(this.stream)
    this.stream = null
  }

  private *emit(data: Uint8Array): Operation<$.GoError> {
    if (this.writer == null) return $.newError(`${this.format}: nil writer`)
    const writer = $.pointerValue<io.Writer>(this.writer)
    const [n, err] = yield writer.Write(data)
    return err ?? (n !== data.length ? io.ErrShortWrite : null)
  }

  private *initialize(): Operation<$.GoError> {
    if (!validLevel(this.level)) return $.newError(`${this.format}: invalid compression level: ${this.level}`)
    const stream = new ZStream()
    const status = zlibDeflateInit2(stream, this.level === -2 ? -1 : this.level, 8, -15, 8, this.level === -2 ? 2 : 0)
    if (status !== Z_OK) return $.newError(`flate: ${stream.msg || 'initialization failed'}`)
    this.stream = stream
    if (this.dictionary != null) {
      const status = zlibDeflateSetDictionary(stream, this.dictionary)
      if (status !== Z_OK) return $.newError(`flate: ${stream.msg || 'invalid dictionary'}`)
    }
    let header: Uint8Array
    if (this.format === 'gzip') {
      const [data, err] = gzipHeader(this.header!(), this.level)
      if (err != null) return err
      header = data!
    } else {
      const level = this.level === -1 ? 6 : this.level
      const flags = (level < 2 ? 0 : level < 6 ? 1 : level === 6 ? 2 : 3) << 6
      let value = 0x7800 | flags | (this.dictionary != null ? 32 : 0)
      value += (31 - value % 31) % 31
      header = new Uint8Array(this.dictionary == null ? 2 : 6)
      header.set([value >>> 8, value & 255])
      if (this.dictionary != null) header.set(word(adler32(1, this.dictionary, this.dictionary.length, 0)), 2)
    }
    return yield* this.emit(header)
  }

  private *process(input: Uint8Array, flush: Z_FlushMode): Operation<io.IOResult> {
    if (this.error != null) return [0, this.error]
    if (this.stream == null) {
      this.error = yield* this.initialize()
      if (this.error != null) return [0, this.error]
    }
    const stream = this.stream!
    stream.input = input
    stream.next_in = 0
    stream.avail_in = input.length
    let accepted = 0
    const output = new Uint8Array(chunkSize)
    try {
      while (true) {
        stream.output = output
        stream.next_out = 0
        stream.avail_out = output.length
        const offset = stream.next_in
        const status = zlibDeflate(stream, flush)
        const n = stream.next_in - offset
        this.checksum = (this.format === 'gzip' ? crc32 : adler32)(this.checksum, input, n, offset)
        this.size = (this.size + n) >>> 0
        accepted += n
        if (status !== Z_OK && status !== Z_STREAM_END && status !== Z_BUF_ERROR) {
          this.error = $.newError(`flate: ${stream.msg || `codec error ${status}`}`)
          return [accepted, this.error]
        }
        if (stream.next_out > 0) {
          this.error = yield* this.emit(output.subarray(0, stream.next_out))
          if (this.error != null) return [accepted, this.error]
        }
        if (status === Z_STREAM_END) {
          const trailer = this.format === 'gzip' ?
            new Uint8Array([...word(this.checksum, true), ...word(this.size, true)]) : word(this.checksum)
          this.error = yield* this.emit(trailer)
          return [accepted, this.error]
        }
        if (stream.avail_in === 0 && stream.avail_out > 0) return [accepted, null]
      }
    } finally {
      stream.input = released
      stream.avail_in = 0
      stream.output = released
    }
  }
}

// A Reader may overread into its bounded scratch buffer. A ByteReader is used
// byte-exactly so framed protocols can retain bytes following a member. This
// never emulates ReadByte with one-byte Reader.Read calls.
class Input {
  readonly buffer = new Uint8Array(chunkSize)
  offset = 0
  available = 0
  private terminal: $.GoError = null
  private readonly byteReader: io.ByteReader | null

  constructor(private readonly reader: io.Reader) {
    this.byteReader = 'ReadByte' in reader && typeof reader.ReadByte === 'function' ?
      reader as io.Reader & io.ByteReader : null
  }

  *fill(): Operation<$.GoError> {
    if (this.available > 0) return null
    if (this.terminal != null) return this.terminal
    this.offset = 0
    if (this.byteReader != null) {
      const [value, err] = yield this.byteReader.ReadByte()
      if (err != null) { this.terminal = err; return err }
      this.buffer[0] = value
      this.available = 1
      return null
    }
    for (let empty = 0; empty < 100; empty++) {
      const [n, err] = yield this.reader.Read(this.buffer)
      if (!Number.isInteger(n) || n < 0 || n > this.buffer.length) {
        this.terminal = $.newError('compress: invalid Read result')
        return this.terminal
      }
      this.available = n
      this.terminal = err
      if (n > 0) return null
      if (err != null) return err
    }
    this.terminal = io.ErrNoProgress
    return this.terminal
  }

  *byte(record: number[]): Operation<io.IOResult> {
    const err = yield* this.fill()
    if (err != null) return [0, err]
    const byte = this.buffer[this.offset++]
    this.available--
    record.push(byte)
    return [byte, null]
  }

  consume(n: number): void {
    this.offset += n
    this.available -= n
  }
}

export type DecodeErrors = {
  header: () => $.GoError
  checksum: () => $.GoError
  dictionary: () => $.GoError
}

// The low-level codec receives each compressed byte only once. Headers are
// parsed separately for Go metadata and constructor errors, then supplied once
// to the wrapped inflater, which validates trailers and checksums incrementally.
export class Inflater {
  header: GzipHeader = { name: '', comment: '', extra: null, time: 0, os: 255 }
  private stream: ZStream | null = null
  private input: Input | null = null
  private dictionary = new Uint8Array(0)
  private error: $.GoError = null
  private ended = false
  private bodyEnded = false
  private bodyError: $.GoError = null
  private closed = false
  private multistream = true
  private readonly queue = new Serial()

  constructor(private readonly format: Format, private readonly errors: DecodeErrors) {}

  Reset(reader: io.Reader | null, dictionary: $.Bytes = null): io.Awaitable<$.GoError> {
    this.queue.assertIdle()
    this.release()
    this.input = reader == null ? null : new Input($.pointerValue<io.Reader>(reader))
    this.dictionary = new Uint8Array($.bytesToUint8Array(dictionary))
    this.header = { name: '', comment: '', extra: null, time: 0, os: 255 }
    this.error = null
    this.ended = false
    this.bodyEnded = false
    this.bodyError = null
    this.closed = false
    this.multistream = true
    return this.queue.run(() => io.mapResult(io.runIO(this.initialize(true)), err => {
      this.error = err
      return err
    }))
  }

  Multistream(enabled: boolean): void { this.multistream = enabled }

  Read(p: $.Bytes): io.Awaitable<io.IOResult> {
    return this.queue.run(() => io.runIO(this.read(p)))
  }

  Close(): io.Awaitable<$.GoError> {
    return this.queue.run(() => {
      this.closed = true
      this.release()
      if (this.format === 'gzip') return this.bodyError
      return this.error === io.EOF ? null : this.error
    })
  }

  private release(): void {
    if (this.stream != null) zlibInflateEnd(this.stream)
    this.stream = null
  }

  private *initialize(first: boolean): Operation<$.GoError> {
    const input = this.input
    if (input == null) return $.newError(`${this.format}: nil reader`)
    const bytes: number[] = []
    const fixed = this.format === 'gzip' ? 10 : 2
    for (let index = 0; index < fixed; index++) {
      const [, err] = yield* input.byte(bytes)
      if (err != null) return err === io.EOF && (index > 0 || this.format === 'zlib') ? io.ErrUnexpectedEOF : err
    }
    const header: GzipHeader = { name: '', comment: '', extra: null, time: 0, os: 255 }
    let dictionary = false
    if (this.format === 'zlib') {
      if ((bytes[0] & 15) !== 8 || (bytes[0] >>> 4) > 7 || ((bytes[0] << 8) | bytes[1]) % 31 !== 0) return this.errors.header()
      dictionary = (bytes[1] & 32) !== 0
      if (dictionary) {
        let id = 0
        for (let i = 0; i < 4; i++) {
          const [b, err] = yield* input.byte(bytes)
          if (err != null) return err === io.EOF ? io.ErrUnexpectedEOF : err
          id = ((id << 8) | b) >>> 0
        }
        if (id !== (adler32(1, this.dictionary, this.dictionary.length, 0) >>> 0)) return this.errors.dictionary()
      }
    } else {
      if (bytes[0] !== 31 || bytes[1] !== 139 || bytes[2] !== 8 || (bytes[3] & 224) !== 0) return this.errors.header()
      const flags = bytes[3]
      header.time = (bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24)) >>> 0
      header.os = bytes[9]
      if (flags & 4) {
        const [low, firstErr] = yield* input.byte(bytes)
        if (firstErr != null) return firstErr === io.EOF ? io.ErrUnexpectedEOF : firstErr
        const [high, secondErr] = yield* input.byte(bytes)
        if (secondErr != null) return secondErr === io.EOF ? io.ErrUnexpectedEOF : secondErr
        const extra = new Uint8Array(low | (high << 8))
        for (let i = 0; i < extra.length; i++) {
          const [b, err] = yield* input.byte(bytes)
          if (err != null) return err === io.EOF ? io.ErrUnexpectedEOF : err
          extra[i] = b
        }
        header.extra = extra
      }
      for (const [flag, field] of [[8, 'name'], [16, 'comment']] as const) {
        if (!(flags & flag)) continue
        let value = ''
        for (let i = 0; ; i++) {
          if (i === 512) return this.errors.header()
          const [b, err] = yield* input.byte(bytes)
          if (err != null) return err === io.EOF ? io.ErrUnexpectedEOF : err
          if (b === 0) break
          value += String.fromCharCode(b)
        }
        header[field] = value
      }
      if (flags & 2) {
        const data = new Uint8Array(bytes)
        const expected = crc32(0, data, data.length, 0) & 65535
        const [low, firstErr] = yield* input.byte(bytes)
        if (firstErr != null) return firstErr === io.EOF ? io.ErrUnexpectedEOF : firstErr
        const [high, secondErr] = yield* input.byte(bytes)
        if (secondErr != null) return secondErr === io.EOF ? io.ErrUnexpectedEOF : secondErr
        if ((low | (high << 8)) !== expected) return this.errors.header()
      }
    }
    this.release()
    const stream = new ZStream()
    if (zlibInflateInit2(stream, this.format === 'gzip' ? 31 : 15) !== Z_OK) return $.newError('flate: initialization failed')
    this.stream = stream
    stream.input = new Uint8Array(bytes)
    stream.next_in = 0
    stream.avail_in = bytes.length
    stream.output = new Uint8Array(1)
    stream.next_out = 0
    stream.avail_out = 1
    const status = zlibInflate(stream, Z_NO_FLUSH)
    if (status === Z_NEED_DICT && dictionary) {
      if (zlibInflateSetDictionary(stream, this.dictionary) !== Z_OK) return this.errors.dictionary()
    } else if (status !== Z_OK && status !== Z_BUF_ERROR) {
      return this.errors.header()
    }
    if (stream.avail_in !== 0 || stream.next_out !== 0) return this.errors.header()
    stream.input = released
    stream.output = released
    this.ended = false
    this.bodyEnded = false
    this.bodyError = null
    if (first) this.header = header
    return null
  }

  private *read(p: $.Bytes): Operation<io.IOResult> {
    if (this.error != null) return [0, this.error]
    if (this.closed) return [0, io.ErrClosedPipe]
    if ($.len(p) === 0) return [0, null]
    const output = new Uint8Array(Math.min($.len(p), chunkSize))
    while (true) {
      if (this.ended) {
        if (this.format === 'zlib' || !this.multistream) { this.error = io.EOF; return [0, this.error] }
        this.error = yield* this.initialize(false)
        if (this.error != null) return [0, this.error]
      }
      const stream = this.stream
      const input = this.input
      if (stream == null || input == null) return [0, $.newError(`${this.format}: reader is not initialized`)]
      stream.output = output
      stream.next_out = 0
      stream.avail_out = output.length
      const before = stream.avail_in
      // Z_BLOCK exposes the final DEFLATE boundary before the wrapper trailer.
      // gzip.Close reports decompressor errors, not gzip trailer/checksum errors.
      const status = zlibInflate(stream, Z_BLOCK)
      const boundary = (stream.data_type & 128) !== 0
      if ((stream.data_type & 192) === 192) this.bodyEnded = true
      const consumed = before - stream.avail_in
      input.consume(consumed)
      const n = stream.next_out
      if (status === Z_STREAM_END) {
        this.ended = true
        if (this.format === 'zlib' || !this.multistream) this.error = io.EOF
      } else if (status !== Z_OK && status !== Z_BUF_ERROR) {
        this.error = stream.msg === 'incorrect data check' || stream.msg === 'incorrect length check' ?
          this.errors.checksum() : $.newError(`flate: ${stream.msg || `codec error ${status}`}`)
        if (!this.bodyEnded) this.bodyError = this.error
      }
      if (n > 0) {
        $.copyByteRanges(p, 0, n, output, 0, n)
        return [n, this.error]
      }
      if (this.error != null) return [0, this.error]
      if (this.ended) continue
      if (stream.avail_in === 0) {
        const err = yield* input.fill()
        if (err != null) {
          this.error = err === io.EOF ? io.ErrUnexpectedEOF : err
          if (!this.bodyEnded) this.bodyError = this.error
          return [0, this.error]
        }
        stream.input = input.buffer
        stream.next_in = input.offset
        stream.avail_in = input.available
      } else if (consumed === 0 && !boundary) {
        this.error = $.newError('flate: decoder made no progress')
        return [0, this.error]
      }
    }
  }
}
