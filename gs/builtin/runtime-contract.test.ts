import { arrayIndex, sliceElems, sliceSlot } from './slice.js'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { queueTask } from './scheduler.js'

import {
  anonymousStructValue,
  append,
  appendSlice,
  arrayValue,
  assignStruct,
  basicInterfaceValue,
  bytesToUint8Array,
  type Bytes,
  byte,
  cap,
  copy,
  cloneArrayValue,
  cloneStructValue,
  copyElement,
  callGenericMethod,
  chanRecvWithOk,
  fieldRef,
  functionValue,
  genericNew,
  genericPointerRef,
  genericZero,
  isMarkedAsStructValue,
  isVarRef,
  markAsStructValue,
  goSlice,
  int,
  arrayPointerFromIndexRef,
  indexAddress,
  indexByteAddress,
  indexRef,
  isSliceProxy,
  int64And,
  int64Div,
  int64Bit,
  int64Mod,
  int64Or,
  int64AndNot,
  int64ToNumber,
  interfaceValue,
  intFromWide,
  comparableEqual,
  len,
  makeSlice,
  makeChannel,
  makeMap,
  mapGet,
  mapSet,
  markReflectTypeIdentity,
  namedFunction,
  namedValueInterfaceValue,
  newError,
  ownedPointerAddress,
  ownedPointerFromRef,
  ownedPointerRef,
  pointerValue,
  print,
  println,
  rangeString,
  registerInterfaceType,
  registerStructType,
  resetHostRuntimeForTests,
  selectStatement,
  sliceFromOwnedPointer,
  sliceToArray,
  sliceHeaderRef,
  stringHeaderRef,
  TypeKind,
  typeAssert,
  typeAssertTuple,
  typedNil,
  uint,
  uint64Add,
  uintFromWide,
  uint64And,
  uint64AndNot,
  uint64Div,
  uint64Mod,
  uint64Mul,
  uint64Or,
  uint64Bit,
  uint64Shl,
  uint64Shr,
  uint64Sub,
  uint64ToNumber,
  uint64Xor,
  uintShr,
  intAnd,
  intAndNot,
  intOr,
  intShl,
  intShr,
  intXor,
  narrowShl,
  narrowShr,
  unref,
  unsupportedPointerRef,
  unsafePointerRef,
  varRef,
  goString,
} from './index.js'

const originalDeno = (globalThis as any).Deno
const originalProcess = (globalThis as any).process

afterEach(() => {
  vi.restoreAllMocks()

  if (originalDeno === undefined) {
    delete (globalThis as any).Deno
  } else {
    ;(globalThis as any).Deno = originalDeno
  }

  if (originalProcess === undefined) {
    delete (globalThis as any).process
  } else {
    ;(globalThis as any).process = originalProcess
  }

  resetHostRuntimeForTests()
})

