import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Values as mapValues } from '../maps/index.js'

import {
  All,
  AppendSeq,
  Backward,
  BinarySearch,
  Chunk,
  Clip,
  Collect,
  Compact,
  CompactFunc,
  CompareFunc,
  Concat,
  DeleteFunc,
  Equal,
  EqualFunc,
  Grow,
  Index,
  IndexFunc,
  Insert,
  IsSorted,
  IsSortedFunc,
  Max,
  MaxFunc,
  Min,
  MinFunc,
  Repeat,
  Replace,
  Sorted,
  SortedFunc,
  SortedStableFunc,
  SortFunc,
  SortStableFunc,
  Values,
} from './slices.js'

class Cell {
  n: number
  constructor(n: number) {
    this.n = n
  }
  clone(): Cell {
    return $.markAsStructValue(new Cell(this.n))
  }
}

function cell(n: number): Cell {
  return $.markAsStructValue(new Cell(n))
}

describe('slices Go comparable equality and lower-bound search', () => {
  // Go compares comparable elements (arrays/structs) by value with ==, and
  // BinarySearch returns the earliest index for duplicate targets.
  it('Compact removes adjacent equal-by-value array elements', () => {
    expect(Array.from(Compact($.arrayToSlice([[1], [1], [2]])) ?? [])).toEqual([
      [1],
      [2],
    ])
  })

  it('Equal compares array elements by value', () => {
    expect(Equal($.arrayToSlice([[1, 2]]), $.arrayToSlice([[1, 2]]))).toBe(true)
    expect(Equal($.arrayToSlice([[1, 2]]), $.arrayToSlice([[1, 3]]))).toBe(
      false,
    )
  })

  it('Index finds an equal-by-value array element', () => {
    expect(Index($.arrayToSlice([[1], [2], [3]]), [2])).toBe(1)
    expect(Index($.arrayToSlice([[1], [2]]), [9])).toBe(-1)
  })

  it('BinarySearch returns the first index of a duplicate target', () => {
    expect(BinarySearch($.arrayToSlice([1, 2, 2, 2, 3]), 2)).toEqual([1, true])
    expect(BinarySearch($.arrayToSlice([1, 2, 2, 2, 3]), 4)).toEqual([5, false])
    expect(BinarySearch($.arrayToSlice([1, 3, 5]), 0)).toEqual([0, false])
  })
})

describe('slices.SortFunc', () => {
  it('awaits async comparison callbacks', async () => {
    const values = $.arrayToSlice([3, 1, 2])

    await SortFunc(values, async (a, b) => a - b)

    expect(Array.from(values ?? [])).toEqual([1, 2, 3])
  })
})

describe('slices.SortStableFunc', () => {
  it('preserves original order for equal elements', () => {
    const values = $.arrayToSlice([
      { group: 2, label: 'a' },
      { group: 1, label: 'b' },
      { group: 2, label: 'c' },
      { group: 1, label: 'd' },
    ])

    SortStableFunc(values, (a, b) => a.group - b.group)

    expect(values?.map((value) => value.label)).toEqual(['b', 'd', 'a', 'c'])
  })

  it('sorts stable sparse proxy-backed slices without dropping elements', () => {
    const values = $.appendSlice(null, [
      { group: 2, label: 'a' },
      { group: 1, label: 'b' },
      { group: 2, label: 'c' },
      { group: 1, label: 'd' },
    ])

    SortStableFunc(values, (a, b) => a.group - b.group)

    expect(Array.from(values ?? []).map((value) => value.label)).toEqual([
      'b',
      'd',
      'a',
      'c',
    ])
  })
})

