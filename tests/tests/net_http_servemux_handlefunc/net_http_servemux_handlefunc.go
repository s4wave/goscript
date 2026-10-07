package main

import (
	"net/http"
	"net/http/httptest"
)

func serve(handler http.Handler, target string) {
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, target, nil))
	println(target, "->", rec.Code, rec.Header().Get("X-Route"), rec.Body.String())
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/mux", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Route", "mux")
		w.WriteHeader(http.StatusAccepted)
		if _, err := w.Write([]byte("hello " + r.URL.Path)); err != nil {
			println("write error:", err.Error())
		}
	})
	http.HandleFunc("/default", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Route", "default")
		if _, err := w.Write([]byte("hello " + r.URL.Path)); err != nil {
			println("write error:", err.Error())
		}
	})

	serve(mux, "/mux")
	serve(mux, "/missing")
	serve(http.DefaultServeMux, "/default")
}
