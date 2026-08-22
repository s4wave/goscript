import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import { New, WithStack } from './errors.js'

// asyncError returns an error whose Error() transpiles from a Go method that
// awaits, so calling it yields a Promise.
function asyncError(message: string): $.GoError {
  return {
    Error: async () => message,
  } as unknown as $.GoError
}

describe('WithStack Error text', () => {
  it('WithStack of a synchronous cause keeps Error plain and exact', () => {
    const err = WithStack(New('sync cause'))

    const text = err!.Error()
    expect(typeof text).toBe('string')
    expect(text).toBe('sync cause')
  })

  it('WithStack of an async cause resolves the exact awaited text', async () => {
    const err = WithStack(asyncError('async cause'))

    await expect(err!.Error()).resolves.toBe('async cause')
  })
})
