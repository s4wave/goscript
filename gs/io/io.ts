// Package io provides basic interfaces to I/O primitives.
// Its primary job is to wrap existing implementations of such primitives,
// such as those in package os, into shared public interfaces that abstract
// the functionality, plus some other related primitives.

import * as $ from '@goscript/builtin/index.js'

// IOError carries an io sentinel message.
class IOError {
  constructor(private message: string) {}

  Error(): string {
    return this.message
  }

  toString(): string {
    return this.message
  }
}

function newError(message: string): $.GoError {
  return new IOError(message)
}

// EOF marks normal completion of a reader.
export const EOF = newError('EOF')
export const ErrClosedPipe = newError('io: read/write on closed pipe')
export const ErrNoProgress = newError(
  'multiple Read calls return no data or error',
)
export const ErrShortBuffer = newError('short buffer')
export const ErrShortWrite = newError('short write')
export const ErrUnexpectedEOF = newError('unexpected EOF')
const errInvalidWrite = newError('invalid Write result')

// SeekStart measures offsets from the beginning.
export const SeekStart = 0 // seek relative to the origin of the file
export const SeekCurrent = 1 // seek relative to the current offset
export const SeekEnd = 2 // seek relative to the end

// Generated Go I/O may suspend. Interfaces expose that possibility rather than
// disguising a Promise as a tuple; concrete synchronous adapters still return
// their result immediately.
export type IOResult = [number, $.GoError]
export type Awaitable<T> = T | PromiseLike<T>

export interface Reader {
  Read(p: $.Bytes): Awaitable<IOResult>
}
export interface SyncReader extends Reader {
  Read(p: $.Bytes): IOResult
}
export interface AsyncReader extends Reader {
  Read(p: $.Bytes): Promise<IOResult>
}
export interface Writer {
  Write(p: $.Bytes): Awaitable<IOResult>
}
export interface SyncWriter extends Writer {
  Write(p: $.Bytes): IOResult
}
export interface AsyncWriter extends Writer {
  Write(p: $.Bytes): Promise<IOResult>
}

type ReaderLike = Reader | { Reader: Reader | null } | null
type WriterLike = Writer | { Writer: Writer | null } | null

export interface Closer {
  Close(): Awaitable<$.GoError>
}
export interface Seeker {
  Seek(offset: bigint, whence: number): [bigint, $.GoError]
}
export interface ReadWriter extends Reader, Writer {}
export interface ReadCloser extends Reader, Closer {}
export interface WriteCloser extends Writer, Closer {}
export interface ReadWriteCloser extends Reader, Writer, Closer {}
export interface ReadSeeker extends Reader, Seeker {}
export interface ReadSeekCloser extends Reader, Seeker, Closer {}
export interface WriteSeeker extends Writer, Seeker {}
export interface ReadWriteSeeker extends Reader, Writer, Seeker {}

export function isAsync<T>(value: Awaitable<T>): value is PromiseLike<T> {
  return value != null &&
    (typeof value === 'object' || typeof value === 'function') &&
    'then' in value && typeof value.then === 'function'
}

// Map a delegated result without introducing a microtask on synchronous paths.
export function mapResult<T, U>(
  value: Awaitable<T>,
  transform: (value: T) => Awaitable<U>,
): Awaitable<U> {
  return isAsync(value) ? Promise.resolve(value).then(transform) : transform(value)
}

// Drive sequential delegated I/O without changing synchronous completion into
// asynchronous completion. Rejections are thrown back into the operation so
// its cleanup and error handling run just as they do for a synchronous throw.
export function runIO<T>(
  operation: Generator<Awaitable<IOResult>, T, IOResult>,
): Awaitable<T> {
  let step = operation.next()
  const pump = (): Awaitable<T> => {
    while (!step.done) {
      const value = step.value
      if (isAsync(value)) {
        return Promise.resolve(value).then(
          value => { step = operation.next(value); return pump() },
          error => { step = operation.throw(error); return pump() },
        )
      }
      step = operation.next(value)
    }
    return step.value
  }
  return pump()
}

