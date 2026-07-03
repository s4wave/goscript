import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import type * as io from '@goscript/io/index.js'

export interface Marshaler {
  MarshalJSON(): [$.Slice<number>, $.GoError]
}

export interface Unmarshaler {
  UnmarshalJSON(data: $.Slice<number>): $.GoError
}

export type RawMessage = $.Bytes
export type Number = string
export type Token = unknown
export type Delim = number

class jsonError extends Error {
  public Error(): string {
    return this.message
  }
}

type decodeOptions = {
  disallowUnknownFields?: boolean
  useNumber?: boolean
}

type fieldMetadata = {
  key: string
  name: string
  tag?: string
  type?: unknown
}

export class SyntaxError extends jsonError {
  public Offset: number

  constructor(init?: Partial<{ Offset: number; Message: string }>) {
    super(init?.Message ?? 'invalid character in JSON')
    this.name = 'SyntaxError'
    this.Offset = init?.Offset ?? 0
  }
}

// Register *json.SyntaxError so a Go `err.(*json.SyntaxError)` assertion in
// compiled code resolves to this class and exposes the Offset field.
$.registerStructType(
  'json.SyntaxError',
  new SyntaxError(),
  [
    {
      name: 'Error',
      args: [],
      returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
    },
  ],
  SyntaxError,
  [
    {
      name: 'Offset',
      key: 'Offset',
      type: { kind: $.TypeKind.Basic, name: 'int64' },
    },
  ],
)

export class InvalidUTF8Error extends jsonError {
  public S: string

  constructor(init?: Partial<{ S: string }>) {
    super(`json: invalid UTF-8 in string: ${init?.S ?? ''}`)
    this.name = 'InvalidUTF8Error'
    this.S = init?.S ?? ''
  }
}

export class InvalidUnmarshalError extends jsonError {
  public Type: unknown

  constructor(init?: Partial<{ Type: unknown }>) {
    super('json: Unmarshal(non-pointer)')
    this.name = 'InvalidUnmarshalError'
    this.Type = init?.Type ?? null
  }
}

export class MarshalerError extends jsonError {
  public Type: unknown
  public Err: $.GoError

  constructor(init?: Partial<{ Type: unknown; Err: $.GoError }>) {
    super(`json: error calling MarshalJSON: ${init?.Err?.Error?.() ?? ''}`)
    this.name = 'MarshalerError'
    this.Type = init?.Type ?? null
    this.Err = init?.Err ?? null
  }

  public Unwrap(): $.GoError {
    return this.Err
  }
}

export class UnmarshalFieldError extends jsonError {
  public Key: string
  public Type: unknown
  public Field: unknown

  constructor(init?: Partial<{ Key: string; Type: unknown; Field: unknown }>) {
    super(`json: cannot unmarshal object key ${init?.Key ?? ''}`)
    this.name = 'UnmarshalFieldError'
    this.Key = init?.Key ?? ''
    this.Type = init?.Type ?? null
    this.Field = init?.Field ?? null
  }
}

export class UnmarshalTypeError extends jsonError {
  public Value: string
  public Type: unknown
  public Offset: number
  public Struct: string
  public Field: string

  constructor(
    init?: Partial<{
      Value: string
      Type: unknown
      Offset: number
      Struct: string
      Field: string
    }>,
  ) {
    super(`json: cannot unmarshal ${init?.Value ?? ''}`)
    this.name = 'UnmarshalTypeError'
    this.Value = init?.Value ?? ''
    this.Type = init?.Type ?? null
    this.Offset = init?.Offset ?? 0
    this.Struct = init?.Struct ?? ''
    this.Field = init?.Field ?? ''
  }
}

export class UnsupportedTypeError extends jsonError {
  public Type: unknown

  constructor(init?: Partial<{ Type: unknown }>) {
    super('json: unsupported type')
    this.name = 'UnsupportedTypeError'
    this.Type = init?.Type ?? null
  }
}

export class UnsupportedValueError extends jsonError {
  public Value: unknown
  public Str: string

  constructor(init?: Partial<{ Value: unknown; Str: string }>) {
    super(`json: unsupported value: ${init?.Str ?? ''}`)
    this.name = 'UnsupportedValueError'
    this.Value = init?.Value ?? null
    this.Str = init?.Str ?? ''
  }
}

export class Decoder {
  private disallowUnknownFields = false
  private inputOffset = 0
  private useNumber = false
  // buf holds the fully buffered input; pos is the index of the next unread
  // character, so successive Decode/Token calls consume one value at a time and
  // leave the remainder buffered, like Go's streaming Decoder.
  private buf = ''
  private pos = 0
  private filled = false
  private readErr: $.GoError = null

  public constructor(private readonly reader: io.Reader) {}

  private fill(): void {
    if (this.filled) {
      return
    }
    this.filled = true
    const [data, err] = readAllSync(this.reader)
    if (err !== null) {
      this.readErr = err
      return
    }
    this.buf = $.bytesToString(data)
  }

  public Decode(v: unknown): $.GoError {
    this.fill()
    this.pos = skipJSONWhitespace(this.buf, this.pos)
    if (this.pos >= this.buf.length) {
      return this.readErr ?? $.newError('EOF')
    }
    let end: number
    try {
      ;[, end] = scanJSONValue(this.buf, this.pos, this.useNumber)
    } catch (err) {
      return goError(err)
    }
    const raw = $.stringToBytes(this.buf.slice(this.pos, end))
    this.pos = end
    this.inputOffset = jsonByteOffset(this.buf, end)
    return decode(raw, v, {
      disallowUnknownFields: this.disallowUnknownFields,
      useNumber: this.useNumber,
    })
  }

  public Buffered(): io.Reader {
    this.fill()
    return bytes.NewBufferString(this.buf.slice(this.pos))!
  }

  public DisallowUnknownFields(): void {
    this.disallowUnknownFields = true
  }

  public InputOffset(): number {
    return this.inputOffset
  }

  public More(): boolean {
    this.fill()
    const next = skipJSONWhitespace(this.buf, this.pos)
    if (next >= this.buf.length) {
      return false
    }
    const c = this.buf[next]
    return c !== ']' && c !== '}'
  }

