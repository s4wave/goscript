import * as $ from '@goscript/builtin/index.js'
import type * as hash from '@goscript/hash/index.js'

// The hash state is two independent 32-bit lanes updated one byte at a time,
// so a value hashes the same whether it arrives in one write or many. Go only
// promises stability for one seed within one process, so the values need not
// match native Go.
const lanePrime1 = 0x01000193
const lanePrime2 = 0x5bd1e995
const uint64Mask = 0xffffffffffffffffn
const bufSize = 128

// Seed selects the hash function computed by a Hash. The zero Seed is not
// valid; MakeSeed returns a random nonzero seed.
export class Seed {
  public s: bigint

  constructor(init?: Partial<{ s?: bigint }>) {
    this.s = init?.s ?? 0n
  }

  public clone(): Seed {
    return $.markAsStructValue(new Seed(this))
  }

  static __typeInfo = $.registerStructType(
    'maphash.Seed',
    new Seed(),
    [],
    Seed,
    [{ name: 's', key: 's', type: { kind: $.TypeKind.Basic, name: 'uint64' } }],
  )
}

// Hash computes a seeded hash of a byte sequence. The zero Hash picks a
// random seed on first use.
export class Hash {
  private seed = new Seed()
  private lo = 0
  private hi = 0
  private n = 0

  public clone(): Hash {
    return $.markAsStructValue(this.copy())
  }

  public Seed(): Seed {
    this.initSeed()
    return this.seed.clone()
  }

  public SetSeed(seed: Seed): void {
    if (seed.s === 0n) {
      $.panic('maphash: use of uninitialized Seed')
    }
    this.seed = new Seed(seed)
    this.Reset()
  }

  public Reset(): void {
    this.initSeed()
    this.lo = Number(this.seed.s & 0xffffffffn) | 0
    this.hi = Number(this.seed.s >> 32n) | 0
    this.n = 0
  }

  public WriteByte(b: number): $.GoError {
    this.writeBytes(Uint8Array.of(b))
    return null
  }

  public Write(b: $.Bytes): [number, $.GoError] {
    const bytes = $.bytesToUint8Array(b)
    this.writeBytes(bytes)
    return [bytes.length, null]
  }

  public WriteString(s: string): [number, $.GoError] {
    const bytes = $.stringToBytes(s)
    this.writeBytes(bytes)
    return [bytes.length, null]
  }

  public Sum64(): bigint {
    this.initSeed()
    const lo = finalize(this.lo ^ this.n, lanePrime1)
    const hi = finalize(this.hi ^ Math.floor(this.n / 0x100000000), lanePrime2)
    return ((BigInt(hi >>> 0) << 32n) | BigInt(lo >>> 0)) & uint64Mask
  }

  public async Sum(b: $.Bytes | null): Promise<$.Bytes> {
    const prefix = $.bytesToUint8Array(b)
    const out = new Uint8Array(prefix.length + 8)
    out.set(prefix)
    new DataView(out.buffer).setBigUint64(prefix.length, this.Sum64())
    return out
  }

  public Size(): number {
    return 8
  }

  public BlockSize(): number {
    return bufSize
  }

  public Clone(): [hash.Cloner, $.GoError] {
    return [this.copy() as unknown as hash.Cloner, null]
  }

  private copy(): Hash {
    const h = new Hash()
    h.seed = new Seed(this.seed)
    h.lo = this.lo
    h.hi = this.hi
    h.n = this.n
    return h
  }

  private initSeed(): void {
    if (this.seed.s === 0n) {
      this.SetSeed(MakeSeed())
    }
  }

  private writeBytes(bytes: Uint8Array): void {
    this.initSeed()
    let lo = this.lo
    let hi = this.hi
    for (const c of bytes) {
      lo = Math.imul(lo ^ c, lanePrime1)
      hi = Math.imul(hi ^ c, lanePrime2)
    }
    this.lo = lo
    this.hi = hi
    this.n += bytes.length
  }

  static __typeInfo = $.registerStructType(
    'maphash.Hash',
    new Hash(),
    [
      { name: 'BlockSize', args: [], returns: [] },
      { name: 'Clone', args: [], returns: [] },
      { name: 'Reset', args: [], returns: [] },
      { name: 'Seed', args: [], returns: [] },
      { name: 'SetSeed', args: [], returns: [] },
      { name: 'Size', args: [], returns: [] },
      { name: 'Sum', args: [], returns: [] },
      { name: 'Sum64', args: [], returns: [] },
      { name: 'Write', args: [], returns: [] },
      { name: 'WriteByte', args: [], returns: [] },
      { name: 'WriteString', args: [], returns: [] },
    ],
    Hash,
  )
}

