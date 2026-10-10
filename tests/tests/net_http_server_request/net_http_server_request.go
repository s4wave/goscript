package main

import (
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
)

// printURL prints the *url.URL surface of u.
func printURL(label string, u *url.URL) {
	println(label, "string:", u.String())
	println(label, "fields:", u.Scheme, u.Opaque, u.User == nil, u.Host, u.Path, u.RawPath, u.RawQuery, u.Fragment, u.RawFragment, u.ForceQuery)
	println(label, "host:", u.Hostname(), u.Port(), u.IsAbs())
	println(label, "redacted:", u.Redacted())
	println(label, "escaped:", u.EscapedPath(), u.EscapedFragment(), u.RequestURI())

	ref, err := u.Parse("../d/e?k=v#top")
	if err != nil {
		println(label, "parse error:", err.Error())
	} else {
		println(label, "parse:", ref.String())
	}

	println(label, "resolve:", u.ResolveReference(&url.URL{Path: "x/./y"}).String())
	println(label, "join:", u.JoinPath("sub", "../z").String())

	data, err := u.MarshalBinary()
	println(label, "marshal:", string(data), err == nil)
}

func main() {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		data, err := io.ReadAll(r.Body)
		println("server:", r.Method, r.Body == http.NoBody, len(data), err == nil, r.URL.Query().Get("x"), r.URL.RequestURI())
		printURL("server", r.URL)
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

	// A parsed *url.URL is a valid request URL.
	parsed, err := url.Parse("https://example.com:8443/x?y=1")
	if err != nil {
		println("parse error:", err.Error())
		return
	}
	req.URL = parsed
	println("assigned:", req.URL.Query().Get("y"), req.URL.Hostname(), req.URL.Port(), req.URL.RequestURI())

	// A composite literal takes a *url.URL field directly.
	literal := &http.Request{Method: http.MethodPost, URL: parsed}
	println("literal:", literal.Method, literal.URL.Host, literal.URL.RequestURI())

	// RequestURI keeps the escaped path and the query unchanged.
	targets := []string{
		"/a%2Fb/c?q=a/../b&n=5",
		"/a/b",
		"http://example.com",
		"https://user:secret@example.com:8443/p/q%20r?a=1&b=2#frag%20x",
		"mailto:joe@example.com?subject=hi",
		"http://example.com/p?",
	}
	for _, target := range targets {
		req, err := http.NewRequest(http.MethodGet, target, nil)
		if err != nil {
			println("new request error:", err.Error())
			continue
		}
		println("request uri:", req.URL.RequestURI())
		printURL("request", req.URL)
	}

	// A bad target reports the parse failure as a *url.Error.
	_, err = http.NewRequest(http.MethodGet, "http://example.com/%zz", nil)
	var urlErr *url.Error
	println("bad target:", errors.As(err, &urlErr), urlErr.Op, urlErr.URL, urlErr.Err.Error())
}
