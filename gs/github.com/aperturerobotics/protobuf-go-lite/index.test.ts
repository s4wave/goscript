import {
  createMessageType,
  FieldFlag,
  MAP_KEY_SHIFT,
} from '@aptre/protobuf-es-lite'
import { Timestamp } from '@aptre/protobuf-es-lite/google/protobuf/timestamp'
import { describe, expect, it } from 'vitest'

import * as $ from '../../../builtin/index.js'
import { Builder } from '../../../strings/index.js'
import {
  AppendVarint,
  BindMessageMethods,
  CloneBoundMessage,
  CountTag,
  DecodeBytes,
  DecodeBytesAppend,
  DecodeBytesCapped,
  DecodeFloat32,
  DecodeFloat64,
  DecodeLengthDelimited,
  DecodeSint32,
  DecodeSint64,
  DecodeString,
  DecodeStringUnsafe,
  DecodeVarintBool,
  EncodeBool,
  EncodeBytes,
  EncodeFixed32,
  EncodeFixed64,
  EncodeRawBytes,
  EncodeString,
  EncodeVarintPacked,
  EncodeZigzag32,
  EncodeZigzag32Packed,
  EncodeZigzag64,
  EncodeZigzag64Packed,
  EqualBoundMessage,
  PackedFixedElementCount,
  PackedVarintElementCount,
  SkipWithin,
  TextFinishMessage,
  TextSortedMapKeys,
  TextStartMessage,
  TextWriteBool,
  TextWriteBytes,
  TextWriteFieldPrefix,
  TextWriteFloat32,
  TextWriteFloat64,
  TextWriteInt,
  TextWriteListEnd,
  TextWriteListSeparator,
  TextWriteListStart,
  TextWriteString,
  TextWriteStringer,
  TextWriteTextMarshaler,
  TextWriteUint,
  CloneBytes,
  CloneBytesMap,
  CloneBytesSlice,
  CloneMap,
  type CloneMessage,
  ClonePtr,
  CloneSlice,
  type CloneVT,
  CloneVTMap,
  CloneVTSlice,
  CloneVTValue,
  CompareEqualVT,
  ConsumeVarint,
  DecodeFixed32,
  DecodeFixed64,
  DecodeVarint,
  DecodeVarintInt32,
  DecodeVarintInt64,
  DecodeVarintUint32,
  EncodeVarint,
  ErrIntOverflow,
  ErrInvalidLength,
  ErrUnexpectedEndOfGroup,
  EqualBytes,
  EqualBytesMap,
  EqualBytesPresent,
  EqualBytesSlice,
  EqualMap,
  EqualPtr,
  EqualSlice,
  EqualVTImplicit,
  EqualVTMapImplicit,
  EqualVTSliceImplicit,
  type EqualVT,
  IsEqualVTSlice,
  MarshalBoundMessageJSON,
  MarshalBoundMessageVT,
  MarshalBoundMessageToSizedBufferVT,
  SizeBoolNonZero,
  SizeBoolPacked,
  SizeBoolPtr,
  SizeBoolSlice,
  SizeBoolValue,
  SizeBytesNonEmpty,
  SizeBytesPresent,
  SizeBytesSlice,
  SizeBytesValue,
  SizeFixed32NonZero,
  SizeFixed32Packed,
  SizeFixed32Ptr,
  SizeFixed32Slice,
  SizeFixed32Value,
  SizeFixed64NonZero,
  SizeFixed64Packed,
  SizeFixed64Ptr,
  SizeFixed64Slice,
  SizeFixed64Value,
  SizeGroup,
  SizeMessage,
  SizeOfVarint,
  SizeOfZigzag,
  SizeStringNonEmpty,
  SizeStringPtr,
  SizeStringSlice,
  SizeStringValue,
  SizeVarintNonZero,
  SizeVarintPacked,
  SizeVarintPtr,
  SizeVarintSlice,
  SizeVarintValue,
  SizeZigzagNonZero,
  SizeZigzagPacked,
  SizeZigzagPtr,
  SizeZigzagSlice,
  SizeZigzagValue,
  Skip,
  UnmarshalBoundMessageJSON,
  UnmarshalBoundMessageVT,
} from './index.js'

class TestValue {
  constructor(private readonly value: string) {}

  EqualVT(other: TestValue): boolean {
    return this.value == other.value
  }
}

class TestCloneValue
  implements CloneVT<TestCloneValue>, EqualVT<TestCloneValue>
{
  constructor(private readonly cloneValue: string) {}

  SizeVT(): number {
    return 0
  }

  MarshalToSizedBufferVT(): [number, $.GoError] {
    return [0, null]
  }

  MarshalVT(): [$.Slice<number>, $.GoError] {
    return [null, null]
  }

  UnmarshalVT(): $.GoError {
    return null
  }

  Reset(): void {}

  CloneMessageVT(): CloneMessage | null {
    return this.CloneVT()
  }

  CloneVT(): TestCloneValue {
    return new TestCloneValue(this.cloneValue)
  }

  EqualVT(other: TestCloneValue | $.VarRef<TestCloneValue> | null): boolean {
    return this.cloneValue === $.pointerValueOrNil(other)?.cloneValue
  }
}

class TestCloneMessage implements CloneMessage {
  SizeVT(): number {
    return 0
  }

  MarshalToSizedBufferVT(): [$.Slice<number>, $.GoError] {
    return [null, null]
  }

  MarshalVT(): [$.Slice<number>, $.GoError] {
    return [null, null]
  }

  UnmarshalVT(): $.GoError {
    return null
  }

  Reset(): void {}

  CloneMessageVT(): CloneMessage | null {
    return new TestCloneMessage()
  }
}

// BrokenBoundMessage's type fails to encode, as a type does for a value its
// field cannot hold.
class BrokenBoundMessage {}

;(BrokenBoundMessage as any).__protobufTypeScriptMessage = {
  ...createMessageType('test.BrokenBoundMessage', () => []),
  toBinary: () => {
    throw new Error('invalid uint 32: undefined')
  },
}

class BytesBoundMessage {
  Config: $.Slice<number>

