package main

import "encoding/binary"

func nonZero(buf [32]byte) int32 {
	ret := binary.LittleEndian.Uint64(buf[0:8]) |
		binary.LittleEndian.Uint64(buf[8:16]) |
		binary.LittleEndian.Uint64(buf[16:24]) |
		binary.LittleEndian.Uint64(buf[24:32])
	ret |= ret >> 32
	ret |= ret >> 16
	ret |= ret >> 8
	ret |= ret >> 4
	ret |= ret >> 2
	ret |= ret >> 1
	return int32(ret & 1)
}

func main() {
	println(nonZero([32]byte{}))
	println(nonZero([32]byte{31: 1}))
}
