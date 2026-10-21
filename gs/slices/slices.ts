// TypeScript implementation of Go's slices package
import * as $ from '@goscript/builtin/index.js'
import * as cmp from '../cmp/index.js'
import * as iter from '../iter/index.js'

type CompareCallback<T, U = T, R = $.MaybePromise<number>> =
  | ((v1: T, v2: U) => R)
  | null
type PredicateCallback<T, R> = ((value: T) => R) | null
type EqualCallback<T, U, R> = ((v1: T, v2: U) => R) | null

/**
 * Compare compares the elements of s1 and s2 using cmp.Compare.
 * The elements are compared sequentially, starting at index 0,
 * until one element is not equal to the other.
 * The result of comparing the first non-matching elements is returned.
 * If both slices are equal until one of them ends, the shorter slice is
 * considered less than the longer one.
 * The result is 0 if s1 == s2, -1 if s1 < s2, and +1 if s1 > s2.
 * @param s1 First slice
 * @param s2 Second slice
 * @returns -1, 0, or 1
 */
export function Compare<T extends cmp.Ordered>(
  s1: $.Slice<T>,
  s2: $.Slice<T>,
): number {
  const len1 = $.len(s1)
  const len2 = $.len(s2)
  const minLen = len1 < len2 ? len1 : len2

  for (let i = 0; i < minLen; i++) {
    const v1 = $.arrayIndex(s1 as any, i) as T
    const v2 = $.arrayIndex(s2 as any, i) as T
    const result = cmp.Compare(v1, v2)
    if (result !== 0) {
      return result
    }
  }

  // All elements are equal up to minLen, compare lengths
  if (len1 < len2) {
    return -1
  }
  if (len1 > len2) {
    return 1
  }
  return 0
}

export function CompareFunc<T, U, R extends $.MaybePromise<number>>(
  s1: $.Slice<T>,
  s2: $.Slice<U>,
  compare: CompareCallback<T, U, R>,
): $.CallbackResult<R, number> {
  if (compare == null) {
    throw new Error('slices.CompareFunc: nil comparison function')
  }
  return $.runCallbacks(
    (function* () {
      const len1 = $.len(s1)
      const len2 = $.len(s2)
      const minLen = len1 < len2 ? len1 : len2
      for (let i = 0; i < minLen; i++) {
        const result: number = yield compare(
          $.arrayIndex(s1 as any, i) as T,
          $.arrayIndex(s2 as any, i) as U,
        )
        if (result !== 0) {
          return result
        }
      }
      if (len1 < len2) {
        return -1
      }
      if (len1 > len2) {
        return 1
      }
      return 0
    })(),
  )
}

/**
 * makeLike allocates a slice of the same representation as s, so a byte
 * slice stays a Uint8Array of zero bytes, and any other typed slice a typed
 * array of its kind.
 */
function makeLike<T>(
  s: $.Slice<T>,
  length: number,
  capacity?: number,
  zeroFactory?: () => T,
): $.Slice<T> {
  const hint = $.typedSliceHintOf(s)
  return $.makeSlice<T>(length, capacity, hint, zeroFactory)
}

/**
 * Clone returns a shallow copy of s while preserving nilness.
 * @param s The slice to clone
 * @returns A new slice with the same elements, or null for a nil slice
 */
export function Clone<T>(s: $.Slice<T>): $.Slice<T> {
  if (s == null) {
    return null
  }
  const length = $.len(s)
  const out = makeLike(s, length)
  $.copySliceElements(out, 0, s, 0, length)
  return out
}

export function Concat<T>(...slices: $.Slice<T>[]): $.Slice<T> {
  let size = 0
  let hint: string | undefined
  for (const slice of slices) {
    size += $.len(slice)
    hint ??= $.typedSliceHintOf(slice)
  }
  if (size === 0) {
    return null
  }
  const out = $.makeSlice<T>(size, undefined, hint)
  let pos = 0
  for (const slice of slices) {
    const length = $.len(slice)
    $.copySliceElements(out, pos, slice, 0, length)
    pos += length
  }
  return out
}

/**
 * Repeat returns a new slice that repeats x count times.
 * The result has length and capacity len(x) * count and is never nil.
 * Repeat panics if count is negative or if len(x) * count exceeds Go's
 * 64-bit maxInt. makeSlice rejects a length JavaScript cannot allocate.
 */
