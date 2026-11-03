package main

import (
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"strings"
	"time"
)

func main() {
	// Canonical headers retain every value under the same field name.
	h := http.Header{}
	h.Set("content-type", "text/plain")
	h.Add("content-type", "charset=utf-8")
	println("header:", http.CanonicalHeaderKey("x-test"), h.Get("CONTENT-TYPE"), len(h.Values("content-type")))

	// Parse protocol versions and look up the method and status constants.
	major, minor, ok := http.ParseHTTPVersion("HTTP/2.0")
	println("proto:", major, minor, ok)
	println("status:", http.MethodPatch, http.StatusNetworkAuthenticationRequired, http.StatusText(http.StatusNetworkAuthenticationRequired))

	// Construct a request with its parsed URL and cookie header.
	req, err := http.NewRequest(http.MethodPut, "https://example.invalid/path?q=1", http.NoBody)
	if err != nil {
		println("request error:", err.Error())
		return
	}
	req.Header.Set("Cookie", "space=wave")
	println("request:", req.Method, req.URL.Path, req.ProtoAtLeast(1, 1), len(req.Cookies()))

	// A cloned request preserves the callback that opens another body reader.
	req.GetBody = func() (io.ReadCloser, error) {
		return io.NopCloser(strings.NewReader("again")), nil
	}
	body, err := req.Clone(req.Context()).GetBody()
	if err != nil {
		println("getbody error:", err.Error())
		return
	}
	data, err := io.ReadAll(body)
	println("getbody:", err == nil, string(data))

	// Record an error response with the corresponding status and body.
	rec := httptest.NewRecorder()
	http.Error(rec, http.ErrNotSupported.Error(), http.StatusForbidden)
	println("recorder:", rec.Code, rec.Body.String())

	// Serve the requested content through the ordinary response writer.
	rec = httptest.NewRecorder()
	http.ServeContent(rec, req, "content.txt", time.Time{}, strings.NewReader("served"))
	println("servecontent:", rec.Code, rec.Body.String())

	// A HEAD response keeps the successful status without sending its body.
	headReq, err := http.NewRequest(http.MethodHead, "https://example.invalid/content.txt", http.NoBody)
	if err != nil {
		println("head request error:", err.Error())
		return
	}
	rec = httptest.NewRecorder()
	http.ServeContent(rec, headReq, "content.txt", time.Time{}, strings.NewReader("hidden"))
	println("servecontent head:", rec.Code, rec.Body.Len())

	// The TLS test server supplies a client and its configured endpoint.
	srv := httptest.NewTLSServer(http.NotFoundHandler())
	defer srv.Close()
	println("server:", srv.URL != "", srv.Client() != nil, httptest.DefaultRemoteAddr)

	// Exercise address-family validation through both loopback socket families.
	println("tcp4:", transfer("tcp4", "127.0.0.1:0"))
	println("tcp6:", transfer("tcp6", "[::1]:0"))
}

// transfer checks an actual connection's payload through the selected family.
func transfer(network, address string) bool {
	// Accept one connection, keeping the listener alive until the read finishes.
	listener, err := net.Listen(network, address)
	if err != nil {
		return false
	}
	defer listener.Close()

	// Read one payload through the accepted connection.
	done := make(chan bool, 1)
	go func() {
		// Close the accepted connection after reading the client's payload.
		conn, err := listener.Accept()
		if err != nil {
			done <- false
			return
		}
		defer conn.Close()

		// Bound the real I/O and check the bytes rather than only dial success.
		_ = conn.SetReadDeadline(time.Now().Add(5 * time.Second))
		data := make([]byte, 4)
		_, err = io.ReadFull(conn, data)
		done <- err == nil && string(data) == "ping"
	}()

	// Dial the allocated address and wait for the receiver's result.
	conn, err := net.DialTimeout(network, listener.Addr().String(), 5*time.Second)
	if err != nil {
		return false
	}
	defer conn.Close()
	_ = conn.SetWriteDeadline(time.Now().Add(5 * time.Second))
	if _, err = conn.Write([]byte("ping")); err != nil {
		return false
	}
	return <-done
}
