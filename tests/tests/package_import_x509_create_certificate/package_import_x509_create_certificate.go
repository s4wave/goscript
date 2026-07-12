package main

import (
	"crypto/ed25519"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"math/big"
	"time"
)

func main() {
	pub, priv, err := ed25519.GenerateKey(rand.Reader)
	println("keygen err nil", err == nil)

	template := &x509.Certificate{
		SerialNumber: big.NewInt(42),
		Subject: pkix.Name{
			CommonName:   "goscript.test",
			Organization: []string{"GoScript"},
		},
		NotBefore:             time.Unix(1_700_000_000, 0),
		NotAfter:              time.Unix(1_700_003_600, 0),
		KeyUsage:              x509.KeyUsageDigitalSignature,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
	}
	der, err := x509.CreateCertificate(rand.Reader, template, template, pub, priv)
	println("create err nil", err == nil)
	println("der nonempty", len(der) != 0)
	if err != nil {
		println("create error", err.Error())
		return
	}

	cert, err := x509.ParseCertificate(der)
	println("parse err nil", err == nil)
	if err != nil {
		println("parse error", err.Error())
		return
	}
	println("serial", cert.SerialNumber.String())
	println("common name", cert.Subject.CommonName)
	println("organization", cert.Subject.Organization[0])
	println("signature algorithm", cert.SignatureAlgorithm.String())
	println("public key algorithm", cert.PublicKeyAlgorithm.String())
	println("public key equal", cert.PublicKey.(ed25519.PublicKey).Equal(pub))
}
