// Declarations for the deliberately pinned low-level pako codec API.
// `import X = require(...)` is the only syntax that references pako's `export =` modules.
/* eslint-disable @typescript-eslint/no-require-imports */
// This script is imported so the declarations accompany emitted override files.
declare module 'pako/lib/zlib/zstream.js' {
  class ZStream {
    input: Uint8Array | null
    output: Uint8Array | null
    next_in: number
    avail_in: number
    total_in: number
    next_out: number
    avail_out: number
    total_out: number
    msg: string
    state: object | null
    data_type: number
    adler: number
  }
  export = ZStream
}
declare module 'pako/lib/zlib/deflate.js' {
  import ZStream = require('pako/lib/zlib/zstream.js')
  export function deflateInit2(s: ZStream, level: number, method: number, window: number, mem: number, strategy: number): number
  export function deflate(s: ZStream, flush: number): number
  export function deflateEnd(s: ZStream): number
  export function deflateSetDictionary(s: ZStream, dictionary: Uint8Array): number
}
declare module 'pako/lib/zlib/inflate.js' {
  import ZStream = require('pako/lib/zlib/zstream.js')
  export function inflateInit2(s: ZStream, window: number): number
  export function inflate(s: ZStream, flush: number): number
  export function inflateEnd(s: ZStream): number
  export function inflateSetDictionary(s: ZStream, dictionary: Uint8Array): number
}
declare module 'pako/lib/zlib/crc32.js' {
  function crc32(crc: number, bytes: Uint8Array, length: number, offset: number): number
  export = crc32
}
declare module 'pako/lib/zlib/adler32.js' {
  function adler32(adler: number, bytes: Uint8Array, length: number, offset: number): number
  export = adler32
}