class pipeState {
  private readerClosed = false
  private writerClosed = false
  private readerErr: $.GoError = null
  private writerErr: $.GoError = null
  private pendingReads: Array<{
    data: $.Bytes
    resolve: (result: IOResult) => void
  }> = []
  private pendingWrites: Array<{
    data: Uint8Array
    offset: number
    resolve: (result: IOResult) => void
  }> = []

  Read(p: $.Bytes): Promise<IOResult> {
    if (this.readerClosed || this.writerClosed) {
      return Promise.resolve([0, this.readCloseError()])
    }
    // Even a zero-length read must rendezvous with a writer, like io.Pipe.
    return new Promise(resolve => {
      this.pendingReads.push({ data: p, resolve })
      this.drain()
    })
  }

  Write(p: $.Bytes): Promise<IOResult> {
    if (this.writerClosed || this.readerClosed) {
      return Promise.resolve([0, this.writeCloseError()])
    }
    const data = new Uint8Array($.bytesToUint8Array(p))
    return new Promise(resolve => {
      this.pendingWrites.push({ data, offset: 0, resolve })
      this.drain()
    })
  }

  CloseReader(err: $.GoError): $.GoError {
    if (!this.readerClosed) {
      this.readerClosed = true
      this.readerErr = err ?? ErrClosedPipe
    }
    this.release()
    return null
  }

  CloseWriter(err: $.GoError): $.GoError {
    if (!this.writerClosed) {
      this.writerClosed = true
      this.writerErr = err ?? EOF
    }
    this.release()
    return null
  }

  private readCloseError(): $.GoError {
    return !this.readerClosed && this.writerClosed ? this.writerErr : ErrClosedPipe
  }

  private writeCloseError(): $.GoError {
    return !this.writerClosed && this.readerClosed ? this.readerErr : ErrClosedPipe
  }

  private drain(): void {
    while (this.pendingWrites.length > 0 && this.pendingReads.length > 0) {
      const read = this.pendingReads.shift()!
      const write = this.pendingWrites[0]
      const n = Math.min($.len(read.data), write.data.length - write.offset)
      $.copy(read.data, write.data.subarray(write.offset, write.offset + n))
      write.offset += n
      read.resolve([n, null])
      if (write.offset === write.data.length) {
        this.pendingWrites.shift()
        write.resolve([write.offset, null])
      }
    }
  }

  private release(): void {
    const readError = this.readCloseError()
    const writeError = this.writeCloseError()
    for (const read of this.pendingReads.splice(0)) read.resolve([0, readError])
    for (const write of this.pendingWrites.splice(0)) {
      write.resolve([write.offset, writeError])
    }
  }
}

// PipeReader is the read half of a pipe.
export class PipeReader implements AsyncReader, Closer {
  constructor(private pipe: pipeState) {}

  Read(data: $.Bytes): Promise<IOResult> {
    return this.pipe.Read(data)
  }

  Close(): $.GoError {
    return this.CloseWithError(null)
  }

  CloseWithError(err: $.GoError): $.GoError {
    return this.pipe.CloseReader(err ?? ErrClosedPipe)
  }
}

// PipeWriter is the write half of a pipe.
export class PipeWriter implements AsyncWriter, Closer {
  constructor(private pipe: pipeState) {}

  Write(data: $.Bytes): Promise<IOResult> {
    return this.pipe.Write(data)
  }

  Close(): $.GoError {
    return this.CloseWithError(null)
  }

  CloseWithError(err: $.GoError): $.GoError {
    return this.pipe.CloseWriter(err ?? EOF)
  }
}

// Pipe creates a synchronous in-memory pipe.
export function Pipe(): [PipeReader, PipeWriter] {
  const pipe = new pipeState()
  return [new PipeReader(pipe), new PipeWriter(pipe)]
}

// ReaderAt is the interface that wraps the basic ReadAt method.
export interface ReaderAt {
  ReadAt(p: $.Bytes, off: bigint): Awaitable<IOResult>
}

// WriterAt is the interface that wraps the basic WriteAt method.
export interface WriterAt {
  WriteAt(p: $.Bytes, off: bigint): Awaitable<IOResult>
}