describe('slices compatibility helpers', () => {
  it('implements comparison, min/max, compact, replace, clip, and search helpers', () => {
    expect(
      CompareFunc(
        $.arrayToSlice(['a', 'c']),
        $.arrayToSlice(['a', 'b']),
        (a, b) => a.localeCompare(b),
      ),
    ).toBeGreaterThan(0)
    expect(Min($.arrayToSlice([3, 1, 2]))).toBe(1)
    expect(
      MaxFunc($.arrayToSlice([{ v: 1 }, { v: 4 }]), (a, b) => a.v - b.v).v,
    ).toBe(4)
    expect(
      MinFunc($.arrayToSlice([{ v: 3 }, { v: 2 }]), (a, b) => a.v - b.v).v,
    ).toBe(2)
    expect(Array.from(Compact($.arrayToSlice([1, 1, 2, 2, 3])) ?? [])).toEqual([
      1, 2, 3,
    ])
    expect(
      Array.from(
        CompactFunc(
          $.arrayToSlice(['a', 'A', 'b']),
          (a, b) => a.toLowerCase() === b.toLowerCase(),
        ) ?? [],
      ),
    ).toEqual(['a', 'b'])
    expect(
      Array.from(Replace($.arrayToSlice([1, 2, 3, 4]), 1, 3, 9, 8)) ?? [],
    ).toEqual([1, 9, 8, 4])
    expect(Array.from(Clip($.arrayToSlice([1, 2])) ?? [])).toEqual([1, 2])
    expect(BinarySearch($.arrayToSlice([1, 3, 5]), 3)).toEqual([1, true])
  })

  it('concatenates slices and preserves empty concat nilness', () => {
    expect(Concat()).toBeNull()
    expect(Concat($.arrayToSlice<number>([]))).toBeNull()
    expect(
      Array.from(
        Concat($.arrayToSlice([1]), null, $.arrayToSlice([2, 3])) ?? [],
      ),
    ).toEqual([1, 2, 3])
    expect(
      Array.from(Concat(new Uint8Array([1, 2]), new Uint8Array([3])) ?? []),
    ).toEqual([1, 2, 3])
  })

  it('accepts generated possibly-async callback types for sync helpers', () => {
    const compare: (a: number, b: number) => number | Promise<number> = (
      a,
      b,
    ) => a - b
    const keepOdd: (v: number) => boolean | Promise<boolean> = (v) =>
      v % 2 === 0
    const equal: (a: string, b: string) => boolean | Promise<boolean> = (
      a,
      b,
    ) => a === b

    expect(
      CompareFunc($.arrayToSlice([1]), $.arrayToSlice([2]), compare),
    ).toBeLessThan(0)
    expect(
      Array.from(DeleteFunc($.arrayToSlice([1, 2, 3]), keepOdd) ?? []),
    ).toEqual([1, 3])
    expect(EqualFunc($.arrayToSlice(['a']), $.arrayToSlice(['a']), equal)).toBe(
      true,
    )
    expect(IndexFunc($.arrayToSlice([1, 2, 3]), keepOdd)).toBe(1)
    expect(IsSortedFunc($.arrayToSlice([1, 2, 3]), compare)).toBe(true)
    expect(BinarySearch($.arrayToSlice([1, 2, 3]), 2)).toEqual([1, true])
  })

  it('preserves DeleteFunc order with asynchronous callbacks', async () => {
    const seen: number[] = []
    const result = await DeleteFunc(
      $.arrayToSlice([1, 2, 3, 4]),
      async (value) => {
        seen.push(value)
        return value % 2 === 0
      },
    )

    expect(seen).toEqual([1, 2, 3, 4])
    expect(Array.from(result ?? [])).toEqual([1, 3])
  })

  it('rejects actual async callback results in sync helpers', () => {
    expect(() =>
      CompareFunc(
        $.arrayToSlice([1]),
        $.arrayToSlice([2]),
        async (a, b) => a - b,
      ),
    ).toThrow('slices: asynchronous callback result is not supported')
  })
})

describe('slices.Sorted', () => {
  it('collects and sorts iterator values', () => {
    const values = Sorted<string>((yieldValue) => {
      yieldValue('c')
      yieldValue('a')
      yieldValue('b')
    })

    expect(Array.from(values ?? [])).toEqual(['a', 'b', 'c'])
  })
})

describe('slices.AppendSeq', () => {
  it('appends iterator values to an existing slice', () => {
    const values = AppendSeq($.arrayToSlice([1]), (yieldValue) => {
      yieldValue(2)
      yieldValue(3)
    })

    expect(Array.from(values ?? [])).toEqual([1, 2, 3])
  })

  it('collects into a nil slice and preserves nilness for empty sequences', () => {
    const values = AppendSeq<number>(null, (yieldValue) => {
      yieldValue(4)
      yieldValue(5)
    })
    const empty = AppendSeq<number>(null, () => {})

    expect(Array.from(values ?? [])).toEqual([4, 5])
    expect(empty).toBeNull()
  })
})

