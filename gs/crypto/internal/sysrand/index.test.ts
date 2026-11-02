import { describe, expect, it, vi } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Read } from './index.js'

describe('crypto/internal/sysrand', () => {
  it('fills bounded byte views and Go slices, and refuses missing secure entropy', () => {
    // Fill across the host quota without overwriting the slice boundaries.
    const bytes = new Uint8Array(65539).fill(17)
    Read(bytes.subarray(1, -1))
    expect(bytes[0]).toBe(17)
    expect(bytes[bytes.length - 1]).toBe(17)
    expect(bytes.subarray(1, -1).some((b) => b !== 17)).toBe(true)

    // The same entropy boundary fills Go's non-native byte representation.
    const backing = new Array<number>(34).fill(17)
    const slice = $.goSlice(backing, 1, 33)
    Read(slice)
    expect(backing[0]).toBe(17)
    expect(backing[33]).toBe(17)
    expect(Array.from(slice ?? []).some((b) => b !== 17)).toBe(true)

    // Empty reads need no entropy; nonempty reads must never succeed with zeros.
    vi.stubGlobal('crypto', undefined)
    try {
      Read(new Uint8Array(0))
      expect(() => Read(new Uint8Array(1))).toThrow()
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