  public Token(): [Token, $.GoError] {
    this.fill()
    let cursor = skipJSONWhitespace(this.buf, this.pos)
    // Object/array separators are implicit in Go's token stream; skip them.
    while (cursor < this.buf.length) {
      const sep = this.buf[cursor]
      if (sep === ',' || sep === ':') {
        cursor++
        cursor = skipJSONWhitespace(this.buf, cursor)
        continue
      }
      break
    }
    this.pos = cursor
    if (this.pos >= this.buf.length) {
      return [null, this.readErr ?? $.newError('EOF')]
    }
    const c = this.buf[this.pos]
    if (c === '{' || c === '[' || c === '}' || c === ']') {
      this.pos++
      this.inputOffset = jsonByteOffset(this.buf, this.pos)
      return [c.charCodeAt(0), null]
    }
    try {
      const [value, end] = scanJSONValue(this.buf, this.pos, this.useNumber)
      this.pos = end
      this.inputOffset = jsonByteOffset(this.buf, end)
      return [value, null]
    } catch (err) {
      return [null, goError(err)]
    }
  }

  public UseNumber(): void {
    this.useNumber = true
  }
}

export class Encoder {
  private escapeHTML = true
  private indent = ''
  private prefix = ''

  public constructor(private readonly writer: io.Writer) {}

  public Encode(v: unknown): $.GoError {
    const [data, err] =
      this.indent === '' && this.prefix === '' ?
        marshalBytes(v, '', '', this.escapeHTML)
      : marshalBytes(v, this.prefix, this.indent, this.escapeHTML)
    if (err !== null) {
      return err
    }

    const out = $.stringToBytes($.bytesToString(data) + '\n')
    const [n, writeErr] = this.writer.Write(out)
    if (writeErr !== null) {
      return writeErr
    }
    if (n < $.len(out)) {
      return $.newError('short write')
    }
    return null
  }

  public SetEscapeHTML(on: boolean): void {
    this.escapeHTML = on
  }

  public SetIndent(prefix: string, indent: string): void {
    this.prefix = prefix
    this.indent = indent
  }
}

export function NewDecoder(r: io.Reader): Decoder {
  return new Decoder(r)
}

export function NewEncoder(w: io.Writer): Encoder {
  return new Encoder(w)
}

$.registerInterfaceType('json.Marshaler', null, [
  {
    name: 'MarshalJSON',
    args: [],
    returns: [
      {
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      { type: 'GoError' },
    ],
  },
])

$.registerInterfaceType('json.Unmarshaler', null, [
  {
    name: 'UnmarshalJSON',
    args: [
      {
        name: 'data',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [{ type: 'GoError' }],
  },
])

// RawJSON wraps a pre-serialized JSON fragment (from a Marshaler or RawMessage)
// so the encoder can emit its exact token spelling instead of round-tripping it
// through JSON.parse/stringify, which would normalize numbers like 1e+00 to 1.
class RawJSON {
  constructor(public raw: string) {}
}

// stripJSONWhitespace removes insignificant whitespace from a JSON document
// while leaving string contents and every number/literal token byte-for-byte
// intact, matching Go's json.Compact.
function stripJSONWhitespace(text: string): string {
  let out = ''
  let inStr = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inStr) {
      out += c
      if (c === '\\') {
        out += text[++i] ?? ''
      } else if (c === '"') {
        inStr = false
      }
      continue
    }
    if (c === '"') {
      inStr = true
      out += c
      continue
    }
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      continue
    }
    out += c
  }
  return out
}

// indentJSON pretty-prints a compact JSON document, preserving every token
// spelling, matching Go's json.Indent layout: a space after a colon, newlines
// with prefix + indent*depth after structural characters, and empty {} / []
// left inline.
function indentJSON(compact: string, prefix: string, indent: string): string {
  let out = ''
  let depth = 0
  let inStr = false
  const newline = (d: number) => '\n' + prefix + indent.repeat(d)
  for (let i = 0; i < compact.length; i++) {
    const c = compact[i]
    if (inStr) {
      out += c
      if (c === '\\') {
        out += compact[++i] ?? ''
      } else if (c === '"') {
        inStr = false
      }
      continue
    }
    switch (c) {
      case '"':
        inStr = true
        out += c
        break
      case '{':
      case '[':
        if (compact[i + 1] === '}' || compact[i + 1] === ']') {
          out += c
        } else {
          depth++
          out += c + newline(depth)
        }
        break
      case '}':
      case ']':
        if (compact[i - 1] === '{' || compact[i - 1] === '[') {
          out += c
        } else {
          depth--
          out += newline(depth) + c
        }
        break
      case ',':
        out += c + newline(depth)
        break
      case ':':
        out += ': '
        break
      default:
        out += c
    }
  }
  return out
}

// encodeJSON serializes a marshal-prepared value to compact JSON. RawJSON
// fragments are emitted verbatim; all other values use plain token forms. The
// caller applies HTML escaping and indentation afterward, matching Go's
// Marshal-then-indent pipeline.
function encodeJSON(v: unknown): string {
  if (v instanceof RawJSON) {
    return v.raw
  }
  if (v === null || v === undefined) {
    return 'null'
  }
  const t = typeof v
  if (t === 'boolean') {
    return v ? 'true' : 'false'
  }
  if (t === 'number') {
    return JSON.stringify(v)
  }
  if (t === 'bigint') {
    return (v as bigint).toString()
  }
  if (t === 'string') {
    return JSON.stringify(v)
  }
  if (Array.isArray(v)) {
    return '[' + v.map(encodeJSON).join(',') + ']'
  }
  if (t === 'object') {
    const parts: string[] = []
    for (const [key, value] of Object.entries(v as Record<string, unknown>)) {
      parts.push(JSON.stringify(key) + ':' + encodeJSON(value))
    }
    return '{' + parts.join(',') + '}'
  }
  return JSON.stringify(v)
}

const JSON_WHITESPACE = ' \t\n\r'

// jsonByteOffset returns the Go byte offset (UTF-8) of character index i, so a
// SyntaxError reports the same Offset Go would for multibyte input.
function jsonByteOffset(text: string, i: number): number {
  return $.len($.stringToBytes(text.slice(0, i)))
}

function jsonSyntaxError(text: string, i: number, msg: string): SyntaxError {
  return new SyntaxError({ Offset: jsonByteOffset(text, i), Message: msg })
}

function skipJSONWhitespace(text: string, i: number): number {
  while (i < text.length && JSON_WHITESPACE.includes(text[i])) {
    i++
  }
  return i
}

