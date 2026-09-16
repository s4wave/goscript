import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import { BigEndian, LittleEndian } from './index.js'

// Inspect raw elements: Uint8Array conversion would hide out-of-range values.
const values = (b: $.Slice<number>) => Array.from(b ?? [])

describe('binary append byte truncation', () => {
  for (const [name, order, little] of [
    ['little', LittleEndian, true], ['big', BigEndian, false],
  ] as const) {
    for (const kind of ['nil', 'array', 'slice', 'byte-slice'] as const) {
      for (const size of [2, 4] as const) {
        it(`${name} ${size * 8}-bit append to ${kind} produces bytes`, () => {
          const make = (): $.Slice<number> => {
            if (kind === 'nil') return null
            if (kind === 'array') return [0xa5]
            const b = $.makeSlice<number>(1, 8, kind === 'byte-slice' ? 'byte' : undefined)
            b![0] = 0xa5
            return b
          }
          for (const value of [0, 0x1234, 0x89abcdef, 0xffffffff]) {
            const input = make()
            const expected = Array.from({ length: size }, (_, i) =>
              (value >>> ((little ? i : size - 1 - i) * 8)) & 0xff,
            )
            const out = size === 2 ? order.AppendUint16(input, value) : order.AppendUint32(input, value)
            expect(values(out)).toEqual([...(kind === 'nil' ? [] : [0xa5]), ...expected])
          }
        })
      }
    }
  }
})
