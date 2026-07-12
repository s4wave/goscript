package main

import "encoding/asn1"

func main() {
	_, err := asn1.Marshal(make(chan int))
	println("err nil", err == nil)
	if err != nil {
		println("err", err.Error())
	}
}
