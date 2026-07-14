package main

import "runtime"

func main() {
	if false {
		runtime.Goexit()
	}
	println("ok")
}
