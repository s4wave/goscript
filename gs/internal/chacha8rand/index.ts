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

import * as $ from '@goscript/builtin/index.js'

import * as byteorder from '@goscript/internal/byteorder/index.js'

import { block } from './block.js'

const ctrInc = 4
const ctrMax = 16
const chunk = 32
const reseed = 4

// State holds the state for a single random generator.
// It must be used from one goroutine at a time.
// If used by multiple goroutines at a time, the goroutines
// may see the same random values, but the code will not
// crash or cause out-of-bounds memory accesses.
export class State {
  public get buf(): bigint[] {
    return this._fields.buf.value
  }
  public set buf(value: bigint[]) {
    this._fields.buf.value = value
  }

  public get seed(): bigint[] {
    return this._fields.seed.value
  }
  public set seed(value: bigint[]) {
    this._fields.seed.value = value
  }

  public get i(): number {
    return this._fields.i.value
  }
  public set i(value: number) {
    this._fields.i.value = value
  }

  public get n(): number {
    return this._fields.n.value
  }
  public set n(value: number) {
    this._fields.n.value = value
  }

  public get c(): number {
    return this._fields.c.value
  }
  public set c(value: number) {
    this._fields.c.value = value
  }

  public _fields: {
    buf: $.VarRef<bigint[]>
    seed: $.VarRef<bigint[]>
    i: $.VarRef<number>
    n: $.VarRef<number>
    c: $.VarRef<number>
  }

  constructor(
    init?: Partial<{
      buf?: bigint[]
      seed?: bigint[]
      i?: number
      n?: number
      c?: number
    }>,
  ) {
    this._fields = {
      buf: $.varRef(
        init?.buf !== undefined ?
          $.cloneArrayValue(init.buf)
        : Array.from({ length: 32 }, () => 0n),
      ),
      seed: $.varRef(
        init?.seed !== undefined ?
          $.cloneArrayValue(init.seed)
        : Array.from({ length: 4 }, () => 0n),
      ),
      i: $.varRef(init?.i ?? (0 as number)),
      n: $.varRef(init?.n ?? (0 as number)),
      c: $.varRef(init?.c ?? (0 as number)),
    }
  }

  public clone(): State {
    const cloned = new State()
    cloned._fields = {
      buf: $.varRef($.cloneArrayValue(this._fields.buf.value)),
      seed: $.varRef($.cloneArrayValue(this._fields.seed.value)),
      i: $.varRef(this._fields.i.value),
      n: $.varRef(this._fields.n.value),
      c: $.varRef(this._fields.c.value),
    }
    return $.markAsStructValue(cloned)
  }

  // Next returns the next random value, along with a boolean
  // indicating whether one was available.
  // If one is not available, the caller should call Refill
  // and then repeat the call to Next.
  public Next(): [bigint, boolean] {
    const state = $.pointerValue<State>(this)
    const i = state.i
    if (i >= state.n) {
      return [0n, false]
    }
    state.i = i + 1
    return [$.arrayIndex(state.buf, i & 31), true]
  }

  // Init seeds the State with the given seed value.
  public Init(seed: Uint8Array): void {
    State.prototype.Init64.call(this, [
      byteorder.LEUint64($.goSlice(seed, 0 * 8, undefined)),
      byteorder.LEUint64($.goSlice(seed, 1 * 8, undefined)),
      byteorder.LEUint64($.goSlice(seed, 2 * 8, undefined)),
      byteorder.LEUint64($.goSlice(seed, 3 * 8, undefined)),
    ])
  }

  // Init64 seeds the state with the given seed value.
  // The input array is copied, so later changes to it do not
  // affect the state.
  public Init64(seed: bigint[]): void {
    const state = $.pointerValue<State>(this)
    state.seed = $.cloneArrayValue(seed)
    state.buf = block(state.seed, 0)
    state.c = 0
    state.i = 0
    state.n = chunk
  }

  // Refill refills the state with more random values.
  // After a call to Refill, an immediate call to Next will succeed
  // (unless multiple goroutines are incorrectly sharing a state).
  public Refill(): void {
    const state = $.pointerValue<State>(this)
    state.c += ctrInc
    if (state.c === ctrMax) {
      // Reseed with generated uint64s for forward secrecy.
      // Normally this is done immediately after computing a block,
      // but we do it immediately before computing the next block,
      // to allow a much smaller serialized state (just the seed plus offset).
      // This gives a delayed benefit for the forward secrecy
      // (you can reconstruct the recent past given a memory dump),
      // which we deem acceptable in exchange for the reduced size.
      state.seed[0] = state.buf[chunk - reseed + 0]
      state.seed[1] = state.buf[chunk - reseed + 1]
      state.seed[2] = state.buf[chunk - reseed + 2]
      state.seed[3] = state.buf[chunk - reseed + 3]
      state.c = 0
    }
    state.buf = block(state.seed, state.c)
    state.i = 0
    state.n = chunk
    if (state.c === ctrMax - ctrInc) {
      state.n = chunk - reseed
    }
  }

  // Reseed reseeds the state with new random values.
  // After a call to Reseed, any previously returned random values
  // have been erased from the memory of the state and cannot be
  // recovered.
  public Reseed(): void {
    const state = $.pointerValue<State>(this)
    const seed: bigint[] = Array.from({ length: 4 }, () => 0n)
    for (let i = 0; i < 4; i++) {
      for (;;) {
        const [x, ok] = state.Next()
        if (ok) {
          seed[i] = x
          break
        }
        state.Refill()
      }
    }
    state.Init64(seed)
  }

