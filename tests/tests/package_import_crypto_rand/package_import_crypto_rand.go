package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"io"
)

func main() {
	// Read from the public entropy adapter and its Reader interface.
	buf := make([]byte, 32)
	n, err := rand.Read(buf)
	println("read len", n)
	println("read err nil", err == nil)
	println("read has data", hasData(buf))

	// The Reader fills a caller-owned Go byte slice.
	var r io.Reader = rand.Reader
	small := make([]byte, 4)
	n, err = r.Read(small)
	println("reader len", n)
	println("reader err nil", err == nil)
	println("reader has data", hasData(small))

	// Text uses the same secure source for its token.
	token := rand.Text()
	println("text len", len(token))
	println("text alphabet", isBase32(token))

	// P256 key generation reaches the standard library's internal sysrand path.
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	println("p256 key err nil", err == nil)
	println("p256 key has entropy", key != nil && key.D.Sign() != 0)
	println("p256 point valid", key != nil && key.Curve.IsOnCurve(key.X, key.Y))

	// Standard-library encoding recognizes the same curve through fresh interfaces.
	println("p256 curve identity", key.Curve == elliptic.P256())
	der, err := x509.MarshalECPrivateKey(key)
	println("p256 marshal err nil", err == nil)
	restored, err := x509.ParseECPrivateKey(der)
	println("p256 roundtrip", err == nil && restored != nil && restored.Curve == elliptic.P256() && restored.D.Cmp(key.D) == 0)
}

func hasData(buf []byte) bool {
	for _, b := range buf {
		if b != 0 {
			return true
		}
	}
	return false
}

func isBase32(token string) bool {
	for i := 0; i < len(token); i++ {
		c := token[i]
		if !((c >= 65 && c <= 90) || (c >= 50 && c <= 55)) {
			return false
		}
	}
	return true
}