export function Repeat<T>(x: $.Slice<T>, count: number): $.Slice<T> {
  if (count < 0) {
    $.panic('cannot be negative')
  }
  const length = $.len(x)
  const total = length * count
  if (total >= 2 ** 63) {
    $.panic('the result of (len(x) * count) overflows')
  }
  const out = makeLike(x, total)
  if (length > 0) {
    for (let offset = 0; offset < total; offset += length) {
      $.copySliceElements(out, offset, x, 0, length)
    }
  }
  return out
}

/**
 * All returns an iterator over index-value pairs in the slice.
 * This is equivalent to Go's slices.All function.
 * @param s The slice to iterate over
 * @returns An iterator function that yields index-value pairs
 */
export function All<T>(
  s: $.Slice<T>,
): (
  yieldFunc: (index: number, value: T) => iter.YieldResult,
) => void | globalThis.Promise<void> {
  return function (
    _yield: (index: number, value: T) => iter.YieldResult,
  ): void | globalThis.Promise<void> {
    const length = $.len(s)
    const walk = (i: number): void | globalThis.Promise<void> => {
      for (; i < length; i++) {
        const stored = $.arrayIndex(s as any, i) as T // Use proper indexing to avoid type issues
        const value = $.copyElement(stored)
        const keepGoing = _yield(i, value)
        if (keepGoing instanceof Promise) {
          return keepGoing.then((next) => {
            if (next) {
              return walk(i + 1)
            }
          })
        }
        if (!keepGoing) {
          return
        }
      }
    }
    return walk(0)
  }
}

export function Backward<T>(
  s: $.Slice<T>,
): (
  _yield: (index: number, value: T) => boolean | globalThis.Promise<boolean>,
) => void | globalThis.Promise<void> {
  return function (
    _yield: (index: number, value: T) => boolean | globalThis.Promise<boolean>,
  ): void | globalThis.Promise<void> {
    const walk = (i: number): void | globalThis.Promise<void> => {
      for (; i >= 0; i--) {
        const stored = $.arrayIndex(s as any, i) as T
        const value = $.copyElement(stored)
        const keepGoing = _yield(i, value)
        if (keepGoing instanceof Promise) {
          return keepGoing.then((next) => {
            if (next) {
              return walk(i - 1)
            }
          })
        }
        if (!keepGoing) {
          break
        }
      }
    }
    const length = $.len(s)
    if (length === 0) {
      return
    }
    return walk(length - 1)
  }
}

/**
 * Values returns an iterator that yields the slice elements in order.
 * Iteration stops when yield returns false. A nil slice yields nothing.
 */
export function Values<T>(s: $.Slice<T>): iter.Seq<T> {
  return function (
    _yield: ((value: T) => iter.YieldResult) | null,
  ): void | globalThis.Promise<void> {
    const length = $.len(s)
    const walk = (i: number): void | globalThis.Promise<void> => {
      for (; i < length; i++) {
        const stored = $.arrayIndex(s as any, i) as T
        const keepGoing = _yield!($.copyElement(stored))
        if (keepGoing instanceof Promise) {
          return keepGoing.then((next) => {
            if (next) {
              return walk(i + 1)
            }
          })
        }
        if (!keepGoing) {
          return
        }
      }
    }
    return walk(0)
  }
}

/**
 * Chunk returns an iterator over consecutive subslices of up to n elements of
 * s. All but the last subslice have exactly n elements. Each subslice has its
 * capacity clipped to its length. Chunk panics if n is less than 1.
 * @param s The slice to split
 * @param n The chunk length
 * @returns An iterator function that yields the subslices
 */
export function Chunk<T>(
  s: $.Slice<T>,
  n: number,
): (
  _yield: (chunk: $.Slice<T>) => iter.YieldResult,
) => void | globalThis.Promise<void> {
  if (n < 1) {
    $.panic('cannot be less than 1')
  }
  return function (
    _yield: (chunk: $.Slice<T>) => iter.YieldResult,
  ): void | globalThis.Promise<void> {
    const length = $.len(s)
    const walk = (i: number): void | globalThis.Promise<void> => {
      for (; i < length; i += n) {
        const end = Math.min(i + n, length)
        const keepGoing = _yield($.goSlice(s, i, end, end))
        if (keepGoing instanceof Promise) {
          return keepGoing.then((next) => {
            if (next) {
              return walk(i + n)
            }
          })
        }
        if (!keepGoing) {
          return
        }
      }
    }
    return walk(0)
  }
}

