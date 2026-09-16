import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  Value_Clone,
  Value_MarshalJSON,
  Value_String,
  Value_UnmarshalJSON,
} from './index.js'

describe('jsontext.Value override', () => {
  it('marshals a value as its raw bytes', () => {
    const v: $.Bytes = $.stringToBytes('{"x":1}')
    const [out, err] = Value_MarshalJSON(v)
    expect(err).toBeNull()
    expect($.bytesToString(out)).toBe('{"x":1}')
  })

  it('marshals a nil value as null', () => {
    const [out, err] = Value_MarshalJSON(null)
    expect(err).toBeNull()
    expect($.bytesToString(out)).toBe('null')
  })

  it('unmarshal stores a copy of the input', () => {
    const rawRef = $.varRef<$.Bytes>(null)
    const input: $.Bytes = $.stringToBytes('[1,2]')
    expect(Value_UnmarshalJSON(rawRef, input)).toBeNull()
    expect($.bytesToString(rawRef.value)).toBe('[1,2]')
    input[0] = 0x20
    expect($.bytesToString(rawRef.value)).toBe('[1,2]')
  })

  it('unmarshal on a non-reference returns the nil pointer error', () => {
    const err = Value_UnmarshalJSON($.stringToBytes('1'), $.stringToBytes('1'))
    expect(err?.Error()).toBe('jsontext.Value: UnmarshalJSON on nil pointer')
  })

  it('string formats nil as null', () => {
    expect(Value_String(null)).toBe('null')
    expect(Value_String($.stringToBytes('{"a":true}'))).toBe('{"a":true}')
  })

  it('clone returns an independent copy', () => {
    const v: $.Bytes = $.stringToBytes('"x"')
    const c = Value_Clone(v)
    expect($.bytesToString(c)).toBe('"x"')
    v[0] = 0x20
    expect($.bytesToString(c)).toBe('"x"')
  })
})
