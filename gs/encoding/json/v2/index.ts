// A program that imports encoding/json/v2 or encoding/json/jsontext compiles
// all three encoding/json packages from Go source (see sourceWhenImported in
// meta.json), so this override serves only programs that reach encoding/json/v2
// through the encoding/json override. That override uses Marshaler and
// Unmarshaler, which encoding/json.Marshaler and encoding/json.Unmarshaler
// alias since Go 1.27; parity.json blocks every other export.
import type * as $ from '@goscript/builtin/index.js'

export interface Marshaler {
  MarshalJSON(): [$.Slice<number>, $.GoError]
}

export interface Unmarshaler {
  UnmarshalJSON(data: $.Slice<number>): $.GoError
}
