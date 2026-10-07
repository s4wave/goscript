package main

import (
	"net/http"
	"net/http/httptest"
)

func route(label string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body := label + " id=" + r.PathValue("id") + " path=" + r.PathValue("path") + " pattern=" + r.Pattern
		if _, err := w.Write([]byte(body)); err != nil {
			println("write error:", err.Error())
		}
	})
}

func serve(mux *http.ServeMux, req *http.Request) {
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, req)
	println(req.Method, req.Host, req.URL.Path, "->", rec.Code, rec.Body.String(), rec.Header().Get("Allow"), rec.Header().Get("Location"))
}

func get(mux *http.ServeMux, method, target string) {
	serve(mux, httptest.NewRequest(method, target, nil))
}

func register(mux *http.ServeMux, pattern string, handler http.Handler) {
	defer func() {
		println("register", pattern, "panics:", recover() != nil)
	}()
	mux.Handle(pattern, handler)
}

func main() {
	mux := http.NewServeMux()
	mux.Handle("/{$}", route("home"))
	mux.Handle("GET /items/{id}", route("get"))
	mux.Handle("DELETE /items/{id}", route("delete"))
	mux.Handle("GET /items/new", route("new"))
	mux.Handle("POST /items", route("create"))
	mux.Handle("/items/{id}/files/{path...}", route("files"))
	mux.Handle("/static/", route("static"))
	mux.Handle("/static/special", route("special"))
	mux.Handle("/exact/{$}", route("exact"))
	mux.Handle("example.com/hosted", route("host"))
	mux.Handle("/hosted", route("any-host"))

	get(mux, "GET", "/")
	get(mux, "GET", "/missing")
	get(mux, "GET", "/items/42")
	get(mux, "HEAD", "/items/42")
	get(mux, "DELETE", "/items/7")
	get(mux, "POST", "/items/7")
	get(mux, "GET", "/items/new")
	get(mux, "POST", "/items")
	get(mux, "GET", "/items")
	get(mux, "GET", "/items/a%2Fb")
	get(mux, "GET", "/items/a%20b")
	get(mux, "PUT", "/items/42/files/a/b/c")
	get(mux, "PUT", "/items/42/files/")
	get(mux, "PUT", "/items/42/files")
	get(mux, "GET", "/static/css/app.css")
	get(mux, "GET", "/static/special")
	get(mux, "GET", "/static/special/more")
	get(mux, "GET", "/static")
	get(mux, "GET", "/exact/")
	get(mux, "GET", "/exact")
	get(mux, "GET", "/exact/x")
	get(mux, "GET", "/items//42")

	hosted := httptest.NewRequest("GET", "/hosted", nil)
	serve(mux, hosted)
	hosted = httptest.NewRequest("GET", "/hosted", nil)
	hosted.Host = "other.org:8080"
	serve(mux, hosted)

	h, pattern := mux.Handler(httptest.NewRequest("GET", "/items/9", nil))
	println("handler:", h != nil, pattern)

	req := httptest.NewRequest("GET", "/", nil)
	println("unset:", req.PathValue("id") == "")
	req.SetPathValue("id", "set")
	println("set:", req.PathValue("id"), req.Clone(req.Context()).PathValue("id"))

	register(mux, "GET /items/{name}", route("conflict"))
	register(mux, "/items/new", route("overlap"))
	register(mux, "/items/{id}/files/{path...}", route("duplicate"))
	register(mux, "/a/{x}/{x}", route("duplicate name"))
	register(mux, "/a/{x", route("unclosed"))
	register(mux, "/a/{$}/b", route("dollar not last"))
	register(mux, "/a/{x...}/b", route("multi not last"))
	register(mux, "BAD(METHOD /a", route("method"))
	register(mux, "a", route("no slash"))
	register(mux, "", route("empty"))
	register(mux, "/nil", nil)
	register(mux, "/ok/{id}", route("ok"))
}
