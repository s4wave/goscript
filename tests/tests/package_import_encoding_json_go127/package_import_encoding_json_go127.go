//go:build go1.27

package main

import (
	"encoding/json"
	"encoding/json/jsontext"
	"io"
	"slices"
	"strings"
)

func main() {
	var raw json.RawMessage
	dec := json.NewDecoder(strings.NewReader(`{"hello": true}`))
	err := dec.Decode(&raw)
	println("RawMessage:", string(raw), err == nil)
	println("RawMessage EOF:", dec.Decode(&raw) == io.EOF)
	println("RawMessage valid:", raw.IsValid(), raw.Kind())
	println("RawMessage format:", raw.Format() == nil, string(raw))

	formatted := json.RawMessage(`{"x": "<"}`)
	println("RawMessage HTML:", formatted.Format(jsontext.EscapeForHTML(true)) == nil, string(formatted))
	duplicates := json.RawMessage(`{"a":1,"a":2}`)
	println("RawMessage duplicates:", duplicates.IsValid(), duplicates.IsValid(jsontext.AllowDuplicateNames(true)))

	malformed := json.RawMessage{'[', ' ', '"', 0xff, '"', ' ', ']'}
	compact := malformed.Clone()
	println("RawMessage compact bytes:", compact.Compact() == nil, slices.Equal(compact, []byte{'[', '"', 0xff, '"', ']'}))
	indentedRaw := malformed.Clone()
	println("RawMessage indent bytes:", indentedRaw.Indent(jsontext.WithIndent("  ")) == nil, slices.Equal(indentedRaw, []byte{'[', '\n', ' ', ' ', '"', 0xff, '"', '\n', ']'}))
	normalized := malformed.Clone()
	println("RawMessage invalid UTF8 replacement:", normalized.Format(jsontext.AllowInvalidUTF8(true)) == nil, string(normalized))
	surrogate := json.RawMessage(`"\ud800"`)
	println("RawMessage surrogate replacement:", surrogate.Format(jsontext.AllowInvalidUTF8(true)) == nil, string(surrogate))
	ordered := json.RawMessage(`{"a":2,"a":1,"b":-0}`)
	println("RawMessage duplicate ordering:", ordered.Canonicalize(jsontext.AllowDuplicateNames(true), jsontext.CanonicalizeRawInts(false)) == nil, string(ordered))

}
