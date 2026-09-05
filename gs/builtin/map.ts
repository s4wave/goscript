import { comparableEqual } from './builtin.js'
import { GoBinaryString, stringEqual, stringMapKey } from './slice.js'

// GoMap indexes Go string representations by their canonical byte value.
// Iteration retains the original key; object and struct equality stays in the
// shared comparison path below. Non-string maps allocate no secondary index.
class GoMap<K, V> extends Map<K, V> {
  private stringKeys?: Map<string, K>

  override set(key: K, value: V): this {
    if (isGoStringKey(key)) {
      const canonical = stringMapKey(key)
      this.stringKeys ??= new Map<string, K>()
      key = this.stringKeys.get(canonical) ?? key
      this.stringKeys.set(canonical, key)
    }
    return super.set(key, value)
  }

  override get(key: K): V | undefined {
    return super.get(this.storedKey(key))
  }

  override has(key: K): boolean {
    return super.has(this.storedKey(key))
  }

  override delete(key: K): boolean {
    const stored = this.storedKey(key)
    if (isGoStringKey(key)) this.stringKeys?.delete(stringMapKey(key))
    return super.delete(stored)
  }

  override clear(): void {
    this.stringKeys?.clear()
    super.clear()
  }

  private storedKey(key: K): K {
    return isGoStringKey(key) ?
        (this.stringKeys?.get(stringMapKey(key)) ?? key)
      : key
  }
}

// makeMap creates a Go map with indexed string-value equality.
export function makeMap<K, V>(entries?: Iterable<readonly [K, V]>): Map<K, V> {
  const map = new GoMap<K, V>()
  if (entries) for (const [key, value] of entries) mapSet(map, key, value)
  return map
}

// mapGet returns the value and presence without confusing stored undefined with a miss.
export function mapGet<K, V, D>(
  map: Map<K, V> | null,
  key: K,
  defaultValue: D,
): [V, true] | [D, false] {
  const entry = findMapEntry(map, key)
  if (entry.found) {
    return [entry.value, true]
  } else {
    return [defaultValue, false]
  }
}

// mapSet preserves the existing equal key when replacing its value.
export const mapSet = <K, V>(map: Map<K, V> | null, key: K, value: V): void => {
  if (!map) {
    throw new Error('assign to nil map')
  }
  const entry = findMapEntry(map, key)
  map.set(entry.found ? entry.key : key, value)
}

// deleteMapEntry removes a key using Go value equality.
export const deleteMapEntry = <K, V>(map: Map<K, V> | null, key: K): void => {
  const entry = findMapEntry(map, key)
  if (entry.found) {
    map!.delete(entry.key)
  }
}

// mapHas reports membership using Go value equality.
export const mapHas = <K, V>(map: Map<K, V> | null, key: K): boolean => {
  return findMapEntry(map, key).found
}

function findMapEntry<K, V>(
  map: Map<K, V> | null,
  key: K,
): { found: false } | { found: true; key: K; value: V } {
  if (!map) {
    return { found: false }
  }
  if (map.has(key)) {
    return { found: true, key, value: map.get(key)! }
  }
  if (isGoStringKey(key)) {
    if (map instanceof GoMap) return { found: false }
    for (const [candidate, value] of map.entries()) {
      if (
        isGoStringKey(candidate) &&
        stringEqual(candidate as string, key as string)
      ) {
        return { found: true, key: candidate, value }
      }
    }
    return { found: false }
  }
  if (key === null || (typeof key !== 'object' && typeof key !== 'function')) {
    return { found: false }
  }
  for (const [candidate, value] of map.entries()) {
    if (candidate !== key && comparableEqual(candidate, key)) {
      return { found: true, key: candidate, value }
    }
  }
  return { found: false }
}

function isGoStringKey(value: unknown): value is string | GoBinaryString {
  return typeof value === 'string' || value instanceof GoBinaryString
}
