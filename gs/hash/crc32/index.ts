import * as $ from '@goscript/builtin/index.js'

export const Size = 4

export const IEEE = 0xedb88320
export const Castagnoli = 0x82f63b78
export const Koopman = 0xeb31d82e

export type Table = number[]

type TablePointer = $.VarRef<Table> | null

// SlicingTable holds the eight slicing-by-8 tables of a polynomial back to
// back. Its signed words keep the update loop in int32 arithmetic, which
// JavaScript engines run far faster than the doubles a uint32 can become.
type SlicingTable = Int32Array

const magic = new Uint8Array([0x63, 0x72, 0x63, 0x01])
const marshaledSize = 12

export let IEEETable: TablePointer = $.varRef(makeSimpleTable(IEEE))
const castagnoliTable = $.varRef(makeSimpleTable(Castagnoli))
const ieeeTable8 = makeSlicingTable(IEEE)
const castagnoliTable8 = makeSlicingTable(Castagnoli)

export function __goscript_set_IEEETable(value: TablePointer): void {
  IEEETable = value
}

class Digest {
  constructor(
    private crc: number,
    private readonly table: TablePointer,
  ) {}

  Write(data: $.Bytes): [number, $.GoError] {
    const bytes = $.bytesToUint8Array(data)
    this.crc = updateBytes(this.crc, this.table, bytes)
    return [bytes.length, null]
  }

  async Sum(prefix: $.Bytes | null): Promise<$.Bytes> {
    const crc = this.crc >>> 0
    return $.append(
      $.bytesToUint8Array(prefix),
      (crc >>> 24) & 0xff,
      (crc >>> 16) & 0xff,
      (crc >>> 8) & 0xff,
      crc & 0xff,
      $.byteSliceHint,
    )
  }

  Sum32(): number {
    return this.crc >>> 0
  }

  Reset(): void {
    this.crc = 0
  }

  Size(): number {
    return Size
  }

  BlockSize(): number {
    return 1
  }

  AppendBinary(prefix: $.Bytes | null): [$.Bytes, $.GoError] {
    const state = new Uint8Array(marshaledSize)
    state.set(magic)
    writeBE32(state, 4, tableSum(this.table))
    writeBE32(state, 8, this.crc)
    return [
      $.appendSlice($.bytesToUint8Array(prefix), state, $.byteSliceHint),
      null,
    ]
  }

  MarshalBinary(): [$.Bytes, $.GoError] {
    return this.AppendBinary(null)
  }

  UnmarshalBinary(data: $.Bytes): $.GoError {
    const state = $.bytesToUint8Array(data)
    if (
      state.length < magic.length ||
      state[0] !== magic[0] ||
      state[1] !== magic[1] ||
      state[2] !== magic[2] ||
      state[3] !== magic[3]
    ) {
      return $.newError('hash/crc32: invalid hash state identifier')
    }
    if (state.length !== marshaledSize) {
      return $.newError('hash/crc32: invalid hash state size')
    }
    if (tableSum(this.table) !== readBE32(state, 4)) {
      return $.newError('hash/crc32: tables do not match')
    }
    this.crc = readBE32(state, 8)
    return null
  }

  Clone(): [Digest, $.GoError] {
    const clone = new Digest(this.crc, this.table)
    return [$.interfaceValue(clone, '*crc32.digest'), null]
  }
}

export function MakeTable(poly: number): TablePointer {
  switch (poly >>> 0) {
    case IEEE:
      return IEEETable
    case Castagnoli:
      return castagnoliTable
    default:
      return $.varRef(makeSimpleTable(poly))
  }
}

export function New(table: TablePointer): Digest {
  return $.interfaceValue(new Digest(0, table), '*crc32.digest')
}

export function NewIEEE(): Digest {
  return New(IEEETable)
}

export function Update(
  crc: number,
  table: TablePointer,
  data: $.Bytes,
): number {
  return updateBytes(crc, table, $.bytesToUint8Array(data))
}

