import { Type, Value, TypeOf } from './type.js'

export { MapOf } from './type.js'

/**
 * MapIter provides an iterator interface for Go maps.
 * It wraps a JavaScript Map iterator and provides methods to iterate over key-value pairs.
 * Returns reflect.Value for Key() and Value() to match Go's reflect.MapIter.
 * @template K - The type of keys in the map
 * @template V - The type of values in the map
 */
export class MapIter<K = unknown, V = unknown> {
  public iterator: Iterator<[K, V]>
  public current: IteratorResult<[K, V]> | null = null

  constructor(public map: Map<K, V>) {
    this.iterator = map.entries()
    this.Next()
  }

  public Next(): boolean {
    this.current = this.iterator.next()
    return !this.current.done
  }

  public Key(): Value {
    const rawKey = this.current?.value?.[0] ?? null
    return new Value(rawKey, TypeOf(rawKey))
  }

  public Value(): Value {
    const rawVal = this.current?.value?.[1] ?? null
    return new Value(rawVal, TypeOf(rawVal))
  }

  public Reset(m: Map<K, V>): void {
    this.map = m
    this.iterator = m.entries()
    this.current = null
    this.Next()
  }
}

// MakeMap Helper functions for map operations.
export function MakeMap(typ: Type): Value {
  const map = new Map()
  return new Value(map, typ)
}

export function MakeMapWithSize(typ: Type, _n: number): Value {
  // JavaScript Map doesn't have initial size, so we ignore n
  return MakeMap(typ)
}
