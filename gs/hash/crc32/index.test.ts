import { describe, expect, it } from 'vitest'

import * as $ from '../../builtin/index.js'
import {
  Castagnoli,
  Checksum,
  ChecksumIEEE,
  IEEE,
  IEEETable,
  Koopman,
  MakeTable,
  New,
  NewIEEE,
  Size,
  Update,
} from './index.js'

describe('hash/crc32 override', () => {
  it('matches Go checksums across tables and slicing boundaries', () => {
    const payload = Uint8Array.from({ length: 64 }, (_, i) => i * 31 + 7)
    const tables = [
      IEEETable,
      MakeTable(Castagnoli),
      MakeTable(Koopman),
      MakeTable(0xd5828281),
    ]

    expect(Size).toBe(4)
    expect(IEEE).toBe(0xedb88320)
    expect(MakeTable(IEEE)).toBe(IEEETable)
    expect(MakeTable(Castagnoli)).toBe(tables[1])
    expect(MakeTable(Koopman)).not.toBe(tables[2])

    for (const table of tables) {
      for (const length of [0, 1, 7, 8, 9, 15, 16, 17, 64]) {
        const data = payload.subarray(0, length)
        const expected = Checksum(data, table)
        const split = Math.floor(length / 2)
        const updated = Update(
          Update(0, table, data.subarray(0, split)),
          table,
          data.subarray(split),
        )
        const hash = New(table)
        expect(hash.Write(data.subarray(0, split))).toEqual([split, null])
        expect(hash.Write(data.subarray(split))).toEqual([length - split, null])
        expect(hash.Sum32()).toBe(expected)
        expect(updated).toBe(expected)
      }
    }

    expect(ChecksumIEEE([0x61, 0x62, 0x63])).toBe(0x352441c2)
    expect(Checksum([0x61, 0x62, 0x63], MakeTable(Castagnoli))).toBe(0x364b3fb7)
  })

  it('hashes only the logical bytes of offset views', async () => {
    const backing = new Uint8Array([0xff, 0xee, 0x61, 0x62, 0x63, 0xdd])
    const view = backing.subarray(2, 5)

    expect(ChecksumIEEE(view)).toBe(0x352441c2)
    const hash = NewIEEE()
    expect(hash.Write(view)).toEqual([3, null])
    expect(hash.Sum32()).toBe(0x352441c2)
    expect(Array.from(await hash.Sum(new Uint8Array([9, 8])))).toEqual([
      9, 8, 0x35, 0x24, 0x41, 0xc2,
    ])
  })

  it('marshals, validates, restores, and clones independent state', () => {
    const hash = NewIEEE()
    hash.Write($.stringToBytes('abc'))

    const [state, marshalErr] = hash.MarshalBinary()
    expect(marshalErr).toBeNull()
    expect(Array.from($.bytesToUint8Array(state))).toEqual([
      0x63, 0x72, 0x63, 0x01, 0xca, 0x87, 0x91, 0x4d, 0x35, 0x24, 0x41, 0xc2,
    ])

    const [appended, appendErr] = hash.AppendBinary(new Uint8Array([7, 6]))
    expect(appendErr).toBeNull()
    expect(Array.from($.bytesToUint8Array(appended)).slice(0, 2)).toEqual([
      7, 6,
    ])
    expect(Array.from($.bytesToUint8Array(appended)).slice(2)).toEqual(
      Array.from($.bytesToUint8Array(state)),
    )

    const restored = NewIEEE()
    expect(restored.UnmarshalBinary(state)).toBeNull()
    restored.Write($.stringToBytes('def'))
    expect(restored.Sum32()).toBe(ChecksumIEEE($.stringToBytes('abcdef')))

    const unchanged = NewIEEE()
    unchanged.Write($.stringToBytes('keep'))
    const before = unchanged.Sum32()
    expect(unchanged.UnmarshalBinary(new Uint8Array([1, 2, 3]))?.Error()).toBe(
      'hash/crc32: invalid hash state identifier',
    )
    expect(
      unchanged
        .UnmarshalBinary(new Uint8Array([0x63, 0x72, 0x63, 0x01, 0, 0, 0, 0]))
        ?.Error(),
    ).toBe('hash/crc32: invalid hash state size')
    expect(New(MakeTable(Castagnoli)).UnmarshalBinary(state)?.Error()).toBe(
      'hash/crc32: tables do not match',
    )
    expect(unchanged.Sum32()).toBe(before)

    const [clone, cloneErr] = hash.Clone()
    expect(cloneErr).toBeNull()
    hash.Write($.stringToBytes('left'))
    clone.Write($.stringToBytes('right'))
    expect(hash.Sum32()).toBe(ChecksumIEEE($.stringToBytes('abcleft')))
    expect(clone.Sum32()).toBe(ChecksumIEEE($.stringToBytes('abcright')))

    hash.Reset()
    expect(hash.Sum32()).toBe(0)
    expect(hash.Size()).toBe(4)
    expect(hash.BlockSize()).toBe(1)
  })

  it('matches nil-table update behavior', () => {
    expect(Checksum(new Uint8Array(), null)).toBe(0)
    const hash = New(null)
    expect(hash.Write(new Uint8Array())).toEqual([0, null])
    expect(() => hash.Write(new Uint8Array([1]))).toThrow(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  })
})