export function Sort<T extends cmp.Ordered>(s: $.Slice<T>): void {
  $.sortSlice(s)
}

export function IsSorted<T extends cmp.Ordered>(x: $.Slice<T>): boolean {
  for (let i = $.len(x) - 1; i > 0; i--) {
    if (
      cmp.Compare(
        $.arrayIndex(x as any, i) as T,
        $.arrayIndex(x as any, i - 1) as T,
      ) < 0
    ) {
      return false
    }
  }
  return true
}

export function Max<T extends cmp.Ordered>(x: $.Slice<T>): T {
  if ($.len(x) === 0) {
    throw new Error('slices.Max: empty list')
  }
  let max = $.arrayIndex(x as any, 0) as T
  for (let i = 1; i < $.len(x); i++) {
    const value = $.arrayIndex(x as any, i) as T
    if (cmp.Compare(max, value) < 0) {
      max = value
    }
  }
  return max
}

export function Min<T extends cmp.Ordered>(x: $.Slice<T>): T {
  if ($.len(x) === 0) {
    throw new Error('slices.Min: empty list')
  }
  let min = $.arrayIndex(x as any, 0) as T
  for (let i = 1; i < $.len(x); i++) {
    const value = $.arrayIndex(x as any, i) as T
    if (cmp.Compare(value, min) < 0) {
      min = value
    }
  }
  return min
}

export function MaxFunc<T, R extends $.MaybePromise<number>>(
  x: $.Slice<T>,
  compare: CompareCallback<T, T, R>,
): $.CallbackResult<R, T> {
  if (compare == null) {
    throw new Error('slices.MaxFunc: nil comparison function')
  }
  if ($.len(x) === 0) {
    throw new Error('slices.MaxFunc: empty list')
  }
  return $.runCallbacks(
    (function* () {
      let max = $.arrayIndex(x as any, 0) as T
      for (let i = 1; i < $.len(x); i++) {
        const value = $.arrayIndex(x as any, i) as T
        if ((yield compare(max, value)) < 0) {
          max = value
        }
      }
      return max
    })(),
  )
}

export function MinFunc<T, R extends $.MaybePromise<number>>(
  x: $.Slice<T>,
  compare: CompareCallback<T, T, R>,
): $.CallbackResult<R, T> {
  if (compare == null) {
    throw new Error('slices.MinFunc: nil comparison function')
  }
  if ($.len(x) === 0) {
    throw new Error('slices.MinFunc: empty list')
  }
  return $.runCallbacks(
    (function* () {
      let min = $.arrayIndex(x as any, 0) as T
      for (let i = 1; i < $.len(x); i++) {
        const value = $.arrayIndex(x as any, i) as T
        if ((yield compare(value, min)) < 0) {
          min = value
        }
      }
      return min
    })(),
  )
}

// Collect collects the values of seq into a new slice. It returns a promise
// of the slice when seq suspends, and the compiler awaits a call whose seq
// may suspend (callbackAsyncFunctions in meta.json).
export function Collect<T>(seq: iter.Seq<T> | null): $.Slice<T> {
  return AppendSeq(null, seq)
}

// AppendSeq appends the values of seq to s. It returns a promise of the slice
// when seq suspends, as one that iter.Pull's next calls does.
export function AppendSeq<T>(
  s: $.Slice<T>,
  seq: iter.Seq<T> | null,
): $.Slice<T> {
  // Each value is appended as seq yields it.
  if (seq == null) {
    throw new Error('slices: nil iterator')
  }
  let out = s
  const done = seq((value: T) => {
    out = $.append(out, value)
    return true
  })

  // An async seq has appended every value once it settles.
  if (done instanceof Promise) {
    return $.awaitedResult(done.then(() => out))
  }
  return out
}

/** Sorted collects an iterator and orders all Go ordered types, including 64-bit integers. */
export function Sorted<T extends cmp.Ordered>(
  seq: iter.Seq<T> | null,
): $.Slice<T> {
  // The values are sorted once collected, after an async seq settles.
  const sorted = (out: $.Slice<T>): $.Slice<T> => {
    Sort(out)
    return out
  }
  const out: $.MaybePromise<$.Slice<T>> = Collect<T>(seq)
  return out instanceof Promise ?
      $.awaitedResult(out.then(sorted))
    : sorted(out)
}

