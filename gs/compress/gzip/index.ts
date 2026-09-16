import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'
import * as time from '@goscript/time/index.js'
import { Deflater, Inflater, validLevel } from '@goscript/internal/flateio/index.js'

export const NoCompression = 0
export const BestSpeed = 1
export const BestCompression = 9
export const DefaultCompression = -1
export const HuffmanOnly = -2
export let ErrChecksum = errors.New('gzip: invalid checksum')
export let ErrHeader = errors.New('gzip: invalid header')

export function __goscript_set_ErrChecksum(value: $.GoError): void { ErrChecksum = value }
export function __goscript_set_ErrHeader(value: $.GoError): void { ErrHeader = value }

export class Header {
  Comment = ''
  Extra: $.Bytes = null
  ModTime: time.Time | null = new time.Time()
  Name = ''
  OS = 255

  get Header(): Header { return this }
  set Header(header: Header) {
    this.Name = header.Name
    this.Comment = header.Comment
    this.Extra = header.Extra
    this.ModTime = header.ModTime
    this.OS = header.OS
  }
}

export class Reader extends Header {
  private readonly decompressor = new Inflater('gzip', {
    header: () => ErrHeader,
    checksum: () => ErrChecksum,
    dictionary: () => ErrHeader,
  })

  Read(p: $.Bytes): io.Awaitable<io.IOResult> { return this.decompressor.Read(p) }
  Close(): io.Awaitable<$.GoError> { return this.decompressor.Close() }
  Multistream(enabled: boolean): void { this.decompressor.Multistream(enabled) }

  Reset(r: io.Reader | null): io.Awaitable<$.GoError> {
    this.Header = new Header()
    return io.mapResult(this.decompressor.Reset(r), err => {
      if (err == null) {
        const header = this.decompressor.header
        this.Name = header.name
        this.Comment = header.comment
        this.Extra = header.extra
        this.OS = header.os
        if (header.time > 0) this.ModTime = time.Unix(BigInt(header.time), 0n)
      }
      return err
    })
  }
}

// Writer incrementally compresses input and writes complete flush boundaries.
export class Writer extends Header {
  private readonly compressor: Deflater

  constructor(w: io.Writer | null = null, level = DefaultCompression) {
    super()
    this.compressor = new Deflater('gzip', w, level, null, () => {
      const timestamp = this.ModTime?.Unix() ?? 0n
      return ({
      name: this.Name,
      comment: this.Comment,
      extra: this.Extra,
      time: timestamp > 0n ? Number(BigInt.asUintN(32, timestamp)) : 0,
      os: this.OS,
      })
    })
  }

  Write(p: $.Bytes): io.Awaitable<io.IOResult> { return this.compressor.Write(p) }
  Flush(): io.Awaitable<$.GoError> { return this.compressor.Flush() }
  Close(): io.Awaitable<$.GoError> { return this.compressor.Close() }

  Reset(w: io.Writer | null): void {
    this.compressor.Reset(w)
    this.Header = new Header()
  }
}

export function NewReader(r: io.Reader | null): io.Awaitable<[Reader | null, $.GoError]> {
  const reader = new Reader()
  return io.mapResult(reader.Reset(r), err => err == null ? [reader, null] : [null, err])
}

export function NewWriter(w: io.Writer | null): Writer { return new Writer(w) }

export function NewWriterLevel(w: io.Writer | null, level: number): [Writer | null, $.GoError] {
  if (!validLevel(level)) return [null, errors.New(`gzip: invalid compression level: ${level}`)]
  return [new Writer(w, level), null]
}
