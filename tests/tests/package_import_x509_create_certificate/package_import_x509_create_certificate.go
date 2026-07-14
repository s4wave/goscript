package main

import (
	"crypto/ed25519"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"math/big"
	"reflect"
	"slices"
	"time"
)

type signedKey struct {
	PubKey    []byte
	Signature []byte
}

var extensionID = asn1.ObjectIdentifier{1, 3, 6, 1, 4, 1, 53594, 1, 1}

func main() {
	pub, priv, err := ed25519.GenerateKey(rand.Reader)
	println("keygen err nil", err == nil)
	extensionDER, err := asn1.Marshal(signedKey{
		PubKey:    []byte{8, 1, 18, 2, 3, 4},
		Signature: []byte{5, 6},
	})
	println("extension marshal err nil", err == nil)

	template := &x509.Certificate{
		SerialNumber: big.NewInt(42),
		Subject: pkix.Name{
			CommonName:   "goscript.test",
			Organization: []string{"GoScript"},
		},
		NotBefore:             time.Unix(1_700_000_000, 0),
		NotAfter:              time.Unix(4_900_000_000, 0),
		KeyUsage:              x509.KeyUsageDigitalSignature,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
		ExtraExtensions: []pkix.Extension{{
			Id:       extensionID,
			Critical: true,
			Value:    extensionDER,
		}},
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
	var keyExt pkix.Extension
	for _, ext := range cert.Extensions {
		if ext.Id.Equal(extensionID) {
			keyExt = ext
			for idx, unhandled := range cert.UnhandledCriticalExtensions {
				if unhandled.Equal(extensionID) {
					cert.UnhandledCriticalExtensions = slices.Delete(
						cert.UnhandledCriticalExtensions,
						idx,
						idx+1,
					)
					break
				}
			}
			break
		}
	}
	var decoded signedKey
	_, err = asn1.Unmarshal(keyExt.Value, &decoded)
	println(
		"extension unmarshal",
		err == nil,
		len(decoded.PubKey),
		decoded.PubKey[0],
		decoded.PubKey[5],
		len(decoded.Signature),
	)
	pool := x509.NewCertPool()
	pool.AddCert(cert)
	_, err = cert.Verify(x509.VerifyOptions{Roots: pool})
	println("verify err nil", err == nil)
	if err != nil {
		println("verify error", err.Error())
		println("verify error type", reflect.TypeOf(err).String())
		switch typed := err.(type) {
		case x509.CertificateInvalidError:
			println("certificate invalid", int(typed.Reason), typed.Detail)
		case x509.UnknownAuthorityError:
			println("unknown authority")
		default:
			println("other error")
		}
		return
	}

	println("serial", cert.SerialNumber.String())
	println("common name", cert.Subject.CommonName)
	println("organization", cert.Subject.Organization[0])
	println("signature algorithm", cert.SignatureAlgorithm.String())
	println("public key algorithm", cert.PublicKeyAlgorithm.String())
	println("public key equal", cert.PublicKey.(ed25519.PublicKey).Equal(pub))
}
