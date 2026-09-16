import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import * as io from './io.js'
type Result = [number, $.GoError]
const base = (1n << 53n) + 1n

describe('I/O exact offsets and asynchronous positional delegates', () => {
  it('preserves high SectionReader offsets and clips only the buffer length', () => {
    const seen: [bigint, number][] = []
    const source: io.ReaderAt = { ReadAt(p, off): Result { seen.push([off, $.len(p)]); return [$.len(p), null] } }
    const section = io.NewSectionReader(source, base, 5n)
    const typed: io.Reader & io.ReaderAt & io.Seeker = section
    expect(section.Size()).toBe(5n)
    expect(typed.Read(new Uint8Array(2))).toEqual([2, null])
    expect(typed.Read(new Uint8Array(9))).toEqual([3, null])
    expect(typed.Read(new Uint8Array(1))).toEqual([0, io.EOF])
    expect(seen).toEqual([[base, 2], [base + 2n, 3]])
    expect(section.Seek(-2n, io.SeekEnd)).toEqual([3n, null])
    expect(section.ReadAt(new Uint8Array(4), 4n)).toEqual([1, io.EOF])
    expect(seen[2]).toEqual([base + 4n, 1])
    expect(section.Seek(0n, io.SeekCurrent)).toEqual([3n, null])
    expect(section.Outer()).toEqual([source, base, 5n])
  })
  it('saturates overflowing section limits and retains the requested Outer size', () => {
    const max = (1n << 63n) - 1n
    const source: io.ReaderAt = { ReadAt: (p): Result => [$.len(p), null] }
    const section = io.NewSectionReader(source, max - 2n, 10n)
    expect(section.Size()).toBe(2n)
    expect(section.Outer()).toEqual([source, max - 2n, 10n])
    expect(section.Read(new Uint8Array(8))).toEqual([2, null])
    expect(section.Read(new Uint8Array(1))).toEqual([0, io.EOF])
    expect(section.Seek(3n, io.SeekStart)[1]).not.toBeNull()
  })
  it('handles async and thenable positional reads before updating the cursor', async () => {
    let complete!: (result: Result) => void
    const seen: bigint[] = []
    const section = io.NewSectionReader({ ReadAt(_p: $.Bytes, off: bigint): Promise<Result> {
      seen.push(off); return new Promise((resolve) => { complete = resolve })
    } }, base, 4n)
    const pending = section.Read(new Uint8Array(3))
    expect(section.Seek(0n, io.SeekCurrent)).toEqual([0n, null])
    complete([2, null])
    expect(await pending).toEqual([2, null])
    expect(section.Seek(0n, io.SeekCurrent)).toEqual([2n, null])
    expect(seen).toEqual([base])
    const thenable = io.NewSectionReader({ ReadAt(p: $.Bytes): PromiseLike<Result> {
      return { then: (f, r) => Promise.resolve<Result>([$.len(p), null]).then(f, r) }
    } }, base, 2n)
    expect(await thenable.ReadAt(new Uint8Array(4), 1n)).toEqual([1, io.EOF])
  })
  it('preserves exact OffsetWriter positions, including random writes and seeks', () => {
    const seen: bigint[] = []
    const writer = io.NewOffsetWriter({ WriteAt(p: $.Bytes, off: bigint): Result { seen.push(off); return [$.len(p), null] } }, base)
    const typed: io.Writer & io.WriterAt & io.Seeker = writer
    expect(typed.Write(new Uint8Array(2))).toEqual([2, null])
    expect(typed.WriteAt(new Uint8Array(1), 7n)).toEqual([1, null])
    expect(typed.Write(new Uint8Array(1))).toEqual([1, null])
    expect(typed.Seek(1n, io.SeekStart)).toEqual([1n, null])
    expect(typed.Write(new Uint8Array(1))).toEqual([1, null])
    expect(seen).toEqual([base, base + 7n, base + 2n, base + 1n])
    expect(typed.Seek(-3n, io.SeekCurrent)[1]).not.toBeNull()
    expect(typed.Seek(0n, io.SeekCurrent)).toEqual([2n, null])
    expect(typed.WriteAt(null, -1n)[1]).not.toBeNull()
  })
  it('awaits asynchronous positional writes and preserves partial-write errors', async () => {
    const failure = $.newError('write failed')
    let complete!: (result: Result) => void
    const seen: bigint[] = []
    const writer = io.NewOffsetWriter({ WriteAt(_p: $.Bytes, off: bigint): Promise<Result> {
      seen.push(off); return new Promise((resolve) => { complete = resolve })
    } }, base)
    const pending = writer.Write(new Uint8Array(4))
    expect(writer.Seek(0n, io.SeekCurrent)).toEqual([0n, null])
    complete([2, failure])
    expect(await pending).toEqual([2, failure])
    expect(writer.Seek(0n, io.SeekCurrent)).toEqual([2n, null])
    expect(seen).toEqual([base])
  })
})
