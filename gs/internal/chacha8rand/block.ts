// Copyright 2023 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//    * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//    * Neither the name of Google LLC nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Package chacha8rand implements a pseudorandom generator based on
// ChaCha8 (https://c2sp.org/chacha8rand). The Go standard library
// declares block without a body and implements it in assembly, which
// the GoScript compiler cannot lower; this hand-written override
// package replaces internal/chacha8rand in compiled output with the
// portable reference algorithm (chacha8_generic.go).
//
// block fills buf with 32 uint64s derived from four interleaved ChaCha8
// blocks. The state is a 16x4 matrix of uint32s: row j holds word j for
// each of the four interlaced blocks, so column i is one full ChaCha8
// state. Rows 0..3 are the ChaCha20 constants, rows 4..11 are the
// 256-bit key read from seed, row 12 is the per-block counter, and rows
// 13..15 are zero. After eight rounds, words 4..11 get the key
// feed-forward; words 0..3 and 12..15 are emitted as-is.
//
// Output word buf[2j+m] pairs the uint32s b[j][2m] (low half) and
// b[j][2m+1] (high half), reproducing the little-endian memory layout
// the four-way interlace is defined on.

const MASK32 = 0xffffffffn

// rotl32 returns x rotated left by n bits, as an unsigned 32-bit value.
function rotl32(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0
}

// qr is the (inlinable) ChaCha8 quarter round. Inputs and outputs are
// uint32 values; addition wraps modulo 2**32.
function qr(
  a: number,
  b: number,
  c: number,
  d: number,
): [number, number, number, number] {
  a = (a + b) >>> 0
  d = rotl32(d ^ a, 16)
  c = (c + d) >>> 0
  b = rotl32(b ^ c, 12)
  a = (a + b) >>> 0
  d = rotl32(d ^ a, 8)
  c = (c + d) >>> 0
  b = rotl32(b ^ c, 7)
  return [a, b, c, d]
}

// block computes the ChaCha8 keystream for the given seed and counter,
// returning the 32 uint64s of output. seed holds the four uint64 words
// of a [32]byte ChaCha8 seed (little-endian byte order); counter is a
// uint32 block counter.
export function block(seed: readonly bigint[], counter: number): bigint[] {
  // b[j*4+i] is row j, column i: word j of interlaced block i.
  const b = new Uint32Array(16 * 4)

  // Rows 0..3: the ChaCha20 constants "expand 32-byte k".
  const constants = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574]
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      b[j * 4 + i] = constants[j]
    }
  }

  // Rows 4..11: the 256-bit key as eight uint32 words in little-endian
  // order; word k of the key is the low half of seed[k/2] for even k
  // and the high half of seed[(k-1)/2] for odd k.
  for (let k = 0; k < 8; k++) {
    const w = Number((seed[k >> 1] >> BigInt(32 * (k & 1))) & MASK32)
    for (let i = 0; i < 4; i++) {
      b[(4 + k) * 4 + i] = w
    }
  }

  // Row 12: per-block counters, wrapping at 2**32.
  for (let i = 0; i < 4; i++) {
    b[12 * 4 + i] = (counter + i) >>> 0
  }

  // Rows 13..15 stay zero.

  // Run the ChaCha8 core on each of the four interlaced blocks.
  for (let i = 0; i < 4; i++) {
    let x0 = b[0 * 4 + i]
    let x1 = b[1 * 4 + i]
    let x2 = b[2 * 4 + i]
    let x3 = b[3 * 4 + i]
    let x4 = b[4 * 4 + i]
    let x5 = b[5 * 4 + i]
    let x6 = b[6 * 4 + i]
    let x7 = b[7 * 4 + i]
    let x8 = b[8 * 4 + i]
    let x9 = b[9 * 4 + i]
    let x10 = b[10 * 4 + i]
    let x11 = b[11 * 4 + i]
    let x12 = b[12 * 4 + i]
    let x13 = b[13 * 4 + i]
    let x14 = b[14 * 4 + i]
    let x15 = b[15 * 4 + i]

    // 4 iterations of eight quarter-rounds each is 8 rounds.
    for (let round = 0; round < 4; round++) {
      ;[x0, x4, x8, x12] = qr(x0, x4, x8, x12)
      ;[x1, x5, x9, x13] = qr(x1, x5, x9, x13)
      ;[x2, x6, x10, x14] = qr(x2, x6, x10, x14)
      ;[x3, x7, x11, x15] = qr(x3, x7, x11, x15)
      ;[x0, x5, x10, x15] = qr(x0, x5, x10, x15)
      ;[x1, x6, x11, x12] = qr(x1, x6, x11, x12)
      ;[x2, x7, x8, x13] = qr(x2, x7, x8, x13)
      ;[x3, x4, x9, x14] = qr(x3, x4, x9, x14)
    }

    // Store block i back into b[*][i].
    // Add b4..b11 back to the original key material,
    // like in ChaCha20, to avoid trivial invertibility.
    // There is no entropy in b0..b3 and b12..b15
    // so we can skip the additions and save some time.
    const xi = [
      x0,
      x1,
      x2,
      x3,
      x4,
      x5,
      x6,
      x7,
      x8,
      x9,
      x10,
      x11,
      x12,
      x13,
      x14,
      x15,
    ]
    for (let j = 0; j < 4; j++) {
      b[j * 4 + i] = xi[j]
    }
    for (let j = 4; j < 12; j++) {
      b[j * 4 + i] = (b[j * 4 + i] + xi[j]) >>> 0
    }
    for (let j = 12; j < 16; j++) {
      b[j * 4 + i] = xi[j]
    }
  }

  // Read the interlaced uint32 matrix back as 32 little-endian uint64s:
  // row j contributes out[2j] (columns 0,1) and out[2j+1] (columns 2,3).
  const out = new Array<bigint>(32)
  for (let j = 0; j < 16; j++) {
    for (let m = 0; m < 2; m++) {
      const lo = BigInt(b[j * 4 + 2 * m])
      const hi = BigInt(b[j * 4 + 2 * m + 1])
      out[2 * j + m] = lo | (hi << 32n)
    }
  }
  return out
}
