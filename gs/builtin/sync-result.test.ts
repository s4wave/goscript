import { describe, expect, it } from 'vitest'

import { syncResult } from './index.js'

describe('syncResult', () => {
  it('returns a synchronous result', () => {
    expect(syncResult(3)).toBe(3)
  })

  it('throws when the function value suspended', () => {
    expect(() => syncResult(Promise.resolve(3))).toThrow(
      'function value suspended in a synchronous context',
    )
  })
})
