package main

import "net/http"

type responseWriter struct {
	header http.Header
}

func (w *responseWriter) Header() http.Header {
	return w.header
}

func main() {
	writer := &responseWriter{header: http.Header{}}
	writer.Header().Set("X-Test", "ok")
	println(writer.Header().Get("x-test"))
}
