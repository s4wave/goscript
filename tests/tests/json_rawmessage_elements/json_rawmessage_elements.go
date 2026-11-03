package main

import "encoding/json"

func main() {
	var fields map[string]json.RawMessage
	err := json.Unmarshal([]byte(`{"name":"a","kids":[{"x":1},"b"],"n":3}`), &fields)
	println("map:", err == nil, string(fields["name"]), string(fields["kids"]), string(fields["n"]))

	var kids []json.RawMessage
	err = json.Unmarshal(fields["kids"], &kids)
	println("slice:", err == nil, len(kids), string(kids[0]), string(kids[1]))

	var name string
	err = json.Unmarshal(fields["name"], &name)
	println("name:", err == nil, name)

	marshalElements()
}

// marshalElements tests that Marshal writes the RawMessage elements of
// maps and slices as their JSON, not as base64.
func marshalElements() {
	out, err := json.Marshal(map[string]json.RawMessage{"b": json.RawMessage(`"x"`), "a": json.RawMessage(`[1, 2]`)})
	println("marshal map:", err == nil, string(out))
	out, err = json.Marshal([]json.RawMessage{json.RawMessage(`{"x": 1}`), json.RawMessage(`true`)})
	println("marshal slice:", err == nil, string(out))
	type item struct {
		Values map[string]json.RawMessage
		Items  []*item `json:",omitempty"`
	}
	out, err = json.MarshalIndent(&item{Values: map[string]json.RawMessage{"Name": json.RawMessage(`"a"`)}, Items: []*item{{Values: map[string]json.RawMessage{"N": json.RawMessage(`3`)}}}}, "", " ")
	println("marshal nested:", err == nil, string(out))
}
