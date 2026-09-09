import { describe, expect, it } from 'vitest'

import { formatPrintedArgs } from './print.js'
import { fieldRef, varRef } from './varRef.js'

describe('builtin println formatting', () => {
  it('formats Uint8Array values with a stable inspect-style representation', () => {
    expect(
      formatPrintedArgs(['b2:', new Uint8Array([72, 101, 108, 108, 111])]),
    ).toBe('b2: Uint8Array(5) [ 72, 101, 108, 108, 111 ]')
  })

  it('quotes nested string array elements', () => {
    expect(formatPrintedArgs(['strings.Split:', ['a', 'b', 'c']])).toBe(
      'strings.Split: [ "a", "b", "c" ]',
    )
  })

  it('formats plain objects across multiple lines', () => {
    expect(
      formatPrintedArgs([
        'out:',
        {
          exampleField: new Uint8Array([104, 101, 108, 108, 111]),
          exampleText: 'world',
        },
      ]),
    ).toBe(`out: {
  exampleField: Uint8Array(5) [ 104, 101, 108, 108, 111 ],
  exampleText: "world",
}`)
  })

  it('formats goscript struct field bags using field values', () => {
    expect(
      formatPrintedArgs([
        {
          _fields: {
            Name: 'hello',
            Count: 3,
          },
        },
      ]),
    ).toBe(`{
  Name: "hello",
  Count: 3,
}`)
  })

  it('formats variable and field pointers without exposing pointer machinery', () => {
    const storage = { Count: 3 }
    const local = varRef(4)
    const field = fieldRef(storage, 'Count')
    const value = { _fields: { Local: local, Field: field } }
    const expected = '{\n  Local: 4,\n  Field: 3,\n}'
    expect(formatPrintedArgs([value])).toBe(expected)
    void local.__goPointer
    void field.__goPointer
    expect(formatPrintedArgs([value])).toBe(expected)
  })
})
