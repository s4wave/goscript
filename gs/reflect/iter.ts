import * as $ from '@goscript/builtin/index.js'

import {
  Array,
  Chan,
  Func,
  Int,
  Int16,
  Int32,
  Int64,
  Int8,
  Map,
  MakeFunc,
  Ptr,
  Slice,
  String,
  Type,
  TypeOf,
  Uint,
  Uint16,
  Uint32,
  Uint64,
  Uint8,
  Uintptr,
  Value,
  ValueOf,
} from './type.js'
import { uintptr } from './types.js'

import * as iter from '@goscript/iter/index.js'

export function rangeNum<_T extends number | uintptr, N extends number>(
  num: N,
  t: Type,
): iter.Seq<Value> {
  // cannot use range T(v) because no core type.

  // if the iteration value type is define by
  // type T built-in type.
  return async (
    _yield: ((v: Value) => iter.YieldResult) | null,
  ): Promise<void> => {
    let convert = t!.PkgPath!() != ''
    // cannot use range T(v) because no core type.

    // if the iteration value type is define by
    // type T built-in type.
    for (let i = 0; i < num; i++) {
      let tmp = ValueOf(i).clone()
      // if the iteration value type is define by
      // type T built-in type.
      if (convert) {
        tmp = tmp.Convert(t).clone()
      }
      if (!(await _yield!(tmp))) {
        return
      }
    }
  }
}

// valueSeq implements Value.Seq, following the Go reflect implementation.
export function valueSeq(v: Value): iter.Seq<Value> {
  const t = v.Type()
  if (v.Kind() === Func && t.CanSeq()) {
    return async (_yield: ((v: Value) => iter.YieldResult) | null) => {
      const rf = MakeFunc(t.In(0), async (args) => [
        ValueOf(await _yield!($.asArray(args)[0])),
      ])
      await v.Call($.arrayToSlice([rf]))
    }
  }
  switch (v.Kind()) {
    case Int:
    case Int8:
    case Int16:
    case Int32:
    case Int64:
      return rangeNum(Number(v.Int()), t)
    case Uint:
    case Uint8:
    case Uint16:
    case Uint32:
    case Uint64:
    case Uintptr:
      return rangeNum(Number(v.Uint()), t)
    case Ptr:
      if (t.Elem().Kind() !== Array) {
        break
      }
      return rangeNum(v.Elem().Len(), TypeOf(0))
    case Array:
    case Slice:
      return rangeNum(v.Len(), TypeOf(0))
    case String:
      return async (_yield: ((v: Value) => iter.YieldResult) | null) => {
        for (const [i] of $.rangeString(v.String())) {
          if (!(await _yield!(ValueOf(i)))) {
            return
          }
        }
      }
    case Map:
      return async (_yield: ((v: Value) => iter.YieldResult) | null) => {
        for (const key of $.asArray(v.MapKeys())) {
          if (!(await _yield!(key))) {
            return
          }
        }
      }
    case Chan:
      return async (_yield: ((v: Value) => iter.YieldResult) | null) => {
        for (;;) {
          const [value, ok] = await v.Recv()
          if (!ok || !(await _yield!(value))) {
            return
          }
        }
      }
  }
  throw new Error(`reflect: ${t.String()} cannot produce iter.Seq[Value]`)
}

// valueSeq2 implements Value.Seq2, following the Go reflect implementation.
export function valueSeq2(v: Value): iter.Seq2<Value, Value> {
  const t = v.Type()
  if (v.Kind() === Func && t.CanSeq2()) {
    return async (
      _yield: ((k: Value, v: Value) => iter.YieldResult) | null,
    ) => {
      const rf = MakeFunc(t.In(0), async (args) => {
        const a = $.asArray(args)
        return [ValueOf(await _yield!(a[0], a[1]))]
      })
      await v.Call($.arrayToSlice([rf]))
    }
  }
  switch (v.Kind()) {
    case Ptr:
    case Array:
    case Slice: {
      if (v.Kind() === Ptr && t.Elem().Kind() !== Array) {
        break
      }
      const elems = v.Kind() === Ptr ? v.Elem() : v
      return async (
        _yield: ((k: Value, v: Value) => iter.YieldResult) | null,
      ) => {
        for (let i = 0; i < elems.Len(); i++) {
          if (!(await _yield!(ValueOf(i), elems.Index(i)))) {
            return
          }
        }
      }
    }
    case String:
      return async (
        _yield: ((k: Value, v: Value) => iter.YieldResult) | null,
      ) => {
        for (const [i, r] of $.rangeString(v.String())) {
          if (!(await _yield!(ValueOf(i), ValueOf(r)))) {
            return
          }
        }
      }
    case Map:
      return async (
        _yield: ((k: Value, v: Value) => iter.YieldResult) | null,
      ) => {
        for (const key of $.asArray(v.MapKeys())) {
          if (!(await _yield!(key, v.MapIndex(key)))) {
            return
          }
        }
      }
  }
  throw new Error(
    `reflect: ${t.String()} cannot produce iter.Seq2[Value, Value]`,
  )
}
