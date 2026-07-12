//go:debug cryptocustomrand=1

package main

import (
	"bytes"
	"crypto/ecdh"
	"errors"
	"io"
)

var errReaderFailed = errors.New("reader failed")

type segmentedReader struct {
	data   []byte
	offset int
	step   int
}

func (r *segmentedReader) Read(p []byte) (int, error) {
	if r.offset >= len(r.data) {
		return 0, io.EOF
	}
	n := min(r.step, len(p), len(r.data)-r.offset)
	copy(p, r.data[r.offset:r.offset+n])
	r.offset += n
	return n, nil
}

type failingReader struct{}

func (*failingReader) Read(p []byte) (int, error) {
	n := copy(p, []byte{1, 2, 3, 4, 5, 6, 7})
	return n, errReaderFailed
}

func main() {
	deterministicBytes := bytes.Repeat([]byte{42}, 64)
	deterministic, err := ecdh.X25519().GenerateKey(bytes.NewReader(deterministicBytes))
	println("deterministic err nil", err == nil)
	println("deterministic private matches", bytes.Equal(deterministic.Bytes(), deterministicBytes[:32]))
	println("deterministic public len", len(deterministic.PublicKey().Bytes()))

	segmentedBytes := bytes.Repeat([]byte{43}, 64)
	segmented, err := ecdh.X25519().GenerateKey(&segmentedReader{
		data: segmentedBytes,
		step: 5,
	})
	println("segmented err nil", err == nil)
	println("segmented private matches", bytes.Equal(segmented.Bytes(), segmentedBytes[:32]))
	println("segmented public len", len(segmented.PublicKey().Bytes()))

	short, err := ecdh.X25519().GenerateKey(bytes.NewReader(deterministicBytes[:31]))
	println("premature key nil", short == nil)
	println("premature unexpected EOF", errors.Is(err, io.ErrUnexpectedEOF))

	failed, err := ecdh.X25519().GenerateKey(&failingReader{})
	println("explicit key nil", failed == nil)
	println("explicit error propagated", errors.Is(err, errReaderFailed))
}
