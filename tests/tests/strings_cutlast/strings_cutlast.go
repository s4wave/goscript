package main

import "strings"

func main() {
	// CutLast splits around the last separator, like Cut does around the first.
	before, after, found := strings.CutLast("a/b/c", "/")
	println("CutLast:", before, after, found)
	before, after, found = strings.Cut("a/b/c", "/")
	println("Cut:", before, after, found)

	// Without the separator, it returns s, "", false.
	before, after, found = strings.CutLast("abc", "/")
	println("missing:", before, after == "", found)

	// A multi-byte separator and non-ASCII text cut at the last match.
	before, after, found = strings.CutLast("héllo::wörld::end", "::")
	println("multi:", before, after, found)
}
