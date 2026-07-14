package main

import (
	"crypto/x509"
	"math/big"
	"time"
)

func verifyCertificate(cert *x509.Certificate, now time.Time) error {
	pool := x509.NewCertPool()
	pool.AddCert(cert)
	_, err := cert.Verify(x509.VerifyOptions{
		Roots:       pool,
		CurrentTime: now,
		KeyUsages:   []x509.ExtKeyUsage{x509.ExtKeyUsageAny},
	})
	return err
}

func main() {
	now := time.Unix(1_700_000_000, 0)
	cert := &x509.Certificate{
		Raw:                   []byte("certificate"),
		RawSubject:            []byte("subject"),
		RawIssuer:             []byte("subject"),
		SerialNumber:          big.NewInt(1),
		NotBefore:             now.Add(-time.Hour),
		NotAfter:              now.Add(time.Hour),
		KeyUsage:              x509.KeyUsageCertSign,
		BasicConstraintsValid: true,
		IsCA:                  true,
	}
	err := verifyCertificate(cert, now)
	println("verify err nil", err == nil)
}
