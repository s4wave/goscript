import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'
import { Deflater, Inflater, validLevel } from '@goscript/internal/flateio/index.js'

export const NoCompression = 0
export const BestSpeed = 1
export const BestCompression = 9
export const DefaultCompression = -1
export const HuffmanOnly = -2
export let ErrChecksum = errors.New('zlib: invalid checksum')
export let ErrDictionary = errors.New('zlib: invalid dictionary')
export let ErrHeader = errors.New('zlib: invalid header')

export function __goscript_set_ErrChecksum(value: $.GoError): void { ErrChecksum = value }
export function __goscript_set_ErrDictionary(value: $.GoError): void { ErrDictionary = value }
export function __goscript_set_ErrHeader(value: $.GoError): void { ErrHeader = value }

export interface Resetter {
  Reset(r: io.Reader | null, dict: $.Bytes | null): io.Awaitable<$.GoError>
}

class zlibReader implements io.ReadCloser, Resetter {
  private readonly decompressor = new Inflater('zlib', {
    header: () => ErrHeader,
    checksum: () => ErrChecksum,
    dictionary: () => ErrDictionary,
  })
  Read(p: $.Bytes): io.Awaitable<io.IOResult> { return this.decompressor.Read(p) }
  Close(): io.Awaitable<$.GoError> { return this.decompressor.Close() }
  Reset(r: io.Reader | null, dict: $.Bytes | null): io.Awaitable<$.GoError> {
    return this.decompressor.Reset(r, dict)
  }
}

export class Writer {
  private readonly compressor: Deflater

  constructor(w: io.Writer | null = null, dict: $.Bytes | null = null, level = DefaultCompression) {
    this.compressor = new Deflater('zlib', w, level, dict)
  }

  Write(p: $.Bytes): io.Awaitable<io.IOResult> { return this.compressor.Write(p) }
  Flush(): io.Awaitable<$.GoError> { return this.compressor.Flush() }
  Close(): io.Awaitable<$.GoError> { return this.compressor.Close() }
  Reset(w: io.Writer | null): void { this.compressor.Reset(w) }
}

export function NewWriter(w: io.Writer | null): Writer { return new Writer(w) }

export function NewWriterLevel(w: io.Writer | null, level: number): [Writer | null, $.GoError] {
  return NewWriterLevelDict(w, level, null)
}

export function NewWriterLevelDict(w: io.Writer | null, level: number, dict: $.Bytes | null): [Writer | null, $.GoError] {
  if (!validLevel(level)) return [null, errors.New(`zlib: invalid compression level: ${level}`)]
  return [new Writer(w, dict, level), null]
}

export function NewReader(r: io.Reader | null): io.Awaitable<[io.ReadCloser | null, $.GoError]> {
  return NewReaderDict(r, null)
}

export function NewReaderDict(r: io.Reader | null, dict: $.Bytes | null): io.Awaitable<[io.ReadCloser | null, $.GoError]> {
  const reader = new zlibReader()
  return io.mapResult(reader.Reset(r, dict), err => err == null ? [reader, null] : [null, err])
}