// ByteReader is the interface that wraps the ReadByte method.
export interface ByteReader {
  ReadByte(): Awaitable<IOResult>
}

// ByteWriter is the interface that wraps the WriteByte method.
export interface ByteWriter {
  WriteByte(c: number): $.GoError
}

// ByteScanner is the interface that adds the UnreadByte method to the basic ReadByte method.
export interface ByteScanner extends ByteReader {
  UnreadByte(): $.GoError
}

// RuneReader is the interface that wraps the ReadRune method.
export interface RuneReader {
  ReadRune(): [number, number, $.GoError]
}

// RuneScanner is the interface that adds the UnreadRune method to the basic ReadRune method.
export interface RuneScanner extends RuneReader {
  UnreadRune(): $.GoError
}

// StringWriter is the interface that wraps the WriteString method.
export interface StringWriter {
  WriteString(s: string): Awaitable<IOResult>
}

// WriterTo is the interface that wraps the WriteTo method.
export interface WriterTo {
  WriteTo(w: Writer): Awaitable<[bigint, $.GoError]>
}

// ReaderFrom is the interface that wraps the ReadFrom method.
export interface ReaderFrom {
  ReadFrom(r: Reader): Awaitable<[bigint, $.GoError]>
}

// DiscardWriter accepts every byte without retaining it.
class DiscardWriter implements Writer {
  Write(p: $.Bytes): [number, $.GoError] {
    return [$.len(p), null]
  }
}

// Discard accepts every byte without retaining it.
export const Discard: Writer | null = new DiscardWriter()

// WriteString writes s through StringWriter when available, or as UTF-8 bytes.
export async function WriteString(
  w: Writer,
  s: string,
): Promise<[number, $.GoError]> {
  if ('WriteString' in w && typeof (w as any).WriteString === 'function') {
    return await ((w as StringWriter).WriteString(s) as any)
  }

  const bytes = new TextEncoder().encode(s)
  return await (w.Write(bytes) as any)
}

// LimitedReader reads from R but limits the amount of data returned to just N bytes.
export class LimitedReader implements Reader {
  public R: Reader | null
  public N: bigint

  constructor(
    r?: Reader | { R?: Reader | null; N?: bigint } | null,
    n?: bigint,
  ) {
    if (r != null && typeof (r as { Read?: unknown }).Read !== 'function') {
      const init = r as { R?: Reader | null; N?: bigint }
      this.R = init.R ?? null
      this.N = init.N ?? 0n
      return
    }
    this.R = (r as Reader | null | undefined) ?? null
    this.N = n ?? 0n
  }

  Read(p: $.Bytes): Awaitable<IOResult> {
    if (this.N <= 0n) return [0, EOF]
    if (this.R == null) throw new Error('io.LimitedReader: nil reader')
    const buf = BigInt($.len(p)) > this.N ? $.goSlice(p, 0, Number(this.N)) : p
    return mapResult(this.R.Read(buf), ([n, err]) => {
      this.N -= BigInt(n)
      return [n, err]
    })
  }
}

export function LimitReader(r: SyncReader, n: bigint): SyncReader
export function LimitReader(r: Reader, n: bigint): Reader
export function LimitReader(r: Reader, n: bigint): Reader {
  return new LimitedReader(r, n)
}

const maxInt64 = (1n << 63n) - 1n

// File positions remain int64 values; only buffer-bounded slice lengths narrow.
export class SectionReader implements Reader, Seeker, ReaderAt {
  private off: bigint
  private readonly limit: bigint

  constructor(private r: ReaderAt, private base: bigint, private n: bigint) {
    this.off = base
    this.limit = base <= BigInt.asIntN(64, maxInt64 - n) ?
      BigInt.asIntN(64, base + n) : maxInt64
  }

  Read(p: $.Bytes): Awaitable<IOResult> {
    if (this.off >= this.limit) return [0, EOF]
    const remaining = this.limit - this.off
    if (BigInt($.len(p)) > remaining) p = $.goSlice(p, 0, Number(remaining))
    return mapResult(this.r.ReadAt(p, this.off), ([n, err]) => {
      this.off = BigInt.asIntN(64, this.off + BigInt(n))
      return [n, err]
    })
  }

