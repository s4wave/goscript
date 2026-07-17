package main

import "net/http"

func main() {
	channel := make(chan http.Header, 1)
	close(channel)
	header, ok := <-channel
	println(header == nil, ok)
}
