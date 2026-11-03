import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as io from '@goscript/io/index.js'

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

// Delim_String returns the delimiter character, as Delim.String does in Go.
export function Delim_String(d: Delim): string {
  return String.fromCharCode(d)
}

// delimToken returns d as a Token holding a Delim, boxed with its Go type
// as compiled code boxes a named type in an interface, so that type switches
// and assertions on the token distinguish it from a number.
function delimToken(d: Delim): Token {
  return $.namedValueInterfaceValue<Token>(
    d,
    'json.Delim',
    { String: Delim_String },
    $.basicType('int32', 'json.Delim'),
    [$.methodSignature('String', [], [$.basicType('string')])],
  )
}

// numberBox returns the json.Number for a number literal decoded with
// UseNumber, boxed as compiled code boxes a json.Number in an interface, so
// that it is not mistaken for a string.
function numberBox(literal: string): unknown {
  return $.namedValueInterfaceValue(
    literal,
    'json.Number',
    {
      Float64: Number_Float64,
      Int64: Number_Int64,
      String: Number_String,
    },
    $.basicType('string', 'json.Number'),
  )
}

// isNumberBox reports whether value is a boxed json.Number (see numberBox).
function isNumberBox(
  value: unknown,
): value is { __goType: string; __goValue: string } {
  return $.isNamedValueBox(value) && value.__goType === 'json.Number'
}

// decodedJSONText returns the JSON text of a decoded value, writing the
// number literals decoded with UseNumber as numbers.
function decodedJSONText(decoded: unknown): string {
  return JSON.stringify(decoded, (_key, value: unknown) =>
    isNumberBox(value) ? Number(value.__goValue) : value,
  )
}