  Seek(offset: bigint, whence: number): [bigint, $.GoError] {
    let absolute: bigint
    switch (whence) {
      case SeekStart: absolute = BigInt.asIntN(64, this.base + offset); break
      case SeekCurrent: absolute = BigInt.asIntN(64, this.off + offset); break
      case SeekEnd: absolute = BigInt.asIntN(64, this.limit + offset); break
      default: return [0n, newError('io.SectionReader.Seek: invalid whence')]
    }
    if (absolute < this.base) return [0n, newError('io.SectionReader.Seek: negative position')]
    this.off = absolute
    return [BigInt.asIntN(64, absolute - this.base), null]
  }

  ReadAt(p: $.Bytes, off: bigint): Awaitable<IOResult> {
    if (off < 0n || off >= this.Size()) return [0, EOF]
    const absolute = BigInt.asIntN(64, this.base + off)
    const remaining = this.limit - absolute
    if (BigInt($.len(p)) > remaining) {
      p = $.goSlice(p, 0, Number(remaining))
      return mapResult(this.r.ReadAt(p, absolute), ([n, err]) => [n, err ?? EOF])
    }
    return this.r.ReadAt(p, absolute)
  }

  Size(): bigint { return BigInt.asIntN(64, this.limit - this.base) }
  Outer(): [ReaderAt, bigint, bigint] { return [this.r, this.base, this.n] }
}

export function NewSectionReader(r: ReaderAt, off: bigint, n: bigint): SectionReader {
  return new SectionReader(r, off, n)
}

export class OffsetWriter implements Writer, WriterAt, Seeker {
  private off: bigint

  constructor(private w: WriterAt, private base: bigint) {
    this.off = base
  }

  Write(p: $.Bytes): Awaitable<IOResult> {
    return mapResult(this.w.WriteAt(p, this.off), ([n, err]) => {
      this.off = BigInt.asIntN(64, this.off + BigInt(n))
      return [n, err]
    })
  }

  WriteAt(p: $.Bytes, off: bigint): Awaitable<IOResult> {
    if (off < 0n) return [0, newError('io.OffsetWriter.WriteAt: negative offset')]
    return this.w.WriteAt(p, BigInt.asIntN(64, this.base + off))
  }

  Seek(offset: bigint, whence: number): [bigint, $.GoError] {
    let absolute: bigint
    switch (whence) {
      case SeekStart: absolute = BigInt.asIntN(64, this.base + offset); break
      case SeekCurrent: absolute = BigInt.asIntN(64, this.off + offset); break
      default: return [0n, newError('io.OffsetWriter.Seek: invalid whence')]
    }
    if (absolute < this.base) return [0n, newError('io.OffsetWriter.Seek: negative position')]
    this.off = absolute
    return [BigInt.asIntN(64, absolute - this.base), null]
  }
}

export function NewOffsetWriter(w: WriterAt, off: bigint): OffsetWriter {
  return new OffsetWriter(w, off)
}

// Copy copies from src to dst until EOF or an error.
export async function Copy(
  dst: WriterLike,
  src: ReaderLike,
): Promise<[bigint, $.GoError]> {
  return await CopyBuffer(dst, src, null)
}

