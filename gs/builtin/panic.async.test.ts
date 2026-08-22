import { describe, expect, it } from 'vitest'

import { GoPanic, panic } from './panic.js'

// asyncError returns an error whose Error() transpiles from a Go method that
// awaits, so calling it yields a Promise.
function asyncPanicValue(): object {
  return {
    Error: async () => 'async failure',
  }
}

function drainMicrotasks(): Promise<void> {
  return Promise.resolve().then(() => {})
}

describe('panic values with async Error methods', () => {
  it('GoPanic resolves the async Error text onto its message', async () => {
    const goPanic = new GoPanic(asyncPanicValue())

    await drainMicrotasks()

    expect(goPanic.message).toBe('panic: async failure')
  })

  it('GoPanic keeps synchronous panic values immediate', () => {
    const goPanic = new GoPanic({
      Error: () => 'sync failure',
    })

    expect(goPanic.message).toBe('panic: sync failure')
  })

  it('panic() still throws a GoPanic carrying the value', () => {
    let thrown: unknown
    try {
      panic(asyncPanicValue())
    } catch (err) {
      thrown = err
    }

    expect(thrown).toBeInstanceOf(GoPanic)
    expect((thrown as GoPanic).recovered).toBe(false)
  })
})
