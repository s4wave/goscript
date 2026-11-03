package main

import (
	"encoding/json"
	"strings"
)

type Simple struct {
	X int `json:"x"`
}

func main() {
	s := Simple{X: 42}
	b, err := json.Marshal(s)
	if err != nil {
		println("Error:", err.Error())
	} else {
		println("Result:", string(b))
	}
	unmarshalNames()
}

type Ref struct {
	Object Object
	Label  string `json:"label"`
}

type Object struct {
	SHA  string
	Type string
}

// unmarshalNames tests that Unmarshal matches the names of the fields
// without case, preferring the same case, as for the lowercase names of an
// API, including in anonymous structs and with DisallowUnknownFields.
func unmarshalNames() {
	var r Ref
	err := json.Unmarshal([]byte(`{"object":{"sha":"abc","TYPE":"commit"},"LABEL":"main"}`), &r)
	println("named:", err == nil, r.Object.SHA, r.Object.Type, r.Label)

	var a struct {
		Object struct{ SHA string }
	}
	err = json.Unmarshal([]byte(`{"object":{"sha":"def"}}`), &a)
	println("anonymous:", err == nil, a.Object.SHA)

	var o Object
	err = json.Unmarshal([]byte(`{"sha":"x","SHA":"y","type":"t"}`), &o)
	println("both cases:", err == nil, o.SHA, o.Type)

	d := json.NewDecoder(strings.NewReader(`{"sha":"z","other":1}`))
	d.DisallowUnknownFields()
	err = d.Decode(&o)
	println("unknown:", err != nil)
	d = json.NewDecoder(strings.NewReader(`{"sha":"w"}`))
	d.DisallowUnknownFields()
	err = d.Decode(&o)
	println("known:", err == nil, o.SHA)
}
