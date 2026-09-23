import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Compare, Sorted } from './slices.js'

describe('slices ordered 64-bit values', () => {
  it('sorts integer iterators without losing precision', () => {
    // Include adjacent values beyond JavaScript's exact number range.
    const values = Sorted<bigint>((yieldValue) => {
      yieldValue(18446744073709551615n)
      yieldValue(9007199254740993n)
      yieldValue(-9223372036854775808n)
      yieldValue(9007199254740992n)
    })

    // Go's integer ordering must survive collection and slice sorting.
    expect(Array.from(values ?? [])).toEqual([
      -9223372036854775808n,
      9007199254740992n,
      9007199254740993n,
      18446744073709551615n,
    ])
  })

  it('compares integer slices without rounding adjacent values', () => {
    expect(
      Compare(
        $.arrayToSlice([9007199254740992n]),
        $.arrayToSlice([9007199254740993n]),
      ),
    ).toBe(-1)
  })
})
