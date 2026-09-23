import { describe, expect, it } from 'vitest'

import * as $ from '../../builtin/index.js'
import { Bytes, Comparable, Hash, MakeSeed, String } from './index.js'

describe('hash/maphash override', () => {
  it('hashes the same bytes the same way however they are written', () => {
    const seed = MakeSeed()
    const whole = String(seed, 'hello world')
    expect(Bytes(seed, $.stringToBytes('hello world'))).toBe(whole)

    const h = new Hash()
    h.SetSeed(seed)
    h.WriteString('hello')
    h.WriteByte(0x20)
    h.Write($.stringToBytes('world'))
    expect(h.Sum64()).toBe(whole)

    h.Reset()
    h.WriteString('hello world')
    expect(h.Sum64()).toBe(whole)
  })

  it('separates seeds and inputs', () => {
    const seed = MakeSeed()
    expect(MakeSeed().s).not.toBe(seed.s)
    expect(String(seed, 'a')).not.toBe(String(seed, 'b'))
    expect(String(seed, '')).not.toBe(String(seed, '\x00'))
    expect(String(seed, 'a')).not.toBe(String(MakeSeed(), 'a'))
  })

  it('spreads keys across buckets', () => {
    const seed = MakeSeed()
    const buckets = new Set<bigint>()
    for (let i = 0; i < 256; i++) {
      buckets.add(String(seed, 'key-' + i) % 64n)
    }
    expect(buckets.size).toBeGreaterThan(48)
  })

  it('seeds the zero Hash on first use and clones state', async () => {
    const h = new Hash()
    h.WriteString('abc')
    const [clone, err] = h.Clone()
    expect(err).toBeNull()
    expect((clone as unknown as Hash).Sum64()).toBe(h.Sum64())
    expect(String(h.Seed(), 'abc')).toBe(h.Sum64())
    expect((await h.Sum(null)).length).toBe(8)
  })

  it('hashes comparable values by value', () => {
    const seed = MakeSeed()
    expect(Comparable(seed, 'x')).toBe(Comparable(seed, 'x'))
    expect(Comparable(seed, 0)).toBe(Comparable(seed, -0))
    expect(Comparable(seed, 1)).not.toBe(Comparable(seed, 2))
  })
})