// scanJSONValue parses one JSON value beginning at the first non-whitespace
// character at or after start, returning the decoded value and the index just
// past it. Numbers decode to JS numbers, or to their exact json.Number source
// literal when useNumber is set. Malformed input throws a SyntaxError whose
// Offset is the Go byte offset of the offending character.
function scanJSONValue(
  text: string,
  start: number,
  useNumber: boolean,
): [unknown, number] {
  let i = start
  const skipWs = () => {
    i = skipJSONWhitespace(text, i)
  }
  const fail = (msg = 'invalid character'): never => {
    // Go's Offset counts bytes read up to and including the offending byte.
    const at = Math.min(i + 1, text.length)
    throw jsonSyntaxError(text, at, msg)
  }
  const parseString = (): string => {
    let raw = text[i++] // opening quote
    while (i < text.length) {
      const c = text[i++]
      raw += c
      if (c === '\\') {
        raw += text[i++] ?? ''
      } else if (c === '"') {
        try {
          return JSON.parse(raw) as string
        } catch {
          i -= raw.length
          return fail('invalid string literal')
        }
      }
    }
    return fail('unexpected end of JSON input')
  }
  const parseValue = (): unknown => {
    skipWs()
    if (i >= text.length) {
      return fail('unexpected end of JSON input')
    }
    const c = text[i]
    if (c === '{') {
      i++
      const obj: Record<string, unknown> = {}
      skipWs()
      if (text[i] === '}') {
        i++
        return obj
      }
      for (;;) {
        skipWs()
        if (text[i] !== '"') {
          return fail()
        }
        const key = parseString()
        skipWs()
        if (text[i++] !== ':') {
          i--
          return fail("expected ':' after object key")
        }
        obj[key] = parseValue()
        skipWs()
        const sep = text[i++]
        if (sep === '}') {
          return obj
        }
        if (sep !== ',') {
          i--
          return fail("expected ',' or '}' after object value")
        }
      }
    }
    if (c === '[') {
      i++
      const arr: unknown[] = []
      skipWs()
      if (text[i] === ']') {
        i++
        return arr
      }
      for (;;) {
        arr.push(parseValue())
        skipWs()
        const sep = text[i++]
        if (sep === ']') {
          return arr
        }
        if (sep !== ',') {
          i--
          return fail("expected ',' or ']' after array element")
        }
      }
    }
    if (c === '"') {
      return parseString()
    }
    if (text.startsWith('true', i)) {
      i += 4
      return true
    }
    if (text.startsWith('false', i)) {
      i += 5
      return false
    }
    if (text.startsWith('null', i)) {
      i += 4
      return null
    }
    const numStart = i
    if (c === '-') {
      i++
    }
    while (i < text.length && '0123456789.eE+-'.includes(text[i])) {
      i++
    }
    if (i === numStart) {
      return fail()
    }
    const literal = text.slice(numStart, i)
    return useNumber ? literal : Number(literal)
  }
  const value = parseValue()
  return [value, i]
}

export function Marshal(v: unknown): [$.Slice<number>, $.GoError] {
  return marshalBytes(v, '', '', true)
}

function marshalBytes(
  v: unknown,
  prefix: string,
  indent: string,
  escapeHTML: boolean,
): [$.Slice<number>, $.GoError] {
  try {
    let text = encodeJSON(marshalValue(v))
    if (escapeHTML) {
      text = escapeHTMLString(text)
    }
    if (indent !== '' || prefix !== '') {
      text = indentJSON(text, prefix, indent)
    }
    return [$.stringToBytes(text), null]
  } catch (err) {
    return [null, goError(err)]
  }
}

export function Compact(
  dst: bytes.Buffer | $.VarRef<bytes.Buffer>,
  src: $.Slice<number>,
): $.GoError {
  try {
    const source = $.bytesToString(src)
    JSON.parse(source) // validate; Go's Compact rejects malformed input
    const text = stripJSONWhitespace(source)
    const [, err] = $.pointerValue<bytes.Buffer>(dst).Write(
      $.stringToBytes(text),
    )
    return err
  } catch (err) {
    return goError(err)
  }
}

export function HTMLEscape(
  dst: bytes.Buffer | $.VarRef<bytes.Buffer>,
  src: $.Slice<number>,
): void {
  const escaped = $.bytesToString(src).replace(/[<>&\u2028\u2029]/g, (char) => {
    switch (char) {
      case '<':
        return '\\u003c'
      case '>':
        return '\\u003e'
      case '&':
        return '\\u0026'
      case '\u2028':
        return '\\u2028'
      case '\u2029':
        return '\\u2029'
      default:
        return char
    }
  })
  $.pointerValue<bytes.Buffer>(dst).Write($.stringToBytes(escaped))
}

export function Indent(
  dst: bytes.Buffer | $.VarRef<bytes.Buffer>,
  src: $.Slice<number>,
  prefix: string,
  indent: string,
): $.GoError {
  try {
    const source = $.bytesToString(src)
    JSON.parse(source) // validate; Go's Indent rejects malformed input
    const compact = stripJSONWhitespace(source)
    // Go's Indent copies trailing whitespace after the value verbatim.
    const trailing = source.slice(source.trimEnd().length)
    const text = indentJSON(compact, prefix, indent) + trailing
    const [, err] = $.pointerValue<bytes.Buffer>(dst).Write(
      $.stringToBytes(text),
    )
    return err
  } catch (err) {
    return goError(err)
  }
}

export function MarshalIndent(
  v: unknown,
  prefix: string,
  indent: string,
): [$.Slice<number>, $.GoError] {
  return marshalBytes(v, prefix, indent, true)
}

export function Unmarshal(data: $.Slice<number>, v: unknown): $.GoError {
  return decode(data, v, {})
}

function decode(
  data: $.Slice<number>,
  v: unknown,
  opts: decodeOptions,
): $.GoError {
  try {
    if (!validUnmarshalTarget(v)) {
      return $.toGoError(new InvalidUnmarshalError())
    }
    const unmarshaler = unmarshalJSONTarget(v)
    if (unmarshaler !== null) {
      const err = unmarshaler.UnmarshalJSON(data)
      if (err instanceof Promise) {
        return $.newError('json: asynchronous UnmarshalJSON is unsupported')
      }
      return err
    }
    assignDecodedValue(v, parseJSON(data, opts), opts)
    return null
  } catch (err) {
    return goError(err)
  }
}

export function Valid(data: $.Slice<number>): boolean {
  try {
    JSON.parse($.bytesToString(data))
    return true
  } catch {
    return false
  }
}

export function RawMessage_MarshalJSON(
  m: RawMessage,
): [$.Slice<number>, $.GoError] {
  if (m === null) {
    return [$.stringToBytes('null'), null]
  }
  const out = $.makeSlice<number>($.len(m), undefined, 'byte')
  $.copy(out, m)
  return [out, null]
}

export function RawMessage_UnmarshalJSON(
  m: $.VarRef<RawMessage> | RawMessage | null,
  data: $.Slice<number>,
): $.GoError {
  const out = $.makeSlice<number>($.len(data), undefined, 'byte')
  $.copy(out, data)
  if ($.isVarRef(m)) {
    m.value = out
  }
  return null
}

