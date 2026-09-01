import { describe, expect, it } from 'vitest'
import {
  genericTypeArgsMarker,
  stripGenericTypeArgs,
} from './type.js'

describe('genericTypeArgsMarker', () => {
  it('is a string constant that survives minification', () => {
    // A minifier that inlines the descriptor's consumer converts the object
    // literal into a property-evaluation sequence, stringifying computed
    // keys. A Symbol key throws "Cannot convert a Symbol value to a string"
    // there; a string key survives.
    expect(typeof genericTypeArgsMarker).toBe('string')
  })

  it('brands descriptors so stripGenericTypeArgs removes them', () => {
    const args: unknown[] = [
      { [genericTypeArgsMarker]: true, T: { type: { kind: 'basic', name: 'int' } } },
      'real-arg',
    ]
    const rest = stripGenericTypeArgs(args)
    expect(rest).toEqual(['real-arg'])
  })

  it('keeps non-descriptor leading arguments', () => {
    const args: unknown[] = ['first', 'second']
    const rest = stripGenericTypeArgs(args)
    expect(rest).toEqual(['first', 'second'])
  })
})