describe('struct element copies', () => {
  it('yields Backward values instead of the stored struct', () => {
    const source = $.arrayToSlice([cell(1)])

    Backward(source)((_, value) => {
      value.n = 9
      return true
    })

    expect(source[0].n).toBe(1)
  })

  it('gives Insert, Replace, and Grow their own struct elements', () => {
    const inserted = $.arrayToSlice([cell(1)])
    const insertedOut = Insert(inserted, 0, cell(0))
    ;(insertedOut as Cell[])[1].n = 7
    expect(inserted[0].n).toBe(1)

    const replaced = $.arrayToSlice([cell(1)])
    const replacedOut = Replace(replaced, 0, 0, cell(0))
    ;(replacedOut as Cell[])[1].n = 8
    expect(replaced[0].n).toBe(1)

    const grown = $.arrayToSlice([cell(1)])
    const grownOut = Grow(grown, 1)
    ;(grownOut as Cell[])[0].n = 9
    expect(grown[0].n).toBe(1)
  })

  it('copies structs yielded to AppendSeq and Collect', () => {
    const stored = cell(1)
    const appended = AppendSeq($.makeSlice<Cell>(0, 4), (yieldValue) => {
      yieldValue!(stored)
      return true
    })
    ;(appended as Cell[])[0].n = 9
    expect(stored.n).toBe(1)

    const values = $.makeMap<number, Cell>()
    $.mapSet(values, 0, cell(1))
    const collected = Collect(mapValues(values))
    ;(collected as Cell[])[0].n = 9
    expect($.mapGet(values, 0, cell(0))[0].n).toBe(1)
  })
})

describe('slices.Backward', () => {
  it('yields index-value pairs from the end', () => {
    const visited: Array<[number, string]> = []
    Backward($.arrayToSlice(['a', 'b', 'c']))((index, value) => {
      visited.push([index, value])
      return true
    })

    expect(visited).toEqual([
      [2, 'c'],
      [1, 'b'],
      [0, 'a'],
    ])
  })

  it('accepts async yield callbacks', async () => {
    const visited: Array<[number, string]> = []
    await Backward($.arrayToSlice(['a', 'b', 'c']))(async (index, value) => {
      visited.push([index, value])
      return index > 1
    })

    expect(visited).toEqual([
      [2, 'c'],
      [1, 'b'],
    ])
  })
})

describe('slices.Chunk', () => {
  it('yields capacity-clipped chunks with a short final chunk', () => {
    const chunks: Array<[number[], number]> = []
    Chunk(
      $.arrayToSlice([1, 2, 3, 4, 5]),
      2,
    )((chunk) => {
      chunks.push([$.asArray(chunk), $.cap(chunk)])
      return true
    })

    expect(chunks).toEqual([
      [[1, 2], 2],
      [[3, 4], 2],
      [[5], 1],
    ])
  })

  it('stops when yield returns false', async () => {
    const chunks: number[][] = []
    await Chunk(
      $.arrayToSlice([1, 2, 3, 4, 5]),
      2,
    )(async (chunk) => {
      chunks.push($.asArray(chunk))
      return false
    })

    expect(chunks).toEqual([[1, 2]])
  })

  it('panics when n is less than 1', () => {
    expect(() => Chunk($.arrayToSlice([1]), 0)).toThrow()
  })
})

describe('slices.Values', () => {
  it('yields elements in order and stops when yield returns false', () => {
    const visited: string[] = []
    Values($.arrayToSlice(['a', 'b', 'c']))((value) => {
      visited.push(value)
      return value !== 'b'
    })

    expect(visited).toEqual(['a', 'b'])
  })

  it('yields nothing for a nil or empty slice', () => {
    const visited: number[] = []
    Values<number>(null)((value) => {
      visited.push(value)
      return true
    })
    Values($.arrayToSlice<number>([]))((value) => {
      visited.push(value)
      return true
    })

    expect(visited).toEqual([])
  })

  it('accepts async yield callbacks', async () => {
    const visited: string[] = []
    await Values($.arrayToSlice(['a', 'b', 'c']))(async (value) => {
      visited.push(value)
      return value === 'a'
    })

    expect(visited).toEqual(['a', 'b'])
  })
})

