package main

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
)

type wrappedAEAD struct {
	inner cipher.AEAD
}

func (w *wrappedAEAD) NonceSize() int {
	return w.inner.NonceSize()
}

func (w *wrappedAEAD) Overhead() int {
	return w.inner.Overhead()
}

func (w *wrappedAEAD) Seal(dst, nonce, plaintext, additionalData []byte) []byte {
	return w.inner.Seal(dst, nonce, plaintext, additionalData)
}

func (w *wrappedAEAD) Open(dst, nonce, ciphertext, additionalData []byte) ([]byte, error) {
	return w.inner.Open(dst, nonce, ciphertext, additionalData)
}

type packetSealer interface {
	Seal(dst, plaintext []byte) []byte
}

type nestedSealer struct {
	aead  cipher.AEAD
	nonce []byte
	aad   []byte
}

func (s *nestedSealer) Seal(dst, plaintext []byte) []byte {
	return s.aead.Seal(dst, s.nonce, plaintext, s.aad)
}

func encodeHex(data []byte) string {
	const digits = "0123456789abcdef"
	encoded := make([]byte, len(data)*2)
	for i, value := range data {
		encoded[i*2] = digits[value>>4]
		encoded[i*2+1] = digits[value&0xf]
	}
	return string(encoded)
}

func roundTrip(prefix []byte) {
	key := []byte("0123456789abcdef")
	nonce := []byte("123456789012")
	plaintext := []byte("browser quic handshake payload")
	aad := []byte("quic protected header")

	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err)
	}
	var aead cipher.AEAD
	aead, err = cipher.NewGCM(block)
	if err != nil {
		panic(err)
	}

	sealed := aead.Seal(prefix, nonce, plaintext, aad)
	ciphertext := sealed[len(prefix):]
	opened, err := aead.Open(nil, nonce, ciphertext, aad)
	println("round trip:", err == nil, bytes.Equal(opened, plaintext), len(sealed), len(ciphertext))
	if prefix == nil {
		println("ciphertext:", encodeHex(ciphertext))
	}
	if len(prefix) == 0 && cap(prefix) >= len(sealed) {
		backing := prefix[:len(sealed)]
		println("shared backing:", bytes.Equal(backing, sealed), cap(prefix), len(sealed))
	}
}

func makeGeneric[T any](length, capacity int) []T {
	return make([]T, length, capacity)
}

func main() {
	roundTrip(nil)
	roundTrip(make([]byte, 15))
	roundTrip(make([]byte, 0, 64))
	block, _ := aes.NewCipher([]byte("0123456789abcdef"))
	inner, _ := cipher.NewGCM(block)
	aead := cipher.AEAD(&wrappedAEAD{inner: inner})
	plaintext := make([]byte, 695)
	for i := range plaintext {
		plaintext[i] = byte(i)
	}
	packet := makeGeneric[byte](15+len(plaintext), 1452)
	nonce := []byte("123456789012")
	aad := []byte("quic protected header")
	expected := aead.Seal(nil, nonce, plaintext, aad)
	copy(packet[15:], plaintext)
	sealer := packetSealer(&nestedSealer{aead: aead, nonce: nonce, aad: aad})
	_ = sealer.Seal(packet[15:15], packet[15:15+len(plaintext)])
	packet = packet[:len(packet)+aead.Overhead()]
	println("wrapped shared backing:", bytes.Equal(packet[15:15+len(expected)], expected))

	randomAEAD, err := cipher.NewGCMWithRandomNonce(block)
	randomSealed := randomAEAD.Seal([]byte{7}, nil, []byte("random nonce"), aad)
	randomOpened, openErr := randomAEAD.Open(nil, nil, randomSealed[1:], aad)
	println(
		"random nonce:",
		err == nil,
		openErr == nil,
		randomAEAD.NonceSize(),
		randomAEAD.Overhead(),
		len(randomSealed),
		randomSealed[0] == 7,
		bytes.Equal(randomOpened, []byte("random nonce")),
	)
}