export function Checksum(data: $.Bytes, table: TablePointer): number {
  return Update(0, table, data)
}

export function ChecksumIEEE(data: $.Bytes): number {
  return slicingUpdateBytes(0, ieeeTable8, $.bytesToUint8Array(data))
}

function makeSimpleTable(poly: number): Table {
  const table = new Array<number>(256)
  poly >>>= 0
  for (let i = 0; i < table.length; i++) {
    let crc = i
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 1) === 1 ? ((crc >>> 1) ^ poly) >>> 0 : (crc >>> 1) >>> 0
    }
    table[i] = crc
  }
  return table
}

// makeSlicingTable builds the slicing-by-8 tables of poly. Table k maps a
// byte to its CRC after k more zero bytes.
function makeSlicingTable(poly: number): SlicingTable {
  const tables = new Int32Array(8 * 256)
  tables.set(makeSimpleTable(poly))
  for (let i = 0; i < 256; i++) {
    let crc = tables[i]
    for (let k = 1; k < 8; k++) {
      crc = tables[crc & 0xff] ^ (crc >>> 8)
      tables[k * 256 + i] = crc
    }
  }
  return tables
}

function updateBytes(
  crc: number,
  table: TablePointer,
  bytes: Uint8Array,
): number {
  crc >>>= 0
  if (table === IEEETable) {
    return slicingUpdateBytes(crc, ieeeTable8, bytes)
  }
  if (table === castagnoliTable) {
    return slicingUpdateBytes(crc, castagnoliTable8, bytes)
  }
  return simpleUpdateBytes(crc, table, bytes)
}

// simpleUpdateBytes folds bytes into crc one byte per step. Like Go, it reads
// the table only when there are bytes to fold.
function simpleUpdateBytes(
  crc: number,
  table: TablePointer,
  bytes: Uint8Array,
): number {
  if (bytes.length === 0) {
    return crc
  }
  const words = $.pointerValue(table)
  crc = ~crc >>> 0
  for (const b of bytes) {
    crc = (words[(crc & 0xff) ^ b] ^ (crc >>> 8)) >>> 0
  }
  return ~crc >>> 0
}

// slicingUpdateBytes folds bytes into crc eight bytes per step.
function slicingUpdateBytes(
  crc: number,
  tables: SlicingTable,
  bytes: Uint8Array,
): number {
  let c = ~crc
  let i = 0
  const n = bytes.length
  for (const end = n - (n & 7); i < end; i += 8) {
    c ^=
      bytes[i] |
      (bytes[i + 1] << 8) |
      (bytes[i + 2] << 16) |
      (bytes[i + 3] << 24)
    c =
      tables[1792 + (c & 0xff)] ^
      tables[1536 + ((c >>> 8) & 0xff)] ^
      tables[1280 + ((c >>> 16) & 0xff)] ^
      tables[1024 + (c >>> 24)] ^
      tables[768 + bytes[i + 4]] ^
      tables[512 + bytes[i + 5]] ^
      tables[256 + bytes[i + 6]] ^
      tables[bytes[i + 7]]
  }
  for (; i < n; i++) {
    c = tables[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  }
  return ~c >>> 0
}

function tableSum(table: TablePointer): number {
  if (table == null) {
    return 0
  }
  const words = $.pointerValue(table)
  const bytes = new Uint8Array(256 * 4)
  for (let i = 0; i < 256; i++) {
    writeBE32(bytes, i * 4, words[i])
  }
  return slicingUpdateBytes(0, ieeeTable8, bytes)
}

function writeBE32(bytes: Uint8Array, offset: number, value: number): void {
  value >>>= 0
  bytes[offset] = value >>> 24
  bytes[offset + 1] = value >>> 16
  bytes[offset + 2] = value >>> 8
  bytes[offset + 3] = value
}

function readBE32(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  )
}