/**
 * SortedFunc collects seq and sorts it with cmp, awaiting an asynchronous
 * sequence or comparison. An empty sequence stays nil and never calls cmp.
 */
export async function SortedFunc<T>(
  seq: iter.Seq<T> | null,
  cmp: CompareCallback<T>,
): globalThis.Promise<$.Slice<T>> {
  const out = await collectAsync(seq)
  if ($.len(out) > 1) {
    await SortFunc(out, cmp)
  }
  return out
}

/** SortedStableFunc is SortedFunc, whose SortFunc merge sort is stable. */
export function SortedStableFunc<T>(
  seq: iter.Seq<T> | null,
  cmp: CompareCallback<T>,
): globalThis.Promise<$.Slice<T>> {
  return SortedFunc(seq, cmp)
}

// collectAsync collects seq, awaiting a sequence that yields asynchronously.
async function collectAsync<T>(
  seq: iter.Seq<T> | null,
): globalThis.Promise<$.Slice<T>> {
  if (seq == null) {
    throw new Error('slices: nil iterator')
  }
  let out: $.Slice<T> = null
  await seq((value: T) => {
    out = $.append(out, value)
    return true
  })
  return out
}

/**
 * Delete removes the elements s[i:j] from s, returning the modified slice.
 * Delete panics if j > len(s) or s[i:j] is not a valid slice of s.
 * This is equivalent to Go's slices.Delete function.
 * @param s The slice to delete from
 * @param i The start index (inclusive)
 * @param j The end index (exclusive)
 * @returns The modified slice
 */
export function Delete<T>(
  s: $.Slice<T>,
  i: number,
  j: number,
  zeroFactory?: () => T,
): $.Slice<T> {
  const length = $.len(s)
  if (j > length || i < 0 || j < i) {
    throw new Error(
      `slice bounds out of range [${i}:${j}] with length ${length}`,
    )
  }
  if (i === j) {
    return s
  }
  // Shift elements after j to position i
  const deleteCount = j - i
  for (let k = j; k < length; k++) {
    $.sliceElems(s)[$.sliceSlot(s, k - deleteCount)] = $.arrayIndex(s as any, k)
  }
  // Zero out the elements at the end
  clearTail(s, length - deleteCount, length, zeroFactory)
  // Update the slice length
  return $.goSlice(s, 0, length - deleteCount) as $.Slice<T>
}

export function DeleteFunc<T, R extends $.MaybePromise<boolean>>(
  s: $.Slice<T>,
  del: PredicateCallback<T, R>,
  zeroFactory?: () => T,
): $.CallbackResult<R, $.Slice<T>> {
  if (del == null) {
    throw new Error('slices.DeleteFunc: nil delete function')
  }
  return $.runCallbacks(
    (function* () {
      if (s === null || s === undefined) {
        return s
      }
      let w = 0
      for (let i = 0; i < s.length; i++) {
        const value = $.arrayIndex(s, i) as T
        if (!(yield del(value))) {
          $.sliceElems(s)[$.sliceSlot(s, w)] = value
          w++
        }
      }
      clearTail(s, w, $.len(s), zeroFactory)
      return $.goSlice(s, 0, w) as $.Slice<T>
    })(),
  )
}

export function Replace<T>(
  s: $.Slice<T>,
  i: number,
  j: number,
  ...v: T[]
): $.Slice<T> {
  const length = $.len(s)
  if (i < 0 || j < i || j > length) {
    throw new Error(
      `slice bounds out of range [${i}:${j}] with length ${length}`,
    )
  }
  // A result longer than the capacity of s is a new slice.
  const total = length - (j - i) + v.length
  if (total > $.cap(s)) {
    const out = makeLike(s, total)
    $.copySliceElements(out, 0, s, 0, i)
    $.copySliceElements(out, i, v, 0, v.length)
    $.copySliceElements(out, i + v.length, s, j, length - j)
    return out
  }

  // Otherwise s holds the result: the elements after j move behind copies
  // of v, and the elements that the result no longer covers are zeroed.
  const tail: T[] = []
  for (let k = j; k < length; k++) {
    tail.push($.arrayIndex(s as any, k) as T)
  }
  const out = $.goSlice(s, 0, total) as $.Slice<T>
  for (let k = 0; k < v.length; k++) {
    $.sliceElems(out)[$.sliceSlot(out, i + k)] = $.copyElement(v[k])
  }
  for (let k = 0; k < tail.length; k++) {
    $.sliceElems(out)[$.sliceSlot(out, i + v.length + k)] = tail[k]
  }
  clearTail(s, total, length)
  return out
}

