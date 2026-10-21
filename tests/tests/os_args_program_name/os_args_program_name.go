package main

import "os"

func main() {
	// The program name comes first on every platform, so programs may index
	// os.Args[0] and slice the arguments after it.
	println("has name:", len(os.Args) > 0 && os.Args[0] != "")
	println("args:", len(os.Args[1:]))
}
