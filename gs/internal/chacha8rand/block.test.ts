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

import { describe, expect, it } from 'vitest'

import { block } from './block.js'

// seed1to32 is the ChaCha8 seed whose bytes are 1, 2, ..., 32, read as
// four little-endian uint64 words. goldenCounter0 is the corresponding
// native Go output of math/rand/v2.NewChaCha8(seed).Uint64() for the
// first 32 draws (counter 0).
const seed1to32: readonly bigint[] = [
  0x0807060504030201n,
  0x100f0e0d0c0b0a09n,
  0x1817161514131211n,
  0x201f1e1d1c1b1a19n,
]

const goldenCounter0: readonly bigint[] = [
  1321726231891648469n,
  7633913885951459254n,
  8828777078258939905n,
  13645562705924589592n,
  3491326525855962135n,
  4655274642627843093n,
  4156933806901666890n,
  8659533936280791071n,
  5721894521891779484n,
  2006179055270145417n,
  13837785268065961965n,
  6025473282503000574n,
  2288344603151595642n,
  9051672082053201051n,
  8785215327782688044n,
  11360099710921800885n,
  5350138739641633764n,
  8389572887738697180n,
  16054367544120479426n,
  4365023495104241058n,
  10244330312987020610n,
  7786887648560913700n,
  368542909519472877n,
  438314090810189142n,
  7313033738846548565n,
  9963264955047881609n,
  15432657324058560010n,
  4623483455223431453n,
  17560850082428231755n,
  9607738468983515573n,
  1832427683369515771n,
  7435345417750366512n,
]

describe('block', () => {
  it('matches the native Go ChaCha8 stream for the first block', () => {
    const out = block(seed1to32, 0)
    expect(out).toHaveLength(32)
    for (let i = 0; i < 32; i++) {
      expect(out[i], `word ${i}`).toBe(goldenCounter0[i])
    }
  })
})