export function Compact<T>(
  s: $.Slice<T>,
  zeroFactory?: () => T,
): $.Slice<T> {
  if (s === null || s === undefined || $.len(s) < 2) {
    return s
  }
  let w = 1
  for (let i = 1; i < $.len(s); i++) {
    if (
      !$.comparableEqual(
        $.arrayIndex(s as any, i),
        $.arrayIndex(s as any, i - 1),
      )
    ) {
      $.sliceElems(s)[$.sliceSlot(s, w)] = $.arrayIndex(s as any, i)
      w++
    }
  }
  clearTail(s, w, $.len(s), zeroFactory)
  return $.goSlice(s, 0, w) as $.Slice<T>
}

export function CompactFunc<T, R extends $.MaybePromise<boolean>>(
  s: $.Slice<T>,
  eq: EqualCallback<T, T, R>,
  zeroFactory?: () => T,
): $.CallbackResult<R, $.Slice<T>> {
  if (eq == null) {
    throw new Error('slices.CompactFunc: nil equality function')
  }
  return $.runCallbacks(
    (function* () {
      if (s === null || s === undefined || $.len(s) < 2) {
        return s
      }
      let w = 1
      for (let i = 1; i < $.len(s); i++) {
        if (
          !(yield eq(
            $.arrayIndex(s as any, i - 1) as T,
            $.arrayIndex(s as any, i) as T,
          ))
        ) {
          $.sliceElems(s)[$.sliceSlot(s, w)] = $.arrayIndex(s as any, i)
          w++
        }
      }
      clearTail(s, w, $.len(s), zeroFactory)
      return $.goSlice(s, 0, w) as $.Slice<T>
    })(),
  )
}

export function Clip<T>(s: $.Slice<T>): $.Slice<T> {
  if (s == null) {
    return null
  }
  const length = $.len(s)
  const out = makeLike(s, length)
  $.copySliceElements(out, 0, s, 0, length)
  return out
}

export function Equal<T>(s1: $.Slice<T>, s2: $.Slice<T>): boolean {
  const len1 = $.len(s1)
  if (len1 !== $.len(s2)) {
    return false
  }
  for (let i = 0; i < len1; i++) {
    if (
      !$.comparableEqual($.arrayIndex(s1 as any, i), $.arrayIndex(s2 as any, i))
    ) {
      return false
    }
  }
  return true
}

export function EqualFunc<T, U, R extends $.MaybePromise<boolean>>(
  s1: $.Slice<T>,
  s2: $.Slice<U>,
  eq: EqualCallback<T, U, R>,
): $.CallbackResult<R, boolean> {
  if (eq == null) {
    throw new Error('slices.EqualFunc: nil equality function')
  }
  return $.runCallbacks(
    (function* () {
      const len1 = $.len(s1)
      if (len1 !== $.len(s2)) {
        return false
      }
      for (let i = 0; i < len1; i++) {
        if (
          !(yield eq(
            $.arrayIndex(s1 as any, i) as T,
            $.arrayIndex(s2 as any, i) as U,
          ))
        ) {
          return false
        }
      }
      return true
    })(),
  )
}

export function Index<T>(s: $.Slice<T>, v: T): number {
  for (let i = 0; i < $.len(s); i++) {
    if ($.comparableEqual($.arrayIndex(s as any, i), v)) {
      return i
    }
  }
  return -1
}

export function IndexFunc<T, R extends $.MaybePromise<boolean>>(
  s: $.Slice<T>,
  f: PredicateCallback<T, R>,
): $.CallbackResult<R, number> {
  if (f == null) {
    throw new Error('slices.IndexFunc: nil predicate function')
  }
  return $.runCallbacks(indexFunc(s, f))
}

function* indexFunc<T>(
  s: $.Slice<T>,
  f: (value: T) => $.MaybePromise<boolean>,
): $.CallbackRun<number> {
  for (let i = 0; i < $.len(s); i++) {
    if (yield f($.arrayIndex(s as any, i) as T)) {
      return i
    }
  }
  return -1
}

export function Contains<T>(s: $.Slice<T>, v: T): boolean {
  return Index(s, v) >= 0
}