export function Number_Float64(n: Number): [number, $.GoError] {
  if (!isValidFloat(n)) {
    return [0, $.newError(`strconv.ParseFloat: parsing "${n}": invalid syntax`)]
  }
  if (/^[+-]?nan$/i.test(n)) {
    return [Number.NaN, null]
  }
  if (/^\+?inf(?:inity)?$/i.test(n)) {
    return [Infinity, null]
  }
  if (/^-inf(?:inity)?$/i.test(n)) {
    return [-Infinity, null]
  }
  const value = Number.parseFloat(n)
  if (Number.isNaN(value)) {
    return [0, $.newError(`strconv.ParseFloat: parsing "${n}": invalid syntax`)]
  }
  if (!Number.isFinite(value) && !/^[+-]?(?:inf(?:inity)?|nan)$/i.test(n)) {
    return [
      value,
      $.newError(`strconv.ParseFloat: parsing "${n}": value out of range`),
    ]
  }
  return [value, null]
}

export function Number_Int64(n: Number): [bigint, $.GoError] {
  if (!/^[+-]?\d+$/.test(n)) {
    return [0n, $.newError(`strconv.ParseInt: parsing "${n}": invalid syntax`)]
  }
  const value = BigInt(n)
  const min = -(1n << 63n)
  const max = (1n << 63n) - 1n
  if (value < min || value > max) {
    const clamped = value < min ? min : max
    return [
      clamped,
      $.newError(`strconv.ParseInt: parsing "${n}": value out of range`),
    ]
  }
  return [value, null]
}

export function Number_String(n: Number): string {
  return n
}

function isValidFloat(value: string): boolean {
  return /^[+-]?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|inf(?:inity)?|nan)$/i.test(
    value,
  )
}

function readAllSync(r: io.Reader): [$.Bytes, $.GoError] {
  const chunks: number[] = []
  const buf = $.makeSlice<number>(512, undefined, 'byte')
  while (true) {
    const read = r.Read(buf)
    if (read instanceof Promise) {
      return [null, $.newError('json: asynchronous reader is unsupported')]
    }
    const [n, err] = read
    if (n > 0) {
      chunks.push(...$.bytesToUint8Array($.goSlice(buf, 0, n)))
    }
    if (err !== null) {
      if (err.Error() === 'EOF') {
        return [new Uint8Array(chunks), null]
      }
      return [null, err]
    }
  }
}

function marshalValue(v: unknown): unknown {
  const marshaler = marshalJSONTarget(v)
  if (marshaler !== null) {
    const result = marshaler.MarshalJSON()
    if (result instanceof Promise) {
      throw new MarshalerError({
        Err: $.newError('json: asynchronous MarshalJSON is unsupported'),
      })
    }
    const [data, err] = result
    if (err !== null) {
      throw new MarshalerError({ Err: err })
    }
    const raw = $.bytesToString(data)
    try {
      JSON.parse(raw) // validate; preserve exact token spelling below
    } catch (parseErr) {
      throw new MarshalerError({ Err: goError(parseErr) })
    }
    return new RawJSON(stripJSONWhitespace(raw))
  }
  if ($.isVarRef(v)) {
    return marshalValue(v.value)
  }
  if (v === null || v === undefined) {
    return null
  }
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) {
      throw new UnsupportedValueError({ Value: v, Str: String(v) })
    }
    return v
  }
  if (typeof v !== 'object') {
    return v
  }
  if (v instanceof Uint8Array) {
    return base64Encode(v)
  }
  if (Array.isArray(v)) {
    return v.map(marshalValue)
  }
  if (v instanceof Map) {
    const out: Record<string, unknown> = {}
    for (const [key, value] of v.entries()) {
      out[String(key)] = marshalValue(value)
    }
    return out
  }
  if (!isStructValue(v)) {
    return v
  }

  const out: Record<string, unknown> = {}
  for (const field of structFields(v)) {
    const ref = v._fields[field.key]
    if (ref === undefined) {
      continue
    }
    const jsonName = jsonFieldName(field.name, field.tag)
    if (jsonName === '') {
      continue
    }
    out[jsonName] = marshalFieldValue(ref.value, field.type)
  }
  return out
}

function marshalFieldValue(value: unknown, fieldType: unknown): unknown {
  if (isRawMessageType(fieldType)) {
    const target = $.isVarRef(value) ? value.value : value
    if (target === null || target === undefined) {
      return null
    }
    const raw = $.bytesToString(target as $.Slice<number>)
    if (raw === '') {
      return null
    }
    try {
      JSON.parse(raw) // validate; preserve exact token spelling below
    } catch (err) {
      throw new MarshalerError({ Err: goError(err) })
    }
    return new RawJSON(stripJSONWhitespace(raw))
  }
  return marshalValue(value)
}

function marshalJSONTarget(value: unknown): Marshaler | null {
  const target = $.isVarRef(value) ? value.value : value
  if (target === null || target === undefined) {
    return null
  }
  if (typeof target !== 'object' && typeof target !== 'function') {
    return null
  }
  const method = Reflect.get(target, 'MarshalJSON')
  return typeof method === 'function' ? (target as Marshaler) : null
}

function unmarshalJSONTarget(value: unknown): Unmarshaler | null {
  const target = $.isVarRef(value) ? value.value : value
  if (target === null || target === undefined) {
    return null
  }
  if (typeof target !== 'object' && typeof target !== 'function') {
    return null
  }
  const method = Reflect.get(target, 'UnmarshalJSON')
  return typeof method === 'function' ? (target as Unmarshaler) : null
}

function validUnmarshalTarget(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false
  }
  if ($.isVarRef(value)) {
    return true
  }
  return unmarshalJSONTarget(value) !== null || isStructValue(value)
}

function parseJSON(data: $.Slice<number>, opts: decodeOptions): unknown {
  const text = $.bytesToString(data)
  const [value, end] = scanJSONValue(text, 0, !!opts.useNumber)
  const rest = skipJSONWhitespace(text, end)
  if (rest !== text.length) {
    throw jsonSyntaxError(
      text,
      rest + 1,
      'invalid character after top-level value',
    )
  }
  return value
}