// Hasher hashes and compares values of type T.
export interface Hasher<T = any> {
  Hash(h: Hash | null, v: T): void
  Equal(x: T, y: T): boolean
}

// ComparableHasher is the Hasher for comparable values.
export class ComparableHasher<T = any> {
  public clone(): ComparableHasher<T> {
    return this
  }

  public Hash(h: Hash | null, v: T): void {
    WriteComparable(h, v)
  }

  public Equal(x: T, y: T): boolean {
    return $.comparableEqual(x, y)
  }

  static __typeInfo = $.registerStructType(
    'maphash.ComparableHasher',
    new ComparableHasher(),
    [
      { name: 'Equal', args: [], returns: [] },
      { name: 'Hash', args: [], returns: [] },
    ],
    ComparableHasher,
  )
}

// MakeSeed returns a new random nonzero seed.
export function MakeSeed(): Seed {
  const words = new BigUint64Array(1)
  do {
    globalThis.crypto.getRandomValues(words)
  } while (words[0] === 0n)
  return $.markAsStructValue(new Seed({ s: words[0] }))
}

// Bytes returns the hash of b with the given seed.
export function Bytes(seed: Seed, b: $.Bytes): bigint {
  const h = new Hash()
  h.SetSeed(seed)
  h.Write(b)
  return h.Sum64()
}

// String returns the hash of s with the given seed.
export function String(seed: Seed, s: string): bigint {
  const h = new Hash()
  h.SetSeed(seed)
  h.WriteString(s)
  return h.Sum64()
}

// Comparable returns the hash of v with the given seed.
export function Comparable<T = any>(seed: Seed, v: T): bigint {
  const h = new Hash()
  h.SetSeed(seed)
  writeValue(h, v)
  return h.Sum64()
}

// WriteComparable adds x to the data hashed by h.
export function WriteComparable<T = any>(h: Hash | null, x: T): void {
  writeValue(h!, x)
}

// objectIDs gives pointers, maps, and channels a stable identity, matching
// Go's hashing of their addresses.
const objectIDs = new WeakMap<object, number>()
let nextObjectID = 1

function writeValue(h: Hash, v: unknown): void {
  switch (typeof v) {
    case 'string':
      h.WriteByte(1)
      h.WriteString(v)
      h.WriteByte(0)
      return
    case 'number':
      h.WriteByte(2)
      writeFloat(h, v === 0 ? 0 : v)
      return
    case 'bigint':
      h.WriteByte(3)
      writeUint64(h, v & uint64Mask)
      return
    case 'boolean':
      h.WriteByte(v ? 5 : 4)
      return
  }
  if (v === null || v === undefined) {
    h.WriteByte(0)
    return
  }
  if (Array.isArray(v)) {
    h.WriteByte(6)
    for (const item of v) {
      writeValue(h, item)
    }
    return
  }
  const fields = (v as { _fields?: Record<string, unknown> })._fields
  if ($.isMarkedAsStructValue(v) && fields) {
    h.WriteByte(7)
    for (const key of Object.keys(fields)) {
      writeValue(h, fields[key])
    }
    return
  }
  let id = objectIDs.get(v as object)
  if (id === undefined) {
    id = nextObjectID++
    objectIDs.set(v as object, id)
  }
  h.WriteByte(8)
  writeFloat(h, id)
}

function writeFloat(h: Hash, v: number): void {
  const bytes = new Uint8Array(8)
  new DataView(bytes.buffer).setFloat64(0, v)
  h.Write(bytes)
}

function writeUint64(h: Hash, v: bigint): void {
  const bytes = new Uint8Array(8)
  new DataView(bytes.buffer).setBigUint64(0, v)
  h.Write(bytes)
}

// finalize is the murmur3 32-bit finalizer with a lane-specific multiplier.
function finalize(x: number, prime: number): number {
  x ^= x >>> 16
  x = Math.imul(x, 0x85ebca6b)
  x ^= x >>> 13
  x = Math.imul(x, prime)
  x ^= x >>> 16
  return x
}
