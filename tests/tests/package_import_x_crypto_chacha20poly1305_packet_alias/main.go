package main

import (
	"bytes"

	"golang.org/x/crypto/chacha20poly1305"
)

func main() {
	key := make([]byte, chacha20poly1305.KeySize)
	nonce := make([]byte, chacha20poly1305.NonceSize)
	plaintext := []byte("QUIC payload")

	aead, err := chacha20poly1305.New(key)
	if err != nil {
		panic(err)
	}

	dst := make([]byte, 2, 64)
	copy(dst, "hd")
	alias := dst[:cap(dst)]
	sealed := aead.Seal(dst, nonce, plaintext, nil)

	println(
		"alias sees ciphertext:",
		bytes.Equal(alias[len(dst):len(sealed)], sealed[len(dst):]),
	)
}