function assignDecodedValue(
  target: unknown,
  decoded: unknown,
  opts: decodeOptions,
): void {
  if ($.isVarRef(target)) {
    const unmarshaler = unmarshalJSONTarget(target.value)
    if (unmarshaler !== null) {
      const err = unmarshaler.UnmarshalJSON(
        $.stringToBytes(JSON.stringify(decoded)),
      )
      if (err !== null) {
        throw err
      }
      return
    }
    if (isStructValue(target.value) && isPlainObject(decoded)) {
      assignStructFields(target.value, decoded, opts)
      return
    }
    if (target.value instanceof Uint8Array && typeof decoded === 'string') {
      target.value = base64Decode(decoded)
      return
    }
    // A top-level map/slice var carries its Go type spelling (including its
    // element type) via __goType, which the runtime boxes onto Unmarshal's
    // `any` target (see unmarshalTargetGoType/goTypeDescriptor below).
    // Decoding per that spelling, instead of the shape-driven decode below,
    // is what makes e.g. `var m map[string]json.RawMessage` or
    // `var m map[string]*Property` populate real typed elements instead of
    // plain JS objects/strings.
    const spelling = unmarshalTargetGoType(target)
    if (spelling !== null) {
      const desc = goTypeDescriptor(spelling)
      // An anonymous (inline, unnamed) struct target, e.g. `var loose
      // struct{ Name string "json:\"name\"" }`, carries no _fields/registered
      // type metadata of its own to decode against, so it needs its json
      // tags read from the parsed __goType spelling instead. See
      // assignAnonymousStructFields below.
      const anonFields = anonymousStructFields(desc)
      if (
        anonFields !== null &&
        isPlainObject(decoded) &&
        isPlainObject(target.value)
      ) {
        assignAnonymousStructFields(target.value, decoded, anonFields, opts)
        return
      }
      const info = resolveTypeInfo(desc)
      if (info !== null) {
        if (
          ($.isSliceTypeInfo(info) && Array.isArray(decoded)) ||
          ($.isMapTypeInfo(info) && isPlainObject(decoded)) ||
          // A top-level *Struct var (e.g. `var p *pkg.T`) needs the same
          // type-driven Pointer handling as a pointer-typed struct field or
          // map/slice element (see decodeValueForType's Pointer branch):
          // without it, decoding falls through to decodeInterfaceValue
          // below and produces a Map/plain object instead of a real
          // (unmarked) struct instance, breaking *T type assertions and
          // pointer-receiver method-set checks on the decoded result.
          ($.isPointerTypeInfo(info) && isPlainObject(decoded))
        ) {
          target.value = decodeValueForType(decoded, desc, opts)
          return
        }
      }
    }
    if (isPlainObject(decoded) || Array.isArray(decoded)) {
      target.value = decodeInterfaceValue(decoded)
      return
    }
    target.value = decoded
    return
  }
  if (isStructValue(target) && isPlainObject(decoded)) {
    assignStructFields(target, decoded, opts)
  }
}

function assignStructFields(
  target: { _fields: Record<string, $.VarRef<unknown>> },
  decoded: Record<string, unknown>,
  opts: decodeOptions,
): void {
  const fields = structFields(target)
  const knownNames = new Set<string>()
  for (const field of fields) {
    const jsonName = jsonFieldName(field.name, field.tag)
    if (jsonName !== '') {
      knownNames.add(jsonName)
    }
  }
  if (opts.disallowUnknownFields) {
    for (const key of Object.keys(decoded)) {
      if (!knownNames.has(key)) {
        throw $.newError(`json: unknown field "${key}"`)
      }
    }
  }
  for (const field of fields) {
    const ref = target._fields[field.key]
    if (ref === undefined) {
      continue
    }
    const jsonName = jsonFieldName(field.name, field.tag)
    if (
      jsonName !== '' &&
      Object.prototype.hasOwnProperty.call(decoded, jsonName)
    ) {
      assignDecodedFieldValue(ref, decoded[jsonName], opts, field.type)
    }
  }
}

function assignDecodedFieldValue(
  target: $.VarRef<unknown>,
  decoded: unknown,
  opts: decodeOptions,
  fieldType: unknown,
): void {
  if (isRawMessageType(fieldType)) {
    target.value = $.stringToBytes(JSON.stringify(decoded))
    return
  }
  // Decode Map/Slice-typed fields (including nested combinations, e.g.
  // map[string][]Struct) through the type-driven decoder below. Gated on the
  // decoded JSON shape actually matching (array for Slice, object for Map) so
  // every other field shape (basic types, []byte-as-base64-string, etc.)
  // falls through to the untouched generic path exactly as before.
  const info = resolveTypeInfo(fieldType)
  if (info !== null) {
    if ($.isSliceTypeInfo(info) && Array.isArray(decoded)) {
      target.value = decodeValueForType(decoded, info, opts)
      return
    }
    if ($.isMapTypeInfo(info) && isPlainObject(decoded)) {
      target.value = decodeValueForType(decoded, info, opts)
      return
    }
    // Pointer-to-struct fields (e.g. Items *ItemsSpec) start as nil, so the
    // generic path below has no zero-value instance to populate — construct
    // the pointee via the type-driven decoder. Decode with the Pointer
    // TypeInfo itself (not its elemType) so decodeValueForType's Pointer
    // branch handles the pointer-vs-value marking correctly; see its
    // comment. Pointer-to-basic fields keep the generic path (their
    // representation is not a struct instance).
    if ($.isPointerTypeInfo(info) && isPlainObject(decoded)) {
      const pointee = resolveTypeInfo(info.elemType)
      if (pointee !== null && $.isStructTypeInfo(pointee)) {
        // A field that already holds a non-nil pointer whose pointee
        // implements UnmarshalJSON must still go through that hook: Go's
        // encoding/json always prefers a custom decoder over field-by-field
        // population, even when the field is pre-populated rather than nil.
        // The type-driven constructor below only sees a fresh instance it
        // allocates itself, so it cannot see this pre-existing target.
        if (unmarshalJSONTarget(target.value) !== null) {
          assignDecodedValue(target, decoded, opts)
          return
        }
        target.value = decodeValueForType(decoded, info, opts)
        return
      }
    }
  }
  assignDecodedValue(target, decoded, opts)
}

// resolveTypeInfo normalizes a type descriptor (an inline TypeInfo object, or
// a qualified type-name string like "pkg.MyStruct") into a TypeInfo, looking
// up named types via $.getTypeByName. Returns null when the descriptor is
// missing or names a type the runtime has no registration for (e.g. a basic
// type name like "uint8" — those are handled as plain values).
function resolveTypeInfo(t: unknown): $.TypeInfo | null {
  if (typeof t === 'string') {
    return ($.getTypeByName(t) as $.TypeInfo | undefined) ?? null
  }
  if (typeof t === 'object' && t !== null && 'kind' in t) {
    return t as $.TypeInfo
  }
  return null
}

