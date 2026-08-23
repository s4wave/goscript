import { describe, expect, it } from 'vitest'

import {
  Append,
  Chan,
  ChanOf,
  BothDir,
  Int,
  MakeChan,
  MakeMap,
  MakeSlice,
  Map,
  MapOf,
  Ptr,
  PtrTo,
  SliceOf,
  Swapper,
  TypeAssert,
  TypeOf,
  ValueOf,
} from './index.js'

// Locator test for the package-level function overrides that golden tests
// only reach when the compiler runs inside this repository. Keeping these
// assertions in-package makes parity behavior-test discovery independent of
// the compiler working directory.
describe('reflect package-level function overrides', () => {
  it('appends a value to a reflected slice', () => {
    const slice = MakeSlice(SliceOf(TypeOf(0)), 2, 4)
    const grown = Append(slice, ValueOf(3))
    expect(grown.Len()).toBe(3)
  })

  it('derives channel and pointer types', () => {
    const elem = TypeOf(0)
    expect(ChanOf(BothDir, elem).Kind()).toBe(Chan)
    expect(PtrTo(elem)?.Kind()).toBe(Ptr)
  })

  it('makes a buffered channel value', () => {
    const ch = MakeChan(ChanOf(BothDir, TypeOf(Int)), 2)
    expect(ch.Kind()).toBe(Chan)
  })

  it('makes an empty map value', () => {
    const map = MakeMap(MapOf(TypeOf(''), TypeOf(Int)))
    expect(map.Kind()).toBe(Map)
  })

  it('swaps elements of a plain slice in place', () => {
    const values = [1, 2, 3]
    Swapper(values)(0, 2)
    expect(values).toEqual([3, 2, 1])
  })

  it('type-asserts a reflected value without type arguments', () => {
    const [value, ok] = TypeAssert(undefined, ValueOf('typed'))
    expect(ok).toBe(true)
    expect(value).toBe('typed')
    expect(Int).toBeDefined()
  })
})