describe('slices.Repeat', () => {
  it('repeats elements and returns a non-nil empty slice for a zero count', () => {
    const source = $.arrayToSlice([1, 2])
    const repeated = Repeat(source, 3)
    ;(repeated as number[])[0] = 9

    expect(Array.from(repeated ?? [])).toEqual([9, 2, 1, 2, 1, 2])
    expect($.len(repeated)).toBe(6)
    expect($.cap(repeated)).toBe(6)
    expect(source?.[0]).toBe(1)

    const empty = Repeat($.arrayToSlice([7]), 0)
    const fromNil = Repeat<number>(null, 4)
    expect(empty).not.toBeNull()
    expect($.len(empty)).toBe(0)
    expect($.cap(empty)).toBe(0)
    expect(fromNil).not.toBeNull()
    expect($.len(fromNil)).toBe(0)
  })

  it('repeats only the visible window of a resliced value', () => {
    const window = $.goSlice($.arrayToSlice([1, 2, 3, 4]), 1, 3)
    const repeated = Repeat(window, 2)

    expect(Array.from(repeated ?? [])).toEqual([2, 3, 2, 3])
    expect($.cap(repeated)).toBe(4)
  })

  it('keeps byte slices as byte slices', () => {
    const repeated = Repeat(new Uint8Array([1, 2]), 2)

    expect(repeated).toBeInstanceOf(Uint8Array)
    expect(Array.from(repeated ?? [])).toEqual([1, 2, 1, 2])
  })

  it('returns an empty slice for an empty source without walking count', () => {
    expect($.len(Repeat($.arrayToSlice<number>([]), 2 ** 52))).toBe(0)
  })

  it('panics on a negative count or a product above maxInt', () => {
    expect(() => Repeat($.arrayToSlice([1]), -1)).toThrow('cannot be negative')
    expect(() => Repeat($.arrayToSlice([1, 2]), 2 ** 62)).toThrow(
      'the result of (len(x) * count) overflows',
    )
  })
})

describe('slices.SortedFunc', () => {
  it('collects iterator values in the order cmp defines', async () => {
    const values = await SortedFunc<number>(
      (yieldValue) => {
        yieldValue!(1)
        yieldValue!(3)
        yieldValue!(2)
      },
      (a, b) => b - a,
    )

    expect(Array.from(values ?? [])).toEqual([3, 2, 1])
    expect(await SortedFunc<number>(() => {}, null)).toBeNull()
  })

  it('awaits an asynchronous sequence and comparison', async () => {
    const values = await SortedFunc<number>(
      async (yieldValue) => {
        for (const value of [2, 3, 1]) {
          if (!(await yieldValue!(value))) {
            return
          }
        }
      },
      async (a, b) => b - a,
    )

    expect(Array.from(values ?? [])).toEqual([3, 2, 1])
  })

  it('rejects a nil comparison when there is something to sort', async () => {
    await expect(
      SortedFunc<number>((yieldValue) => {
        yieldValue!(2)
        yieldValue!(1)
      }, null),
    ).rejects.toThrow('slices.SortFunc: nil comparison function')
  })
})

describe('slices.SortedStableFunc', () => {
  it('keeps the original order of equal elements', async () => {
    const values = await SortedStableFunc<{ group: number; label: string }>(
      (yieldValue) => {
        yieldValue!({ group: 2, label: 'a' })
        yieldValue!({ group: 1, label: 'b' })
        yieldValue!({ group: 2, label: 'c' })
        yieldValue!({ group: 1, label: 'd' })
      },
      (a, b) => a.group - b.group,
    )

    expect(Array.from(values ?? []).map((value) => value.label)).toEqual([
      'b',
      'd',
      'a',
      'c',
    ])
  })
})

describe('slices.All', () => {
  it('accepts async yield callbacks', async () => {
    const visited: Array<[number, string]> = []
    await All($.arrayToSlice(['a', 'b', 'c']))(async (index, value) => {
      visited.push([index, value])
      return index < 1
    })

    expect(visited).toEqual([
      [0, 'a'],
      [1, 'b'],
    ])
  })
})

describe('slices.IsSorted', () => {
  it('reports ordered and unordered slices', () => {
    expect(IsSorted($.arrayToSlice([1, 2, 3]))).toBe(true)
    expect(IsSorted($.arrayToSlice([1, 3, 2]))).toBe(false)
    expect(
      IsSortedFunc($.arrayToSlice(['aa', 'b']), (a, b) => a.length - b.length),
    ).toBe(false)
    expect(
      IsSortedFunc($.arrayToSlice(['b', 'aa']), (a, b) => a.length - b.length),
    ).toBe(true)
  })
})

describe('slices.Max', () => {
  it('returns the greatest ordered value', () => {
    expect(Max($.arrayToSlice([3, 1, 4, 2]))).toBe(4)
    expect(Max($.arrayToSlice(['beta', 'alpha', 'gamma']))).toBe('gamma')
  })

  it('panics for empty slices', () => {
    expect(() => Max($.arrayToSlice<number>([]))).toThrow(
      'slices.Max: empty list',
    )
  })
})
