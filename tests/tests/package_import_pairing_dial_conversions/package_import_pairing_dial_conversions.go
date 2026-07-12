package main

import (
	"crypto"
	"crypto/ed25519"
	"errors"
	"io"
	"net"
)

type recreateError struct {
	next uint64
}

func (e *recreateError) Error() string {
	return "recreate"
}

type readWriteCloser struct{}

func (*readWriteCloser) Read([]byte) (int, error) {
	return 0, io.EOF
}

func (*readWriteCloser) Write(p []byte) (int, error) {
	return len(p), nil
}

func (*readWriteCloser) Close() error {
	return nil
}

func main() {
	var addr net.Addr = &net.UDPAddr{IP: net.IPv4(127, 0, 0, 1), Port: 443}
	println("addr", addr.Network(), addr.(*net.UDPAddr).Port)

	var stream io.ReadWriteCloser = &readWriteCloser{}
	written, err := stream.Write([]byte("dial"))
	println("stream", written, err == nil, stream.Close() == nil)

	keys := make(chan crypto.PublicKey, 1)
	keys <- ed25519.PublicKey{1, 2, 3}
	key := (<-keys).(ed25519.PublicKey)
	println("key", len(key), key[0])

	var target *recreateError
	matched := errors.As(&recreateError{next: 7}, &target)
	println("error", matched, target.next)
}
