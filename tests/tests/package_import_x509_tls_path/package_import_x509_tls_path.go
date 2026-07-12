package main

import (
	"crypto/ed25519"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"math/big"
	"time"
)

func main() {
	pub, priv, err := ed25519.GenerateKey(rand.Reader)
	println("keygen err nil", err == nil)

	template := &x509.Certificate{
		SerialNumber: big.NewInt(84),
		Subject: pkix.Name{
			CommonName: "bifrost.goscript.test",
		},
		NotBefore:             time.Unix(1_700_000_000, 0),
		NotAfter:              time.Unix(1_700_003_600, 0),
		KeyUsage:              x509.KeyUsageDigitalSignature,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth, x509.ExtKeyUsageClientAuth},
		BasicConstraintsValid: true,
	}
	der, err := x509.CreateCertificate(rand.Reader, template, template, pub, priv)
	println("create err nil", err == nil)
	if err != nil {
		println("create error", err.Error())
		return
	}

	leaf, err := x509.ParseCertificate(der)
	println("parse err nil", err == nil)
	if err != nil {
		println("parse error", err.Error())
		return
	}

	certificate := tls.Certificate{
		Certificate: [][]byte{der},
		PrivateKey:  priv,
		Leaf:        leaf,
	}
	config := &tls.Config{
		Certificates: []tls.Certificate{certificate},
		MinVersion:   tls.VersionTLS12,
		NextProtos:   []string{"bifrost"},
	}
	println("certificate count", len(config.Certificates))
	println("chain count", len(config.Certificates[0].Certificate))
	println("leaf common name", config.Certificates[0].Leaf.Subject.CommonName)
	println("private key signer", config.Certificates[0].PrivateKey.(ed25519.PrivateKey).Public().(ed25519.PublicKey).Equal(pub))
	println("min version", config.MinVersion)
	println("next proto", config.NextProtos[0])

	cache := tls.NewLRUClientSessionCache(2)
	session := &tls.ClientSessionState{}
	cache.Put("one", session)
	cached, ok := cache.Get("one")
	println("session cache hit", ok, cached == session)
	cache.Put("two", &tls.ClientSessionState{})
	cache.Put("three", &tls.ClientSessionState{})
	_, ok = cache.Get("one")
	println("session cache evicted", !ok)
}