export function ContainsFunc<T, R extends $.MaybePromise<boolean>>(
  s: $.Slice<T>,
  f: PredicateCallback<T, R>,
): $.CallbackResult<R, boolean> {
  if (f == null) {
    throw new Error('slices.ContainsFunc: nil predicate function')
  }
  return $.runCallbacks(
    (function* () {
      return (yield* indexFunc(s, f)) >= 0
    })(),
  )
}

export function Insert<T>(s: $.Slice<T>, i: number, ...v: T[]): $.Slice<T> {
  const length = $.len(s)
  if (i < 0 || i > length) {
    throw new Error(
      `slice bounds out of range [${i}:${i}] with length ${length}`,
    )
  }
  if (v.length === 0) {
    return s
  }
  const out = makeLike(s, length + v.length)
  $.copySliceElements(out, 0, s, 0, i)
  $.copySliceElements(out, i, v, 0, v.length)
  $.copySliceElements(out, i + v.length, s, i, length - i)
  return out
}

export function Reverse<T>(s: $.Slice<T>): void {
  for (let i = 0, j = $.len(s) - 1; i < j; i++, j--) {
    const tmp = $.arrayIndex(s as any, i)
    $.sliceElems(s)[$.sliceSlot(s, i)] = $.arrayIndex(s as any, j)
    $.sliceElems(s)[$.sliceSlot(s, j)] = tmp
  }
}

/**
 * Grow increases the slice's capacity, if necessary, to guarantee space for
 * another n elements. After Grow(n), at least n elements can be appended
 * to the slice without another allocation. If n is negative or too large to
 * allocate the memory, Grow panics.
 * This is equivalent to Go's slices.Grow function.
 * @param s The slice to grow
 * @param n The number of additional elements to guarantee space for
 * @param zeroFactory The factory used to initialize newly exposed elements
 * @returns The slice with increased capacity
 */
export function Grow<T>(
  s: $.Slice<T>,
  n: number,
  zeroFactory?: () => T,
): $.Slice<T> {
  if (n < 0) {
    throw new Error(`slices.Grow: negative n: ${n}`)
  }
  const currentLen = $.len(s)
  const currentCap = $.cap(s)
  const neededCap = currentLen + n

  if (neededCap <= currentCap) {
    return s
  }

  // Create new slice with increased capacity
  // Go's growth strategy typically doubles capacity when needed
  let newCap = currentCap * 2
  if (newCap < neededCap) {
    newCap = neededCap
  }

  const newSlice = makeLike(s, currentLen, newCap, zeroFactory)
  $.copySliceElements(newSlice, 0, s, 0, currentLen)

  return newSlice
}

/**
 * SortFunc sorts the slice using the provided comparison function.
 * The comparison function should return a negative number if a < b, zero if a == b, or a positive number if a > b.
 * The sort is a stable merge sort so it can await an asynchronous comparison.
 * @param s The slice to sort in place
 * @param cmp Comparison function
 */
export function SortFunc<T, R extends $.MaybePromise<number>>(
  s: $.Slice<T>,
  cmp: CompareCallback<T, T, R>,
): $.CallbackResult<R, void> {
  if (cmp == null) {
    throw new Error('slices.SortFunc: nil comparison function')
  }
  return $.runCallbacks(
    (function* () {
      if (s === null || s === undefined || $.len(s) < 2) {
        return
      }
      const sorted = yield* mergeSort($.asArray(s), cmp)
      for (let i = 0; i < sorted.length; i++) {
        $.sliceElems(s)[$.sliceSlot(s, i)] = sorted[i]
      }
    })(),
  )
}

function* mergeSort<T>(
  values: T[],
  cmp: (a: T, b: T) => $.MaybePromise<number>,
): $.CallbackRun<T[]> {
  if (values.length < 2) {
    return values
  }
  const mid = Math.floor(values.length / 2)
  const left = yield* mergeSort(values.slice(0, mid), cmp)
  const right = yield* mergeSort(values.slice(mid), cmp)
  const out: T[] = []
  let li = 0
  let ri = 0
  while (li < left.length && ri < right.length) {
    if ((yield cmp(left[li], right[ri])) <= 0) {
      out.push(left[li++])
    } else {
      out.push(right[ri++])
    }
  }
  while (li < left.length) {
    out.push(left[li++])
  }
  while (ri < right.length) {
    out.push(right[ri++])
  }
  return out
}