  constructor(config: $.Slice<number>) {
    this.Config = config
  }
}

;(BytesBoundMessage as any).__protobufTypeScriptMessage = createMessageType(
  'test.BytesBoundMessage',
  () => [[1, 'config', 12]],
)

class TextBoundMessage {
  Name = ''
  Labels: Map<string, string> | null = null

  constructor(init?: Partial<TextBoundMessage>) {
    Object.assign(this, init)
  }
}

const textMessageType = createMessageType<{
  name?: string
  labels?: Record<string, string>
}>('test.TextBoundMessage', () => [
  [1, 'name', 9],
  [2, 'labels', 9, FieldFlag.MAP | (9 << MAP_KEY_SHIFT)],
])
;(TextBoundMessage as any).__protobufTypeScriptMessage = textMessageType

class BinaryInputBoundMessage {
  static lastInput: Uint8Array | null | undefined

  static __protobufTypeScriptMessage = {
    ...createMessageType('test.BinaryInputBoundMessage', () => []),
    fromBinary: (bytes: Uint8Array | null | undefined) => {
      BinaryInputBoundMessage.lastInput = bytes
      return {}
    },
  }
}

class TimestampBoundMessage {
  declare public Seconds: bigint

  declare public Nanos: number

  constructor(init?: Partial<{ Seconds?: bigint; Nanos?: number }>) {
    this.Seconds = init?.Seconds ?? 0n
    this.Nanos = init?.Nanos ?? 0
  }
}

class TimestampParentBoundMessage {
  declare public Timestamp: TimestampBoundMessage | null

  constructor(init?: Partial<{ Timestamp?: TimestampBoundMessage | null }>) {
    this.Timestamp = init?.Timestamp ?? null
  }
}

const timestampParentType = createMessageType<{ timestamp?: Date }>(
  'test.TimestampParentBoundMessage',
  () => [[1, 'timestamp', 11, 0, Timestamp.codec]],
)
;(TimestampParentBoundMessage as any).__protobufTypeScriptMessage =
  timestampParentType
;(TimestampParentBoundMessage as any).__protobufTypeScriptFields = {
  timestamp: TimestampBoundMessage,
}

const oneofLeafMessageType = createMessageType(
  'test.OneofLeafBoundMessage',
  () => [[1, 'label', 9]],
)

class OneofLeafBoundMessage {
  declare public Label: string

  constructor(init?: Partial<{ Label?: string }>) {
    this.Label = init?.Label ?? ''
  }
}

;(OneofLeafBoundMessage as any).__protobufTypeScriptMessage =
  oneofLeafMessageType
;(OneofLeafBoundMessage as any).__protobufTypeScriptFields = {}

class OneofBoundMessage_TabSet {
  declare public TabSet: OneofLeafBoundMessage | null

  constructor(init?: Partial<{ TabSet?: OneofLeafBoundMessage | null }>) {
    this.TabSet = init?.TabSet ?? null
  }
}

class OneofBoundMessage {
  declare public Node: OneofBoundMessage_TabSet | null

  constructor(init?: Partial<{ Node?: OneofBoundMessage_TabSet | null }>) {
    this.Node = init?.Node ?? null
  }
}

const oneofMessageType = createMessageType<{
  node?: { case: 'tabSet'; value: { label?: string } }
}>('test.OneofBoundMessage', () => [
  [1, 'tab_set', 11, 0, oneofLeafMessageType.codec, 'node'],
])
;(OneofBoundMessage as any).__protobufTypeScriptMessage = oneofMessageType
;(OneofBoundMessage as any).__protobufTypeScriptFields = {
  tabSet: OneofLeafBoundMessage,
}
;(OneofBoundMessage as any).__protobufTypeScriptOneofFields = {
  node: { tabSet: OneofBoundMessage_TabSet },
}

// StartBoundMessage has the shape of a plugin's start info: several string
// fields whose Go names differ from their proto names.
class StartBoundMessage {
  InstanceId = ''
  PluginId = ''

  constructor(init?: Partial<StartBoundMessage>) {
    Object.assign(this, init)
  }
}

const startMessageType = createMessageType<{
  instanceId?: string
  pluginId?: string
}>('test.StartBoundMessage', () => [
  [1, 'instance_id', 9],
  [2, 'plugin_id', 9],
])
;(StartBoundMessage as any).__protobufTypeScriptMessage = startMessageType

// KeyedBoundMessage holds a packed list and a map with 64-bit keys, whose Go
// keys are bigints and whose TypeScript record keys are text.
class KeyedBoundMessage {
  Counts: $.Slice<number> = null
  ById: Map<bigint, string> | null = null

  constructor(init?: Partial<KeyedBoundMessage>) {
    Object.assign(this, init)
  }
}

const keyedMessageType = createMessageType<{
  counts?: number[]
  byId?: Record<string, string>
}>('test.KeyedBoundMessage', () => [
  [1, 'counts', 5, FieldFlag.REPEATED | FieldFlag.PACKED],
  [2, 'by_id', 9, FieldFlag.MAP | (3 << MAP_KEY_SHIFT)],
])
;(KeyedBoundMessage as any).__protobufTypeScriptMessage = keyedMessageType

describe('protobuf-go-lite EqualVT helpers', () => {
  it('accepts compiler-emitted runtime type arguments', () => {
    const equal = CompareEqualVT<TestValue>({
      T: { zero: () => null },
    })

    expect(equal(new TestValue('a'), new TestValue('a'))).toBe(true)
    expect(equal(new TestValue('a'), new TestValue('b'))).toBe(false)
    expect(equal(null, null)).toBe(true)
  })

  it('accepts nullable generated message slices', () => {
    const left: $.Slice<TestValue | $.VarRef<TestValue> | null> = [
      $.varRef(new TestValue('x')),
      null,
    ]
    const right: $.Slice<TestValue | $.VarRef<TestValue> | null> = [
      new TestValue('x'),
      null,
    ]

    expect(IsEqualVTSlice(left, right)).toBe(true)
  })
})

