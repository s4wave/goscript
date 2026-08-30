package main

import "fmt"

func main() {
	msg := &ExampleMsg{
		ExampleText: "world",
	}

	// String() must be synchronous and return a plain string, matching the Go
	// contract: func (x *M) String() string. A GoScript regression that makes
	// String() async (returning a Promise) breaks len() and all sync string use.
	str := msg.String()
	println("len:", len(str))
	println("empty:", len(str) == 0)
	println("prefix ok:", len(str) >= 10 && str[:10] == "ExampleMsg")

	// MarshalProtoText must also be synchronous.
	text := msg.MarshalProtoText()
	println("text len:", len(text))
	println("text:", text)

	// fmt.Sprintf uses String() internally; a Promise would break formatting.
	formatted := fmt.Sprintf("msg=%v", msg)
	println("formatted len:", len(formatted))
}
