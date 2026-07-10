package main

import (
	"encoding"
	"hash"
	"hash/crc32"
)

func main() {
	if crc32.Size != 4 || crc32.IEEE != 0xedb88320 || crc32.Castagnoli != 0x82f63b78 || crc32.Koopman != 0xeb31d82e {
		panic("public constants")
	}
	if crc32.MakeTable(crc32.IEEE) != crc32.IEEETable || crc32.MakeTable(crc32.IEEE) != crc32.MakeTable(crc32.IEEE) {
		panic("IEEE table reuse")
	}
	if crc32.MakeTable(crc32.Castagnoli) != crc32.MakeTable(crc32.Castagnoli) {
		panic("Castagnoli table reuse")
	}
	if crc32.MakeTable(crc32.Koopman) == crc32.MakeTable(crc32.Koopman) {
		panic("custom tables unexpectedly reused")
	}

	payload := make([]byte, 257)
	for i := range payload {
		payload[i] = byte(i*31 + i/3 + 7)
	}

	tables := []struct {
		name  string
		table *crc32.Table
	}{
		{"ieee", crc32.IEEETable},
		{"castagnoli", crc32.MakeTable(crc32.Castagnoli)},
		{"koopman", crc32.MakeTable(crc32.Koopman)},
		{"custom", crc32.MakeTable(0xd5828281)},
	}
	lengths := []int{0, 1, 7, 8, 9, 15, 16, 17, len(payload)}
	for _, tc := range tables {
		for _, length := range lengths {
			data := payload[:length]
			oneShot := crc32.Checksum(data, tc.table)
			split := length / 2
			updated := crc32.Update(crc32.Update(0, tc.table, data[:split]), tc.table, data[split:])
			stream := crc32.New(tc.table)
			if n, err := stream.Write(data[:split]); n != split || err != nil {
				panic("first stream write")
			}
			if n, err := stream.Write(data[split:]); n != length-split || err != nil {
				panic("second stream write")
			}
			if updated != oneShot || stream.Sum32() != oneShot {
				panic("checksum mismatch")
			}
			println(tc.name, length, oneShot)
		}
	}

	if crc32.ChecksumIEEE(payload) != crc32.Checksum(payload, crc32.IEEETable) {
		panic("ChecksumIEEE")
	}
	ieee := crc32.NewIEEE()
	if _, err := ieee.Write(payload[:113]); err != nil {
		panic(err.Error())
	}
	if _, err := ieee.Write(payload[113:]); err != nil {
		panic(err.Error())
	}
	if ieee.Sum32() != crc32.ChecksumIEEE(payload) {
		panic("NewIEEE")
	}

	prefix := []byte{9, 8, 7}
	summed := ieee.Sum(prefix[:len(prefix):len(prefix)])
	if len(summed) != len(prefix)+crc32.Size || summed[0] != 9 || summed[1] != 8 || summed[2] != 7 {
		panic("prefix-preserving Sum")
	}
	println("sum", len(summed), summed[3], summed[4], summed[5], summed[6])

	marshaler, ok := ieee.(encoding.BinaryMarshaler)
	if !ok {
		panic("BinaryMarshaler")
	}
	state, err := marshaler.MarshalBinary()
	if err != nil {
		panic(err.Error())
	}
	appender, ok := ieee.(encoding.BinaryAppender)
	if !ok {
		panic("BinaryAppender")
	}
	appended, err := appender.AppendBinary([]byte{4, 5})
	if err != nil || len(appended) != len(state)+2 || appended[0] != 4 || appended[1] != 5 {
		panic("AppendBinary")
	}
	for i := range state {
		if appended[i+2] != state[i] {
			panic("AppendBinary state")
		}
	}
	println("state", len(state), state[0], state[1], state[2], state[3])

	restored := crc32.NewIEEE()
	unmarshaler, ok := restored.(encoding.BinaryUnmarshaler)
	if !ok {
		panic("BinaryUnmarshaler")
	}
	if err := unmarshaler.UnmarshalBinary(state); err != nil {
		panic(err.Error())
	}
	if restored.Sum32() != ieee.Sum32() {
		panic("restored state")
	}
	if _, err := restored.Write([]byte("tail")); err != nil {
		panic(err.Error())
	}
	if restored.Sum32() != crc32.Update(ieee.Sum32(), crc32.IEEETable, []byte("tail")) {
		panic("restored continuation")
	}

	beforeInvalid := restored.Sum32()
	invalidCases := [][]byte{
		{1, 2, 3},
		{'c', 'r', 'c', 1},
	}
	for _, invalid := range invalidCases {
		err := unmarshaler.UnmarshalBinary(invalid)
		if err == nil {
			panic("invalid state accepted")
		}
		println("invalid", err.Error())
		if restored.Sum32() != beforeInvalid {
			panic("invalid state changed hash")
		}
	}
	other := crc32.New(crc32.MakeTable(crc32.Castagnoli))
	otherUnmarshaler := other.(encoding.BinaryUnmarshaler)
	if err := otherUnmarshaler.UnmarshalBinary(state); err == nil {
		panic("table mismatch accepted")
	} else {
		println("invalid", err.Error())
	}

	cloneSource := crc32.NewIEEE()
	_, _ = cloneSource.Write([]byte("prefix"))
	cloner, ok := cloneSource.(hash.Cloner)
	if !ok {
		panic("Cloner")
	}
	clonedHash, err := cloner.Clone()
	if err != nil {
		panic(err.Error())
	}
	clone := clonedHash.(hash.Hash32)
	_, _ = cloneSource.Write([]byte("left"))
	_, _ = clone.Write([]byte("right"))
	if cloneSource.Sum32() != crc32.ChecksumIEEE([]byte("prefixleft")) || clone.Sum32() != crc32.ChecksumIEEE([]byte("prefixright")) {
		panic("clone independence")
	}
	println("clone", cloneSource.Sum32(), clone.Sum32())

	cloneSource.Reset()
	if cloneSource.Sum32() != 0 || cloneSource.Size() != crc32.Size || cloneSource.BlockSize() != 1 {
		panic("Reset/Size/BlockSize")
	}
	println("reset", cloneSource.Sum32(), cloneSource.Size(), cloneSource.BlockSize())
}
