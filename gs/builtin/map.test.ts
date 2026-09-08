import { describe, expect, it, vi } from 'vitest'

import { deleteMapEntry, makeMap, mapGet, mapHas, mapSet } from './map.js'
import { bytesToString, GoBinaryString } from './slice.js'
import { varRef } from './varRef.js'

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

describe('Go map string-struct keys', () => {
  const edge = (subject: string, object: string, type = 'edge') => ({
    __goType: type,
    _fields: { subject: varRef(subject), object: varRef(object) },
  })

  it('indexes value copies without scanning unrelated entries', () => {
    const first = edge('first', 'target')
    const map = makeMap([[first, 0]])
    const entries = vi.spyOn(map, 'entries')
    for (let i = 0; i < 4096; i++) mapSet(map, edge(`key-${i}`, 'target'), i)
    expect(mapGet(map, edge('key-2048', 'target'), -1)).toEqual([2048, true])
    expect(mapHas(map, edge('absent', 'target'))).toBe(false)
    mapSet(map, edge('first', 'target'), 7)
    expect(mapGet(map, first, -1)).toEqual([7, true])
    expect(map.keys().next().value).toBe(first)
    deleteMapEntry(map, edge('first', 'target'))
    expect(mapHas(map, first)).toBe(false)
    expect(entries).not.toHaveBeenCalled()
    map.clear()
    expect(mapHas(map, edge('key-2048', 'target'))).toBe(false)
    mapSet(map, first, 8)
    expect(map.size).toBe(1)
  })

  it('preserves type and binary-field equality inside candidate buckets', () => {
    const binary = new GoBinaryString(new TextEncoder().encode('value'))
    const value = (field: string | GoBinaryString, type: string) => ({
      __goType: type,
      _fields: { field: varRef(field) },
    })
    const map = makeMap<ReturnType<typeof value>, number>()
    mapSet(map, value('value', 'first'), 1)
    mapSet(map, value('value', 'second'), 2)
    mapSet(map, value(binary, 'first'), 3)
    expect(map.size).toBe(3)
    expect(mapGet(map, value('value', 'first'), 0)).toEqual([1, true])
    expect(mapGet(map, value('value', 'second'), 0)).toEqual([2, true])
    expect(mapGet(map, value(binary, 'first'), 0)).toEqual([3, true])
    deleteMapEntry(map, value('value', 'first'))
    expect(mapGet(map, value(binary, 'first'), 0)).toEqual([3, true])
    expect(mapGet(map, value('value', 'second'), 0)).toEqual([2, true])
  })
})
