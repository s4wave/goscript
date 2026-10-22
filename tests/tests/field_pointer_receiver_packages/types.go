package main

// Base is declared in a file apart from its methods and the struct that
// embeds it.
type Base struct {
	self *Base
	n    int
}
