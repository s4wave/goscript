import * as $ from '@goscript/builtin/index.js'
import {
  Copy,
  CopyBuffer,
  CopyN,
  Discard,
  EOF,
  ErrShortWrite,
  ErrUnexpectedEOF,
  LimitedReader,
  MultiReader,
  MultiWriter,
  NewSectionReader,
  NopCloser,
  Pipe,
  ReadAll,
  ReadFull,
  TeeReader,
  WriteString,
} from './index.js'
import { describe, expect, test } from 'vitest'

class sliceReader {
  public requestedSizes: number[] = []

  constructor(private data: Uint8Array) {}

  Read(p: $.Bytes): [number, $.GoError] {
    this.requestedSizes.push($.len(p))
    if (this.data.length === 0) {
      return [0, EOF]
    }
    const n = Math.min($.len(p), this.data.length)
    p!.set(this.data.subarray(0, n), 0)
    this.data = this.data.subarray(n)
    return [n, null]
  }
}

class captureWriter {
  public chunks: number[] = []

  Write(p: $.Bytes): [number, $.GoError] {
    this.chunks.push(...Array.from(p ?? []))
    return [$.len(p), null]
  }
}

class syncReaderAt {
  constructor(private data: Uint8Array) {}

  ReadAt(p: $.Bytes, off: bigint): [number, $.GoError] {
    const n = $.copy(p, this.data.subarray(Number(off)))
    return [n, n < $.len(p) ? (new Error('EOF') as $.GoError) : null]
  }
}

