package main

import (
	"fmt"
	"net/http"
)

func main() {
	header := http.Header{"X-Test": []string{"ok"}}
	if header.Get("x-test") != "ok" {
		panic("missing header")
	}
	_ = fmt.Sprint(header)
	println("ok")
}
