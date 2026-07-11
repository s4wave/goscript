package main

import (
	"crypto"
	"crypto/ed25519"
)

func main() {
	var value any = ed25519.PrivateKey(make([]byte, ed25519.PrivateKeySize))
	_, ok := value.(crypto.Signer)
	println(ok)
}