// decodeValueForType recursively decodes a raw JSON-parsed JS value into a
// properly-typed Go value per `typeInfo`:
//   - Struct: construct the registered ctor and populate its fields.
//   - Slice: decode each element per the slice's elemType (struct elements
//     become real struct instances instead of leaking plain objects).
//   - Map: build a real Map (this override's Go-map representation) whose
//     values are decoded per the map's elemType — this is what fixes
//     map[string]T struct/slice-of-struct fields (e.g. a
//     `Contexts map[string][]Ref` field): a struct- or slice-valued MAP
//     field previously fell through to the shape-driven interface{} decode
//     below and silently produced a Map of plain JS objects/arrays instead
//     of real struct instances, so Go field access on the decoded values
//     (e.g. `contexts.Foo`) read back empty/undefined.
//   - json.RawMessage element: captures the raw JSON fragment as bytes,
//     mirroring the direct-struct-field RawMessage path in
//     assignDecodedFieldValue above.
//   - Pointer element: decodes as its pointee (the runtime represents a
//     *Struct value as the struct instance itself for field access) —
//     without this, map/slice elements typed e.g. map[string]*Property
//     leaked plain objects whose Go field reads came back undefined.
//   - Anonymous struct element: decodes to a plain object keyed by Go field
//     name, honoring the field's own json tags (see
//     assignAnonymousStructFields below) — the runtime's representation of
//     an inline struct{...} value.
//   - Missing type info / interface{} elements: shape-driven decode via
//     decodeInterfaceValue, mirroring Go's json.Unmarshal-into-any.
function decodeValueForType(
  decoded: unknown,
  typeInfo: unknown,
  opts: decodeOptions,
): unknown {
  if (isRawMessageType(typeInfo) && decoded !== undefined) {
    return $.stringToBytes(JSON.stringify(decoded))
  }
  if (decoded === null || decoded === undefined) {
    return decoded
  }
  const anonFields = anonymousStructFields(typeInfo)
  if (anonFields !== null) {
    if (!isPlainObject(decoded)) {
      return decoded
    }
    const out: Record<string, unknown> = {}
    assignAnonymousStructFields(out, decoded, anonFields, opts)
    return out
  }
  const info = resolveTypeInfo(typeInfo)
  if (info === null || $.isInterfaceTypeInfo(info)) {
    return decodeInterfaceValue(decoded)
  }
  if ($.isPointerTypeInfo(info)) {
    // A *Struct pointee must be constructed directly here, NOT by recursing
    // into the Struct branch below: that branch always marks its result via
    // $.markAsStructValue, but the runtime's pointer matching
    // (matchesPointerType in gs/builtin/type.ts) requires struct pointees to
    // stay UNMARKED — only a genuine non-pointer struct value is marked.
    // Getting this wrong breaks *Struct type assertions/switches and
    // pointer-receiver method-set checks on decoded values.
    const pointee = resolveTypeInfo(info.elemType)
    if (pointee !== null && $.isStructTypeInfo(pointee)) {
      if (!isPlainObject(decoded) || typeof pointee.ctor !== 'function') {
        return decoded
      }
      const inst = new pointee.ctor()
      // A freshly-allocated pointee that implements UnmarshalJSON must be
      // decoded through that hook rather than field-by-field, mirroring Go:
      // encoding/json always prefers a custom decoder over the default
      // struct decode, including for a pointer field/element it allocates
      // itself.
      const unmarshaler = unmarshalJSONTarget(inst)
      if (unmarshaler !== null) {
        const err = unmarshaler.UnmarshalJSON(
          $.stringToBytes(JSON.stringify(decoded)),
        )
        if (err !== null) {
          throw err
        }
        return inst
      }
      if (isStructValue(inst)) {
        assignStructFields(inst, decoded, opts)
      }
      return inst
    }
    // Non-struct pointee (e.g. *string): decode as the pointee's own
    // representation, which carries no pointer-vs-value marking.
    return decodeValueForType(decoded, info.elemType, opts)
  }
  if ($.isStructTypeInfo(info)) {
    if (!isPlainObject(decoded) || typeof info.ctor !== 'function') {
      return decoded
    }
    const inst = new info.ctor()
    if (isStructValue(inst)) {
      assignStructFields(inst, decoded, opts)
    }
    return $.markAsStructValue(inst)
  }
  if ($.isSliceTypeInfo(info)) {
    if (!Array.isArray(decoded)) {
      return decoded
    }
    return decoded.map((el) => decodeValueForType(el, info.elemType, opts))
  }
  if ($.isMapTypeInfo(info)) {
    if (!isPlainObject(decoded)) {
      return decoded
    }
    const out = new Map<string, unknown>()
    for (const [key, value] of Object.entries(decoded)) {
      out.set(key, decodeValueForType(value, info.elemType, opts))
    }
    return out
  }
  // Basic / other kinds: passthrough (RawMessage and []byte-as-base64 are
  // handled by the caller before reaching the generic decoder).
  return decoded
}

// decodeInterfaceValue recursively decodes a raw JSON-parsed JS value the way
// Go's json.Unmarshal decodes into interface{}: objects become Maps (this
// override's Go-map representation) and arrays are decoded element-wise, so
// nested objects INSIDE arrays also become Maps, not just direct object
// values — both recursively, all the way down. Primitives pass through
// unchanged.
//
// Supersedes objectToMap, which only recursed into direct object VALUES, not
// array elements: an interface{}-typed array of objects (e.g. a Go []any
// holding map[string]any elements) left its element objects as raw plain JS
// objects instead of Maps. Go-side code that then type-switches on
// `case map[string]any:` and calls Map-only methods like .entries() on those
// elements panics with "entries is not a function".
function decodeInterfaceValue(decoded: unknown): unknown {
  if (Array.isArray(decoded)) {
    return decoded.map((el) => decodeInterfaceValue(el))
  }
  if (isPlainObject(decoded)) {
    const out = new Map<string, unknown>()
    for (const [key, value] of Object.entries(decoded)) {
      out.set(key, decodeInterfaceValue(value))
    }
    return out
  }
  return decoded
}

// unmarshalTargetGoType returns the Go type spelling the runtime's
// $.interfaceValue boxes onto an Unmarshal target as __goType (e.g.
// `*map[string]json.RawMessage`), without the leading pointer star. Null
// when the target carries none (e.g. it was never passed through an `any`
// parameter, so there is no spelling to decode against).
function unmarshalTargetGoType(target: unknown): string | null {
  if (target === null || typeof target !== 'object') {
    return null
  }
  const t = Reflect.get(target, '__goType')
  if (typeof t !== 'string' || t === '') {
    return null
  }
  return t.startsWith('*') ? t.slice(1) : t
}