describe('protobuf-go-lite static helper overrides', () => {
  it('clones pointer, slice, map, bytes, and VT values', () => {
    const ptr = $.varRef(7)
    const clonedPtr = ClonePtr(ptr)
    expect(clonedPtr).not.toBe(ptr)
    expect(clonedPtr?.value).toBe(7)

    const bytes = new Uint8Array([1, 2])
    const clonedBytes = CloneBytes(bytes)
    expect(clonedBytes).not.toBe(bytes)
    expect(Array.from(clonedBytes ?? [])).toEqual([1, 2])

    expect(CloneSlice([1, 2])).toEqual([1, 2])

    const numbers: $.Slice<number> = new Uint8Array([1, 2])
    const clonedNumbers = CloneSlice(numbers)
    expect(clonedNumbers).not.toBe(numbers)
    expect(Array.from(clonedNumbers ?? [])).toEqual([1, 2])
    expect(CloneMap(new Map([['a', 1]]))?.get('a')).toBe(1)

    const bytesSlice = CloneBytesSlice([new Uint8Array([3])])
    expect(bytesSlice?.[0]).not.toBe(bytes)
    expect(Array.from(bytesSlice?.[0] ?? [])).toEqual([3])

    const bytesMap = CloneBytesMap(new Map([['a', new Uint8Array([4])]]))
    expect(Array.from(bytesMap?.get('a') ?? [])).toEqual([4])

    const msg = new TestCloneValue('x')
    expect(CloneVTValue(msg)).not.toBe(msg)
    expect(CloneVTSlice([msg])?.[0]).not.toBe(msg)
    expect(CloneVTMap(new Map([['a', msg]]))?.get('a')).not.toBe(msg)
  })

  it('compares pointer, slice, map, bytes, and implicit VT values', () => {
    expect(EqualPtr($.varRef(1), $.varRef(1))).toBe(true)
    expect(EqualPtr($.varRef(1), $.varRef(2))).toBe(false)
    expect(EqualBytes(new Uint8Array([1]), [1])).toBe(true)
    expect(EqualBytesPresent(null, new Uint8Array())).toBe(false)
    expect(EqualSlice([1, 2], [1, 2])).toBe(true)
    expect(EqualMap(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true)
    expect(EqualBytesSlice([new Uint8Array([1])], [[1]])).toBe(true)
    expect(
      EqualBytesMap(
        new Map([['a', new Uint8Array([1])]]),
        new Map([['a', [1]]]),
      ),
    ).toBe(true)

    const empty = () => new TestCloneValue('')
    expect(EqualVTImplicit(null, new TestCloneValue(''), empty)).toBe(true)
    expect(
      EqualVTSliceImplicit(
        [null, new TestCloneValue('x')],
        [new TestCloneValue(''), new TestCloneValue('x')],
        empty,
      ),
    ).toBe(true)
    expect(
      EqualVTMapImplicit(
        new Map([['a', null]]),
        new Map([['a', new TestCloneValue('')]]),
        empty,
      ),
    ).toBe(true)
  })
})

describe('protobuf-go-lite runtime interfaces', () => {
  it('registers CloneMessage metadata for Go type assertions', () => {
    const [value, ok] = $.typeAssertTuple<CloneMessage | null>(
      new TestCloneMessage(),
      'protobuf_go_lite.CloneMessage',
    )

    expect(ok).toBe(true)
    expect(value?.CloneMessageVT()).toBeInstanceOf(TestCloneMessage)
  })
})

describe('protobuf-go-lite TypeScript binding helpers', () => {
  it('compares nil messages like the generated Go EqualVT', () => {
    const empty = new BinaryInputBoundMessage()

    expect(EqualBoundMessage(BinaryInputBoundMessage, empty, null)).toBe(false)
    expect(EqualBoundMessage(BinaryInputBoundMessage, null, empty)).toBe(false)
    expect(EqualBoundMessage(BinaryInputBoundMessage, null, null)).toBe(true)
    expect(
      EqualBoundMessage(
        BinaryInputBoundMessage,
        empty,
        new BinaryInputBoundMessage(),
      ),
    ).toBe(true)
  })

  // Generated Go CloneVT returns nil for a nil receiver; callers clone
  // optional message fields without checking them first.
  it('clones nil messages like the generated Go CloneVT', () => {
    const empty = new BinaryInputBoundMessage()

    expect(CloneBoundMessage(BinaryInputBoundMessage, null)).toBeNull()
    expect(CloneBoundMessage(BinaryInputBoundMessage, empty)).not.toBeNull()
    expect(CloneBoundMessage(BinaryInputBoundMessage, empty)).not.toBe(empty)
  })

  it('adds message type context to binary marshal errors', () => {
    const [, err] = MarshalBoundMessageVT(
      BrokenBoundMessage as any,
      new BrokenBoundMessage(),
    )

    expect(err?.Error()).toBe(
      'marshal test.BrokenBoundMessage: invalid uint 32: undefined',
    )
  })

  it('converts Go strings and map keys to text across the binding', () => {
    const name = $.goString('🌻')
    const labels = new Map([[$.goString('🌳'), $.goString('💎')]])
    const wire = textMessageType.toBinary({
      name: '🌻',
      labels: { '🌳': '💎' },
    })
    const jsonWire = new TextEncoder().encode(
      JSON.stringify({ name: '🌻', labels: { '🌳': '💎' } }),
    )

    const [bytes, err] = MarshalBoundMessageVT(
      TextBoundMessage as any,
      new TextBoundMessage({ Name: name, Labels: labels }),
    )
    expect(err).toBeNull()
    expect(Array.from(bytes ?? [])).toEqual(Array.from(wire))

    const target = new TextBoundMessage()
    expect(
      UnmarshalBoundMessageVT(
        TextBoundMessage as any,
        target,
        $.arrayToSlice(Array.from(wire)),
      ),
    ).toBeNull()
    expect(target.Name).toBe(name)
    expect(Array.from(target.Labels ?? [])).toEqual(Array.from(labels))

    const [json, jsonErr] = MarshalBoundMessageJSON(
      TextBoundMessage as any,
      target,
    )
    expect(jsonErr).toBeNull()
    expect(Array.from(json ?? [])).toEqual(Array.from(jsonWire))
    const fromJSON = new TextBoundMessage()
    expect(
      UnmarshalBoundMessageJSON(TextBoundMessage as any, fromJSON, json),
    ).toBeNull()
    expect(fromJSON.Name).toBe(name)
  })

  it('normalizes Go byte slices before binary marshal', () => {
    const [bytes, err] = MarshalBoundMessageVT(
      BytesBoundMessage as any,
      new BytesBoundMessage([1, 2, 3]),
    )

    expect(err).toBeNull()
    expect(Array.from(bytes ?? [])).toEqual([10, 3, 1, 2, 3])
  })

  it('passes byte slices to binary unmarshal as typed-array views', () => {
    const target = new BinaryInputBoundMessage()

    expect(
      UnmarshalBoundMessageVT(BinaryInputBoundMessage, target, [1, 2, 3]),
    ).toBeNull()
    expect(BinaryInputBoundMessage.lastInput).toBeInstanceOf(Uint8Array)
    expect(Array.from(BinaryInputBoundMessage.lastInput ?? [])).toEqual([
      1, 2, 3,
    ])

    const full = new Uint8Array([4, 5, 6])
    expect(
      UnmarshalBoundMessageVT(BinaryInputBoundMessage, target, full),
    ).toBeNull()
    expect(BinaryInputBoundMessage.lastInput).toBe(full)

    const backing = new Uint8Array([9, 8, 7, 6, 5])
    const view = $.goSlice(backing, 1, 4)
    expect(
      UnmarshalBoundMessageVT(BinaryInputBoundMessage, target, view),
    ).toBeNull()
    expect(BinaryInputBoundMessage.lastInput?.buffer).toBe(backing.buffer)
    expect(BinaryInputBoundMessage.lastInput?.byteOffset).toBe(
      backing.byteOffset + 1,
    )
    expect(BinaryInputBoundMessage.lastInput?.byteLength).toBe(3)
    expect(Array.from(BinaryInputBoundMessage.lastInput ?? [])).toEqual([
      8, 7, 6,
    ])
  })

  it('returns bytes written after marshaling into a sized buffer', () => {
    const target = new Uint8Array(7)
    const [n, err] = MarshalBoundMessageToSizedBufferVT(
      BytesBoundMessage as any,
      new BytesBoundMessage([1, 2, 3]),
      target,
    )

    expect(err).toBeNull()
    expect(n).toBe(5)
    expect(Array.from(target)).toEqual([0, 0, 10, 3, 1, 2, 3])
  })

  it('converts protobuf-es-lite timestamp Dates to and from Go timestamp structs', () => {
    // Decode a Date field into the Go timestamp struct.
    const wire = timestampParentType.toBinary({
      timestamp: new Date(Date.UTC(2026, 4, 31, 12, 34, 56, 789)),
    })
    const target = new TimestampParentBoundMessage()
    expect(
      UnmarshalBoundMessageVT(TimestampParentBoundMessage as any, target, wire),
    ).toBeNull()
    expect(target.Timestamp?.Seconds).toBe(1780230896n)
    expect(target.Timestamp?.Nanos).toBe(789000000)

    // Encode the struct back to the same wire bytes.
    const [bytes, err] = MarshalBoundMessageVT(
      TimestampParentBoundMessage as any,
      target,
    )
    expect(err).toBeNull()
    expect(Array.from(bytes ?? [])).toEqual(Array.from(wire))
  })

  // A binding that reads no fields would decode every message as empty, so
  // each field of a non-empty message must arrive in its Go field.
  it('decodes every field of a non-empty message', () => {
    // Decode the binary form.
    const fields = { instanceId: 'web-1', pluginId: 'spacewave-wasivm' }
    const fromVT = new StartBoundMessage()
    expect(
      UnmarshalBoundMessageVT(
        StartBoundMessage as any,
        fromVT,
        startMessageType.toBinary(fields),
      ),
    ).toBeNull()
    expect(fromVT).toMatchObject({
      InstanceId: $.goString('web-1'),
      PluginId: $.goString('spacewave-wasivm'),
    })

    // Decode the JSON form to the same fields.
    const fromJSON = new StartBoundMessage()
    const json = $.stringToBytes(
      $.goString(startMessageType.toJsonString(fields)),
    )
    expect(
      UnmarshalBoundMessageJSON(StartBoundMessage as any, fromJSON, json),
    ).toBeNull()
    expect(fromJSON).toEqual(fromVT)
  })

  it('converts lists and 64-bit map keys', () => {
    // Encode a Go slice and a map keyed by int64.
    const source = new KeyedBoundMessage({
      Counts: $.arrayToSlice([1, 2, 3]),
      ById: new Map([[7n, $.goString('seven')]]),
    })
    const [bytes, err] = MarshalBoundMessageVT(KeyedBoundMessage as any, source)
    expect(err).toBeNull()
    expect(keyedMessageType.fromBinary(bytes as Uint8Array)).toEqual({
      counts: [1, 2, 3],
      byId: { '7': 'seven' },
    })

    // Decode them back, with the map's text keys as bigints.
    const target = new KeyedBoundMessage()
    expect(
      UnmarshalBoundMessageVT(KeyedBoundMessage as any, target, bytes),
    ).toBeNull()
    expect(Array.from($.asArray(target.Counts))).toEqual([1, 2, 3])
    expect(Array.from(target.ById ?? [])).toEqual([[7n, $.goString('seven')]])
  })

  it('rejects a message type whose codec lists no fields', () => {
    // Bind a type shaped like protobuf-es-lite 1.2.2, whose codec has no
    // field list.
    class OldBoundMessage {}
    ;(OldBoundMessage as any).__protobufTypeScriptMessage = {
      ...startMessageType,
      codec: { typeName: 'test.OldBoundMessage' },
    }

    // Decoding fails instead of leaving every field unset.
    const err = UnmarshalBoundMessageVT(
      OldBoundMessage as any,
      new OldBoundMessage(),
      startMessageType.toBinary({ instanceId: 'web-1' }),
    )
    expect(err?.Error()).toMatch(/needs @aptre\/protobuf-es-lite 1.2.3/)
  })

  it('preserves protobuf oneof branches in bound binary helpers', () => {
    // Encode a Go oneof member to the bytes protobuf-es-lite writes for it.
    const source = new OneofBoundMessage({
      Node: new OneofBoundMessage_TabSet({
        TabSet: new OneofLeafBoundMessage({ Label: 'files' }),
      }),
    })
    const wire = oneofMessageType.toBinary({
      node: { case: 'tabSet', value: { label: 'files' } },
    })
    const [bytes, marshalErr] = MarshalBoundMessageVT(
      OneofBoundMessage as any,
      source,
    )
    expect(marshalErr).toBeNull()
    expect(Array.from(bytes ?? [])).toEqual(Array.from(wire))

    // Decode them back into the member's Go wrapper struct.
    const target = new OneofBoundMessage()
    expect(
      UnmarshalBoundMessageVT(OneofBoundMessage as any, target, wire),
    ).toBeNull()
    expect(target.Node).toBeInstanceOf(OneofBoundMessage_TabSet)
    expect(target.Node?.TabSet).toBeInstanceOf(OneofLeafBoundMessage)
    expect(target.Node?.TabSet?.Label).toBe('files')
  })
})

class ViewLeafBoundMessage {
  constructor(init?: Partial<{ Data?: Uint8Array | null }>) {
    this.Data = init?.Data ?? null
  }

  declare public Data: Uint8Array | null
}

const viewLeafType = createMessageType('test.ViewLeaf', () => [[1, 'data', 12]])

// ViewHolderBoundMessage decodes through protobuf-es-lite, whose bytes fields
// decode as subarray views into the input buffer, so every decoded byte
// aliases the caller-owned wire buffer until copied.
class ViewHolderBoundMessage {
  constructor(init?: {
    Leaf?: ViewLeafBoundMessage | null
    Leaves?: $.Slice<ViewLeafBoundMessage | null> | null
    Entries?: Map<string, ViewLeafBoundMessage | null> | null
  }) {
    this.Leaf = init?.Leaf ?? null
    this.Leaves = init?.Leaves ?? null
    this.Entries = init?.Entries ?? null
  }

  declare public Leaf: ViewLeafBoundMessage | null

  declare public Leaves: $.Slice<ViewLeafBoundMessage | null> | null

  declare public Entries: Map<string, ViewLeafBoundMessage | null> | null
}

const viewHolderType = createMessageType<{
  leaf?: { data?: Uint8Array }
  leaves?: { data?: Uint8Array }[]
  entries?: Record<string, { data?: Uint8Array }>
}>('test.ViewHolder', () => [
  [1, 'leaf', 11, 0, viewLeafType.codec],
  [2, 'leaves', 11, FieldFlag.REPEATED, viewLeafType.codec],
  [3, 'entries', 11, FieldFlag.MAP | (9 << MAP_KEY_SHIFT), viewLeafType.codec],
])
;(ViewHolderBoundMessage as any).__protobufTypeScriptMessage = viewHolderType
;(ViewHolderBoundMessage as any).__protobufTypeScriptFields = {
  leaf: ViewLeafBoundMessage,
  leaves: ViewLeafBoundMessage,
  entries: ViewLeafBoundMessage,
}

describe('protobuf-go-lite bound unmarshal owns decoded bytes', () => {
  it('retains singular, nested, repeated, and map bytes after scrubbing the input', () => {
    // The payload sits at a nonzero offset inside a larger buffer so an
    // aliased view keeps pointing at live memory even when lengths survive.
    const first = Uint8Array.of(1, 2, 3, 4)
    const second = Uint8Array.of(5, 6, 7, 8)
    const wire = viewHolderType.toBinary({
      leaf: { data: first },
      leaves: [{ data: first }, { data: second }],
      entries: { first: { data: first }, second: { data: second } },
    })
    const backing = new Uint8Array(wire.length + 8)
    backing.set(wire, 4)
    const view = backing.subarray(4, 4 + wire.length)

    const target = new ViewHolderBoundMessage()
    expect(
      UnmarshalBoundMessageVT(ViewHolderBoundMessage as any, target, view),
    ).toBeNull()

    // Capture the remarshal while the input buffer is still intact; the
    // post-scrub remarshal must reproduce it exactly.
    const [preScrubBytes, preScrubErr] = MarshalBoundMessageVT(
      ViewHolderBoundMessage as any,
      target,
    )
    expect(preScrubErr).toBeNull()

    // Scrub the whole backing buffer, mirroring callers that zero decrypted
    // key material once UnmarshalVT returns.
    backing.fill(0)

    const expectedFirst = [1, 2, 3, 4]
    const expectedSecond = [5, 6, 7, 8]
    expect(Array.from(target.Leaf?.Data ?? [])).toEqual(expectedFirst)
    expect(Array.from(target.Leaves?.[0]?.Data ?? [])).toEqual(expectedFirst)
    expect(Array.from(target.Leaves?.[1]?.Data ?? [])).toEqual(expectedSecond)
    expect(Array.from(target.Entries?.get('first')?.Data ?? [])).toEqual(
      expectedFirst,
    )
    expect(Array.from(target.Entries?.get('second')?.Data ?? [])).toEqual(
      expectedSecond,
    )

    const [remarshalled, err] = MarshalBoundMessageVT(
      ViewHolderBoundMessage as any,
      target,
    )
    expect(err).toBeNull()
    expect(Array.from(remarshalled ?? [])).toEqual(
      Array.from(preScrubBytes ?? []),
    )
  })
})

describe('protobuf-go-lite wire helpers', () => {
  it('encodes and decodes varints', () => {
    const buf = new Uint8Array(4)

    const offset = EncodeVarint(buf, 4, 300)

    expect(offset).toBe(2)
    expect(Array.from(buf.slice(offset))).toEqual([0xac, 0x02])
    expect(SizeOfVarint(300)).toBe(2)
    expect(DecodeVarint(buf, offset)).toEqual([300n, 4, null])
    expect(DecodeVarintInt32(buf, offset)).toEqual([300, 4, null])
    expect(DecodeVarintInt64(buf, offset)).toEqual([300n, 4, null])
    expect(
      DecodeVarintInt64(
        new Uint8Array([
          0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01,
        ]),
        0,
      ),
    ).toEqual([-1n, 10, null])
    expect(DecodeVarintUint32(buf, offset)).toEqual([300, 4, null])
    expect(DecodeVarint(AppendVarint([], -1n), 0)).toEqual([
      0xffffffffffffffffn,
      10,
      null,
    ])
    expect(DecodeVarintInt64(AppendVarint([], 0x7fffffffffffffffn), 0)).toEqual(
      [0x7fffffffffffffffn, 9, null],
    )
    expect(DecodeVarintInt64(AppendVarint([], -1n), 0)).toEqual([-1n, 10, null])
    expect(
      DecodeVarintInt64(AppendVarint([], -0x8000000000000000n), 0),
    ).toEqual([-0x8000000000000000n, 10, null])
    expect(Array.from(AppendVarint([], 300) as number[])).toEqual([0xac, 0x02])
    expect(SizeOfVarint(0xffffffffffffffffn)).toBe(10)
    expect(SizeOfZigzag(-1)).toBe(1)
    expect(SizeOfZigzag(1)).toBe(1)
    expect(SizeOfZigzag(-64)).toBe(1)
    expect(SizeOfZigzag(-65)).toBe(2)
    expect(
      Array.from(AppendVarint([], 0xffffffffffffffffn) as number[]),
    ).toEqual([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01])
    expect(ConsumeVarint(AppendVarint([], 0xffffffffffffffffn))).toEqual([
      0xffffffffffffffffn,
      10,
    ])
  })

  it('decodes fixed64 values', () => {
    expect(DecodeFixed32(new Uint8Array([0x44, 0x33, 0x22, 0x11]), 0)).toEqual([
      0x11223344,
      4,
      null,
    ])

    expect(
      DecodeFixed64(
        new Uint8Array([0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11]),
        0,
      ),
    ).toEqual([0x1122334455667788n, 8, null])

    const [, , err] = DecodeFixed64(new Uint8Array([1, 2, 3]), 0)
    expect(err?.Error()).toBe('unexpected EOF')
  })

  it('skips protobuf records', () => {
    expect(Skip(new Uint8Array([0x08, 0x96, 0x01]))).toEqual([3, null])
    expect(Skip(new Uint8Array([0x12, 0x03, 0x61, 0x62, 0x63]))).toEqual([
      5,
      null,
    ])
    expect(Skip(new Uint8Array([0x0c]))).toEqual([0, ErrUnexpectedEndOfGroup])
  })

  it('reports protobuf wire errors as Go errors', () => {
    expect(ErrInvalidLength?.Error()).toContain('negative length')
    expect(ErrIntOverflow?.Error()).toContain('integer overflow')
    const [, eof] = Skip(new Uint8Array([0x08, 0x80]))
    expect(eof?.Error()).toBe('unexpected EOF')
  })

  it('reports helper-backed protobuf sizes', () => {
    expect(SizeVarintValue(1, 300)).toBe(3)
    expect(SizeVarintNonZero(1, 0)).toBe(0)
    expect(SizeVarintNonZero(1, 300)).toBe(3)
    expect(SizeVarintPtr(1, null)).toBe(0)
    expect(SizeVarintPtr(1, $.varRef(300))).toBe(3)
    expect(SizeVarintSlice(1, [1, 300])).toBe(5)
    expect(SizeVarintPacked(1, [1, 300])).toBe(5)

    expect(SizeZigzagValue(1, -65)).toBe(3)
    expect(SizeZigzagNonZero(1, 0)).toBe(0)
    expect(SizeZigzagPtr(1, $.varRef(-1))).toBe(2)
    expect(SizeZigzagSlice(1, [-1, -65])).toBe(5)
    expect(SizeZigzagPacked(1, [-1, -65])).toBe(5)

    expect(SizeFixed32Value(1)).toBe(5)
    expect(SizeFixed32NonZero(1, 0)).toBe(0)
    expect(SizeFixed32Ptr(1, $.varRef(1))).toBe(5)
    expect(SizeFixed32Slice(1, [1, 2])).toBe(10)
    expect(SizeFixed32Packed(1, [1, 2])).toBe(10)

    expect(SizeFixed64Value(1)).toBe(9)
    expect(SizeFixed64NonZero(1, 0)).toBe(0)
    expect(SizeFixed64Ptr(1, $.varRef(1))).toBe(9)
    expect(SizeFixed64Slice(1, [1, 2])).toBe(18)
    expect(SizeFixed64Packed(1, [1, 2])).toBe(18)

    expect(SizeBoolValue(1)).toBe(2)
    expect(SizeBoolNonZero(1, false)).toBe(0)
    expect(SizeBoolPtr(1, $.varRef(false))).toBe(2)
    expect(SizeBoolSlice(1, [true, false])).toBe(4)
    expect(SizeBoolPacked(1, [true, false])).toBe(4)

    expect(SizeStringValue(1, 'abc')).toBe(5)
    expect(SizeStringNonEmpty(1, '')).toBe(0)
    expect(SizeStringPtr(1, $.varRef('abc'))).toBe(5)
    expect(SizeStringSlice(1, ['a', 'bc'])).toBe(7)

    expect(SizeBytesValue(1, 3)).toBe(5)
    expect(SizeBytesNonEmpty(1, new Uint8Array())).toBe(0)
    expect(SizeBytesPresent(1, new Uint8Array())).toBe(2)
    expect(
      SizeBytesSlice(1, [new Uint8Array([1]), new Uint8Array([2, 3])]),
    ).toBe(7)

    expect(SizeMessage(1, 3)).toBe(5)
    expect(SizeGroup(1, 3)).toBe(5)
  })
})

// These helpers mirror the exported helper functions the protobuf-go-lite
// generator now emits as calls instead of inlining. The generated .pb.gs.ts
// references them by name, so the shim must reproduce their wire semantics.
describe('protobuf-go-lite encode helpers', () => {
  it('writes raw bytes and length-prefixed bytes from the buffer tail', () => {
    const raw = new Uint8Array(3)
    expect(EncodeRawBytes(raw, 3, new Uint8Array([1, 2, 3]))).toBe(0)
    expect(Array.from(raw)).toEqual([1, 2, 3])

    const v = new Uint8Array([9, 8, 7])
    const buf = new Uint8Array(4)
    expect(EncodeBytes(buf, 4, v)).toBe(0)
    expect(Array.from(buf)).toEqual([3, 9, 8, 7])
    const [decoded, end, err] = DecodeBytes(buf, 0, true)
    expect(err).toBeNull()
    expect(end).toBe(4)
    expect(Array.from(decoded as Uint8Array)).toEqual([9, 8, 7])
  })

  it('decodes capped shared bytes and counts tags', () => {
    // Two length-delimited fields 1, then a varint field 2.
    const buf = new Uint8Array([0x0a, 2, 9, 8, 0x0a, 1, 7, 0x10, 5])
    const [capped, end, err] = DecodeBytesCapped(buf, 1)
    expect(err).toBeNull()
    expect(end).toBe(4)
    expect(Array.from(capped as Uint8Array)).toEqual([9, 8])
    expect($.cap(capped)).toBe(2)

    // Appending to the capped slice copies rather than overwriting buf.
    $.append(capped, 1)
    expect(buf[4]).toBe(0x0a)

    expect(CountTag(buf, 0x0an)).toEqual([2, null])
    expect(CountTag(buf, 0x10n)).toEqual([1, null])
  })

  it('copies raw bytes between slice windows', () => {
    const backing = new Uint8Array([0, 0, 0, 0, 0, 0])
    const dst = $.goSlice(backing, 1, 5)
    const src = $.goSlice(new Uint8Array([7, 1, 2, 7]), 1, 3)
    expect(EncodeRawBytes(dst, 3, src)).toBe(1)
    expect(Array.from(backing)).toEqual([0, 0, 1, 2, 0, 0])
    expect(EncodeRawBytes(dst, 2, null)).toBe(2)
    expect(() => EncodeRawBytes(dst, 1, src)).toThrow()
  })

  it('round-trips strings including multibyte runes', () => {
    const buf = new Uint8Array(8)
    const off = EncodeString(buf, 8, 'héllo')
    const [s, end, err] = DecodeString(buf, off)
    expect(err).toBeNull()
    expect(s).toBe('héllo')
    expect(end).toBe(8)
  })

  it('encodes bool and decodes it as a varint bool', () => {
    const t = new Uint8Array(1)
    expect(EncodeBool(t, 1, true)).toBe(0)
    expect(DecodeVarintBool(t, 0)).toEqual([true, 1, null])
    const f = new Uint8Array(1)
    expect(EncodeBool(f, 1, false)).toBe(0)
    expect(DecodeVarintBool(f, 0)).toEqual([false, 1, null])
  })

  it('writes fixed32 and fixed64 little-endian', () => {
    const b32 = new Uint8Array(4)
    expect(EncodeFixed32(b32, 4, 0x11223344)).toBe(0)
    expect(Array.from(b32)).toEqual([0x44, 0x33, 0x22, 0x11])
    const [v32, , err32] = DecodeFixed32(b32, 0)
    expect(err32).toBeNull()
    expect(v32).toBe(0x11223344)

    const b64 = new Uint8Array(8)
    expect(EncodeFixed64(b64, 8, 0x1122334455667788n)).toBe(0)
    expect(Array.from(b64)).toEqual([
      0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11,
    ])
  })

  it('round-trips sint32 zigzag including extremes', () => {
    for (const v of [0, 1, -1, 65, -65, 2147483647, -2147483648]) {
      const buf = new Uint8Array(10)
      const off = EncodeZigzag32(buf, 10, v)
      const [decoded, , err] = DecodeSint32(buf, off)
      expect(err).toBeNull()
      expect(decoded).toBe(v)
    }
  })

  it('round-trips sint64 zigzag including extremes', () => {
    for (const v of [
      0n,
      1n,
      -1n,
      300n,
      -300n,
      9223372036854775807n,
      -9223372036854775808n,
    ]) {
      const buf = new Uint8Array(10)
      const off = EncodeZigzag64(buf, 10, v)
      const [decoded, , err] = DecodeSint64(buf, off)
      expect(err).toBeNull()
      expect(decoded).toBe(v)
    }
  })

  it('packs varints and counts elements', () => {
    const buf = new Uint8Array(4)
    expect(EncodeVarintPacked(buf, 4, [1n, 300n])).toBe(0)
    expect(Array.from(buf)).toEqual([3, 1, 0xac, 0x02])
    const [start, end, err] = DecodeLengthDelimited(buf, 0)
    expect(err).toBeNull()
    expect(start).toBe(1)
    expect(end).toBe(4)
    expect(PackedVarintElementCount($.goSlice(buf, start, end))).toBe(2)
  })

  it('packs zigzag varints', () => {
    const b32 = new Uint8Array(3)
    expect(EncodeZigzag32Packed(b32, 3, [-1, 1])).toBe(0)
    expect(Array.from(b32)).toEqual([2, 1, 2])
    const b64 = new Uint8Array(3)
    expect(EncodeZigzag64Packed(b64, 3, [-1n, 1n])).toBe(0)
    expect(Array.from(b64)).toEqual([2, 1, 2])
  })

  it('counts packed fixed-width elements', () => {
    expect(PackedFixedElementCount(new Uint8Array(12), 4)).toBe(3)
    expect(PackedFixedElementCount(new Uint8Array(10), 4)).toBe(2)
    expect(PackedFixedElementCount(new Uint8Array(8), 0)).toBe(0)
  })

  it('decodes floats from fixed-width bit patterns', () => {
    const f32 = new Uint8Array([0x00, 0x00, 0xc0, 0x3f])
    expect(DecodeFloat32(f32, 0)).toEqual([1.5, 4, null])
    const f64 = new Uint8Array([0, 0, 0, 0, 0, 0, 0xf8, 0x3f])
    expect(DecodeFloat64(f64, 0)).toEqual([1.5, 8, null])
  })

  it('appends decoded bytes and reads unsafe strings', () => {
    const buf = new Uint8Array([3, 97, 98, 99])
    const [bytes, end, err] = DecodeBytesAppend(null, buf, 0)
    expect(err).toBeNull()
    expect(end).toBe(4)
    expect(Array.from(bytes as Uint8Array)).toEqual([97, 98, 99])
    expect(DecodeStringUnsafe(buf, 0)).toEqual(['abc', 4, null])
  })

  it('skips a record bounded by a limit', () => {
    // field 1, wire type 0 (varint), value 150 encoded as 0x96 0x01.
    const rec = new Uint8Array([0x08, 0x96, 0x01])
    expect(SkipWithin(rec, 0, 3)).toEqual([3, null])
    const [, errLimit] = SkipWithin(rec, 0, 2)
    expect(errLimit).not.toBeNull()
  })
})

describe('protobuf-go-lite text helpers', () => {
  it('assembles a proto-text message body', () => {
    const sb = new Builder()
    const initial = TextStartMessage(sb, 'M')
    TextWriteFieldPrefix(sb, initial, 'a')
    TextWriteInt(sb, 1n)
    TextWriteFieldPrefix(sb, initial, 'b')
    TextWriteString(sb, 'hi')
    TextWriteFieldPrefix(sb, initial, 'c')
    TextWriteBool(sb, true)
    expect(TextFinishMessage(sb)).toBe('M {a: 1 b: "hi" c: true}')
  })

  it('writes lists, maps, and sorted keys', () => {
    const sb = new Builder()
    const initial = TextStartMessage(sb, 'L')
    TextWriteListStart(sb, initial, 'items')
    TextWriteListSeparator(sb, 0)
    TextWriteUint(sb, 1n)
    TextWriteListSeparator(sb, 1)
    TextWriteUint(sb, 2n)
    TextWriteListEnd(sb)
    expect(TextFinishMessage(sb)).toBe('L {items: [1, 2]}')

    const keys = TextSortedMapKeys(
      new Map([
        ['b', 1],
        ['a', 2],
      ]),
    )
    expect(Array.from(keys as string[])).toEqual(['a', 'b'])
  })

  it('encodes bytes as base64 and floats via FormatFloat', () => {
    const sb = new Builder()
    TextWriteBytes(sb, new Uint8Array([1, 2, 3]))
    expect(sb.String()).toBe('"AQID"')

    const fb = new Builder()
    TextWriteFloat32(fb, 1.5)
    expect(fb.String()).toBe('1.5')
    const f64 = new Builder()
    TextWriteFloat64(f64, 2.25)
    expect(f64.String()).toBe('2.25')
  })

  it('writes stringer and text-marshaler values', () => {
    const sb = new Builder()
    TextWriteStringer(sb, { String: () => 'ID' })
    expect(sb.String()).toBe('"ID"')

    const mb = new Builder()
    TextWriteTextMarshaler(mb, { MarshalProtoText: () => 'inner {}' })
    expect(mb.String()).toBe('inner {}')
  })
})

describe('generated method installation', () => {
  it('uses the declaring constructor for nil and borrowed receivers and preserves custom methods', () => {
    class Installed {
      static __protobufTypeScriptMessage = {
        ...createMessageType('test.Installed', () => []),
        toBinary: () => new Uint8Array([7]),
      }
      declare MarshalVT: () => [$.Slice<number>, $.GoError]
      declare MarshalToVT: (data: $.Slice<number>) => [number, $.GoError]
      declare EqualMessageVT: (other: any) => boolean
      declare String: () => string

      EqualVT(other: Installed | null) {
        return this === other
      }

      SizeVT() {
        return 2
      }

      MarshalToSizedBufferVT(data: $.Slice<number>): [number, $.GoError] {
        expect($.len(data)).toBe(2)
        $.sliceElems(data!)[$.sliceSlot(data!, 0)] = 7
        $.sliceElems(data!)[$.sliceSlot(data!, 1)] = 8
        return [2, null]
      }

      MarshalProtoText() {
        return 'custom text'
      }

      MarshalJSON() {
        return 'custom'
      }
    }
    BindMessageMethods(Installed, '*test.Installed', [
      'EqualMessageVT',
      'MarshalToVT',
      'MarshalVT',
      'String',
    ])
    for (const receiver of [null, {}, new Installed()]) {
      const [data, err] = Installed.prototype.MarshalVT.call(
        receiver as Installed,
      )
      expect(err).toBeNull()
      expect(Array.from(data ?? [])).toEqual([7])

      const buffer = new Uint8Array([0, 0, 99, 99])
      expect(
        Installed.prototype.MarshalToVT.call(receiver as Installed, buffer),
      ).toEqual([2, null])
      expect(Array.from(buffer)).toEqual([7, 8, 99, 99])
      expect(Installed.prototype.String.call(receiver as Installed)).toBe(
        'custom text',
      )
    }
    const instance = new Installed()
    const boxed = $.interfaceValue(instance, '*test.Installed')
    expect(instance.EqualMessageVT(boxed)).toBe(true)
    expect(new Installed().EqualMessageVT(boxed)).toBe(false)
    expect(instance.EqualMessageVT({})).toBe(false)
    expect(instance.EqualMessageVT(null)).toBe(false)
    expect(
      Installed.prototype.EqualMessageVT.call(
        null as any,
        $.interfaceValue(null, '*test.Installed'),
      ),
    ).toBe(true)
    expect(new Installed().MarshalJSON()).toBe('custom')
    expect(Object.keys(new Installed())).not.toContain('MarshalVT')
    expect(
      Object.getOwnPropertyDescriptor(Installed.prototype, 'MarshalVT'),
    ).toMatchObject({
      enumerable: false,
      configurable: true,
      writable: true,
    })
  })
})
