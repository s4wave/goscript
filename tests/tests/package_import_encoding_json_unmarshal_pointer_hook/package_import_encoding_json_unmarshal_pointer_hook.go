package main

import (
	"encoding/json"
	"fmt"
)

type Hooked struct {
	Calls int
	Seen  string
}

func (h *Hooked) UnmarshalJSON(data []byte) error {
	h.Calls++
	h.Seen = string(data)
	return nil
}

type Box struct {
	Value *Hooked `json:"value"`
}

func main() {
	// A non-nil *T field with UnmarshalJSON must use the hook before any
	// pointer-to-struct population path can inspect fields.
	box := Box{Value: &Hooked{Seen: "before"}}
	if err := json.Unmarshal([]byte(`{"value":{"ignored":0}}`), &box); err != nil {
		fmt.Println("unmarshal error:", err.Error())
		return
	}
	fmt.Printf("calls=%d seen=%s\n", box.Value.Calls, box.Value.Seen)
}