export function IsSortedFunc<T, R extends $.MaybePromise<number>>(
  x: $.Slice<T>,
  cmp: CompareCallback<T, T, R>,
): $.CallbackResult<R, boolean> {
  if (cmp == null) {
    throw new Error('slices.IsSortedFunc: nil comparison function')
  }
  return $.runCallbacks(
    (function* () {
      for (let i = $.len(x) - 1; i > 0; i--) {
        if (
          (yield cmp(
            $.arrayIndex(x as any, i) as T,
            $.arrayIndex(x as any, i - 1) as T,
          )) < 0
        ) {
          return false
        }
      }
      return true
    })(),
  )
}

/** SortStableFunc is SortFunc, whose merge sort is stable. */
export function SortStableFunc<T, R extends $.MaybePromise<number>>(
  s: $.Slice<T>,
  cmp: CompareCallback<T, T, R>,
): $.CallbackResult<R, void> {
  if (cmp == null) {
    throw new Error('slices.SortStableFunc: nil comparison function')
  }
  return SortFunc(s, cmp)
}

// clearTail sets the elements of s from start to end to the zero value of
// the element type: a new value from zeroFactory, which the compiler passes,
// or else the zero of the type of an element of s, so that a struct element
// becomes a new zero struct rather than nil.
function clearTail<T>(
  s: $.Slice<T>,
  start: number,
  end: number,
  zeroFactory?: () => T,
): void {
  // A typed slice holds numbers.
  if (start >= end) {
    return
  }
  if ($.isTypedSlice(s)) {
    for (let k = start; k < end; k++) {
      $.sliceElems(s)[$.sliceSlot(s, k)] = 0 as T
    }
    return
  }

  // The zero comes from the factory or a sample element.
  const zero = zeroFactory ?? sampleZeroFactory(s, end)
  for (let k = start; k < end; k++) {
    $.sliceElems(s)[$.sliceSlot(s, k)] = zero()
  }
}

// sampleZeroFactory returns a function that makes the zero value of the type
// of the first element of s[:end] that is not nil.
function sampleZeroFactory<T>(s: $.Slice<T>, end: number): () => T {
  for (let k = 0; k < end; k++) {
    const value = $.arrayIndex(s as any, k)
    if (value !== null && value !== undefined) {
      return () => $.zeroLike(value) as T
    }
  }
  return () => null as T
}

/**
 * BinarySearchFunc works like BinarySearch, but uses a custom comparison function.
 * The slice must be sorted in increasing order, where "increasing" is defined by cmp.
 * cmp should return 0 if the slice element matches the target, a negative number if
 * the slice element precedes the target, or a positive number if the slice element
 * follows the target.
 * This is equivalent to Go's slices.BinarySearchFunc function.
 * @param x The sorted slice to search
 * @param target The target value to search for
 * @param cmp Comparison function
 * @returns A tuple of [index, found] where index is the position and found indicates if target was found
 */
export function BinarySearchFunc<E, T, R extends $.MaybePromise<number>>(
  x: $.Slice<E>,
  target: T,
  cmp: CompareCallback<E, T, R>,
): $.CallbackResult<R, [number, boolean]> {
  if (cmp == null) {
    throw new Error('slices.BinarySearchFunc: nil comparison function')
  }
  return $.runCallbacks(binarySearchFunc(x, target, cmp))
}

// binarySearchFunc narrows to the earliest index not less than target, so
// duplicate targets return the first match as Go's BinarySearchFunc does.
function* binarySearchFunc<E, T>(
  x: $.Slice<E>,
  target: T,
  cmp: (e: E, t: T) => $.MaybePromise<number>,
): $.CallbackRun<[number, boolean]> {
  const n = $.len(x)
  let left = 0
  let right = n
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if ((yield cmp($.arrayIndex(x as any, mid) as E, target)) < 0) {
      left = mid + 1
    } else {
      right = mid
    }
  }
  const found =
    left < n && (yield cmp($.arrayIndex(x as any, left) as E, target)) === 0
  return [left, found]
}

export function BinarySearch<T extends cmp.Ordered>(
  x: $.Slice<T>,
  target: T,
): [number, boolean] {
  // cmp.Compare returns synchronously, so the search does too.
  const result = $.runCallbacks(binarySearchFunc(x, target, cmp.Compare))
  return result as [number, boolean]
}