describe('io override', () => {
  test('LimitedReader accepts generated struct-literal construction', async () => {
    const reader = new LimitedReader({
      R: new sliceReader($.stringToBytes('abcdef')),
      N: 3n,
    })
    const buf = new Uint8Array(8)

    const [n, err] = await reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(buf.subarray(0, n)).toString('utf8')).toBe('abc')
  })

  test('TeeReader accepts nullable generated interface values', async () => {
    const writer = new captureWriter()
    const reader = TeeReader(new sliceReader($.stringToBytes('abc')), writer)
    const buf = new Uint8Array(4)

    const [n, err] = await reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(writer.chunks).toString('utf8')).toBe('abc')
  })

  test('NopCloser accepts nullable generated interface values', () => {
    const reader: sliceReader | null = new sliceReader($.stringToBytes('abc'))
    const body = NopCloser(reader)
    const buf = new Uint8Array(4)

    const [n, err] = body.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(body.Close()).toBeNull()
  })

  test('TeeReader awaits async readers and writers', async () => {
    const chunks: number[] = []
    const reader = TeeReader(
      {
        async Read(p: $.Bytes): Promise<[number, $.GoError]> {
          await Promise.resolve()
          p!.set($.stringToBytes('abc'), 0)
          return [3, null]
        },
      } as any,
      {
        async Write(p: $.Bytes): Promise<[number, $.GoError]> {
          await Promise.resolve()
          chunks.push(...Array.from(p ?? []))
          return [$.len(p), null]
        },
      } as any,
    )
    const buf = new Uint8Array(4)

    const [n, err] = await reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(chunks).toString('utf8')).toBe('abc')
  })

  test('MultiWriter accepts nullable generated interface values', async () => {
    const first = new captureWriter()
    const second = new captureWriter()
    const writer = MultiWriter(first, second)

    const [n, err] = await writer.Write($.stringToBytes('abc'))

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(first.chunks).toString('utf8')).toBe('abc')
    expect(Buffer.from(second.chunks).toString('utf8')).toBe('abc')
  })

  test('MultiWriter awaits async generated writers', async () => {
    const chunks: number[] = []
    const writer = MultiWriter({
      async Write(p: $.Bytes): Promise<[number, $.GoError]> {
        await Promise.resolve()
        chunks.push(...Array.from(p ?? []))
        return [$.len(p), null]
      },
    })

    const [n, err] = await writer.Write($.stringToBytes('abc'))

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(chunks).toString('utf8')).toBe('abc')
  })

  test('SectionReader preserves sync reads for sync ReaderAt', () => {
    const reader = NewSectionReader(
      new syncReaderAt($.stringToBytes('abcdef')),
      1,
      3,
    )
    const buf = new Uint8Array(4)

    const result = reader.Read(buf)
    expect(result).not.toBeInstanceOf(Promise)
    const [n, err] = result

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(buf.subarray(0, n)).toString('utf8')).toBe('bcd')
  })

  test('SectionReader awaits async ReaderAt', async () => {
    const reader = NewSectionReader(
      {
        async ReadAt(p: $.Bytes, off: bigint): Promise<[number, $.GoError]> {
          await Promise.resolve()
          const data = $.stringToBytes('abcdef')
          const n = $.copy(p, data.subarray(Number(off)))
          return [n, n < $.len(p) ? (new Error('EOF') as $.GoError) : null]
        },
      } as any,
      1,
      3,
    )
    const buf = new Uint8Array(4)

    const [n, err] = await reader.Read(buf)

    expect(err).toBeNull()
    expect(n).toBe(3)
    expect(Buffer.from(buf.subarray(0, n)).toString('utf8')).toBe('bcd')
  })

  test('PipeReader waits for a later write', async () => {
    const [reader, writer] = Pipe()
    const buf = new Uint8Array(5)

    const read = reader.Read(buf)
    const [written, writeErr] = await writer.Write($.stringToBytes('later'))
    const [readBytes, readErr] = await read

    expect(writeErr).toBeNull()
    expect(written).toBe(5)
    expect(readErr).toBeNull()
    expect(readBytes).toBe(5)
    expect(Buffer.from(buf).toString('utf8')).toBe('later')
  })

  test('Copy copies bytes until EOF and reports nil error', async () => {
    const writer = new captureWriter()

    const [written, err] = await Copy(
      writer,
      new sliceReader($.stringToBytes('hello world')),
    )

    expect(err).toBeNull()
    expect(written).toBe(11n)
    expect(Buffer.from(writer.chunks).toString('utf8')).toBe('hello world')
  })

  test('CopyBuffer stages reads through the provided buffer', async () => {
    const reader = new sliceReader($.stringToBytes('abcdefghij'))
    const writer = new captureWriter()

    const [written, err] = await CopyBuffer(writer, reader, new Uint8Array(4))

    expect(err).toBeNull()
    expect(written).toBe(10n)
    expect(Buffer.from(writer.chunks).toString('utf8')).toBe('abcdefghij')
    expect(reader.requestedSizes).toEqual([4, 4, 4, 4])
  })

  test('Copy reports ErrShortWrite when the writer accepts too few bytes', async () => {
    const shortWriter = {
      chunks: [] as number[],
      Write(p: $.Bytes): [number, $.GoError] {
        const accepted = Math.max(0, $.len(p) - 1)
        this.chunks.push(...Array.from((p ?? []).subarray(0, accepted)))
        return [accepted, null]
      },
    }

    const [written, err] = await Copy(
      shortWriter,
      new sliceReader($.stringToBytes('abc')),
    )

    expect(err).toBe(ErrShortWrite)
    expect(written).toBe(2n)
    expect(Buffer.from(shortWriter.chunks).toString('utf8')).toBe('ab')
  })

  test('CopyN copies exactly n bytes and reports EOF when the source is short', async () => {
    const exactSource = new sliceReader($.stringToBytes('abcdef'))
    const exactWriter = new captureWriter()

    const [written, err] = await CopyN(exactWriter, exactSource, 4n)

    expect(err).toBeNull()
    expect(written).toBe(4n)
    expect(Buffer.from(exactWriter.chunks).toString('utf8')).toBe('abcd')

    const remaining = new Uint8Array(4)
    const [remainingBytes, remainingErr] = exactSource.Read(remaining)
    expect(remainingErr).toBeNull()
    expect(remainingBytes).toBe(2)
    expect(Buffer.from(remaining.subarray(0, remainingBytes)).toString('utf8')).toBe(
      'ef',
    )

    const shortWriter = new captureWriter()
    const [shortWritten, shortErr] = await CopyN(
      shortWriter,
      new sliceReader($.stringToBytes('xy')),
      4n,
    )

    expect(shortErr).toBe(EOF)
    expect(shortWritten).toBe(2n)
    expect(Buffer.from(shortWriter.chunks).toString('utf8')).toBe('xy')
  })

  test('MultiReader concatenates readers and suppresses intermediate EOF', async () => {
    const reader = MultiReader(
      new sliceReader($.stringToBytes('ab')),
      new sliceReader(new Uint8Array(0)),
      new sliceReader($.stringToBytes('cd')),
    )

    const [out, err] = await ReadAll(reader)

    expect(err).toBeNull()
    expect($.bytesToString(out)).toBe('abcd')
  })

  test('ReadFull fills the buffer and reports unexpected EOF on short input', async () => {
    const full = new Uint8Array(4)
    const [n, err] = await ReadFull(new sliceReader($.stringToBytes('abcd')), full)

    expect(err).toBeNull()
    expect(n).toBe(4)
    expect($.bytesToString(full)).toBe('abcd')

    const short = new Uint8Array(4)
    const [shortN, shortErr] = await ReadFull(
      new sliceReader($.stringToBytes('xy')),
      short,
    )

    expect(shortErr).toBe(ErrUnexpectedEOF)
    expect(shortN).toBe(2)
    expect($.bytesToString($.goSlice(short, 0, shortN))).toBe('xy')
  })

  test('WriteString writes encoded bytes and returns the byte count', async () => {
    const writer = new captureWriter()

    const [written, err] = await WriteString(writer, 'hé')

    expect(err).toBeNull()
    expect(written).toBe(3)
    expect(Buffer.from(writer.chunks).toString('utf8')).toBe('hé')
  })

  test('Discard accepts copied bytes and preserves the copy count', async () => {
    const [written, err] = await Copy(
      Discard,
      new sliceReader($.stringToBytes('discard me')),
    )

    expect(err).toBeNull()
    expect(written).toBe(10n)
  })

  test('ReadAll returns the bytes already read with a non-EOF error', async () => {
    const boom = new Error('boom') as $.GoError
    let called = false
    const reader = {
      Read(p: $.Bytes): [number, $.GoError] {
        if (called) {
          return [0, EOF]
        }
        called = true
        const data = $.stringToBytes('hello')
        p!.set(data, 0)
        return [$.len(data), boom]
      },
    }

    const [data, err] = await ReadAll(reader)
    expect(err).toBe(boom)
    expect($.bytesToString(data)).toBe('hello')
  })

  test('ReadAll reports EOF as a nil error', async () => {
    const data = $.stringToBytes('world')
    let offset = 0
    const reader = {
      Read(p: $.Bytes): [number, $.GoError] {
        if (offset >= $.len(data)) {
          return [0, EOF]
        }
        const n = Math.min($.len(p), $.len(data) - offset)
        p!.set((data as Uint8Array).subarray(offset, offset + n), 0)
        offset += n
        return [n, null]
      },
    }

    const [out, err] = await ReadAll(reader)
    expect(err).toBeNull()
    expect($.bytesToString(out)).toBe('world')
  })
})