  static __typeInfo = $.registerStructType(
    'chacha8rand.State',
    () => new State(),
    [
      {
        name: 'Init',
        args: [
          {
            name: 'seed',
            type: {
              kind: $.TypeKind.Array,
              elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
              length: 32,
            },
          },
        ],
        returns: [],
      },
      {
        name: 'Init64',
        args: [
          {
            name: 'seed',
            type: {
              kind: $.TypeKind.Array,
              elemType: { kind: $.TypeKind.Basic, name: 'uint64' },
              length: 4,
            },
          },
        ],
        returns: [],
      },
      {
        name: 'Next',
        args: [],
        returns: [
          { name: '_r0', type: { kind: $.TypeKind.Basic, name: 'uint64' } },
          { name: '_r1', type: 'bool' },
        ],
      },
      { name: 'Refill', args: [], returns: [] },
      { name: 'Reseed', args: [], returns: [] },
    ],
    State,
    [
      {
        name: 'buf',
        key: 'buf',
        type: {
          kind: $.TypeKind.Array,
          elemType: { kind: $.TypeKind.Basic, name: 'uint64' },
          length: 32,
        },
        pkgPath: 'internal/chacha8rand',
        index: [0],
        offset: 0,
        exported: false,
      },
      {
        name: 'seed',
        key: 'seed',
        type: {
          kind: $.TypeKind.Array,
          elemType: { kind: $.TypeKind.Basic, name: 'uint64' },
          length: 4,
        },
        pkgPath: 'internal/chacha8rand',
        index: [1],
        offset: 256,
        exported: false,
      },
      {
        name: 'i',
        key: 'i',
        type: { kind: $.TypeKind.Basic, name: 'uint32' },
        pkgPath: 'internal/chacha8rand',
        index: [2],
        offset: 288,
        exported: false,
      },
      {
        name: 'n',
        key: 'n',
        type: { kind: $.TypeKind.Basic, name: 'uint32' },
        pkgPath: 'internal/chacha8rand',
        index: [3],
        offset: 292,
        exported: false,
      },
      {
        name: 'c',
        key: 'c',
        type: { kind: $.TypeKind.Basic, name: 'uint32' },
        pkgPath: 'internal/chacha8rand',
        index: [4],
        offset: 296,
        exported: false,
      },
    ],
  )
}

export class errUnmarshalChaCha8 {
  public _fields: {} = {}

  public clone(): errUnmarshalChaCha8 {
    const cloned = new errUnmarshalChaCha8()
    cloned._fields = {}
    return $.markAsStructValue(cloned)
  }

  public Error(): string {
    return 'invalid ChaCha8 encoding'
  }

  static __typeInfo = $.registerStructType(
    'chacha8rand.errUnmarshalChaCha8',
    () => new errUnmarshalChaCha8(),
    [
      {
        name: 'Error',
        args: [],
        returns: [
          { name: '_r0', type: { kind: $.TypeKind.Basic, name: 'string' } },
        ],
      },
    ],
    errUnmarshalChaCha8,
    [],
  )
}

// Marshal marshals the state into a byte slice.
// Marshal and Unmarshal are functions, not methods,
// so that they will not be linked into the runtime
// when it uses the State struct, since the runtime
// does not need these.
export function Marshal(s: State | $.VarRef<State> | null): $.Slice<number> {
  const state = $.pointerValue<State>(s)
  const data: $.Slice<number> = $.makeSlice<number>(6 * 8, undefined, 'byte')
  $.copy(data, 'chacha8:')
  const used = (state.c / ctrInc) * chunk + state.i
  byteorder.BEPutUint64($.goSlice(data, 1 * 8, undefined), used)
  for (let i = 0; i < 4; i++) {
    byteorder.LEPutUint64(
      $.goSlice(data, (2 + i) * 8, undefined),
      state.seed[i],
    )
  }
  return data
}

// Unmarshal unmarshals the state from a byte slice.
export function Unmarshal(
  s: State | $.VarRef<State> | null,
  data: $.Slice<number>,
): $.GoError {
  const state = $.pointerValue<State>(s)
  if (
    $.len(data) !== 6 * 8 ||
    !$.stringEqual($.bytesToString($.goSlice(data, undefined, 8)), 'chacha8:')
  ) {
    return $.interfaceValue<$.GoError>(
      new errUnmarshalChaCha8(),
      '*chacha8rand.errUnmarshalChaCha8',
      { kind: $.TypeKind.Pointer, elemType: 'chacha8rand.errUnmarshalChaCha8' },
    )
  }
  const used = byteorder.BEUint64($.goSlice(data, 1 * 8, undefined))
  if (used > (ctrMax / ctrInc) * chunk - reseed) {
    return $.interfaceValue<$.GoError>(
      new errUnmarshalChaCha8(),
      '*chacha8rand.errUnmarshalChaCha8',
      { kind: $.TypeKind.Pointer, elemType: 'chacha8rand.errUnmarshalChaCha8' },
    )
  }
  const usedNum = $.uint(used, 32)
  for (let i = 0; i < 4; i++) {
    state.seed[i] = byteorder.LEUint64($.goSlice(data, (2 + i) * 8, undefined))
  }
  state.c = ctrInc * Math.trunc(usedNum / chunk)
  state.buf = block(state.seed, state.c)
  state.i = usedNum % chunk
  state.n = chunk
  if (state.c === ctrMax - ctrInc) {
    state.n = chunk - reseed
  }
  return null
}
