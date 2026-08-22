import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import { Sprint, Sprintf } from './fmt.js'

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

describe('fmt with async Error operands', () => {
  it('Sprintf renders the resolved Error text for %v', async () => {
    expect(await Sprintf('%v', asyncError('boom'))).toBe('boom')
  })

  it('Sprint renders the resolved Error text', async () => {
    expect(await Sprint('prefix-', asyncError('boom'))).toBe('prefix-boom')
  })

  it('Sprintf keeps synchronous Error operands synchronous in text form', () => {
    // A sync operand must render identically to the pre-async contract; the
    // result is a Promise only because Sprintf is declared async.
    const rendered = Sprintf('%v', syncError('sync boom'))

    return expect(rendered).resolves.toBe('sync boom')
  })

  it('Sprintf renders an async Error operand through %w formatting', async () => {
    expect(await Sprintf('%w', asyncError('root'))).toBe('root')
  })
})