describe('builtin runtime contract helpers', () => {
  it('writes print and println through the host runtime owner', async () => {
    const writes: Array<{ fd: number; text: string }> = []
    const writeSync = vi.fn(
      (
        fd: number,
        buffer: Uint8Array,
        _offset?: number,
        length?: number,
        _position?: number | null,
      ) => {
        writes.push({
          fd,
          text: new TextDecoder().decode(
            buffer.subarray(0, length ?? buffer.length),
          ),
        })
        return length ?? buffer.length
      },
    )

    delete (globalThis as any).Deno
    ;(globalThis as any).process = {
      getBuiltinModule: vi.fn(() => ({
        readSync: vi.fn(),
        writeSync,
      })),
    }
    resetHostRuntimeForTests()

    await print('value:', 3)
    await println('done')

    // print/println resolve async Error/String operands on the microtask
    // queue, so the awaited writes carry the fully rendered text.
    expect(writes).toEqual([
      { fd: 1, text: 'value: 3' },
      { fd: 1, text: 'done\n' },
    ])
  })

  it('returns signed int64 helper results as bigint across mixed operands', () => {
    const helperCases: Array<{
      name: string
      actual: bigint
      expected: bigint
    }> = [
      {
        name: 'int64Div mixed negative truncates toward zero',
        actual: int64Div(-7n, 2),
        expected: -3n,
      },
      {
        name: 'int64Div wraps min int divided by -1',
        actual: int64Div(-0x8000000000000000n, -1),
        expected: -0x8000000000000000n,
      },
      {
        name: 'int64Mod mixed negative keeps dividend sign',
        actual: int64Mod(-7n, 2),
        expected: -1n,
      },
      {
        name: 'int64Mod wraps min int modulo -1',
        actual: int64Mod(-0x8000000000000000n, -1),
        expected: 0n,
      },
      {
        name: 'int64And coerces number mask',
        actual: int64And(-1n, 0xff),
        expected: 0xffn,
      },
      {
        name: 'int64And wraps unsigned sign bit to min int',
        actual: int64And(0x8000000000000000n, -1),
        expected: -0x8000000000000000n,
      },
      {
        name: 'int64Or coerces number mask',
        actual: int64Or(-0x8000000000000000n, 0x7f),
        expected: -0x7fffffffffffff81n,
      },
      {
        name: 'int64Or wraps full signed width',
        actual: int64Or(0x7fffffffffffffffn, 0x8000000000000000n),
        expected: -1n,
      },
    ]

    for (const { name, actual, expected } of helperCases) {
      expect(typeof actual, name).toBe('bigint')
      expect(actual, name).toBe(expected)
    }
  })

  it('exposes numeric, varref, map, and error helpers', () => {
    expect(int(1.9)).toBe(1)
    expect(int(3n)).toBe(3)
    expect(uint(257, 8)).toBe(1)
    expect(uint(-1.9, 8)).toBe(255)
    expect(uint(0x1_0000_0005, 32)).toBe(5)
    expect(uint(42, 64)).toBe(42)
    expect(uint(-1n, 8)).toBe(255)
    expect(byte(257)).toBe(1)
    // A 64-bit integer narrows to its low bits, as a bigint or a number.
    expect(uintFromWide(0x8000000180008081n, 16)).toBe(0x8081)
    expect(uintFromWide(-1n, 32)).toBe(0xffffffff)
    expect(intFromWide(0x8000000180008081n, 8)).toBe(-127)
    expect(intFromWide(0xffffffffn, 32)).toBe(-1)
    expect(uintFromWide(-1, 8)).toBe(255)
    // A 64-bit integer converts to the nearest number through its words.
    expect(int64ToNumber(-1n)).toBe(-1)
    expect(int64ToNumber(-0x8000000000000000n)).toBe(-(2 ** 63))
    expect(int64ToNumber(0x7fffffffffffffffn)).toBe(2 ** 63)
    expect(int64ToNumber(0x20000000000001n)).toBe(Number(0x20000000000001n))
    expect(int64ToNumber(-0x123456789abcdefn)).toBe(-Number(0x123456789abcdefn))
    expect(int64ToNumber(5)).toBe(5)
    expect(uint64ToNumber(0xffffffffffffffffn)).toBe(2 ** 64)
    expect(uint64ToNumber(0x8000000000000801n)).toBe(
      Number(0x8000000000000801n),
    )
    expect(uint64ToNumber(0xfedcba9876543210n)).toBe(
      Number(0xfedcba9876543210n),
    )
    expect(uint(uint64Shl(1n, 63), 32)).toBe(0)
    expect(uint(uint64Shr(uint64Shl(1n, 63), 60), 32)).toBe(8)
    expect(uint(uint64Mul(0xffffffffffffffffn, 3), 32)).toBe(0xfffffffd)
    expect(uint64Div(0xffffffffffffffffn, 4114)).toBe(4483895010624587n)
    expect(uint64Mod(0xffffffffffffffffn, 4114)).toBe(697n)
    expect(uint(uint64Add(0xffffffffffffffffn, 2), 32)).toBe(1)
    expect(uint(uint64Sub(1n, 2), 32)).toBe(0xffffffff)
    expect(uint(uint64And(0xf0n, 0x3cn), 32)).toBe(0x30)
    expect(uint(uint64Or(0xf0n, 0x0fn), 32)).toBe(0xff)
    expect(uint(uint64Xor(0xf0n, 0xffn), 32)).toBe(0x0f)
    expect(uint64AndNot(0xffn, 0x0fn)).toBe(0xf0n)
    // A mask 1<<k comes from the bit tables, and other counts shift.
    expect(int64Bit(0)).toBe(1n)
    expect(int64Bit(63)).toBe(-0x8000000000000000n)
    expect(int64Bit(64n)).toBe(0n)
    expect(int64Bit(5n)).toBe(32n)
    expect(uint64Bit(63n)).toBe(0x8000000000000000n)
    expect(uint64Bit(200)).toBe(0n)
    // A constant right operand lowers to a JS number; the helper coerces it so a
    // bigint left operand never mixes with number (the Rand.Int64 1<<63 crash).
    expect(uint64AndNot(0xffffffffffffffffn, 9223372036854775808)).toBe(
      9223372036854775807n,
    )
    expect(int64AndNot(-1n, 4611686018427387904n)).toBe(-4611686018427387905n)
    expect(
      uint64And(
        uint('18446744073709551615', 64),
        uint('18014398509481983', 64),
      ),
    ).toBe(18014398509481983n)
    expect(uintShr(0x80000000, 31, 32)).toBe(1)
    expect(uintShr(0x80000000, 32, 32)).toBe(0)
    expect(uintShr(0xff, 4, 8)).toBe(15)
    expect(narrowShl(1, 31)).toBe(-2147483648)
    expect(narrowShl(1, 32)).toBe(0)
    expect(narrowShl(3, 33)).toBe(0)
    expect(narrowShr(-8, 2)).toBe(-2)
    expect(narrowShr(-8, 32)).toBe(-1)
    expect(narrowShr(8, 40)).toBe(0)

    // Int bitwise operations keep the bits above 32 of their numbers.
    const wide = 2 ** 40
    expect(intAnd(wide + 0xff, wide + 0xf0f)).toBe(wide + 0xf)
    expect(intAnd(-wide, 2 ** 48 - 1)).toBe(2 ** 48 - wide)
    expect(intOr(wide, 5)).toBe(wide + 5)
    expect(intOr(-wide, 1)).toBe(-wide + 1)
    expect(intXor(wide, 3)).toBe(wide + 3)
    expect(intXor(-wide, -1)).toBe(wide - 1)
    expect(intAndNot(wide + 0xff, 0xf)).toBe(wide + 0xf0)
    expect(intAndNot(-1, wide)).toBe(-wide - 1)
    expect(intAnd(0x7fffffff, -0x80000000)).toBe(0)
    expect(intOr(-1, 0x7fffffff)).toBe(-1)
    expect(intShl(1, 35)).toBe(2 ** 35)
    expect(intShl(0x7fffffff, 1)).toBe(0xfffffffe)
    expect(intShl(-1, 31)).toBe(-(2 ** 31))
    expect(intShl(wide, 23)).toBe(-(2 ** 63))
    expect(intShl(3, 64)).toBe(0)
    expect(intShr(wide, 3)).toBe(2 ** 37)
    expect(intShr(-wide - 1, 40)).toBe(-2)
    expect(intShr(-5, 100)).toBe(-1)
    expect(intShr(-0x80000000, 31)).toBe(-1)
    expect(() => intShl(1, -1)).toThrow('negative shift amount')
    expect(() => intShr(wide, -1)).toThrow('negative shift amount')

    const value = varRef(4)
    value.value = 8
    expect(unref(value)).toBe(8)
    expect(pointerValue(value)).toBe(8)
    const pointerAssert = typeAssert<typeof value>(value, {
      kind: TypeKind.Pointer,
      elemType: { kind: TypeKind.Basic, name: 'int' },
    })
    expect(pointerAssert).toEqual({ value, ok: true })
    const nilNamedSlice = varRef(null)
    const nilNamedSliceIface = interfaceValue(
      nilNamedSlice,
      '*main.ObjectIdentifier',
    )
    expect(
      typeAssert<typeof nilNamedSlice>(nilNamedSliceIface, {
        kind: TypeKind.Pointer,
        elemType: 'main.ObjectIdentifier',
      }),
    ).toEqual({ value: nilNamedSlice, ok: true })
    const identifierType = {
      kind: TypeKind.Slice,
      elemType: {
        kind: TypeKind.Slice,
        typeName: 'asn1.ObjectIdentifier',
        elemType: { kind: TypeKind.Basic, name: 'int' },
      },
    }
    const identifiers = interfaceValue(
      [[1, 2, 840]],
      '[]asn1.ObjectIdentifier',
      identifierType,
    )
    expect('__goTypeInfo' in identifiers).toBe(true)
    expect(identifiers.__goTypeInfo).toEqual(identifierType)
    expect(pointerValue({ ok: true })).toEqual({ ok: true })
    const nilSliceIface = interfaceValue(null, '[]*main.StatusEntry')
    expect(len(nilSliceIface as any)).toBe(0)
    expect(cap(nilSliceIface as any)).toBe(0)
    const namedPointerBox = namedValueInterfaceValue(
      varRef(new Uint8Array([1, 2])),
      '*main.Bytes',
      {},
    )
    expect(pointerValue(namedPointerBox)).toEqual(new Uint8Array([1, 2]))
    const namedPointerMethodBox = namedValueInterfaceValue(
      varRef(new Uint8Array([1, 2, 3])),
      '*main.Bytes',
      { Len: (receiver: any) => len(receiver.value) },
    )
    expect(pointerValue(namedPointerMethodBox)).toBe(namedPointerMethodBox)
    expect(pointerValue(namedPointerMethodBox).Len()).toBe(3)
    expect(len(pointerValue(namedPointerMethodBox))).toBe(3)
    expect(bytesToUint8Array(pointerValue(namedPointerMethodBox))).toEqual(
      new Uint8Array([1, 2, 3]),
    )
    expect(
      bytesToUint8Array(goSlice(pointerValue(namedPointerMethodBox), 1)),
    ).toEqual(new Uint8Array([2, 3]))
    const namedStringBox = namedValueInterfaceValue('id', 'main.Name', {
      String: (receiver: string) => `name:${receiver}`,
    })
    expect(pointerValue(namedStringBox)).toBe(namedStringBox)
    expect(pointerValue(namedStringBox).String()).toBe('name:id')
    expect(cloneStructValue({ clone: () => ({ ok: true }) })).toEqual({
      ok: true,
    })
    expect(
      cloneStructValue({ __goscriptClone: () => ({ internal: true }) }),
    ).toEqual({ internal: true })
    const fixedBytes = new Uint8Array([1, 2, 3])
    const clonedBytes = cloneArrayValue(fixedBytes)
    expect(clonedBytes).toEqual(fixedBytes)
    expect(clonedBytes).not.toBe(fixedBytes)
    const fixedWords = arrayValue([arrayValue([1, 2]), arrayValue([3, 4])], {
      kind: TypeKind.Array,
      length: 2,
      elemType: { kind: TypeKind.Array, length: 2, elemType: 'int' },
    })
    const clonedWords = cloneArrayValue(fixedWords)
    expect(clonedWords).toEqual(fixedWords)
    expect(clonedWords).not.toBe(fixedWords)
    expect(clonedWords[0]).not.toBe(fixedWords[0])
    expect(copyElement(fixedWords[0])).toEqual(fixedWords[0])
    expect(copyElement(fixedWords[0])).not.toBe(fixedWords[0])
    const wordsSlice = goSlice(fixedWords)
    expect(wordsSlice).not.toBe(fixedWords)
    expect(copyElement(wordsSlice)).toBe(wordsSlice)
    const pointInfo = {
      kind: TypeKind.Struct,
      methods: [],
      fields: [
        { name: 'X', type: 'int' },
        {
          name: 'Words',
          type: { kind: TypeKind.Array, length: 2, elemType: 'int' },
        },
      ],
    }
    const point = anonymousStructValue(
      { X: 1, Words: arrayValue([1, 2]) },
      pointInfo,
    )
    const clonedPoint = cloneStructValue(point)
    expect(clonedPoint).toEqual(point)
    expect(clonedPoint).not.toBe(point)
    expect(clonedPoint.Words).not.toBe(point.Words)
    expect(() => pointerValue(null)).toThrow('nil pointer dereference')
    const unsupported = unsupportedPointerRef<number>(0)
    expect(() => unsupported.value).toThrow('unsafe pointer dereference')
    expect(() => {
      unsupported.value = 1
    }).toThrow('unsafe pointer dereference')

    const m = makeMap<string, number>()
    mapSet(m, 'answer', 42)
    expect(mapGet(m, 'answer', 0)).toEqual([42, true])
    expect(mapGet(m, 'missing', 0)).toEqual([0, false])

    expect(newError('bad')?.Error()).toBe('bad')
    expect(rangeString(goString('a¢€'))).toEqual([
      [0, 97],
      [1, 162],
      [3, 8364],
    ])
  })

  it('assigns cloneable runtime struct values', () => {
    class ManualStruct {
      constructor(public value = 0) {}

      clone(): ManualStruct {
        return new ManualStruct(this.value)
      }
    }

    const target = new ManualStruct(1)
    const source = new ManualStruct(42)
    assignStruct(target, source)

    expect(target.value).toBe(42)
    source.value = 7
    expect(target.value).toBe(42)
  })

  it('preserves nested struct fields when package type names collide', () => {
    class Record {
      constructor(public object = '') {}

      static __typeInfo = registerStructType(
        'assignment.Record',
        () => new Record(),
        [],
        Record,
        [
          {
            name: 'object',
            type: 'string',
            index: [0],
            offset: 0,
            exported: true,
          },
        ],
      )
    }
    class OtherRecord {
      constructor(public target = '') {}

      static __typeInfo = registerStructType(
        'assignment.Record',
        () => new OtherRecord(),
        [],
        OtherRecord,
        [
          {
            name: 'target',
            type: 'string',
            index: [0],
            offset: 0,
            exported: true,
          },
        ],
      )
    }
    class Container {
      constructor(public record = new Record()) {}

      static __typeInfo = registerStructType(
        'assignment.Container',
        () => new Container(),
        [],
        Container,
        [
          {
            name: 'record',
            type: 'assignment.Record',
            index: [0],
            offset: 0,
            exported: true,
          },
        ],
      )
    }

    const destination = new Container()
    const address = destination.record
    assignStruct(destination, new Container(new Record('retained')))

    expect(destination.record).toBe(address)
    expect(destination.record.object).toBe('retained')
    const other = new OtherRecord()
    assignStruct(other, new OtherRecord('separate'))
    expect(other.target).toBe('separate')
  })

  it('attaches owned pointer handles to variable and field refs', () => {
    const local = varRef(1)
    const localPointer = ownedPointerFromRef(local)
    expect(localPointer).toBeDefined()
    expect(ownedPointerRef(localPointer!)).toBe(local)
    expect(ownedPointerFromRef(local)).toBe(localPointer)
    expect(ownedPointerAddress(ownedPointerFromRef(varRef(1))!)).not.toBe(
      ownedPointerAddress(localPointer!),
    )
    expect(ownedPointerAddress(localPointer!)).toBe(local.__goAddress!())
    ownedPointerRef(localPointer!).value = 3
    expect(local.value).toBe(3)
    expect(() => sliceFromOwnedPointer(localPointer!, 1)).toThrow(
      'reflect.SliceAt requires a GoScript-owned pointer',
    )

    const target = { count: 2 }
    const count = fieldRef(target, 'count')
    const countPointer = ownedPointerFromRef(count)
    expect(countPointer).toBeDefined()
    ownedPointerRef(countPointer!).value = 4
    expect(target.count).toBe(4)

    const sameField = fieldRef(target, 'count')
    expect(ownedPointerAddress(ownedPointerFromRef(sameField)!)).toBe(
      ownedPointerAddress(countPointer!),
    )
  })

  it('matches struct map keys by Go comparable value', () => {
    class Key {
      declare public name: string
      declare public id: number

      constructor(name: string, id: number) {
        this.name = name
        this.id = id
      }

      static __typeInfo = registerStructType('example.Key', null, [], Key, [
        { name: 'name', type: { kind: TypeKind.Basic, name: 'string' } },
        { name: 'id', type: { kind: TypeKind.Basic, name: 'int' } },
      ])
    }

    const m = makeMap<Key, string>()
    mapSet(m, markAsStructValue(new Key('so-1', 7)), 'pending')
    mapSet(m, markAsStructValue(new Key('so-1', 7)), 'accepted')

    expect(m.size).toBe(1)
    expect(mapGet(m, markAsStructValue(new Key('so-1', 7)), '')).toEqual([
      'accepted',
      true,
    ])
    expect(mapGet(m, markAsStructValue(new Key('so-2', 7)), '')).toEqual([
      '',
      false,
    ])
  })

  it('compares independently materialized reflect types by identity', () => {
    const first = {}
    const second = {}
    const different = {}
    markReflectTypeIdentity(first, 'struct:asn1.BitString')
    markReflectTypeIdentity(second, 'struct:asn1.BitString')
    markReflectTypeIdentity(different, 'struct:asn1.RawValue')

    expect(comparableEqual(first, second)).toBe(true)
    expect(comparableEqual(first, different)).toBe(false)
  })

  it('compares pointers to structs by identity and struct values by fields', () => {
    class Node {
      declare public name: string
      declare public parent: Node | null

      constructor(name: string, parent: Node | null) {
        this.name = name
        this.parent = parent
      }

      static __typeInfo = registerStructType('example.Node', null, [], Node, [
        { name: 'name', type: { kind: TypeKind.Basic, name: 'string' } },
        {
          name: 'parent',
          type: { kind: TypeKind.Pointer, elemType: 'example.Node' },
        },
      ])
    }

    // Two pointers to equal structs that point at each other are different.
    const first = new Node('leaf', null)
    const second = new Node('leaf', first)
    first.parent = second
    expect(comparableEqual(first, second)).toBe(false)
    expect(comparableEqual(first, first)).toBe(true)

    // Struct values with the same fields are equal.
    const root = new Node('root', null)
    expect(
      comparableEqual(
        markAsStructValue(new Node('leaf', root)),
        markAsStructValue(new Node('leaf', root)),
      ),
    ).toBe(true)
  })

  it('compares the elements of slice windows', () => {
    const backing = [1, 2, 3, 1, 2, 4]
    const first = goSlice(backing, 0, 3)
    const same = goSlice([0, 1, 2, 3], 1, 4)
    const different = goSlice(backing, 3, 6)

    expect(comparableEqual(first, same)).toBe(true)
    expect(comparableEqual(first, different)).toBe(false)
  })

  it('does not compare runtime internals as generated struct values', () => {
    class RuntimeType {
      constructor(
        private readonly name: string,
        public readonly _fields: unknown[],
      ) {}

      String(): string {
        return this.name
      }
    }

    const m = makeMap<RuntimeType, string>()
    mapSet(m, new RuntimeType('gob.wireType', []), 'wire')

    expect(mapGet(m, new RuntimeType('gob.arrayType', []), '')).toEqual([
      '',
      false,
    ])
  })

  it('tries duplicate runtime type registrations for colliding package names', () => {
    class HashInterfaceImpl {
      Write(_p: Bytes): [number, null] {
        return [0, null]
      }
    }
    class HashMessage {}

    registerInterfaceType('collision.Hash', null, [
      {
        name: 'Write',
        args: [
          {
            name: 'p',
            type: {
              kind: TypeKind.Slice,
              elemType: { kind: TypeKind.Basic, name: 'uint8' },
            },
          },
        ],
        returns: [],
      },
    ])
    registerStructType('collision.Hash', new HashMessage(), [], HashMessage, [])

    expect(typeAssertTuple(new HashInterfaceImpl(), 'collision.Hash')[1]).toBe(
      true,
    )
    expect(
      typeAssertTuple(
        markAsStructValue(new HashMessage()),
        'collision.Hash',
      )[1],
    ).toBe(true)
  })

  it('asserts interface-boxed named primitive values by declared type', () => {
    const boxed = namedValueInterfaceValue(13, 'main.MyInt', {
      Double: (receiver: number) => receiver * 2,
    })

    expect(
      typeAssertTuple<number>(boxed, {
        kind: TypeKind.Basic,
        name: 'int',
        typeName: 'main.MyInt',
      }),
    ).toEqual([13, true])
  })

  it('boxes basic interface values with compact runtime metadata', () => {
    const boxed = basicInterfaceValue(13, 'int32')

    expect(
      typeAssertTuple<number>(boxed, {
        kind: TypeKind.Basic,
        name: 'int32',
      }),
    ).toEqual([13, true])

    const rune = basicInterfaceValue(13, 'rune', 'int32')
    expect(
      typeAssertTuple<number>(rune, {
        kind: TypeKind.Basic,
        name: 'int32',
      }),
    ).toEqual([13, true])
  })

  it('asserts fixed-width numeric values by runtime type name', () => {
    expect(
      typeAssertTuple<bigint>(13n, { kind: TypeKind.Basic, name: 'uint64' }),
    ).toEqual([13n, true])
    expect(
      typeAssertTuple<number>(13, { kind: TypeKind.Basic, name: 'int32' }),
    ).toEqual([13, true])
  })

  it('asserts typed byte-slice pointers through uint8 descriptors', () => {
    const bytes = varRef(makeSlice<number>(4, undefined, 'byte'))
    const boxed = interfaceValue(bytes, '*[]byte')

    expect(
      typeAssertTuple<typeof bytes>(boxed, {
        kind: TypeKind.Pointer,
        elemType: {
          kind: TypeKind.Slice,
          elemType: { kind: TypeKind.Basic, name: 'uint8' },
        },
      }),
    ).toEqual([bytes, true])
  })

  it('exposes addressable slice and array index references', () => {
    const values = [1, 2, 3]
    const second = indexRef(values, 1)
    second.value = 8
    expect(values).toEqual([1, 8, 3])
    expect(pointerValue(second)).toBe(8)

    const view = goSlice(values, 1, 3)
    const firstInView = indexRef(view, 0)
    firstInView.value = 11
    expect(values).toEqual([1, 11, 3])
    expect(arrayIndex(view, 0)).toBe(11)

    const bytes = new Uint8Array([4, 5])
    const firstByte = indexRef<number>(bytes, 0)
    firstByte.value = 9
    expect(Array.from(bytes)).toEqual([9, 5])

    const byteBacking = makeSlice<number>(8, undefined, 'byte')
    const shortBytes = goSlice(byteBacking as Uint8Array, 0, 2)
    expect(len(shortBytes)).toBe(2)
    expect(cap(shortBytes)).toBe(8)
    const fullBytes = goSlice(shortBytes, 0, 8)
    sliceElems(fullBytes!)[sliceSlot(fullBytes!, 7)] = 12
    expect((byteBacking as Uint8Array)[7]).toBe(12)

    const arrayPointer = arrayPointerFromIndexRef(indexRef(byteBacking, 1), 3)
    const arrayView = pointerValue(arrayPointer) as Uint8Array
    expect(len(arrayView)).toBe(3)
    arrayView[2] = 19
    expect((byteBacking as Uint8Array)[3]).toBe(19)

    const words = [0x11223344, 0]
    const wordBytes = arrayPointerFromIndexRef(indexRef(words, 0), 8, 4, 1)
    const byteView = pointerValue(wordBytes) as number[]
    expect(byteView[0]).toBe(0x44)
    expect(byteView[3]).toBe(0x11)
    byteView[4] = 0xaa
    expect(words[1]).toBe(0xaa)
    wordBytes.value = [1, 2, 3, 4]
    expect(words[0]).toBe(0x04030201)

    sliceElems(shortBytes!)[sliceSlot(shortBytes!, 0)] = 14
    expect(bytesToUint8Array(shortBytes)).toEqual(new Uint8Array([14, 0]))

    class Entry {
      value = ''
    }
    const entries = makeSlice<Entry>(1, 3, undefined, () => new Entry())
    const expanded = goSlice(entries, 0, 3)
    const extra = indexRef(expanded, 2)
    extra.value.value = 'zero-backed'
    expect(pointerValue(extra).value).toBe('zero-backed')

    const base = makeSlice<number>(1, 4, 'number')
    sliceElems(base!)[sliceSlot(base!, 0)] = 7
    const beforeAppend = goSlice(base, 0, 1)
    const afterAppend = append(beforeAppend, 8, 9)
    expect(len(beforeAppend)).toBe(1)
    expect(len(afterAppend)).toBe(3)
    expect([...afterAppend!]).toEqual([7, 8, 9])
    expect(arrayIndex(beforeAppend!, 0)).toBe(7)

    const splitLeft = goSlice(afterAppend, 0, 1, 1)
    expect(len(splitLeft)).toBe(1)
    expect(cap(splitLeft)).toBe(1)
    expect([...splitLeft!]).toEqual([7])

    const text = varRef('abc')
    const headerBytes = varRef(makeSlice<number>(0, 0, 'byte'))
    const strh = pointerValue(stringHeaderRef(text))
    const sh = pointerValue(sliceHeaderRef(headerBytes))
    sh.Data = strh.Data
    sh.Len = strh.Len
    sh.Cap = strh.Len
    expect(bytesToUint8Array(headerBytes.value)).toEqual(
      new Uint8Array([97, 98, 99]),
    )
  })

  it('keeps large appended slice proxy targets sparse while preserving reads', () => {
    const sliceLength = 65_576
    const backing = Array.from(
      { length: sliceLength },
      (_, index) => (index * 17) & 0xff,
    )

    const appended = appendSlice<number>(null, backing)

    expect(len(appended)).toBe(sliceLength)
    expect(cap(appended)).toBe(sliceLength)
    expect(arrayIndex(appended!, 0)).toBe(0)
    expect(arrayIndex(appended!, 1024)).toBe((1024 * 17) & 0xff)
    expect(arrayIndex(appended!, sliceLength - 1)).toBe(
      ((sliceLength - 1) * 17) & 0xff,
    )
    expect([
      ...(goSlice(appended, sliceLength - 6, sliceLength) ?? []),
    ]).toEqual(backing.slice(sliceLength - 6))

    expect(isSliceProxy(appended)).toBe(true)
  })

  it('sorts sparse proxy-backed slices without losing or duplicating elements', () => {
    const values = appendSlice<string>(null, ['c', 'a', 'd', 'b'])

    expect(isSliceProxy(values)).toBe(true)

    const sorted = (values as unknown as string[]).sort((left, right) =>
      left.localeCompare(right),
    )

    expect(sorted).toBe(values)
    expect(Array.from(values as Iterable<string>)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('copies overlapping slices through a stable source snapshot', () => {
    const leftShift = appendSlice<number>(null, [1, 2, 3, 4, 5])
    expect(copy(goSlice(leftShift, 0, 4), goSlice(leftShift, 1, 5))).toBe(4)
    expect(Array.from(leftShift ?? [])).toEqual([2, 3, 4, 5, 5])

    const rightShift = appendSlice<number>(null, [1, 2, 3, 4, 5])
    expect(copy(goSlice(rightShift, 1, 5), goSlice(rightShift, 0, 4))).toBe(4)
    expect(Array.from(rightShift ?? [])).toEqual([1, 1, 2, 3, 4])
  })

  it('exposes stable synthetic slice index addresses', () => {
    const values = [1, 2, 3, 4]
    const left = goSlice(values, 1, 3)
    const right = goSlice(values, 2, 4)
    const other = [8, 9]

    expect(indexAddress(left, 0)).toBe(indexAddress(values, 1))
    expect(indexAddress(left, 1)).toBe(indexAddress(right, 0))
    expect(indexAddress(left, 1)).toBeGreaterThan(indexAddress(left, 0))
    expect(indexAddress(other, 0)).not.toBe(indexAddress(left, 0))
  })

  it('resolves unsafe byte addresses within numeric slice elements', () => {
    const words = makeSlice<number | bigint>(2, undefined, 'number')
    const first = indexByteAddress(words, 0, 8)
    const second = indexByteAddress(words, 1, 8)

    expect(second - first).toBe(8)
    unsafePointerRef<number>(first + 1).value = 0x12
    unsafePointerRef<number>(first + 7).value = 0x80
    expect(unsafePointerRef<number>(first + 1).value).toBe(0x12)
    expect(unsafePointerRef<number>(first + 7).value).toBe(0x80)
    expect(arrayIndex(words!, 0)).toBe(0x8000000000001200n)

    unsafePointerRef<number>(second).value = 0x34
    expect(arrayIndex(words!, 1)).toBe(0x34)
  })

  it('exposes owned pointer handles for addressable collection elements', () => {
    const values = [1, 2, 3, 4]
    const second = indexRef(values, 1)
    const pointer = ownedPointerFromRef(second)

    expect(pointer).toBeDefined()
    expect(ownedPointerAddress(pointer!)).toBe(indexAddress(values, 1))
    ownedPointerRef(pointer!).value = 8
    expect(values).toEqual([1, 8, 3, 4])

    const view = sliceFromOwnedPointer(pointer!, 2)
    sliceElems(view)[sliceSlot(view, 1)] = 12
    expect(values).toEqual([1, 8, 12, 4])

    const bytes = new Uint8Array([5, 6, 7])
    const bytePointer = ownedPointerFromRef(indexRef<number>(bytes, 1))
    const byteView = sliceFromOwnedPointer(bytePointer!, 2) as Uint8Array
    byteView[0] = 9
    expect(Array.from(bytes)).toEqual([5, 9, 7])
  })

  it('copies slices into fixed arrays with Go length checks', () => {
    const source = goSlice([1, 2, 3], 1, 3)
    const array = sliceToArray<number>(source, 2)
    array[0] = 9

    expect(array).toEqual(arrayValue([9, 3]))
    expect(arrayIndex(source!, 0)).toBe(2)
    expect(() => sliceToArray<number>(source, 3)).toThrow(
      'cannot convert slice with length 2 to array or pointer to array with length 3',
    )

    expect(sliceToArray<number>(new Uint8Array([4, 5, 6]), 2, 'byte')).toEqual(
      arrayValue(new Uint8Array([4, 5])),
    )
  })

  it('exposes value and type descriptor helpers', () => {
    class Runner {
      public Run(): string {
        return 'ok'
      }
    }

    const runnerType = registerStructType(
      'phase5.Runner',
      markAsStructValue(new Runner()),
      [{ name: 'Run', args: [], returns: [{ type: 'string' }] }],
      Runner,
    )
    const runnerInterface = registerInterfaceType(
      'phase5.RunnerInterface',
      null,
      [{ name: 'Run', args: [], returns: [{ type: 'string' }] }],
    )

    const value = new Runner()
    expect(markAsStructValue(value)).toBe(value)
    expect(typeAssert<Runner>(value, runnerType)).toEqual({
      ok: true,
      value,
    })
    expect(typeAssert<Runner>(new Runner(), runnerInterface).ok).toBe(true)
    expect(typeAssert<Runner>(null, runnerInterface).ok).toBe(false)

    const emptyInterface = registerInterfaceType(
      'phase5.EmptyInterface',
      null,
      [],
    )
    const fn = functionValue(() => 'ok', {
      kind: TypeKind.Function,
      params: [],
      results: [{ kind: TypeKind.Basic, name: 'string' }],
    })
    expect(typeAssert<typeof fn>(fn, emptyInterface)).toEqual({
      ok: true,
      value: fn,
    })
    expect(typeAssert<number>(3, emptyInterface)).toEqual({
      ok: true,
      value: 3,
    })

    const nil = typedNil('*main.Example')
    expect(nil.__isTypedNil).toBe(true)
    expect(nil.__goType).toBe('*main.Example')
    expect(
      typeAssert<Runner | null>(typedNil('*phase5.Runner'), {
        kind: TypeKind.Pointer,
        elemType: 'phase5.Runner',
      }),
    ).toEqual({ value: null, ok: true })

    const mapType = {
      kind: TypeKind.Map,
      keyType: { kind: TypeKind.Basic, name: 'string' },
      elemType: { kind: TypeKind.Basic, name: 'int' },
    } as const
    const nilMap = interfaceValue<Map<string, number> | null>(
      null,
      'map[string]int',
      mapType,
    )
    expect(typeAssert<Map<string, number> | null>(nilMap, mapType)).toEqual({
      value: null,
      ok: true,
    })
    expect(() => comparableEqual(nilMap, nilMap)).toThrow(
      'runtime error: comparing uncomparable type map[string]int',
    )
    expect(TypeKind.Pointer).toBe('pointer')

    class TypedDog {
      public Name(this: TypedDog | null): string {
        if (this === null) {
          return 'unknown dog'
        }
        return 'dog'
      }
    }

    registerStructType(
      'phase5.TypedDog',
      new TypedDog(),
      [{ name: 'Name', args: [], returns: [{ type: 'string' }] }],
      TypedDog,
    )
    const dogInterface = registerInterfaceType('phase5.DogInterface', null, [
      { name: 'Name', args: [], returns: [{ type: 'string' }] },
    ])
    const nilDog = interfaceValue<{ Name(): string } | null>(
      null,
      '*phase5.TypedDog',
    )
    expect(nilDog).not.toBeNull()
    expect(nilDog!.Name()).toBe('unknown dog')
    expect(typeAssert<{ Name(): string }>(nilDog, dogInterface).ok).toBe(true)
    expect(
      typeAssert<TypedDog | null>(nilDog, {
        kind: TypeKind.Pointer,
        elemType: 'phase5.TypedDog',
      }),
    ).toEqual({ value: null, ok: true })

    const dogRef = interfaceValue<{ Name(): string } | null>(
      { value: markAsStructValue(new TypedDog()), __isVarRef: true },
      '*phase5.TypedDog',
    )
    expect(typeAssert<{ Name(): string }>(dogRef, dogInterface).ok).toBe(true)

    const bytesRef = varRef<Bytes>(new Uint8Array([1, 2, 3]))
    const boxedBytesRef = interfaceValue<any>(bytesRef, '*[]byte')
    const [assertedBytesRef, bytesOk] = typeAssertTuple<typeof bytesRef>(
      boxedBytesRef,
      {
        kind: TypeKind.Pointer,
        elemType: {
          kind: TypeKind.Slice,
          elemType: { kind: TypeKind.Basic, name: 'int' },
        },
      },
    )
    expect(bytesOk).toBe(true)
    expect(pointerValue(assertedBytesRef)).toBe(bytesRef.value)

    const greetInfo = {
      kind: TypeKind.Function,
      name: 'phase5.Greet',
      params: [{ kind: TypeKind.Basic, name: 'string' }],
      results: [{ kind: TypeKind.Basic, name: 'string' }],
    }
    const greet = namedFunction(
      (name: string) => `hello ${name}`,
      'phase5.Greet',
      greetInfo,
    )
    expect(typeAssert<typeof greet>(greet, greetInfo).ok).toBe(true)
    expect(
      typeAssert<typeof greet>(greet, {
        kind: TypeKind.Function,
        name: 'phase5.Greet',
        params: [{ kind: TypeKind.Basic, name: 'int' }],
        results: [{ kind: TypeKind.Basic, name: 'string' }],
      }).ok,
    ).toBe(false)
    expect(
      typeAssert<{ Name: string }>(
        { Name: 'Alice' },
        {
          kind: TypeKind.Struct,
          methods: [],
          fields: [
            {
              name: 'Name',
              key: 'Name',
              type: { kind: TypeKind.Basic, name: 'string' },
              tag: 'json:"name"',
            },
          ],
        },
      ).ok,
    ).toBe(true)
    const literal = functionValue((value: number) => String(value), {
      kind: TypeKind.Function,
      params: [{ kind: TypeKind.Basic, name: 'int' }],
      results: [{ kind: TypeKind.Basic, name: 'string' }],
    })
    expect(literal(7)).toBe('7')
    expect(literal).toHaveProperty('__typeInfo')
    expect(
      typeAssert<typeof literal>(literal, {
        kind: TypeKind.Function,
        params: [{ kind: TypeKind.Basic, name: 'int' }],
        results: [{ kind: TypeKind.Basic, name: 'string' }],
      }).ok,
    ).toBe(true)
    expect(
      typeAssert<(...args: unknown[]) => unknown>(() => undefined, {
        kind: TypeKind.Function,
        params: [],
        results: [],
      }).ok,
    ).toBe(false)

    const genericArgs = {
      T: {
        zero: () => 0,
        methods: {
          String: (value: number) => String(value),
        },
      },
    }
    expect(genericZero(genericArgs, 'T', null)).toBe(0)
    expect(callGenericMethod(genericArgs, 'T', 'String', 12)).toBe('12')
  })

  it('allocates and stores through pointers to type parameters', () => {
    class Point {
      declare public X: { value: number }
      constructor(init?: { X?: number }) {
        this.X = { value: init?.X ?? 0 }
      }
      clone(): Point {
        return markAsStructValue(new Point({ X: this.X.value }))
      }
      static __typeInfo = {
        kind: TypeKind.Struct,
        name: 'main.Point',
        fields: [{ name: 'X', type: { kind: TypeKind.Basic, name: 'int' } }],
        methods: [],
      }
    }

    const structArgs = {
      T: { zero: () => markAsStructValue(new Point()) },
    }
    const p = genericNew(structArgs, 'T', null) as Point
    expect(p).toBeInstanceOf(Point)
    expect(isVarRef(p)).toBe(false)
    expect(isMarkedAsStructValue(p)).toBe(false)
    genericPointerRef(p).value = markAsStructValue(new Point({ X: 3 }))
    expect(p.X.value).toBe(3)

    const intArgs = { T: { zero: () => 0 } }
    const ip = genericNew(intArgs, 'T', null)
    expect(isVarRef(ip)).toBe(true)
    genericPointerRef(ip).value = 7
    expect((ip as { value: number }).value).toBe(7)
  })

  it('compares anonymous descriptors inside function assertions', () => {
    const acceptsAny = functionValue((value: unknown) => String(value), {
      kind: TypeKind.Function,
      name: 'main.AcceptsAny',
      params: [{ kind: TypeKind.Interface, methods: [] }],
      results: [{ kind: TypeKind.Basic, name: 'string' }],
    })

    expect(
      typeAssert<typeof acceptsAny>(acceptsAny, {
        kind: TypeKind.Function,
        name: 'main.AcceptsAny',
        params: [{ kind: TypeKind.Interface, methods: [] }],
        results: [{ kind: TypeKind.Basic, name: 'string' }],
      }).ok,
    ).toBe(true)

    const acceptsStruct = functionValue(
      (value: { Name: string }) => value.Name,
      {
        kind: TypeKind.Function,
        name: 'main.AcceptsStruct',
        params: [
          {
            kind: TypeKind.Struct,
            methods: [],
            fields: [
              {
                name: 'Name',
                type: { kind: TypeKind.Basic, name: 'string' },
                tag: 'json:"name"',
              },
            ],
          },
        ],
        results: [{ kind: TypeKind.Basic, name: 'string' }],
      },
    )

    expect(
      typeAssert<typeof acceptsStruct>(acceptsStruct, {
        kind: TypeKind.Function,
        name: 'main.AcceptsStruct',
        params: [
          {
            kind: TypeKind.Struct,
            methods: [],
            fields: [
              {
                name: 'Name',
                type: { kind: TypeKind.Basic, name: 'string' },
                tag: 'json:"name"',
              },
            ],
          },
        ],
        results: [{ kind: TypeKind.Basic, name: 'string' }],
      }).ok,
    ).toBe(true)
    expect(
      typeAssert<typeof acceptsStruct>(acceptsStruct, {
        kind: TypeKind.Function,
        name: 'main.AcceptsStruct',
        params: [
          {
            kind: TypeKind.Struct,
            methods: [],
            fields: [
              {
                name: 'Name',
                type: { kind: TypeKind.Basic, name: 'string' },
                tag: 'json:"other"',
              },
            ],
          },
        ],
        results: [{ kind: TypeKind.Basic, name: 'string' }],
      }).ok,
    ).toBe(false)

    const acceptsAlias = functionValue((value: number) => value, {
      kind: TypeKind.Function,
      name: 'main.AcceptsAlias',
      params: [{ kind: TypeKind.Basic, name: 'int', typeName: 'main.A' }],
      results: [{ kind: TypeKind.Basic, name: 'int' }],
    })
    expect(
      typeAssert<typeof acceptsAlias>(acceptsAlias, {
        kind: TypeKind.Function,
        name: 'main.AcceptsAlias',
        params: [{ kind: TypeKind.Basic, name: 'int', typeName: 'main.A' }],
        results: [{ kind: TypeKind.Basic, name: 'int' }],
      }).ok,
    ).toBe(true)
    expect(
      typeAssert<typeof acceptsAlias>(acceptsAlias, {
        kind: TypeKind.Function,
        name: 'main.AcceptsAlias',
        params: [{ kind: TypeKind.Basic, name: 'int', typeName: 'main.B' }],
        results: [{ kind: TypeKind.Basic, name: 'int' }],
      }).ok,
    ).toBe(false)
    expect(
      typeAssert<typeof acceptsAlias>(acceptsAlias, {
        kind: TypeKind.Function,
        name: 'main.AcceptsAlias',
        params: [{ kind: TypeKind.Basic, name: 'int' }],
        results: [{ kind: TypeKind.Basic, name: 'int' }],
      }).ok,
    ).toBe(false)
  })

  it('asserts raw function values after interface storage', () => {
    const accessType = {
      kind: TypeKind.Function,
      params: [
        'context.Context',
        { kind: TypeKind.Function, params: [], results: [] },
      ],
      results: [
        { kind: TypeKind.Pointer, elemType: 'unixfs.FSHandle' },
        { kind: TypeKind.Function, params: [], results: [] },
        'error',
      ],
    } as const
    const accessFunc = functionValue(() => [null, null, null], accessType)
    const storedAsAny: any = accessFunc

    const [asserted, ok] = typeAssertTuple<typeof accessFunc>(
      storedAsAny,
      accessType,
    )

    expect(ok).toBe(true)
    expect(asserted).toBe(accessFunc)
  })

  it('exposes channel helpers used by future lowering', async () => {
    const channel = makeChannel<number>(1, 0, 'both')
    expect(cap(channel)).toBe(1)
    await channel.send(7)
    expect(len(channel)).toBe(1)
    expect(cap(channel)).toBe(1)
    expect(await chanRecvWithOk(channel)).toEqual({ value: 7, ok: true })
    expect(len(channel)).toBe(0)
    channel.close()
    expect(await chanRecvWithOk(channel)).toEqual({ value: 0, ok: false })
  })

  it('preserves ready buffered select send and receive behavior', async () => {
    const recvChannel = makeChannel<number>(1, 0, 'both')
    await recvChannel.send(41)

    const [recvHasValue, recvValue] = await selectStatement<number, number>(
      [
        {
          id: 0,
          isSend: false,
          channel: recvChannel,
          onSelected: async (result) => result.value + 1,
        },
      ],
      false,
    )

    expect(recvHasValue).toBe(true)
    expect(recvValue).toBe(42)
    expect(len(recvChannel)).toBe(0)

    const sendChannel = makeChannel<number>(1, 0, 'both')
    const [sendHasValue, sendValue] = await selectStatement<number, boolean>(
      [
        {
          id: 1,
          isSend: true,
          channel: sendChannel,
          value: 7,
          onSelected: async () => true,
        },
      ],
      false,
    )

    expect(sendHasValue).toBe(true)
    expect(sendValue).toBe(true)
    expect(await sendChannel.receive()).toBe(7)
  })

  it('hands selected buffered sends to already waiting receivers', async () => {
    const directChannel = makeChannel<number>(1, 0, 'both')
    let directReceived: number | undefined
    const directReceive = directChannel.receive().then((value) => {
      directReceived = value
    })

    await Promise.resolve()
    await directChannel.send(7)
    await directReceive
    expect(directReceived).toBe(7)

    const selectChannel = makeChannel<number>(1, 0, 'both')
    let selectReceived: number | undefined
    const selectReceive = selectChannel.receive().then((value) => {
      selectReceived = value
    })

    await Promise.resolve()
    const [sendHasValue, sendValue] = await selectStatement<number, boolean>(
      [
        {
          id: 1,
          isSend: true,
          channel: selectChannel,
          value: 9,
          onSelected: async () => true,
        },
      ],
      false,
    )

    await Promise.resolve()
    await Promise.resolve()
    expect(sendHasValue).toBe(true)
    expect(sendValue).toBe(true)
    expect(selectReceived).toBe(9)
    expect(len(selectChannel)).toBe(0)
    await selectReceive
  })

  it('does not resume an unbuffered sender before the waiting receiver accepts the value', async () => {
    const channel = makeChannel<number>(0, 0, 'both')
    let received = 0

    const receiver = (async () => {
      received = await channel.receive()
    })()

    await channel.send(7)
    expect(received).toBe(7)
    await receiver
  })

  it('resumes closed-channel receivers after queued goroutine work', async () => {
    const channel = makeChannel<number>(0, 0, 'both')
    const events: string[] = []

    const receive = channel.receive().then(() => {
      events.push('receiver')
    })
    channel.close()
    queueMicrotask(() => events.push('queued'))

    await receive
    expect(events).toEqual(['queued', 'receiver'])
  })

  it('lets queued shutdown work progress when receiving an already closed channel', async () => {
    const channel = makeChannel(0, 0)
    channel.close()
    const receivers = [
      () => channel.receive(),
      () => channel.receiveWithOk(),
      () => channel.selectReceive(0),
      () => selectStatement([{ id: 0, isSend: false, channel }]),
    ]

    for (const receive of receivers) {
      let shutdownFinished = false
      queueTask(() => {
        shutdownFinished = true
      })
      await receive()
      expect(shutdownFinished).toBe(true)
    }
  })

  it('preserves values offered to losing select branches in the same turn', async () => {
    const first = makeChannel(1, 0)
    const second = makeChannel(1, 0)
    const selected = selectStatement<number, number>([
      {
        id: 0,
        isSend: false,
        channel: first,
        onSelected: (result) => result.value,
      },
      {
        id: 1,
        isSend: false,
        channel: second,
        onSelected: (result) => result.value,
      },
    ])

    const firstSend = first.send(7)
    const secondSend = second.send(9)
    expect(await selected).toEqual([true, 7])
    await Promise.all([firstSend, secondSend])
    expect(second.len()).toBe(1)
    expect(await second.receive()).toBe(9)
  })

  it('withdraws losing sends before another receiver can consume them', async () => {
    const first = makeChannel(0, 0)
    const second = makeChannel(0, 0)
    const selected = selectStatement<number, number>([
      { id: 0, isSend: true, channel: first, value: 7, onSelected: () => 0 },
      { id: 1, isSend: true, channel: second, value: 9, onSelected: () => 1 },
    ])

    const received = first.receive()
    expect(second.canReceiveNonBlocking()).toBe(false)
    expect(await received).toBe(7)
    expect(await selected).toEqual([true, 0])
  })

  it('never pairs send and receive branches of the same select', async () => {
    const channel = makeChannel(0, 0)
    const selected = selectStatement<number, number>([
      { id: 0, isSend: false, channel, onSelected: (result) => result.value },
      { id: 1, isSend: true, channel, value: 7, onSelected: () => -1 },
    ])
    const externalSend = channel.send(9)
    try {
      expect(await selected).toEqual([true, 9])
    } finally {
      channel.close()
      await externalSend.catch(() => {})
    }
  })

  it('cancels losing select receive cases', async () => {
    const signal = makeChannel<string>(1, '', 'both')
    const timeout = makeChannel<string>(0, '', 'both')
    queueMicrotask(() => timeout.close())

    await selectStatement(
      [
        {
          id: 0,
          isSend: false,
          channel: signal,
          onSelected: async () => 'signal',
        },
        {
          id: 1,
          isSend: false,
          channel: timeout,
          onSelected: async () => 'timeout',
        },
      ],
      false,
    )

    await signal.send('value')
    const received = await Promise.race([
      signal.receive(),
      new Promise<string>((resolve) =>
        setTimeout(() => resolve('timeout'), 20),
      ),
    ])
    expect(received).toBe('value')
  })
})
