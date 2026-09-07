import { describe, expect, it, vi } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Cause, Errorf, New, WithStack, Wrap, Wrapf } from './errors.js'
import { Is, Unwrap } from './go113.js'

// asyncError models a Go Error method that awaits before returning its text.
function asyncError(message: string): $.GoError {
  return {
    Error: async () => message,
  }
}

describe('WithStack Error text', () => {
  it('keeps synchronous error text synchronous', () => {
    const err = WithStack(New('sync cause'))

    const text = err!.Error()
    expect(typeof text).toBe('string')
    expect(text).toBe('sync cause')
  })

  it('resolves the exact asynchronous error text', async () => {
    const err = WithStack(asyncError('async cause'))

    await expect(err!.Error()).resolves.toBe('async cause')
  })
})

describe('error construction', () => {
  it('preserves messages and causes without capturing unused JavaScript stacks', () => {
    const capture = vi.spyOn(globalThis, 'Error')
    let base: $.GoError
    let wrapped: $.GoError
    let formatted: $.GoError
    let annotated: $.GoError
    let formattedBase: $.GoError
    let captures: number
    try {
      base = New('disk unavailable')
      wrapped = Wrap(base, 'read')
      formatted = Wrapf(base, 'read %s', 'guide')
      annotated = WithStack(base)
      formattedBase = Errorf('read %d', 3)
      captures = capture.mock.calls.length
    } finally {
      capture.mockRestore()
    }

    expect(captures).toBe(0)
    expect(base!.Error()).toBe('disk unavailable')
    expect(wrapped!.Error()).toBe('read: disk unavailable')
    expect(formatted!.Error()).toBe('read guide: disk unavailable')
    expect(annotated!.Error()).toBe('disk unavailable')
    expect(formattedBase!.Error()).toBe('read 3')
    expect(Cause(wrapped)).toBe(base)
    expect(Cause(formatted)).toBe(base)
    expect(Unwrap(annotated)).toBe(base)
    expect(Is(wrapped, base)).toBe(true)
  })
})