// valueToken returns a scanned literal value as a Token. Numbers are boxed
// as float64 or json.Number values, as compiled code boxes them in an
// interface, so that they are not mistaken for other numeric types.
function valueToken(value: unknown, useNumber: boolean): Token {
  if (isNumberBox(value)) {
    return value as Token
  }
  if (useNumber && typeof value === 'string' && isValidFloat(value)) {
    return numberBox(value) as Token
  }
  if (typeof value === 'number') {
    return $.basicInterfaceValue<Token>(value, 'float64')
  }
  return value
}

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
  anonymous?: boolean
  exported?: boolean
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
// compiled code resolves to this class and exposes the Offset field. The zero
// value is made on demand: constructing an Error while the bundle's top level
// runs makes V8 collect the source positions of the whole bundle (it reparses
// it, about 150 ms for a 26 MB app in Chrome).
$.registerStructType(
  'json.SyntaxError',
  () => new SyntaxError(),
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

// decoderReadSize is the size of each read from a Decoder's reader.
const decoderReadSize = 32 * 1024

// needMore is returned by a Decoder step that needs more input.
const needMore = Symbol('needMore')

export class Decoder {
  private disallowUnknownFields = false
  private inputOffset = 0
  private useNumber = false

  // buf holds the input read so far; pos is the index of the next unread
  // character, so successive Decode/Token calls consume one value at a time and
  // leave the remainder buffered, like Go's streaming Decoder. Input is read in
  // bounded chunks only as needed to complete the next value.
  private buf = ''
  private pos = 0
  private eof = false
  private readErr: $.GoError = null
  private chunk = $.makeSlice<number>(decoderReadSize, undefined, 'byte')

  // end searches each read for the end of the composite value or string at
  // pos, so that the value is not parsed again after each read.
  private end = new valueEnd()

  public constructor(private readonly reader: io.Reader) {}

  // readChunk reads the next chunk of input into buf. It returns a Promise
  // when the reader is asynchronous.
  private readChunk(): io.Awaitable<void> {
    return io.mapResult(this.reader.Read(this.chunk), ([n, err]) => {
      // The buffer holds the bytes read as a Go string.
      if (n > 0) {
        const text = $.bytesToString($.goSlice(this.chunk, 0, n))
        this.buf += text
        this.end.feed(text)
      }

      // Any error ends the input; only io.EOF is not reported.
      if (err !== null) {
        this.eof = true
        if (err !== io.EOF) {
          this.readErr = err
        }
      }
    })
  }

  // run calls step, reading more input while it returns needMore, so the
  // result is synchronous for a synchronous reader. While the value at pos
  // has not ended, run reads more without calling step, which would make the
  // buffer one string again.
  private run<T>(step: () => T | typeof needMore): io.Awaitable<T> {
    while (true) {
      if (this.eof || !this.end.waiting()) {
        const result = step()
        if (result !== needMore) {
          return result
        }
      }
      const read = this.readChunk()
      if (io.isAsync(read)) {
        return Promise.resolve(read).then(() => this.run(step))
      }
    }
  }

  // scanValue scans the value at pos, returning needMore if the input so
  // far may end before the value does.
  private scanValue(): [unknown, number] | typeof needMore {
    // The search for the end of the value starts with its first parse.
    this.end.parse(this.buf, this.pos)
    try {
      // Only a number that reaches the end of the input may continue.
      const [value, end] = scanJSONValue(this.buf, this.pos, this.useNumber)
      if (
        !this.eof &&
        end >= this.buf.length &&
        /[-\d]/.test(this.buf[this.pos])
      ) {
        return needMore
      }
      return [value, end]
    } catch (err) {
      // An error at the end of the input may be a value that continues.
      if (
        !this.eof &&
        err instanceof SyntaxError &&
        Number(err.Offset) >= this.buf.length
      ) {
        return needMore
      }
      this.end.stop()
      throw err
    }
  }

  // consume advances past the scanned input up to end.
  private consume(end: number): void {
    this.end.stop()
    this.pos = end
    this.inputOffset = end
  }

  public Decode(v: unknown): io.Awaitable<$.GoError> {
    return this.run(() => {
      // Find the next value, reading until it is complete.
      this.pos = skipJSONWhitespace(this.buf, this.pos)
      if (this.pos >= this.buf.length) {
        return this.eof ? (this.readErr ?? io.EOF) : needMore
      }
      let scanned: ReturnType<Decoder['scanValue']>
      try {
        scanned = this.scanValue()
      } catch (err) {
        return goError(err)
      }
      if (scanned === needMore) {
        return needMore
      }

      // Consume the value and decode it into v, which assigns the value
      // parsed by the scan, unless an UnmarshalJSON method takes the bytes.
      const raw = $.stringToBytes(this.buf.slice(this.pos, scanned[1]))
      this.consume(scanned[1])
      const opts = {
        disallowUnknownFields: this.disallowUnknownFields,
        useNumber: this.useNumber,
      }
      return decode(raw, v, opts, scanned)
    })
  }

  // Buffered returns the data remaining in the Decoder's buffer, without
  // reading more input, as in Go.
  public Buffered(): io.Reader {
    return bytes.NewBufferString(this.buf.slice(this.pos))!
  }

  public DisallowUnknownFields(): void {
    this.disallowUnknownFields = true
  }

  public InputOffset(): bigint {
    return BigInt(this.inputOffset)
  }

  public More(): io.Awaitable<boolean> {
    return this.run(() => {
      const next = skipJSONWhitespace(this.buf, this.pos)
      if (next >= this.buf.length) {
        return this.eof ? false : needMore
      }
      const c = this.buf[next]
      return c !== ']' && c !== '}'
    })
  }

  public Token(): io.Awaitable<[Token, $.GoError]> {
    return this.run((): [Token, $.GoError] | typeof needMore => {
      // Object and array separators are implicit in Go's token stream, so
      // skip them.
      let cursor = skipJSONWhitespace(this.buf, this.pos)
      while (this.buf[cursor] === ',' || this.buf[cursor] === ':') {
        cursor = skipJSONWhitespace(this.buf, cursor + 1)
      }
      if (cursor >= this.buf.length) {
        if (!this.eof) {
          return needMore
        }
        this.pos = cursor
        return [null, this.readErr ?? io.EOF]
      }

      // A delimiter is a token by itself.
      this.pos = cursor
      const c = this.buf[cursor]
      if (c === '{' || c === '[' || c === '}' || c === ']') {
        this.consume(cursor + 1)
        return [delimToken(c.charCodeAt(0)), null]
      }

      // Otherwise the token is the next literal value, boxed as Go boxes it.
      let scanned: ReturnType<Decoder['scanValue']>
      try {
        scanned = this.scanValue()
      } catch (err) {
        return [null, goError(err)]
      }
      if (scanned === needMore) {
        return needMore
      }
      const [value, end] = scanned
      this.consume(end)
      return [c === '"' ? value : valueToken(value, this.useNumber), null]
    })
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

  // Encode supports a MarshalJSON that suspends, unlike Marshal, because
  // Encode is itself async (see meta.json): such marshalers are awaited
  // before the value is encoded.
  public Encode(v: unknown): io.Awaitable<$.GoError> {
    // Prepare the value, collecting each MarshalJSON that suspends.
    const pending: PendingMarshal[] = []
    let prepared: unknown
    try {
      prepared = prepareMarshal(v, pending)
    } catch (err) {
      return goError(err)
    }
    if (pending.length === 0) {
      return this.write(prepared)
    }

    return (async () => {
      const err = await resolvePendingMarshals(pending)
      if (err !== null) {
        return err
      }
      return await this.write(prepared)
    })()
  }

  private write(prepared: unknown): io.Awaitable<$.GoError> {
    const [data, err] = encodeBytes(
      prepared,
      this.prefix,
      this.indent,
      this.escapeHTML,
    )
    if (err !== null) {
      return err
    }

    const out = $.stringToBytes($.bytesToString(data) + '\n')
    return io.mapResult(this.writer.Write(out), ([n, writeErr]) => {
      if (writeErr !== null) return writeErr
      return n !== $.len(out) ? io.ErrShortWrite : null
    })
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

// PendingMarshal stands in for the result of a MarshalJSON that suspended,
// until resolvePendingMarshals awaits it and sets json.
class PendingMarshal {
  public json: RawJSON | null = null
  constructor(public result: Promise<[$.Slice<number>, $.GoError]>) {}
}

// pendingMarshals collects the PendingMarshals of the value prepareMarshal is
// preparing.
let pendingMarshals: PendingMarshal[] = []

// resolvePendingMarshals awaits every suspended marshaler together, so that
// none is left with an unobserved rejection, then fills in their results in
// order. It returns the first marshaler error.
async function resolvePendingMarshals(
  pending: PendingMarshal[],
): Promise<$.GoError> {
  const results = await Promise.all(pending.map((p) => p.result))
  try {
    for (const [i, p] of pending.entries()) {
      p.json = marshalerResult(...results[i])
    }
  } catch (marshalErr) {
    return goError(marshalErr)
  }
  return null
}

// pendingUnmarshals collects the results of the UnmarshalJSON calls that
// suspend while decode assigns a value. Each one fills its target in place.
let pendingUnmarshals: Promise<$.GoError>[] = []

// callUnmarshalJSON calls a decode target's UnmarshalJSON, throwing its
// error, and records the result when the call suspends. Once one call has
// suspended, the later ones run after it, in order, as they do in Go, since
// an UnmarshalJSON may change the values that a later one decodes into.
function callUnmarshalJSON(
  unmarshaler: Unmarshaler,
  data: $.Slice<number>,
): void {
  // A call behind a pending one waits for it, so the unmarshalers run in order.
  const previous = pendingUnmarshals.at(-1)
  if (previous !== undefined) {
    pendingUnmarshals.push(
      previous.then((err) =>
        err !== null ? err : unmarshaler.UnmarshalJSON(data),
      ),
    )
    return
  }

  // A call that suspends is awaited by Unmarshal.
  const err: $.MaybePromise<$.GoError> = unmarshaler.UnmarshalJSON(data)
  if (err instanceof Promise) {
    pendingUnmarshals.push(err)
    return
  }
  if (err !== null) {
    throw err
  }
}

// prepareMarshal prepares v for encoding like marshalValue, adding a
// PendingMarshal to pending for each MarshalJSON that suspends.
function prepareMarshal(v: unknown, pending: PendingMarshal[]): unknown {
  const outer = pendingMarshals
  pendingMarshals = pending
  try {
    return marshalValue(v)
  } finally {
    pendingMarshals = outer
  }
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
  if (v instanceof PendingMarshal) {
    return v.json!.raw
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
  if ($.isArrayOrGoSlice(v)) {
    return '[' + v.map(encodeJSON).join(',') + ']'
  }
  if ($.isTypedSlice(v)) {
    return '[' + Array.from(v, encodeJSON).join(',') + ']'
  }
  if (t === 'object') {
    const parts: string[] = []
    for (const key of $.ownKeys(v as object)) {
      const value = (v as Record<string, unknown>)[key]
      parts.push(JSON.stringify(key) + ':' + encodeJSON(value))
    }
    return '{' + parts.join(',') + '}'
  }
  return JSON.stringify(v)
}

const JSON_WHITESPACE = ' \t\n\r'

// valueEnd searches the input that a Decoder reads for the end of the
// composite value or string it is decoding, so that the value is parsed only
// once it ends, or once the input read for it has doubled since it was last
// parsed, which reports a syntax error in it before its end. The value is
// then parsed in time linear in its size.
class valueEnd {
  private start = -1
  private searching = false
  private depth = 0
  private inString = false
  private escaped = false
  private parsedLength = 0
  private unparsed = 0

  // parse records a parse of the value at start in text, starting the
  // search for its end at its first parse. A number or literal is short, so
  // it is parsed again after each read.
  parse(text: string, start: number): void {
    // A parse of the same value only counts the input read since the last.
    if (start === this.start) {
      this.parsedLength += this.unparsed
      this.unparsed = 0
      return
    }

    // The first parse of a composite value or string starts the search.
    const c = text[start]
    this.start = start
    this.searching = c === '{' || c === '[' || c === '"'
    this.depth = 0
    this.inString = false
    this.escaped = false
    this.feed(text.slice(start))
    this.parsedLength = text.length - start
    this.unparsed = 0
  }

  // stop ends the search, once the value is consumed or malformed.
  stop(): void {
    this.start = -1
    this.searching = false
  }

  // waiting reports whether the value has not ended and the input read
  // since its last parse is shorter than the input it had then.
  waiting(): boolean {
    return this.searching && this.unparsed < this.parsedLength
  }

  // feed continues the search through text read for the value.
  feed(text: string): void {
    this.unparsed += text.length
    for (let i = 0; this.searching && i < text.length; i++) {
      this.next(text.charCodeAt(i))
    }
  }

  // next continues the search with the next character code c, which ends
  // the value when it closes its string or balances its brackets.
  private next(c: number): void {
    // In a string, an escape skips the next character, and an unescaped
    // quote ends the string.
    if (this.inString) {
      if (this.escaped) {
        this.escaped = false
      } else if (c === 0x5c) {
        this.escaped = true
      } else if (c === 0x22) {
        this.inString = false
        this.searching = this.depth > 0
      }
      return
    }

    // Outside strings, the brackets nest.
    if (c === 0x22) {
      this.inString = true
    } else if (c === 0x7b || c === 0x5b) {
      this.depth++
    } else if (c === 0x7d || c === 0x5d) {
      this.searching = --this.depth > 0
    }
  }
}

// jsonSyntaxError returns a SyntaxError at index i of the input, which is its
// Go byte offset, as a Go string has a character for each byte.
function jsonSyntaxError(i: number, msg: string): SyntaxError {
  return new SyntaxError({ Offset: i, Message: msg })
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
    throw jsonSyntaxError(at, msg)
  }
  const parseString = (): string => {
    // The literal is sliced from the text once its closing quote is found.
    const start = i++
    while (i < text.length) {
      const c = text.charCodeAt(i++)
      if (c === 0x5c) {
        i++
      } else if (c === 0x22) {
        try {
          return parseJSONStringLiteral(text.slice(start, i))
        } catch {
          i = start
          return fail('invalid string literal')
        }
      }
    }
    i = Math.min(i, text.length)
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
    return useNumber ? numberBox(literal) : Number(literal)
  }
  const value = parseValue()
  return [value, i]
}

export function Marshal(v: unknown): [$.Slice<number>, $.GoError] {
  return marshalBytes(v, '', '', true)
}

// marshalBytes encodes v. When a MarshalJSON suspends, it returns a Promise
// of the result instead: the compiler awaits Marshal and MarshalIndent in a
// program with an async MarshalJSON method (see asyncWhenMethods in
// meta.json).
function marshalBytes(
  v: unknown,
  prefix: string,
  indent: string,
  escapeHTML: boolean,
): [$.Slice<number>, $.GoError] {
  // Prepare the value, collecting the MarshalJSON calls that suspend.
  const pending: PendingMarshal[] = []
  let prepared: unknown
  try {
    prepared = prepareMarshal(v, pending)
  } catch (err) {
    return [null, goError(err)]
  }

  // Encode now unless a marshaler suspended.
  if (pending.length === 0) {
    return encodeBytes(prepared, prefix, indent, escapeHTML)
  }
  return $.awaitedResult(
    (async (): Promise<[$.Slice<number>, $.GoError]> => {
      const err = await resolvePendingMarshals(pending)
      if (err !== null) {
        return [null, err]
      }
      return encodeBytes(prepared, prefix, indent, escapeHTML)
    })(),
  )
}

// encodeBytes encodes a value prepared by marshalValue.
function encodeBytes(
  prepared: unknown,
  prefix: string,
  indent: string,
  escapeHTML: boolean,
): [$.Slice<number>, $.GoError] {
  try {
    let text = encodeJSON(prepared)
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

// decode decodes data into v. When an UnmarshalJSON suspends, it returns a
// Promise of the error instead: the compiler awaits Unmarshal in a program
// with an async UnmarshalJSON method (see asyncWhenMethods in meta.json), and
// Decoder.Decode is async. The value parsed from data may be given as the
// first element of parsed, so that data is not parsed again.
function decode(
  data: $.Slice<number>,
  v: unknown,
  opts: decodeOptions,
  parsed: [unknown, ...unknown[]] | null = null,
): $.GoError {
  // Assign the decoded value, collecting the UnmarshalJSON calls that suspend.
  const pending: Promise<$.GoError>[] = []
  const outer = pendingUnmarshals
  pendingUnmarshals = pending
  try {
    v = unwrapPointerBox(v)
    if (!validUnmarshalTarget(v)) {
      return $.toGoError(new InvalidUnmarshalError())
    }
    const unmarshaler = unmarshalJSONTarget(v)
    if (unmarshaler !== null) {
      callUnmarshalJSON(unmarshaler, data)
    } else {
      const value = parsed !== null ? parsed[0] : parseJSON(data, opts)
      assignDecodedValue(v, value, opts)
    }
  } catch (err) {
    return goError(err)
  } finally {
    pendingUnmarshals = outer
  }

  // Await every suspended unmarshaler together, so that none is left with an
  // unobserved rejection, and report the first error.
  if (pending.length === 0) {
    return null
  }
  return $.awaitedResult(
    (async (): Promise<$.GoError> => {
      const errs = await Promise.all(pending)
      return errs.find((err) => err !== null) ?? null
    })(),
  )
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

// jsonv2Encoder and jsonv2Decoder are the parts of jsontext.Encoder and
// jsontext.Decoder used by the jsonv2 methods of Number, which the
// jsontext override does not otherwise provide.
interface jsonv2Encoder {
  WriteValue(value: $.Bytes): $.GoError
}

interface jsonv2Decoder {
  ReadValue(): [$.Bytes, $.GoError]
}

// jsonNumberPattern matches a JSON number literal.
const jsonNumberPattern = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/

// Number_MarshalJSONTo implements jsonv2.MarshalerTo, writing the number,
// or 0 if it is empty. Numbers are not stringified, since the encoder
// options are not available.
export function Number_MarshalJSONTo(
  n: Number,
  enc: jsonv2Encoder | $.VarRef<jsonv2Encoder> | null,
): $.GoError {
  const text = n === '' ? '0' : n
  if (!jsonNumberPattern.test(text)) {
    return $.newError(
      `cannot parse ${JSON.stringify(text)} as JSON number: invalid syntax`,
    )
  }
  return $.pointerValue(enc).WriteValue($.stringToBytes(text))
}

// Number_UnmarshalJSONFrom implements jsonv2.UnmarshalerFrom, reading a
// JSON number, a string containing one, or null, which empties n.
export function Number_UnmarshalJSONFrom(
  n: $.VarRef<Number> | Number | null,
  dec: jsonv2Decoder | $.VarRef<jsonv2Decoder> | null,
): $.GoError {
  // Read the next whole value.
  const [value, err] = $.pointerValue(dec).ReadValue()
  if (err !== null) {
    return err
  }

  // Take the number from a literal or a quoted string.
  const text = $.bytesToString(value)
  let result: string
  if (text === 'null') {
    result = ''
  } else if (text.startsWith('"')) {
    result = JSON.parse(text) as string
    if (!jsonNumberPattern.test(result)) {
      return $.newError(
        'json: cannot unmarshal JSON string into Go json.Number: invalid syntax',
      )
    }
  } else if (jsonNumberPattern.test(text)) {
    result = text
  } else {
    return $.newError('json: cannot unmarshal into Go json.Number')
  }

  // Store it through the pointer receiver.
  if ($.isVarRef(n)) {
    n.value = result
  }
  return null
}

function isValidFloat(value: string): boolean {
  return /^[+-]?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|inf(?:inity)?|nan)$/i.test(
    value,
  )
}

// marshalerResult returns the RawJSON for the result of a MarshalJSON call.
function marshalerResult(data: $.Slice<number>, err: $.GoError): RawJSON {
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

// mapKeyTypeName returns the Go type string of a named map key type, such as
// "pkg.Tokens", or '' for an unnamed key type.
function mapKeyTypeName(info: $.TypeInfo): string {
  if (typeof info.typeName === 'string' && info.typeName !== '') {
    return info.typeName
  }
  return info.kind === $.TypeKind.Basic ? '' : (info.name ?? '')
}

// integerKeyBits returns the bit size and signedness of an integer basic
// kind name, or null for a non-integer kind.
function integerKeyBits(kind: string): [number, boolean] | null {
  switch (kind) {
    case 'int':
    case 'int64':
      return [64, true]
    case 'int8':
      return [8, true]
    case 'int16':
      return [16, true]
    case 'int32':
    case 'rune':
      return [32, true]
    case 'uint':
    case 'uint64':
    case 'uintptr':
      return [64, false]
    case 'uint8':
    case 'byte':
      return [8, false]
    case 'uint16':
      return [16, false]
    case 'uint32':
      return [32, false]
  }
  return null
}

// decodeMapKey converts a JSON object key to a Go map key of keyType, as
// encoding/json does, and passes it to assign: through UnmarshalText when a
// pointer to the key type implements encoding.TextUnmarshaler, as is for
// string kinds, and parsed as a decimal integer for integer kinds.
function decodeMapKey(key: string, keyType: unknown, assign: Assign): void {
  // A key that is not of a basic type stays a string.
  const info = resolveTypeInfo(keyType)
  if (info === null || info.kind !== $.TypeKind.Basic) {
    assign(key)
    return
  }

  // A key type with UnmarshalText decodes itself.
  if (hasTextMethod(info, 'UnmarshalText')) {
    unmarshalText(key, info, assign)
    return
  }

  // A string key stays a string, and an integer key is parsed.
  const kind = info.name ?? ''
  const bits = integerKeyBits(kind)
  if (bits === null) {
    assign(key)
    return
  }

  // The text must be a decimal integer.
  const typeName = mapKeyTypeName(info)
  const [size, signed] = bits
  const typeError = () =>
    new UnmarshalTypeError({
      Value: 'number ' + key,
      Type: typeName !== '' ? typeName : kind,
    })
  if (!/^-?[0-9]+$/.test(key)) {
    throw typeError()
  }

  // The integer must fit the key type.
  const n = BigInt(key)
  const min = signed ? -(BigInt(1) << BigInt(size - 1)) : BigInt(0)
  const max =
    signed ?
      (BigInt(1) << BigInt(size - 1)) - BigInt(1)
    : (BigInt(1) << BigInt(size)) - BigInt(1)
  if (n < min || n > max) {
    throw typeError()
  }

  // A 64-bit integer is a bigint, as elsewhere in the runtime.
  assign(
    kind === 'int64' || kind === 'uint64' || kind === 'uintptr' ? n : Number(n),
  )
}

// Assign receives a decoded value. It is called after decoding returns when
// the value comes from an UnmarshalText method that suspends.
type Assign = (value: unknown) => void

// unmarshalText decodes text into a value of the named basic type described
// by info, through the UnmarshalText method of a pointer to it, and passes
// the value to assign. When UnmarshalText suspends, inside a Unmarshal that
// awaits its unmarshalers (see pendingUnmarshals), assign is called once it
// completes.
function unmarshalText(text: string, info: $.TypeInfo, assign: Assign): void {
  // UnmarshalText is called on a pointer to a zero value of the type.
  const typeName = mapKeyTypeName(info)
  const method = $.namedValueMethods('*' + typeName)!.methods.UnmarshalText
  const kind = info.name ?? ''
  const bits = integerKeyBits(kind)
  const zero: unknown =
    bits === null ? ''
    : kind === 'int64' || kind === 'uint64' || kind === 'uintptr' ? BigInt(0)
    : 0
  const ref = $.varRef(zero)
  const err = method(ref, $.stringToBytes(text)) as
    | $.GoError
    | PromiseLike<$.GoError>

  // A method that suspends is awaited by Unmarshal, which then assigns the value.
  if (err instanceof Promise) {
    if (pendingUnmarshals === null) {
      throw $.newError('json: asynchronous UnmarshalText is unsupported')
    }
    pendingUnmarshals.push(
      err.then((result: $.GoError) => {
        if (result === null || result === undefined) {
          assign(ref.value)
          return null
        }
        return result
      }),
    )
    return
  }

  // A method that returned is assigned at once.
  if (err !== null && err !== undefined) {
    throw err
  }
  assign(ref.value)
}

// encodeMapKey returns the JSON object key text for a Go map key of keyType,
// as encoding/json does: through MarshalText when the key type implements
// encoding.TextMarshaler, and as its decimal or string value otherwise.
function encodeMapKey(key: unknown, keyType: unknown): string {
  // A key type with MarshalText encodes itself.
  const info = resolveTypeInfo(keyType)
  const typeName = info !== null ? mapKeyTypeName(info) : ''
  const marshalText =
    typeName !== '' ?
      $.namedValueMethods(typeName)?.methods.MarshalText
    : undefined
  if (marshalText !== undefined) {
    const result = marshalText(key)
    if (result instanceof Promise) {
      throw new MarshalerError({
        Err: $.newError('json: asynchronous MarshalText is unsupported'),
      })
    }
    const [data, err] = result as [$.Slice<number>, $.GoError]
    if (err !== null) {
      throw new MarshalerError({ Err: err })
    }
    return $.bytesToString(data)
  }

  // Any other key is its string value.
  return String(key)
}

// textUnmarshalerElemInfo returns the type information of the named basic
// type that a pointer target points to, when it implements
// encoding.TextUnmarshaler, or null.
function textUnmarshalerElemInfo(target: unknown): $.TypeInfo | null {
  // The target must be a pointer.
  const pointer = $.resolveTypeInfo(
    Reflect.get(target as object, '__goTypeInfo') as $.TypeInfo | string,
  )
  if (
    pointer === undefined ||
    pointer === null ||
    !$.isPointerTypeInfo(pointer)
  ) {
    return null
  }

  // Its element must have UnmarshalText.
  const elem = $.resolveTypeInfo(pointer.elemType)
  if (elem === undefined || elem === null) {
    return null
  }
  return hasTextMethod(elem, 'UnmarshalText') ? elem : null
}

// textUnmarshalerSliceInfo returns the type information of the slice that
// a pointer target points to, when its elements are of a named basic type
// that implements encoding.TextUnmarshaler, or null.
function textUnmarshalerSliceInfo(target: unknown): $.TypeInfo | null {
  // The target must be a pointer to a slice.
  const pointer = $.resolveTypeInfo(
    Reflect.get(target as object, '__goTypeInfo') as $.TypeInfo | string,
  )
  if (!pointer || !$.isPointerTypeInfo(pointer)) {
    return null
  }
  const slice = $.resolveTypeInfo(pointer.elemType)
  if (!slice || !$.isSliceTypeInfo(slice)) {
    return null
  }

  // The elements must have UnmarshalText.
  const elem = $.resolveTypeInfo(slice.elemType)
  return elem && hasTextMethod(elem, 'UnmarshalText') ? slice : null
}

// hasTextMethod reports whether the named basic type described by info (or
// a pointer to it, for UnmarshalText) has the given encoding.TextMarshaler
// or encoding.TextUnmarshaler method.
function hasTextMethod(
  info: $.TypeInfo,
  method: 'MarshalText' | 'UnmarshalText',
): boolean {
  // Only a named basic type has these methods.
  if (info.kind !== $.TypeKind.Basic) {
    return false
  }
  const typeName = mapKeyTypeName(info)
  if (typeName === '') {
    return false
  }

  // UnmarshalText has a pointer receiver.
  const name = method === 'UnmarshalText' ? '*' + typeName : typeName
  return $.namedValueMethods(name)?.methods[method] !== undefined
}

// goTypeInfoOf returns the type information that a boxed or typed value
// carries in its __goType property, or null.
function goTypeInfoOf(v: unknown): unknown {
  if (v === null || typeof v !== 'object') {
    return null
  }
  const t = Reflect.get(v, '__goType')
  return typeof t === 'string' && t !== '' ? t : null
}

// marshalValue encodes v of type typeInfo. addressable reports whether v is
// addressable in Go, as a slice element or a value reached through a pointer
// is, so that methods with pointer receivers apply to it.
function marshalValue(
  v: unknown,
  typeInfo?: unknown,
  addressable = false,
): unknown {
  // A value with MarshalJSON encodes itself, awaiting it if it suspends.
  // The type of a map or slice passed as an interface can be the spelling
  // of an unnamed type, such as map[string]json.RawMessage, which is parsed
  // for the types of its elements.
  typeInfo ??= goTypeInfoOf(v) ?? undefined
  if (
    typeof typeInfo === 'string' &&
    (typeInfo.startsWith('map[') || typeInfo.startsWith('[]')) &&
    $.getTypeByName(typeInfo) === undefined
  ) {
    typeInfo = goTypeDescriptor(typeInfo) ?? undefined
  }
  const marshaler = marshalJSONTarget(v, typeInfo, addressable)
  if (marshaler !== null) {
    const result = marshaler.MarshalJSON()
    if (result instanceof Promise) {
      const pending = new PendingMarshal(result)
      pendingMarshals.push(pending)
      return pending
    }
    const [data, err] = result
    return marshalerResult(data, err)
  }

  // A json.RawMessage, such as an element of a map or slice, is its JSON.
  if (isRawMessageType(typeInfo)) {
    return marshalRawMessage(v)
  }

  // A pointer encodes the value it points to, which is addressable.
  if ($.isVarRef(v)) {
    return marshalValue(v.value, typeInfo, true)
  }

  // Unwrap a boxed interface{} value (a named/defined type's value, boxed by
  // the runtime as { __goType, __goValue, ... } so it can carry methods)
  // before serializing; otherwise the wrapper object itself leaks into the
  // output instead of the underlying primitive/map/slice it holds.
  if ($.isNamedValueBox(v) && !isStructValue(v)) {
    return marshalValue(
      (v as { __goValue: unknown }).__goValue,
      (v as { __goType: unknown }).__goType,
    )
  }

  // A nil value is null.
  if (v === null || v === undefined) {
    return null
  }

  // A primitive is encoded by MarshalText, if its type has one, or by its value.
  if (typeof v !== 'object' && typeof v !== 'function') {
    const textInfo = resolveTypeInfo(typeInfo)
    if (textInfo !== null && hasTextMethod(textInfo, 'MarshalText')) {
      return encodeMapKey(v, textInfo)
    }
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

  // A byte slice is base64 text.
  if (v instanceof Uint8Array) {
    return base64Encode(v)
  }

  // A slice, array or map encodes its elements by their types, which for a
  // slice held in a typed array are at least those of its typed array.
  const info = resolveTypeInfo(typeInfo)
  if ($.isArrayOrGoSlice(v) || $.isTypedSlice(v)) {
    const elemType =
      info !== null && ($.isSliceTypeInfo(info) || $.isArrayTypeInfo(info)) ?
        info.elemType
      : $.typedSliceHintOf(v)
    // Slice elements are addressable; array elements are when the array is.
    const elemAddressable =
      info === null || !$.isArrayTypeInfo(info) || addressable
    const items = $.isTypedSlice(v) ? Array.from(v) : v
    return items.map((el) => marshalValue(el, elemType, elemAddressable))
  }
  if (v instanceof Map) {
    const mapInfo = info !== null && $.isMapTypeInfo(info) ? info : null
    // Go sorts the keys of an encoded map by their text.
    const entries = [...v.entries()].map(
      ([key, value]) =>
        [encodeMapKey(key, mapInfo?.keyType), value] as [string, unknown],
    )
    entries.sort(([a], [b]) =>
      a < b ? -1
      : a > b ? 1
      : 0,
    )
    const out: Record<string, unknown> = {}
    for (const [key, value] of entries) {
      out[key] = marshalValue(value, mapInfo?.elemType)
    }
    return out
  }

  // An anonymous struct value stores its fields on the object itself.
  const anonymousFields =
    isStructValue(v) ? null : anonymousStructValueFields(v)
  if (!isStructValue(v) && anonymousFields === null) {
    return v
  }
  const fieldValues: Record<string, unknown> = v as Record<string, unknown>

  // Fields are addressable when the struct is or is reached via a pointer.
  const fieldsAddressable = !isStructValueType(typeInfo) || addressable

  // The fields are listed with their JSON names, and the object is built in that order.
  const out: Record<string, unknown> = {}
  const fields =
    anonymousFields !== null ?
      anonymousFields.map((field) => ({
        jsonName: jsonFieldName(field.name, field.tag),
        owner: fieldValues,
        field,
      }))
    : jsonStructFields(v as Record<string, unknown>)
  for (const { jsonName, owner, field } of fields) {
    const value = owner[field.key]
    if (jsonName === '' || value === undefined) {
      continue
    }
    if (jsonOmitEmpty(field.tag) && isEmptyValue(value, field.type)) {
      continue
    }
    out[jsonName] = marshalFieldValue(value, field.type, fieldsAddressable)
  }
  return out
}

// jsonOmitEmpty reports whether the struct tag carries the `,omitempty` option.
function jsonOmitEmpty(tag: string | undefined): boolean {
  const value = jsonTagValue(tag)
  if (value === undefined) {
    return false
  }
  return value.split(',').slice(1).includes('omitempty')
}

// jsonTagValue returns the value of the json key in a struct tag, or
// undefined when there is none. It follows reflect.StructTag.Lookup, so the
// json key need not come first, as in `copier:"-" json:"-"`.
function jsonTagValue(tag: string | undefined): string | undefined {
  let rest = tag ?? ''
  while (rest !== '') {
    rest = rest.replace(/^ +/, '')
    if (rest === '') {
      break
    }
    // Scan to the colon; a space, quote or control character ends the tag.
    let i = 0
    while (
      i < rest.length &&
      rest.charCodeAt(i) > 0x20 &&
      rest[i] !== ':' &&
      rest[i] !== '"' &&
      rest.charCodeAt(i) !== 0x7f
    ) {
      i++
    }
    if (
      i === 0 ||
      i + 1 >= rest.length ||
      rest[i] !== ':' ||
      rest[i + 1] !== '"'
    ) {
      break
    }
    const name = rest.slice(0, i)
    rest = rest.slice(i + 1)
    // Scan the quoted value, skipping escaped characters.
    i = 1
    while (i < rest.length && rest[i] !== '"') {
      if (rest[i] === '\\') {
        i++
      }
      i++
    }
    if (i >= rest.length) {
      break
    }
    const quoted = rest.slice(0, i + 1)
    rest = rest.slice(i + 1)
    if (name === 'json') {
      try {
        return JSON.parse(quoted) as string
      } catch {
        return undefined
      }
    }
  }
  return undefined
}

// isEmptyValue mirrors Go encoding/json: zero numbers/strings/bools, empty
// slices/maps/arrays, and nil pointers/interfaces are "empty". Pointer and
// interface fields are only empty when the pointer/interface itself is nil;
// a non-nil pointer or interface is never empty, even when it points to or
// holds a zero value, so those field types must not be unwrapped further.
function isEmptyValue(v: unknown, fieldType?: unknown): boolean {
  if (isPointerOrInterfaceFieldType(fieldType)) {
    return v === null || v === undefined
  }
  const t = $.isVarRef(v) ? (v as $.VarRef<unknown>).value : v
  if (t === null || t === undefined) {
    return true
  }
  if (typeof t === 'number') {
    return t === 0
  }
  if (typeof t === 'bigint') {
    return t === 0n
  }
  if (typeof t === 'string') {
    return t === ''
  }
  if (typeof t === 'boolean') {
    return t === false
  }
  if ($.isArrayOrGoSlice(t) || $.isTypedSlice(t)) {
    return t.length === 0
  }
  if (t instanceof Map) {
    return t.size === 0
  }
  return false
}

function isPointerOrInterfaceFieldType(fieldType: unknown): boolean {
  if (fieldType === null || typeof fieldType !== 'object') {
    return false
  }
  const kind = Reflect.get(fieldType, 'kind')
  return kind === $.TypeKind.Pointer || kind === $.TypeKind.Interface
}

// marshalRawMessage returns the JSON of a json.RawMessage value, which is
// that JSON itself, compacted, or null for an empty or nil message.
function marshalRawMessage(value: unknown): unknown {
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

function marshalFieldValue(
  value: unknown,
  fieldType: unknown,
  addressable: boolean,
): unknown {
  if (isRawMessageType(fieldType)) {
    return marshalRawMessage(value)
  }
  // Go encodes a float32 with the shortest digits that round trip at 32 bits;
  // the float64 nearest those digits serializes with the same digits.
  if (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    isFloat32Type(resolveTypeInfo(fieldType))
  ) {
    return Number($.formatFloat(value, 'g', -1, 32))
  }
  return marshalValue(value, fieldType, addressable)
}

// isStructValueType reports whether typeInfo is a struct type, rather than a
// pointer to one, so that a value of it has only the value method set.
function isStructValueType(typeInfo: unknown): boolean {
  if (typeof typeInfo === 'string') {
    if (typeInfo.startsWith('*')) {
      return false
    }
    if (typeInfo.startsWith('struct{') || typeInfo.startsWith('struct {')) {
      return true
    }
  }
  const info = resolveTypeInfo(typeInfo)
  return info !== null && info.kind === $.TypeKind.Struct
}

// pointerReceiverMethod reports whether the method name of the struct type
// typeInfo is only in the method set of a pointer to the type.
function pointerReceiverMethod(typeInfo: unknown, name: string): boolean {
  const info = resolveTypeInfo(typeInfo)
  if (info === null || !$.isStructTypeInfo(info)) {
    return false
  }
  return info.methods.some(
    (method) => method.name === name && method.pointerReceiver === true,
  )
}

// marshalJSONTarget returns value as a Marshaler when its method set has
// MarshalJSON. As in Go, a struct value that is not addressable does not
// have the methods with pointer receivers, which lets such a MarshalJSON
// marshal the value it points to with the default encoding.
function marshalJSONTarget(
  value: unknown,
  typeInfo?: unknown,
  addressable = true,
): Marshaler | null {
  const target = $.isVarRef(value) ? value.value : value
  if (target === null || target === undefined) {
    return null
  }
  if (typeof target !== 'object' && typeof target !== 'function') {
    return null
  }
  const method = Reflect.get(target, 'MarshalJSON')
  if (typeof method !== 'function') {
    return null
  }
  if (
    !addressable &&
    isStructValueType(typeInfo) &&
    pointerReceiverMethod(typeInfo, 'MarshalJSON')
  ) {
    return null
  }
  return target as Marshaler
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

// unwrapPointerBox returns the pointer held by an interface box of a
// pointer type with methods, such as *T for a named slice or map type T,
// tagged with the box's Go type as interfaceValue tags a plain pointer.
// A box whose methods include UnmarshalJSON is kept, so that it is called.
function unwrapPointerBox(value: unknown): unknown {
  if (
    !$.isNamedValueBox(value) ||
    !$.isVarRef(value.__goValue) ||
    unmarshalJSONTarget(value) !== null
  ) {
    return value
  }
  const info = Reflect.get(value, '__goTypeInfo') as
    | $.TypeInfo
    | string
    | undefined
  return $.interfaceValue(value.__goValue, value.__goType, info)
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

// parseJSONStringLiteral returns the Go string of a JSON string literal in a
// Go string (a string of UTF-8 bytes), validating it with JSON.parse, which
// keeps the bytes of the literal as they are. A \u escape gives JavaScript
// text, so a literal with one is decoded here, with each escape encoded as
// UTF-8, as Go does, and an unpaired surrogate as U+FFFD.
function parseJSONStringLiteral(raw: string): string {
  // JSON.parse validates the literal, whose result is right without \u.
  const parsed = JSON.parse(raw) as string
  if (!raw.includes('\\u')) {
    return parsed
  }

  // The literal between its quotes is copied up to each escape.
  let out = ''
  const end = raw.length - 1
  let start = 1
  let i = 1
  while (i < end) {
    // Bytes other than a backslash are copied as they are.
    if (raw.charCodeAt(i) !== 0x5c) {
      i++
      continue
    }
    out += raw.substring(start, i)

    // A \u escape gives the UTF-8 bytes of its rune, and another escape
    // its ASCII character.
    if (raw[i + 1] === 'u') {
      const [r, next] = jsonUnicodeEscape(raw, i)
      out += $.runeToString(r)
      i = next
    } else {
      out += JSON.parse('"' + raw.substring(i, i + 2) + '"') as string
      i += 2
    }
    start = i
  }
  return out + raw.substring(start, end)
}

// jsonUnicodeEscape decodes the \u escape at offset i of a JSON string
// literal, with the low surrogate escape that follows a high one, returning
// the rune, or U+FFFD for an unpaired surrogate, and the offset after it.
function jsonUnicodeEscape(raw: string, i: number): [number, number] {
  // A rune outside the surrogates is the escape's value.
  const r = parseInt(raw.substring(i + 2, i + 6), 16)
  i += 6
  if (r < 0xd800 || r >= 0xe000) {
    return [r, i]
  }

  // A high surrogate pairs with a following low surrogate escape.
  if (r < 0xdc00 && raw[i] === '\\' && raw[i + 1] === 'u') {
    const r2 = parseInt(raw.substring(i + 2, i + 6), 16)
    if (r2 >= 0xdc00 && r2 < 0xe000) {
      return [0x10000 + ((r - 0xd800) << 10) + (r2 - 0xdc00), i + 6]
    }
  }
  return [0xfffd, i]
}

function parseJSON(data: $.Slice<number>, opts: decodeOptions): unknown {
  const text = $.bytesToString(data)
  const [value, end] = scanJSONValue(text, 0, !!opts.useNumber)
  const rest = skipJSONWhitespace(text, end)
  if (rest !== text.length) {
    throw jsonSyntaxError(rest + 1, 'invalid character after top-level value')
  }
  return value
}

// storeDecodedValue stores a decoded value into target. As in Go, decoding
// an object into a non-nil map adds its entries to the existing map rather
// than replacing it.
function storeDecodedValue(target: $.VarRef<unknown>, value: unknown): void {
  if (target.value instanceof Map && value instanceof Map) {
    for (const [key, elem] of value) {
      target.value.set(key, elem)
    }
    return
  }
  target.value = value
}

function assignDecodedValue(
  target: unknown,
  decoded: unknown,
  opts: decodeOptions,
): void {
  if ($.isVarRef(target)) {
    const unmarshaler = unmarshalJSONTarget(target.value)
    if (unmarshaler !== null) {
      callUnmarshalJSON(unmarshaler, $.stringToBytes(decodedJSONText(decoded)))
      return
    }
    // A pointer to a named basic type that implements
    // encoding.TextUnmarshaler, such as an enum, decodes from a string
    // through UnmarshalText.
    if (typeof decoded === 'string') {
      const info = textUnmarshalerElemInfo(target)
      if (info !== null) {
        unmarshalText(decoded, info, (value) => {
          target.value = value
        })
        return
      }
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
    // A slice of a named basic type with a text method, such as []Enum,
    // decodes by the structured type information of the target, which keeps
    // the element type's methods that its spelling below cannot.
    const elemSlice = textUnmarshalerSliceInfo(target)
    if (elemSlice !== null && $.isArrayOrGoSlice(decoded)) {
      target.value = decodeValueForType(decoded, elemSlice, opts)
      return
    }
    const spelling = unmarshalTargetGoType(target)
    if (spelling !== null) {
      let desc: unknown = goTypeDescriptor(spelling)
      // An anonymous (inline, unnamed) struct target, e.g. `var loose
      // struct{ Name string "json:\"name\"" }`, carries no class or registered
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
      let info = resolveTypeInfo(desc)
      if (info === null) {
        // A named type that is not registered by name, such as a named
        // slice or map type, is described by the pointer's type info.
        const elemInfo = unmarshalTargetElemTypeInfo(target)
        if (elemInfo !== null) {
          desc = elemInfo
          info = elemInfo
        }
      }
      if (info !== null) {
        if (
          ($.isSliceTypeInfo(info) && $.isArrayOrGoSlice(decoded)) ||
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
          storeDecodedValue(target, decodeValueForType(decoded, desc, opts))
          return
        }
      }
    }
    if (isPlainObject(decoded) || $.isArrayOrGoSlice(decoded)) {
      storeDecodedValue(target, decodeInterfaceValue(decoded))
      return
    }
    target.value = decoded
    return
  }
  if (isStructValue(target) && isPlainObject(decoded)) {
    assignStructFields(target, decoded, opts)
  }
}

// decodedFieldKey returns the key of the decoded object for the field with
// the given JSON name, of the fields with the given names, or undefined if
// it has none. As in Go, a key matches the name of a field without case,
// unless another field has that exact name, and the last key that matches
// is the one that is used, as the later keys overwrite the earlier ones.
function decodedFieldKey(
  decoded: Record<string, unknown>,
  jsonName: string,
  names: Set<string>,
): string | undefined {
  const folded = jsonName.toLowerCase()
  let found: string | undefined
  for (const key of Object.keys(decoded)) {
    if (key === jsonName || (!names.has(key) && key.toLowerCase() === folded)) {
      found = key
    }
  }
  return found
}

// checkUnknownFields returns an error, for DisallowUnknownFields, if the
// decoded object has a key that matches none of the given names of the
// fields, without case.
function checkUnknownFields(
  decoded: Record<string, unknown>,
  names: Set<string>,
): void {
  const folded = new Set([...names].map((name) => name.toLowerCase()))
  for (const key of Object.keys(decoded)) {
    if (!names.has(key) && !folded.has(key.toLowerCase())) {
      throw $.newError(`json: unknown field "${key}"`)
    }
  }
}

function assignStructFields(
  target: Record<string, unknown>,
  decoded: Record<string, unknown>,
  opts: decodeOptions,
): void {
  const fields = jsonStructFields(target)
  const names = new Set(fields.map((field) => field.jsonName))
  if (opts.disallowUnknownFields) {
    checkUnknownFields(decoded, names)
  }
  for (const { jsonName, owner, field } of fields) {
    if (!(field.key in owner)) {
      continue
    }
    const key = decodedFieldKey(decoded, jsonName, names)
    if (key !== undefined) {
      assignDecodedFieldValue(
        $.fieldRef(owner, field.key),
        decoded[key],
        opts,
        field.type,
      )
    }
  }
}

// reuseInterfacePointerElements sets target to the decoded slice of
// interfaces value, except that each element that the slice held before
// decoding a pointer is decoded into that pointer instead, as Go decodes
// into an existing element, and into the pointer an interface holds. When
// every element is reused, the slice is left as the UnmarshalJSON calls
// left it, as in Go, where they may replace elements of the slice.
function reuseInterfacePointerElements(
  target: $.VarRef<unknown>,
  value: unknown,
  decoded: unknown[],
  info: $.SliceTypeInfo,
  opts: decodeOptions,
): void {
  // Only a slice of interfaces that held elements before decoding reuses any.
  const existing = target.value
  const elemInfo = resolveTypeInfo(info.elemType)
  if (
    elemInfo === null ||
    !$.isInterfaceTypeInfo(elemInfo) ||
    existing === null ||
    existing === undefined ||
    $.len(existing as $.Slice<unknown>) === 0
  ) {
    target.value = value
    return
  }

  // Each old struct element is decoded into in place, when it can be.
  const old = $.asArray(existing as $.Slice<unknown>)
  const out = $.asArray(value as $.Slice<unknown>).slice()
  let reused = 0
  for (let i = 0; i < out.length && i < old.length; i++) {
    const elem = old[i]
    if (!isStructValue(elem) || decoded[i] === null) {
      continue
    }
    const unmarshaler = unmarshalJSONTarget(elem)
    if (unmarshaler !== null) {
      callUnmarshalJSON(
        unmarshaler,
        $.stringToBytes(decodedJSONText(decoded[i])),
      )
    } else if (isPlainObject(decoded[i])) {
      assignStructFields(elem, decoded[i] as Record<string, unknown>, opts)
    } else {
      continue
    }
    out[i] = elem
    reused++
  }

  // A slice whose elements were all reused is left as UnmarshalJSON left it.
  if (reused === out.length && out.length === old.length) {
    return
  }
  target.value = reused === 0 ? value : $.arrayToSlice(out)
}

// jsonStructField is a field of a struct as encoding/json sees it: an
// exported field of the struct or of a struct embedded in it, with the
// storage that holds it.
type jsonStructField = {
  jsonName: string
  owner: Record<string, unknown>
  field: fieldMetadata
  depth: number
  tagged: boolean
}

// jsonStructFields returns the fields of a struct as encoding/json encodes
// them, in order: the exported fields, with the fields of embedded structs
// without a JSON name in place of them. Of the fields with the same JSON
// name, the least nested one is used, or the one with a JSON name among
// those equally nested, as in Go; otherwise none is.
function jsonStructFields(value: Record<string, unknown>): jsonStructField[] {
  // The fields are collected from the struct and the structs embedded in it.
  const all: jsonStructField[] = []
  const visit = (
    target: Record<string, unknown>,
    depth: number,
    seen: Set<object>,
  ) => {
    for (const field of structFields(target)) {
      const tagName = jsonTagValue(field.tag)?.split(',')[0]
      if (tagName === '-' && !jsonTagValue(field.tag)?.startsWith('-,')) {
        continue
      }
      if (field.anonymous && !tagName) {
        let inner = target[field.key]
        if ($.isVarRef(inner)) {
          inner = inner.value
        }
        if (isStructValue(inner)) {
          if (!seen.has(inner)) {
            seen.add(inner)
            visit(inner, depth + 1, seen)
          }
          continue
        }
        if (inner === null) {
          continue
        }
      }
      if (!fieldExported(field)) {
        continue
      }
      all.push({
        jsonName: tagName || field.name,
        owner: target,
        field,
        depth,
        tagged: !!tagName,
      })
    }
  }
  visit(value, 0, new Set([value]))

  // Keep the dominant field of each name.
  const byName = new Map<string, jsonStructField[]>()
  for (const field of all) {
    const named = byName.get(field.jsonName)
    if (named === undefined) {
      byName.set(field.jsonName, [field])
    } else {
      named.push(field)
    }
  }
  return all.filter((field) => {
    // A name used once is kept.
    const named = byName.get(field.jsonName)!
    if (named.length === 1) {
      return true
    }

    // Among equal names, the shallowest wins, or the only tagged one at that depth.
    const depth = Math.min(...named.map((f) => f.depth))
    const shallow = named.filter((f) => f.depth === depth)
    const tagged = shallow.filter((f) => f.tagged)
    const dominant =
      shallow.length === 1 ? shallow[0]
      : tagged.length === 1 ? tagged[0]
      : null
    return dominant === field
  })
}

// fieldExported reports whether a struct field is exported.
function fieldExported(field: fieldMetadata): boolean {
  if (field.exported !== undefined) {
    return field.exported
  }
  const first = field.name[0] ?? ''
  return first.toUpperCase() === first && first.toLowerCase() !== first
}

function assignDecodedFieldValue(
  target: $.VarRef<unknown>,
  decoded: unknown,
  opts: decodeOptions,
  fieldType: unknown,
): void {
  if (isRawMessageType(fieldType)) {
    target.value = $.stringToBytes(decodedJSONText(decoded))
    return
  }
  // Decode Map/Slice-typed fields (including nested combinations, e.g.
  // map[string][]Struct) through the type-driven decoder below. Gated on the
  // decoded JSON shape actually matching (array for Slice, object for Map) so
  // every other field shape (basic types, []byte-as-base64-string, etc.)
  // falls through to the untouched generic path exactly as before.
  const info = resolveTypeInfo(fieldType)
  if (info !== null) {
    // A []byte field decodes from a base64 string even when it is nil, and
    // so holds no Uint8Array for the generic path to recognize.
    if (isByteSliceTypeInfo(info) && typeof decoded === 'string') {
      target.value = base64Decode(decoded)
      return
    }
    if ($.isSliceTypeInfo(info) && Array.isArray(decoded)) {
      reuseInterfacePointerElements(
        target,
        decodeValueForType(decoded, info, opts),
        decoded,
        info,
        opts,
      )
      return
    }
    if ($.isMapTypeInfo(info) && isPlainObject(decoded)) {
      storeDecodedValue(target, decodeValueForType(decoded, info, opts))
      return
    }
    // A field of a named basic type that implements
    // encoding.TextUnmarshaler, such as an enum, decodes from a string
    // through UnmarshalText.
    if (typeof decoded === 'string' && hasTextMethod(info, 'UnmarshalText')) {
      unmarshalText(decoded, info, (value) => {
        target.value = value
      })
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
    if (typeof decoded === 'number' && isFloat32Type(info)) {
      target.value = Math.fround(decoded)
      return
    }
  }
  assignDecodedValue(target, decoded, opts)
}

// unmarshalTargetElemTypeInfo returns the element type info of the pointer
// type info that interfaceValue attached to an Unmarshal target, or null.
function unmarshalTargetElemTypeInfo(target: unknown): $.TypeInfo | null {
  if (target === null || typeof target !== 'object') {
    return null
  }
  const info = resolveTypeInfo(Reflect.get(target, '__goTypeInfo'))
  if (info === null || !$.isPointerTypeInfo(info)) {
    return null
  }
  return resolveTypeInfo(info.elemType)
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

// isFloat32Type reports whether info is float32, whose values are float64
// numbers rounded to float32 precision.
function isFloat32Type(info: $.TypeInfo | null): boolean {
  return info?.kind === $.TypeKind.Basic && info.name === 'float32'
}

// typedSliceOf returns decoded slice elements of elemType in the typed array
// that holds slices of such elements, as the compiled program makes them, or
// the elements as they are for elements held in plain arrays.
function typedSliceOf(out: unknown[], elemType: unknown): unknown {
  // A basic element type is named by its spelling or by its type info.
  const elem = resolveTypeInfo(elemType)
  const name =
    typeof elemType === 'string' ? elemType
    : elem !== null && elem.kind === $.TypeKind.Basic ? elem.name
    : ''
  const ctor = $.typedSliceConstructor(name === 'uint8' ? 'byte' : name)
  if (ctor === undefined || !out.every((el) => typeof el === 'number')) {
    return out
  }
  return ctor.from(out as number[])
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
  assign?: Assign,
): unknown {
  if (isRawMessageType(typeInfo) && decoded !== undefined) {
    return $.stringToBytes(decodedJSONText(decoded))
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
  if (isNumberBox(decoded)) {
    // A typed target receives the number literal.
    decoded = decoded.__goValue
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
        callUnmarshalJSON(
          unmarshaler,
          $.stringToBytes(decodedJSONText(decoded)),
        )
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
    if (isByteSliceTypeInfo(info) && typeof decoded === 'string') {
      return base64Decode(decoded)
    }
    if (!$.isArrayOrGoSlice(decoded)) {
      return decoded
    }
    const out: unknown[] = new Array(decoded.length)
    decoded.forEach((el, i) => {
      out[i] = decodeValueForType(el, info.elemType, opts, (value) => {
        out[i] = value
      })
    })
    return typedSliceOf(out, info.elemType)
  }
  if ($.isMapTypeInfo(info)) {
    if (!isPlainObject(decoded)) {
      return decoded
    }
    const out = new Map<unknown, unknown>()
    for (const [key, value] of Object.entries(decoded)) {
      // The key or the element may be assigned later, when its
      // UnmarshalText suspends; the entry is set once the key is known.
      let mapKey: unknown = undefined
      let hasKey = false
      let elem = decodeValueForType(value, info.elemType, opts, (v) => {
        elem = v
        if (hasKey) {
          out.set(mapKey, elem)
        }
      })
      decodeMapKey(key, info.keyType, (k) => {
        mapKey = k
        hasKey = true
        out.set(mapKey, elem)
      })
    }
    return out
  }
  // float32 values are float64 numbers rounded to float32 precision.
  if (typeof decoded === 'number' && isFloat32Type(info)) {
    return Math.fround(decoded)
  }
  if (typeof decoded === 'string' && hasTextMethod(info, 'UnmarshalText')) {
    let result: unknown = undefined
    let returned = false
    unmarshalText(decoded, info, (value) => {
      result = value
      if (returned) {
        assign?.(value)
      }
    })
    returned = true
    return result
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
  if ($.isArrayOrGoSlice(decoded)) {
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
  if (rawMessageTypeNames.has(s)) {
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
// fieldMetadata. Embedded and unexported fields are skipped because
// encoding/json cannot address promoted fields from this spelling alone and
// ignores unexported fields even when they carry json tags.
function parseAnonymousStructFields(body: string): fieldMetadata[] {
  const fields: fieldMetadata[] = []
  for (const decl of splitGoFieldDecls(body)) {
    const [spec, tag] = splitGoFieldTag(decl.trim())
    const space = spec.indexOf(' ')
    if (space < 0) {
      continue
    }
    const name = spec.slice(0, space)
    const first = name[0] ?? ''
    if (first.toUpperCase() !== first || first.toLowerCase() === first) {
      continue
    }
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
  const names = new Set<string>()
  for (const field of fields) {
    const jsonName = jsonFieldName(field.name, field.tag)
    if (jsonName !== '') {
      names.add(jsonName)
    }
  }
  if (opts.disallowUnknownFields) {
    checkUnknownFields(decoded, names)
  }
  for (const field of fields) {
    const jsonName = jsonFieldName(field.name, field.tag)
    const key =
      jsonName === '' ? undefined : decodedFieldKey(decoded, jsonName, names)
    if (key === undefined) {
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
    const fieldValue = decoded[key]
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

function isStructValue(value: unknown): value is Record<string, unknown> {
  return $.isStructObject(value)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !$.isNamedValueBox(value) &&
    !$.isArrayOrGoSlice(value) &&
    !$.isTypedSlice(value) &&
    !(value instanceof Map)
  )
}

function structFields(value: Record<string, unknown>): fieldMetadata[] {
  const fields = structFieldMetadata(value)
  if (fields.length !== 0) {
    return fields
  }
  return $.ownKeys(value).map((key) => ({ key, name: key }))
}

// anonymousStructValueFields returns the fields of an anonymous struct
// value, which carries its descriptor instead of a class, or null for any
// other value.
function anonymousStructValueFields(value: unknown): fieldMetadata[] | null {
  if (
    value === null ||
    typeof value !== 'object' ||
    $.isArrayOrGoSlice(value)
  ) {
    return null
  }
  const info = resolveTypeInfo($.structValueTypeInfo(value))
  if (info === null || !$.isStructTypeInfo(info)) {
    return null
  }
  return info.fields.map((field) => ({
    key: $.structFieldRuntimeKey(field),
    name: field.name,
    type: field.type,
    ...(typeof field.tag === 'string' ? { tag: field.tag } : {}),
  }))
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
  if ($.isArrayOrGoSlice(fields)) {
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
        ...(field.anonymous ? { anonymous: true } : {}),
        ...(typeof field.exported === 'boolean' ? { exported: field.exported }
        : typeof field.pkgPath === 'string' && field.pkgPath !== '' ?
          { exported: false }
        : {}),
      })
    }
    return out
  }
  return []
}

// rawMessageTypeNames are the type spellings of json.RawMessage. With the
// encoding/json v2 implementation (the default since Go 1.27), RawMessage is
// an alias for jsontext.Value, so the compiler spells it that way.
const rawMessageTypeNames = new Set([
  'json.RawMessage',
  'encoding/json.RawMessage',
  'jsontext.Value',
  'encoding/json/jsontext.Value',
])

function isRawMessageType(value: unknown): boolean {
  if (typeof value === 'string') {
    return rawMessageTypeNames.has(value)
  }
  if (!isPlainObject(value)) {
    return false
  }
  return (
    (typeof value.typeName === 'string' &&
      rawMessageTypeNames.has(value.typeName)) ||
    (typeof value.name === 'string' && rawMessageTypeNames.has(value.name))
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

// isByteSliceTypeInfo reports whether info describes a []byte, which JSON
// encodes as a base64 string.
function isByteSliceTypeInfo(info: $.TypeInfo): boolean {
  if (!$.isSliceTypeInfo(info)) {
    return false
  }
  const elem = resolveTypeInfo(info.elemType)
  const name =
    elem === null ? info.elemType
    : $.isBasicTypeInfo(elem) ? elem.name
    : undefined
  return name === 'uint8' || name === 'byte'
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

// jsonFieldName returns the JSON name of a struct field: the name in its json
// tag, or the field name without one, or "" when the tag omits the field.
function jsonFieldName(fieldName: string, tag: string | undefined): string {
  // Without a json tag the field keeps its name.
  const value = jsonTagValue(tag)
  if (value === undefined) {
    return fieldName
  }

  // The name is the part of the tag before the options.
  const name = value.split(',')[0]
  if (name === '-') {
    return ''
  }
  if (name === '') {
    return fieldName
  }
  return name
}
