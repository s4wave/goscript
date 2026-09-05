import { describe, expect, it, vi } from 'vitest'
import { deleteMapEntry, makeMap, mapGet, mapHas, mapSet } from './map.js'
import { bytesToString, GoBinaryString } from './slice.js'

describe('Go map string keys', () => {
  it('does not scan existing entries for string misses or insertion', () => {
    const map = makeMap<string, number>([['initial', 0]])
    for (let i = 0; i < 4096; i++) mapSet(map, `key-${i}`, i)
    const entries = vi.spyOn(map, 'entries')
    expect(mapGet(map, 'absent', -1)).toEqual([-1, false])
    expect(mapHas(map, 'absent')).toBe(false)
    deleteMapEntry(map, 'absent')
    mapSet(map, 'new', 4096)
    expect(entries).not.toHaveBeenCalled()
    expect(mapGet(map, 'new', -1)).toEqual([4096, true])
  })

  it('indexes binary, UTF-8, empty, and stored undefined values consistently', () => {
    const map = makeMap<string | GoBinaryString, number | undefined>()
    for (const bytes of [
      new Uint8Array(),
      new Uint8Array([0, 255, 65]),
      new TextEncoder().encode('你好'),
    ]) {
      const wrapped = new GoBinaryString(bytes)
      const key = bytesToString(bytes)
      mapSet(map, wrapped, 1)
      mapSet(map, key, undefined)
      expect(map.size).toBe(1)
      expect(mapGet(map, key, 99)).toEqual([undefined, true])
      expect(mapGet(map, new GoBinaryString(bytes), 99)).toEqual([
        undefined,
        true,
      ])
      expect([...map.keys()]).toEqual([wrapped])
      deleteMapEntry(map, key)
      expect(map.size).toBe(0)
      mapSet(map, key, 2)
      map.clear()
      expect(mapHas(map, wrapped)).toBe(false)
    }
  })
})
