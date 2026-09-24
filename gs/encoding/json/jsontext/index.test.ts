import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  AllowDuplicateNames,
  AllowInvalidUTF8,
  CanonicalizeRawInts,
  EscapeForHTML,
  EscapeForJS,
  PreserveRawStrings,
  Value_Canonicalize,
  Value_Compact,
  Value_Format,
  Value_Indent,
  Value_IsValid,
  Value_Kind,
  Value_Clone,
  Value_MarshalJSON,
  Value_String,
  Value_UnmarshalJSON,
  WithIndent,
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

  it('validates one value and rejects duplicate names and invalid Unicode', () => {
    expect(Value_IsValid($.stringToBytes(' {"a":1} '))).toBe(true)
    expect(Value_IsValid($.stringToBytes('{"a":1,"a":2}'))).toBe(false)
    expect(
      Value_IsValid(
        $.stringToBytes('{"a":1,"a":2}'),
        AllowDuplicateNames(true),
      ),
    ).toBe(true)
    expect(Value_IsValid($.stringToBytes('1 2'))).toBe(false)
    expect(Value_IsValid(new Uint8Array([0xef, 0xbb, 0xbf, 0x31]))).toBe(false)
    expect(Value_IsValid($.stringToBytes('"\\ud800"'))).toBe(false)
    const invalidUTF8 = new Uint8Array([0x22, 0xff, 0x22])
    expect(Value_IsValid(invalidUTF8)).toBe(false)
    expect(Value_IsValid(invalidUTF8, AllowInvalidUTF8(true))).toBe(true)
  })

  it('formats without changing invalid input or discarding duplicate names', () => {
    const raw = $.varRef<$.Bytes>(
      $.stringToBytes(' { "a" : "\\u0062", "a": 1e+1 } '),
    )
    expect(Value_Format(raw)).not.toBeNull()
    expect($.bytesToString(raw.value)).toBe(' { "a" : "\\u0062", "a": 1e+1 } ')
    expect(Value_Compact(raw)).toBeNull()
    expect($.bytesToString(raw.value)).toBe('{"a":"\\u0062","a":1e+1}')
    expect(Value_Indent(raw, WithIndent('  '))).toBeNull()
    expect(() => WithIndent('x')).toThrow()
    expect($.bytesToString(raw.value)).toBe(
      '{\n  "a": "\\u0062",\n  "a": 1e+1\n}',
    )
  })

  it('normalizes strings and escapes HTML only when requested', () => {
    const raw = $.varRef<$.Bytes>($.stringToBytes(' { "x": "<\\u0026>" } '))
    expect(Value_Format(raw, EscapeForHTML(true))).toBeNull()
    expect($.bytesToString(raw.value)).toBe('{"x":"\\u003c\\u0026\\u003e"}')
    expect(Value_Format(raw, PreserveRawStrings(true))).toBeNull()

    const escaped = $.varRef<$.Bytes>($.stringToBytes('{"x":"\\u0062"}'))
    expect(Value_Format(escaped)).toBeNull()
    expect($.bytesToString(escaped.value)).toBe('{"x":"b"}')
  })

  it('canonicalizes sorted members and numbers with overrideable defaults', () => {
    const raw = $.varRef<$.Bytes>(
      $.stringToBytes('{"z":1.0,"a":9007199254740993}'),
    )
    expect(Value_Canonicalize(raw, CanonicalizeRawInts(false))).toBeNull()
    expect($.bytesToString(raw.value)).toBe('{"a":9007199254740993,"z":1}')
    expect(Value_Kind($.stringToBytes(' \t-12'))).toBe(48)
    expect(Value_Kind($.stringToBytes('  {'))).toBe(123)
    expect(Value_Kind(null)).toBe(0)
  })
  it('preserves malformed bytes only when raw strings are requested', () => {
    const input = new Uint8Array([0x5b, 0x20, 0x22, 0xff, 0x22, 0x20, 0x5d])
    const compact = $.varRef<$.Bytes>(input.slice())
    expect(Value_Compact(compact)).toBeNull()
    expect(Array.from($.bytesToUint8Array(compact.value))).toEqual([
      0x5b, 0x22, 0xff, 0x22, 0x5d,
    ])

    const indented = $.varRef<$.Bytes>(input.slice())
    expect(Value_Indent(indented, WithIndent('  '))).toBeNull()
    expect(Array.from($.bytesToUint8Array(indented.value))).toEqual([
      0x5b, 0x0a, 0x20, 0x20, 0x22, 0xff, 0x22, 0x0a, 0x5d,
    ])

    const formatted = $.varRef<$.Bytes>(input.slice())
    expect(Value_Format(formatted, AllowInvalidUTF8(true))).toBeNull()
    expect($.bytesToString(formatted.value)).toBe('["�"]')
    expect(Value_Format($.varRef<$.Bytes>(input.slice()))).not.toBeNull()
  })

  it('replaces unpaired escapes unless preserving raw strings', () => {
    const formatted = $.varRef<$.Bytes>($.stringToBytes('"\\ud800"'))
    expect(Value_Format(formatted, AllowInvalidUTF8(true))).toBeNull()
    expect($.bytesToString(formatted.value)).toBe('"�"')

    const preserved = $.varRef<$.Bytes>($.stringToBytes('"\\ud800"'))
    expect(Value_Compact(preserved)).toBeNull()
    expect($.bytesToString(preserved.value)).toBe('"\\ud800"')
  })

  it('normalizes negative zero and orders duplicate members by content', () => {
    const raw = $.varRef<$.Bytes>($.stringToBytes('{"a":2,"a":1,"b":-0}'))
    expect(
      Value_Canonicalize(
        raw,
        AllowDuplicateNames(true),
        CanonicalizeRawInts(false),
      ),
    ).toBeNull()
    expect($.bytesToString(raw.value)).toBe('{"a":1,"a":2,"b":0}')
  })
  it('sorts equal names by UTF-16 member content', () => {
    const raw = $.varRef<$.Bytes>($.stringToBytes('{"a":"","a":"😀"}'))
    expect(Value_Canonicalize(raw, AllowDuplicateNames(true))).toBeNull()
    expect($.bytesToString(raw.value)).toBe('{"a":"😀","a":""}')
  })

  it('escapes JavaScript separators in preserved byte strings', () => {
    const raw = $.varRef<$.Bytes>(
      $.stringToBytes(`"${String.fromCodePoint(0x2028)}"`),
    )
    expect(Value_Compact(raw, EscapeForJS(true))).toBeNull()
    expect($.bytesToString(raw.value)).toBe('"\\u2028"')
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
