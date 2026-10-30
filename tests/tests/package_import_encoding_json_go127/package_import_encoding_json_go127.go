//go:build go1.27

package main

import (
	"bytes"
	"encoding/json"
	"encoding/json/jsontext"
	jsonv2 "encoding/json/v2"
	"io"
	"slices"
	"strings"
)

// point marshals itself through jsontext tokens, as structured-merge-diff's
// fieldpath types do.
type point struct{ x, y int64 }

func (p point) MarshalJSONTo(enc *jsontext.Encoder) error {
	if err := enc.WriteToken(jsontext.BeginArray); err != nil {
		return err
	}
	if err := enc.WriteToken(jsontext.Int(p.x)); err != nil {
		return err
	}
	if err := enc.WriteToken(jsontext.Int(p.y)); err != nil {
		return err
	}
	return enc.WriteToken(jsontext.EndArray)
}

func (p *point) UnmarshalJSONFrom(dec *jsontext.Decoder) error {
	var xy []int64
	if err := jsonv2.UnmarshalDecode(dec, &xy); err != nil {
		return err
	}
	if len(xy) != 2 {
		return io.ErrUnexpectedEOF
	}
	p.x, p.y = xy[0], xy[1]
	return nil
}

type shape struct {
	Name   string         `json:"name"`
	Points []point        `json:"points"`
	Tags   map[string]int `json:"tags,omitempty"`
}

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

	// encoding/json/v2 marshals with deterministic map order and calls the
	// jsontext methods of its values.
	out, err := jsonv2.Marshal(shape{Name: "tri", Points: []point{{1, 2}, {3, -4}}, Tags: map[string]int{"z": 1, "a": 2}}, jsonv2.Deterministic(true))
	println("v2 Marshal:", string(out), err == nil)
	var back shape
	err = jsonv2.Unmarshal(out, &back)
	println("v2 Unmarshal:", back.Name, len(back.Points), back.Points[1].y, back.Tags["a"], err == nil)
	println("v2 duplicate name:", jsonv2.Unmarshal([]byte(`{"name":"a","name":"b"}`), &back) != nil)

	// Options built from encoding/json reach encoding/json/v2, as
	// k8s.io/apimachinery decodes with them.
	var anyValue map[string]any
	err = jsonv2.Unmarshal([]byte(`{"Name":1.5}`), &anyValue, json.DefaultOptionsV1(), jsonv2.MatchCaseInsensitiveNames(false))
	println("v2 with v1 options:", anyValue["Name"].(float64) == 1.5, err == nil)

	// A jsontext Encoder writes tokens to a writer.
	var buf bytes.Buffer
	enc := jsontext.NewEncoder(&buf)
	enc.WriteToken(jsontext.BeginObject)
	enc.WriteToken(jsontext.String("k"))
	enc.WriteToken(jsontext.Float(0.5))
	enc.WriteToken(jsontext.EndObject)
	println("jsontext Encoder:", strings.TrimSpace(buf.String()))
}
