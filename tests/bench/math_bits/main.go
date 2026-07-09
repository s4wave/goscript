package main

import (
	"fmt"
	"math/bits"
	"time"
)

const benchIterations = 200_000

var leadingZeros64Sink int
var mul32HiSink uint64
var mul32LoSink uint64

var leadingZeros64Inputs = [...]uint64{
	0,
	1,
	1 << 31,
	uint64(1)<<32 - 1,
	uint64(1)<<63 - 1,
	1 << 63,
	0xf000000000000000,
	^uint64(0),
}

var mul32XInputs = [...]uint32{
	0,
	1,
	1 << 31,
	^uint32(0),
	1 << 31,
}

var mul32YInputs = [...]uint32{
	^uint32(0),
	^uint32(0),
	2,
	^uint32(0),
	1 << 31,
}

func main() {
	benchmarkLeadingZeros64()
	benchmarkMul32()
}

func benchmarkLeadingZeros64() {
	expected := leadingZeros64Checksum()
	ops := benchIterations * len(leadingZeros64Inputs)
	acc := 0

	start := time.Now()
	for range benchIterations {
		for _, x := range leadingZeros64Inputs {
			acc += bits.LeadingZeros64(x)
		}
	}
	elapsed := time.Since(start)

	leadingZeros64Sink = acc
	want := expected * benchIterations
	if acc != want {
		panic(fmt.Sprintf("LeadingZeros64 checksum mismatch: got %d want %d", acc, want))
	}
	report("LeadingZeros64", ops, elapsed, uint64(acc))
}

func leadingZeros64Checksum() int {
	acc := 0
	for _, x := range leadingZeros64Inputs {
		acc += bits.LeadingZeros64(x)
	}
	return acc
}

func benchmarkMul32() {
	expectedHi, expectedLo := mul32Checksum()
	ops := benchIterations * len(mul32XInputs)
	var accHi uint64
	var accLo uint64

	start := time.Now()
	for range benchIterations {
		for idx, x := range mul32XInputs {
			hi, lo := bits.Mul32(x, mul32YInputs[idx])
			accHi += uint64(hi)
			accLo += uint64(lo)
		}
	}
	elapsed := time.Since(start)

	mul32HiSink = accHi
	mul32LoSink = accLo
	wantHi := expectedHi * uint64(benchIterations)
	wantLo := expectedLo * uint64(benchIterations)
	if accHi != wantHi || accLo != wantLo {
		panic(fmt.Sprintf("Mul32 checksum mismatch: got hi=%d lo=%d want hi=%d lo=%d", accHi, accLo, wantHi, wantLo))
	}
	report("Mul32", ops, elapsed, accHi^accLo)
}

func mul32Checksum() (uint64, uint64) {
	var accHi uint64
	var accLo uint64
	for idx, x := range mul32XInputs {
		hi, lo := bits.Mul32(x, mul32YInputs[idx])
		accHi += uint64(hi)
		accLo += uint64(lo)
	}
	return accHi, accLo
}

func report(name string, ops int, elapsed time.Duration, sink uint64) {
	totalNS := elapsed.Nanoseconds()
	fmt.Printf("RESULT bench=%s ops=%d total_ns=%d ns/op=%.3f sink=%d check=ok\n", name, ops, totalNS, float64(totalNS)/float64(ops), sink)
}