// goTypeDescriptor parses a Go type spelling (from __goType, see above) into
// a decode descriptor consumable by decodeValueForType / resolveTypeInfo:
//   - {kind: Pointer, elemType}   for *T (e.g. a map[string]*T element
//                                 spelling) — NOT stripped, so
//                                 decodeValueForType's Pointer branch can
//                                 apply the correct pointer-vs-value marking
//                                 (see its comment). Only the single
//                                 outermost star representing the Unmarshal
//                                 target's own address-of is stripped, by
//                                 unmarshalTargetGoType above, before this
//                                 function ever runs.
//   - 'json.RawMessage'          RawMessage marker (isRawMessageType)
//   - {kind: Slice|Map, elemType} for []T / map[K]V
//   - {anonymousStructFields}     for inline struct{...} types
//   - the spelling itself         for named types ($.getTypeByName resolves)
//   - null                        for interface{} and unparseable spellings
//                                 (shape-driven decode, same as before)
function goTypeDescriptor(spelling: string): unknown {
  const s = spelling.trim()
  if (s.startsWith('*')) {
    return {
      kind: $.TypeKind.Pointer,
      elemType: goTypeDescriptor(s.slice(1).trim()),
    }
  }
  if (s === 'json.RawMessage' || s === 'encoding/json.RawMessage') {
    return 'json.RawMessage'
  }
  if (s === 'any' || s === 'interface{}' || s === 'interface {}') {
    return null
  }
  if (s.startsWith('[]')) {
    return { kind: $.TypeKind.Slice, elemType: goTypeDescriptor(s.slice(2)) }
  }
  if (s.startsWith('map[')) {
    const keyEnd = matchingBracketIndex(s, 'map['.length - 1)
    if (keyEnd < 0) {
      return null
    }
    return {
      kind: $.TypeKind.Map,
      elemType: goTypeDescriptor(s.slice(keyEnd + 1)),
    }
  }
  if (s.startsWith('struct{') && s.endsWith('}')) {
    return {
      anonymousStructFields: parseAnonymousStructFields(
        s.slice('struct{'.length, -1),
      ),
    }
  }
  return s
}

// parseAnonymousStructFields parses the field list of an inline struct type
// spelling ("Name Type" or "Name Type \"tag\"" decls separated by ';') into
// fieldMetadata. Embedded fields (no explicit name) are skipped: there is no
// way to address their promoted keys from this spelling alone.
function parseAnonymousStructFields(body: string): fieldMetadata[] {
  const fields: fieldMetadata[] = []
  for (const decl of splitGoFieldDecls(body)) {
    const [spec, tag] = splitGoFieldTag(decl.trim())
    const space = spec.indexOf(' ')
    if (space < 0) {
      continue
    }
    const name = spec.slice(0, space)
    fields.push({
      key: name,
      name,
      type: goTypeDescriptor(spec.slice(space + 1).trim()),
      ...(tag !== undefined ? { tag } : {}),
    })
  }
  return fields
}

// splitGoFieldDecls splits a struct-type field list on ';' at nesting depth
// zero, skipping string literals (tags) so a ';' inside a tag cannot split.
function splitGoFieldDecls(body: string): string[] {
  const decls: string[] = []
  let depth = 0
  let inStr = false
  let start = 0
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (inStr) {
      if (c === '\\') {
        i++
      } else if (c === '"') {
        inStr = false
      }
      continue
    }
    if (c === '"') {
      inStr = true
    } else if (c === '{' || c === '[') {
      depth++
    } else if (c === '}' || c === ']') {
      depth--
    } else if (c === ';' && depth === 0) {
      decls.push(body.slice(start, i))
      start = i + 1
    }
  }
  decls.push(body.slice(start))
  return decls
}

// splitGoFieldTag splits one field decl into [name+type, unquoted tag?]. The
// tag is the trailing Go-quoted literal at depth zero (a nested inline struct
// type keeps its own tags inside its braces, at depth > 0).
function splitGoFieldTag(decl: string): [string, string | undefined] {
  let depth = 0
  for (let i = 0; i < decl.length; i++) {
    const c = decl[i]
    if (c === '{' || c === '[') {
      depth++
    } else if (c === '}' || c === ']') {
      depth--
    } else if (c === '"' && depth === 0) {
      return [decl.slice(0, i).trim(), unquoteGoString(decl.slice(i).trim())]
    }
  }
  return [decl, undefined]
}

// unquoteGoString unquotes a Go double-quoted string literal. strconv.Quote
// output is JSON-compatible for the escapes tags use (\" and \\); anything
// exotic falls back to a plain backslash strip.
function unquoteGoString(lit: string): string {
  try {
    return JSON.parse(lit) as string
  } catch {
    return lit.slice(1, -1).replace(/\\(.)/g, '$1')
  }
}

// anonymousStructFields returns the parsed field list when the descriptor
// came from an inline struct{...} spelling, else null.
function anonymousStructFields(desc: unknown): fieldMetadata[] | null {
  if (desc === null || typeof desc !== 'object') {
    return null
  }
  const fields = (desc as { anonymousStructFields?: unknown })
    .anonymousStructFields
  return Array.isArray(fields) ? (fields as fieldMetadata[]) : null
}

