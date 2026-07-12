package main

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

func main() {
	input := pkix.RDNSequence{
		{
			{Type: asn1.ObjectIdentifier{2, 5, 4, 3}, Value: "goscript"},
		},
	}
	der, err := asn1.Marshal(input)
	println("marshal err nil", err == nil)
	println("der len", len(der))

	var output pkix.RDNSequence
	rest, err := asn1.Unmarshal(der, &output)
	println("unmarshal err nil", err == nil)
	println("rest len", len(rest))
	println("rdn count", len(output))
	println("set count", len(output[0]))
	println("oid", output[0][0].Type.String())
	println("value", output[0][0].Value.(string))
}
