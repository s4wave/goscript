import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import { Join, Wrap } from './errors.js'

// asyncError returns an error whose Error() transpiles from a Go method that
// awaits, so calling it yields a Promise.
function asyncError(message: string): $.GoError {
  return {
    Error: async () => message,
  } as unknown as $.GoError
}

function syncError(message: string): $.GoError {
  return $.newError(message)
}

describe('errors with async Error members', () => {
  it('Wrap resolves the inner Error text instead of interpolating a Promise', async () => {
    const wrapped = Wrap(asyncError('root cause'), 'context')

    expect(await wrapped!.Error()).toBe('context: root cause')
  })

  it('Wrap keeps synchronous Error results synchronous', () => {
    const wrapped = Wrap(syncError('root'), 'ctx')
    const text = wrapped!.Error()

    expect(typeof text).toBe('string')
    expect(text as string).toBe('ctx: root')
  })

  it('Join resolves every member Error, including async ones', async () => {
    const a = syncError('a')
    const b = asyncError('b')
    const c = syncError('c')
    const joined = Join(a, b, c)

    expect(await joined!.Error()).toBe('a\nb\nc')
    expect((joined as any).Unwrap()).toEqual([a, b, c])
  })

  it('Join of synchronous members returns its Error text synchronously', () => {
    const a = syncError('a')
    const b = syncError('b')
    const joined = Join(a, b)

    const text = joined!.Error()
    expect(typeof text).toBe('string')
    expect(text as string).toBe('a\nb')
  })
})

// keep references to the exact member objects used in the Join test above
const syncErr0 = (Join(syncError('a')) as any) && syncError('a')
const joinedMembers = [syncError('a'), asyncError('b'), syncError('c')]
