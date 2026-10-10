package main

import "encoding/binary"

type attrs struct {
	packedData string
}

func (a attrs) decode() (result []string) {
	if a.packedData == "" {
		return nil
	}
	bytes := []byte(a.packedData)
	for len(bytes) > 0 {
		kn := 4 + binary.LittleEndian.Uint32(bytes[:4])
		k := string(bytes[4:kn])
		bytes = bytes[kn:]
		vn := 4 + binary.LittleEndian.Uint32(bytes[:4])
		v := string(bytes[4:vn])
		bytes = bytes[vn:]
		result = append(result, k+"="+v)
	}
	return result
}

func main() {
	a := attrs{packedData: "\x01\x00\x00\x00a\x01\x00\x00\x00b"}
	for _, s := range a.decode() {
		println(s)
	}
}