// assignAnonymousStructFields populates an anonymous-struct value (a plain
// JS object keyed by Go field name, the runtime's representation of an
// inline struct) from decoded JSON, honoring json tags, disallowUnknownFields,
// and field types via the same per-field decode named-struct fields get
// (assignDecodedFieldValue).
function assignAnonymousStructFields(
  target: Record<string, unknown>,
  decoded: Record<string, unknown>,
  fields: fieldMetadata[],
  opts: decodeOptions,
): void {
  if (opts.disallowUnknownFields) {
    const knownNames = new Set<string>()
    for (const field of fields) {
      const jsonName = jsonFieldName(field.name, field.tag)
      if (jsonName !== '') {
        knownNames.add(jsonName)
      }
    }
    for (const key of Object.keys(decoded)) {
      if (!knownNames.has(key)) {
        throw $.newError(`json: unknown field "${key}"`)
      }
    }
  }
  for (const field of fields) {
    const jsonName = jsonFieldName(field.name, field.tag)
    if (
      jsonName === '' ||
      !Object.prototype.hasOwnProperty.call(decoded, jsonName)
    ) {
      continue
    }
    // An anonymous struct's own fields start unset (the target object
    // starts as {}), so a by-value named-struct field (e.g.
    // `Inner SomeStruct`) has no pre-existing instance for
    // assignDecodedFieldValue's generic path to populate into, unlike a
    // registered struct's fields (pre-initialized to a zero-value instance
    // at construction). Construct it directly via the type-driven decoder
    // whenever the field's type resolves to a real, ctor-bearing struct
    // type (a bare type-name spelling resolved through $.getTypeByName);
    // an inline TypeInfo with no ctor keeps the existing generic path
    // unchanged below.
    const fieldValue = decoded[jsonName]
    const fieldTypeInfo = resolveTypeInfo(field.type)
    if (
      fieldTypeInfo !== null &&
      $.isStructTypeInfo(fieldTypeInfo) &&
      typeof fieldTypeInfo.ctor === 'function' &&
      isPlainObject(fieldValue)
    ) {
      target[field.name] = decodeValueForType(fieldValue, fieldTypeInfo, opts)
      continue
    }
    // A field whose own type is itself an inline struct{...} or
    // *struct{...} (e.g. `Inner struct{ Name string "json:\"name\"" }`) has
    // no registered TypeInfo of its own — resolveTypeInfo(field.type) is
    // null for it, same as it is for a missing type. Left on the generic
    // path below, it decodes as a plain interface{} value (a Map keyed by
    // JSON tag) instead of the anonymous struct representation (a plain
    // object keyed by Go field name). Route it through decodeValueForType
    // directly, which recurses into assignAnonymousStructFields (or, for
    // *struct{...}, its Pointer branch, which falls through to the same
    // anonymous decode for a non-struct-typeinfo pointee) and so honors the
    // field's own parsed json tags and disallowUnknownFields.
    if (isAnonymousStructType(field.type) && isPlainObject(fieldValue)) {
      target[field.name] = decodeValueForType(fieldValue, field.type, opts)
      continue
    }
    const ref = $.varRef(target[field.name])
    assignDecodedFieldValue(ref, fieldValue, opts, field.type)
    target[field.name] = ref.value
  }
}

// isAnonymousStructType reports whether `t` (a field's parsed type
// descriptor, from parseAnonymousStructFields) denotes struct{...} or
// *struct{...} — the shapes decodeValueForType constructs via
// assignAnonymousStructFields rather than a registered struct's ctor, and
// so must not be left on the generic assignDecodedFieldValue path.
function isAnonymousStructType(t: unknown): boolean {
  if (anonymousStructFields(t) !== null) {
    return true
  }
  if (typeof t === 'object' && t !== null && 'kind' in t) {
    const info = t as $.TypeInfo
    if ($.isPointerTypeInfo(info)) {
      return isAnonymousStructType(info.elemType)
    }
  }
  return false
}

// matchingBracketIndex returns the index of the ']' matching the '[' at
// `open`, or -1. Tracks nesting only — Go map key spellings carry no strings
// or further brackets in the shapes goTypeDescriptor parses (map keys are
// always basic types).
function matchingBracketIndex(s: string, open: number): number {
  let depth = 0
  for (let i = open; i < s.length; i++) {
    if (s[i] === '[') depth++
    else if (s[i] === ']') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

function isStructValue(
  value: unknown,
): value is { _fields: Record<string, $.VarRef<unknown>> } {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const fields = Reflect.get(value, '_fields')
  return (
    fields !== null &&
    fields !== undefined &&
    typeof fields === 'object' &&
    !Array.isArray(fields)
  )
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Uint8Array) &&
    !(value instanceof Map)
  )
}

function structFields(value: {
  _fields: Record<string, $.VarRef<unknown>>
}): fieldMetadata[] {
  const fields = structFieldMetadata(value)
  if (fields.length !== 0) {
    return fields
  }
  return Object.keys(value._fields).map((key) => ({ key, name: key }))
}

function structFieldMetadata(value: unknown): fieldMetadata[] {
  if (value === null || typeof value !== 'object') {
    return []
  }
  const ctor = Reflect.get(value, 'constructor')
  if (
    ctor === null ||
    ctor === undefined ||
    (typeof ctor !== 'object' && typeof ctor !== 'function')
  ) {
    return []
  }
  const typeInfo = Reflect.get(ctor, '__typeInfo')
  if (
    typeInfo === null ||
    typeInfo === undefined ||
    typeof typeInfo !== 'object'
  ) {
    return []
  }
  const fields = Reflect.get(typeInfo, 'fields')
  if (Array.isArray(fields)) {
    const out: fieldMetadata[] = []
    for (const field of fields) {
      if (!$.isStructFieldInfo(field)) {
        continue
      }
      const tag = field.tag
      out.push({
        key: $.structFieldRuntimeKey(field),
        name: field.name,
        type: field.type,
        ...(typeof tag === 'string' ? { tag } : {}),
      })
    }
    return out
  }
  return []
}

function isRawMessageType(value: unknown): boolean {
  if (value === 'json.RawMessage' || value === 'encoding/json.RawMessage') {
    return true
  }
  if (!isPlainObject(value)) {
    return false
  }
  return (
    value.typeName === 'json.RawMessage' ||
    value.typeName === 'encoding/json.RawMessage' ||
    value.name === 'json.RawMessage' ||
    value.name === 'encoding/json.RawMessage'
  )
}

function goError(err: unknown): $.GoError {
  if (
    err !== null &&
    typeof err === 'object' &&
    typeof (err as { Error?: unknown }).Error === 'function'
  ) {
    return err as $.GoError
  }
  if (err instanceof Error) {
    return $.toGoError(err)
  }
  return $.newError(String(err))
}

function base64Encode(data: Uint8Array): string {
  let binary = ''
  for (const byte of data) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function base64Decode(text: string): Uint8Array {
  const binary = atob(text)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i)
  }
  return out
}

function escapeHTMLString(text: string): string {
  return text.replace(/[<>&\u2028\u2029]/g, (char) => {
    switch (char) {
      case '<':
        return '\\u003c'
      case '>':
        return '\\u003e'
      case '&':
        return '\\u0026'
      case '\u2028':
        return '\\u2028'
      case '\u2029':
        return '\\u2029'
      default:
        return char
    }
  })
}

function jsonFieldName(fieldName: string, tag: string | undefined): string {
  if (tag === undefined || !tag.startsWith('json:"')) {
    return fieldName
  }
  const end = tag.indexOf('"', 'json:"'.length)
  if (end < 0) {
    return fieldName
  }
  const name = tag.slice('json:"'.length, end).split(',')[0]
  if (name === '-') {
    return ''
  }
  if (name === '') {
    return fieldName
  }
  return name
}