// CopyBuffer stages copying through buf unless a reader or writer owns the copy.
// A nil buffer grows from 32 KiB to 256 KiB when full reads sustain bulk copying.
export async function CopyBuffer(
  dst: WriterLike,
  src: ReaderLike,
  buf: $.Bytes | null,
): Promise<[bigint, $.GoError]> {
  if (buf !== null && $.len(buf) === 0) {
    $.panic('empty buffer in CopyBuffer')
  }
  dst = unwrapWriter(dst)
  src = unwrapReader(src)
  if (dst === null || src === null) {
    return [0n, newError('io: copy with nil reader or writer')]
  }

  // Source and destination copy methods take precedence over buffering.
  if ('WriteTo' in src && typeof (src as any).WriteTo === 'function') {
    return await ((src as WriterTo).WriteTo(dst) as any)
  }

  if ('ReadFrom' in dst && typeof (dst as any).ReadFrom === 'function') {
    return await ((dst as ReaderFrom).ReadFrom(src) as any)
  }

  const growBuffer = buf === null
  if (buf === null) {
    buf = $.makeSlice<number>(32 * 1024, undefined, 'byte')
  }

  let written = 0n
  while (true) {
    const [nr, er] = await src.Read(buf)
    if (nr > 0) {
      const [nw, ew] = await dst.Write($.goSlice(buf, 0, nr))
      if (nw < 0 || nr < nw) {
        if (ew === null) {
          return [written, errInvalidWrite]
        }
        return [written, ew]
      }
      written += BigInt(nw)
      if (ew !== null) {
        return [written, ew]
      }
      if (nr !== nw) {
        return [written, ErrShortWrite]
      }
    }
    if (er !== null) {
      if (er === EOF) {
        break
      }
      return [written, er]
    }
    if (growBuffer && nr === $.len(buf) && $.len(buf) < 256 * 1024) {
      buf = $.makeSlice<number>($.len(buf) * 2, undefined, 'byte')
    }
  }
  return [written, null]
}

function unwrapReader(src: ReaderLike): Reader | null {
  if (src == null) {
    return null
  }
  if ('Read' in src && typeof (src as any).Read === 'function') {
    return src as Reader
  }
  return (src as { Reader: Reader | null }).Reader
}

function unwrapWriter(dst: WriterLike): Writer | null {
  if (dst == null) {
    return null
  }
  if ('Write' in dst && typeof (dst as any).Write === 'function') {
    return dst as Writer
  }
  return (dst as { Writer: Writer | null }).Writer
}

// CopyN copies n bytes from src to dst, or returns the error that stops it.
export async function CopyN(
  dst: Writer,
  src: Reader,
  n: bigint,
): Promise<[bigint, $.GoError]> {
  const [written, err] = await Copy(dst, LimitReader(src, n))
  if (written === n) {
    return [written, null]
  }
  if (written < n && err === null) {
    // Copy translates EOF to nil; a short CopyN restores that terminal error.
    return [written, EOF]
  }
  return [written, err]
}

// ReadAtLeast fills at least min bytes or reports the terminal error.
export async function ReadAtLeast(
  r: Reader,
  buf: $.Bytes,
  min: number,
): Promise<[number, $.GoError]> {
  if ($.len(buf) < min) {
    return [0, ErrShortBuffer]
  }

  let n = 0
  while (n < min) {
    const [nn, err] = await r.Read($.goSlice(buf, n))
    n += nn
    if (n >= min) return [n, null]
    if (err !== null) {
      if (err === EOF && n === 0) {
        return [n, EOF]
      }
      if (err === EOF && n < min) {
        return [n, ErrUnexpectedEOF]
      }
      return [n, err]
    }
  }
  return [n, null]
}

// ReadFull fills buf or reports EOF or ErrUnexpectedEOF for a short read.
export async function ReadFull(
  r: Reader,
  buf: $.Bytes,
): Promise<[number, $.GoError]> {
  return await ReadAtLeast(r, buf, $.len(buf))
}

// ReadAll reads until EOF or an error, preserving bytes returned with an error.
// EOF is reported as a nil error; other errors accompany the partial result.
export async function ReadAll(
  r: Reader,
): Promise<[$.Bytes, $.GoError]> {
  const chunks: $.Bytes[] = []
  let totalLength = 0
  let buf = $.makeSlice<number>(512, undefined, 'byte')
  let readErr: $.GoError = null

  while (true) {
    const [n, err] = await r.Read(buf)
    if (n > 0) {
      const chunk = $.makeSlice<number>(n, undefined, 'byte')
      $.copy(chunk, $.goSlice(buf, 0, n))
      chunks.push(chunk)
      totalLength += n
    }
    if (err !== null) {
      if (err !== EOF) {
        readErr = err
      }
      break
    }

    // Keep small inputs cheap and amortize calls once the reader fills the buffer.
    if (n === $.len(buf) && $.len(buf) < 32 * 1024) {
      buf = $.makeSlice<number>($.len(buf) * 2, undefined, 'byte')
    }
  }

  // Return independently owned bytes after the scratch buffer is no longer needed.
  const result = $.makeSlice<number>(totalLength, undefined, 'byte')
  let offset = 0
  for (const chunk of chunks) {
    const resultSlice = $.goSlice(result, offset, offset + $.len(chunk))
    $.copy(resultSlice, chunk)
    offset += $.len(chunk)
  }

  return [result, readErr]
}

