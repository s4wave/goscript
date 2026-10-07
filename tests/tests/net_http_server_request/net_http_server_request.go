package main

import (
	"io"
	"net/http"
	"net/http/httptest"
)

func main() {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		data, err := io.ReadAll(r.Body)
		println("server:", r.Method, r.Body == http.NoBody, len(data), err == nil, r.URL.Query().Get("x"))
		if _, err := w.Write([]byte("ok")); err != nil {
			println("write error:", err.Error())
		}
	}))
	defer server.Close()

	resp, err := http.Get(server.URL + "/?x=1")
	if err != nil {
		println("get error:", err.Error())
		return
	}
	defer resp.Body.Close()
	println("get status:", resp.StatusCode)

	req := httptest.NewRequest(http.MethodGet, "/?y=2", nil)
	println("recorded:", req.Body != nil, req.URL.Query().Get("y"), req.URL.Query().Has("z"))
}
