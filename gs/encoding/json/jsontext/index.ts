import * as $ from '@goscript/builtin/index.js'

// Value is a raw JSON value: the raw textual representation of a JSON value.
export type Value = $.Bytes

// Value_MarshalJSON returns v as the JSON encoding of v.
// It performs no validation. If v is nil, it returns a JSON null.
export function Value_MarshalJSON(
  v: Value,
): [$.Slice<number>, $.GoError] {
  if (v === null) {
    return [$.stringToBytes('null'), null]
  }
  const out = $.makeSlice<number>($.len(v), undefined, 'byte')
  $.copy(out, v)
  return [out, null]
}

// Value_UnmarshalJSON sets v as the JSON encoding of b.
// It stores a copy of the provided raw JSON input without any validation.
export function Value_UnmarshalJSON(
  v: $.VarRef<Value> | Value | null,
  b: $.Slice<number>,
): $.GoError {
  if ($.isVarRef(v)) {
    const out = $.makeSlice<number>($.len(b), undefined, 'byte')
    $.copy(out, b)
    v.value = out
    return null
  }
  return $.newError('jsontext.Value: UnmarshalJSON on nil pointer')
}

// Value_String returns the string formatting of v.
export function Value_String(v: Value): string {
  if (v === null) {
    return 'null'
  }
  return $.bytesToString(v)
}

// Value_Clone returns a copy of v.
export function Value_Clone(v: Value): Value {
  if (v === null) {
    return null
  }
  const out = $.makeSlice<number>($.len(v), undefined, 'byte')
  $.copy(out, v)
  return out
}
