package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

// Omitempty tests pointer and interface nilness, not pointed or dynamic zero
// values, so non-nil wrappers still emit their contents.
type Payload struct {
	Ptr              *int  `json:"ptr,omitempty"`
	IfaceZero        any   `json:"ifaceZero,omitempty"`
	IfaceFalse       any   `json:"ifaceFalse,omitempty"`
	IfaceEmptyString any   `json:"ifaceEmptyString,omitempty"`
	IfaceEmptySlice  any   `json:"ifaceEmptySlice,omitempty"`
	IfaceEmptyMap    any   `json:"ifaceEmptyMap,omitempty"`
	PtrNilIface      *any  `json:"ptrNilIface,omitempty"`
	PtrBool          *bool `json:"ptrBool,omitempty"`
}

func main() {
	zero := 0
	falseValue := false
	var nilIface any
	out, err := json.Marshal(Payload{
		Ptr:              &zero,
		IfaceZero:        0,
		IfaceFalse:       false,
		IfaceEmptyString: "",
		IfaceEmptySlice:  []int{},
		IfaceEmptyMap:    map[string]int{},
		PtrNilIface:      &nilIface,
		PtrBool:          &falseValue,
	})
	if err != nil {
		fmt.Println("marshal error:", err.Error())
		return
	}
	text := string(out)
	fmt.Println("ptr emitted:", strings.Contains(text, `"ptr":`))
	fmt.Println("ifaceZero emitted:", strings.Contains(text, `"ifaceZero":`))
	fmt.Println("ifaceFalse emitted:", strings.Contains(text, `"ifaceFalse":`))
	fmt.Println("ifaceEmptyString emitted:", strings.Contains(text, `"ifaceEmptyString":`))
	fmt.Println("ifaceEmptySlice emitted:", strings.Contains(text, `"ifaceEmptySlice":`))
	fmt.Println("ifaceEmptyMap emitted:", strings.Contains(text, `"ifaceEmptyMap":`))
	fmt.Println("ptrNilIface emitted as null:", strings.Contains(text, `"ptrNilIface":null`))
	fmt.Println("ptrBool emitted:", strings.Contains(text, `"ptrBool":`))
}