// NopCloser returns a ReadCloser with a no-op Close method wrapping the provided Reader r.
export function NopCloser(r: Reader | null): ReadCloser {
  if (r == null) {
    return {
      Read: () => {
        throw new Error('nil Reader')
      },
      Close: () => null,
    }
  }
  return {
    Read: r.Read.bind(r),
    Close: () => null,
  }
}

// MultiReader preserves bytes returned with EOF before advancing to the next
// input. Empty readers are skipped iteratively, including deeply nested readers.
export function MultiReader(...readers: SyncReader[]): SyncReader
export function MultiReader(...readers: Reader[]): Reader
export function MultiReader(...readers: Reader[]): Reader {
  return new multiReader(readers.slice())
}

class multiReader implements Reader {
  constructor(private readers: Reader[]) {}

  Read(p: $.Bytes): Awaitable<IOResult> {
    const finish = ([n, err]: IOResult): IOResult | null => {
      if (err === EOF) this.readers.shift()
      if (n > 0 || err !== EOF) {
        return [n, err === EOF && this.readers.length > 0 ? null : err]
      }
      return null
    }
    while (this.readers.length > 0) {
      if (this.readers.length === 1 && this.readers[0] instanceof multiReader) {
        this.readers = this.readers[0].readers
        continue
      }
      const result = this.readers[0].Read(p)
      if (isAsync(result)) {
        return Promise.resolve(result).then(result => finish(result) ?? this.Read(p))
      }
      const out = finish(result)
      if (out != null) return out
    }
    return [0, EOF]
  }
}

export function MultiWriter(...writers: (SyncWriter | null)[]): SyncWriter
export function MultiWriter(...writers: (Writer | null)[]): Writer
export function MultiWriter(...writers: (Writer | null)[]): Writer {
  return new multiWriter(writers.slice())
}

class multiWriter implements Writer {
  constructor(private writers: (Writer | null)[]) {}

  Write(p: $.Bytes): Awaitable<IOResult> {
    const finish = ([n, err]: IOResult): IOResult | null => {
      if (err != null) return [n, err]
      return n === $.len(p) ? null : [n, ErrShortWrite]
    }
    const run = (index: number): Awaitable<IOResult> => {
      for (; index < this.writers.length; index++) {
        const w = this.writers[index]
        if (w == null) throw new Error('io.MultiWriter: nil writer')
        const result = w.Write(p)
        if (isAsync(result)) {
          return Promise.resolve(result).then(result => finish(result) ?? run(index + 1))
        }
        const out = finish(result)
        if (out != null) return out
      }
      return [$.len(p), null]
    }
    return run(0)
  }
}

export function TeeReader(r: SyncReader | null, w: SyncWriter | null): SyncReader
export function TeeReader(r: Reader | null, w: Writer | null): Reader
export function TeeReader(r: Reader | null, w: Writer | null): Reader {
  return new teeReader(r, w)
}

class teeReader implements Reader {
  constructor(private r: Reader | null, private w: Writer | null) {}

  Read(p: $.Bytes): Awaitable<IOResult> {
    if (this.r == null) throw new Error('io.TeeReader: nil reader')
    return mapResult(this.r.Read(p), ([n, err]) => {
      if (n === 0) return [n, err]
      if (this.w == null) throw new Error('io.TeeReader: nil writer')
      return mapResult(this.w.Write($.goSlice(p, 0, n)), ([nw, ew]) => {
        if (ew != null) return [nw, ew]
        if (nw !== n) return [nw, ErrShortWrite]
        return [n, err]
      })
    })
  }
}
