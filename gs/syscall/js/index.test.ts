import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Error as JSError, ValueOf } from './index.js'

describe('syscall/js override', () => {
  test('ValueOf unwraps generated interface numeric boxes', () => {
    const value = ValueOf(
      $.namedValueInterfaceValue(
        41,
        'int',
        {},
        {
          kind: $.TypeKind.Basic,
          name: 'int',
        },
      ),
    )

    expect(value.Int()).toBe(41)
  })

  test('a thrown JavaScript value panics with Error', () => {
    const thrown = new globalThis.Error('transaction finished')
    const value = ValueOf({
      abort() {
        throw thrown
      },
    })

    let caught: unknown
    try {
      value.Call('abort')
    } catch (err) {
      caught = err
    }

    expect(caught).toBeInstanceOf($.GoPanic)
    const panicValue = (caught as $.GoPanic).value
    expect($.typeAssert<JSError>(panicValue, 'js.Error').ok).toBe(true)
    expect((panicValue as JSError).Value._raw).toBe(thrown)
  })

  test('a Go panic from a callback unwinds unchanged', () => {
    const goPanic = new $.GoPanic('callback failed')
    const value = ValueOf(() => {
      throw goPanic
    })

    expect(() => value.Invoke()).toThrow(goPanic)
  })
})
