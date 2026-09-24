import * as $ from '@goscript/builtin/index.js'

// Value is a raw JSON value: the raw textual representation of a JSON value.
export type Value = $.Bytes

// Value_MarshalJSON returns v as the JSON encoding of v.
// It performs no validation. If v is nil, it returns a JSON null.
export function Value_MarshalJSON(v: Value): [$.Slice<number>, $.GoError] {
  if (v === null) {
    return [$.stringToBytes('null'), null]
  }
  const out = $.makeSlice<number>($.len(v), undefined, 'byte')
  $.copy(out, v)
  return [out, null]
}

// Value_UnmarshalJSON sets v as the JSON encoding of b.
// It stores a copy of the provided raw JSON input without any validation.
export function Value_UnmarshalJSON(
  v: $.VarRef<Value> | Value | null,
  b: $.Slice<number>,
): $.GoError {
  if ($.isVarRef(v)) {
    const out = $.makeSlice<number>($.len(b), undefined, 'byte')
    $.copy(out, b)
    v.value = out
    return null
  }
  return $.newError('jsontext.Value: UnmarshalJSON on nil pointer')
}

// Value_String returns the string formatting of v.
export function Value_String(v: Value): string {
  if (v === null) {
    return 'null'
  }
  return $.bytesToString(v)
}

// Value_Clone returns a copy of v.
export function Value_Clone(v: Value): Value {
  if (v === null) {
    return null
  }
  const out = $.makeSlice<number>($.len(v), undefined, 'byte')
  $.copy(out, v)
  return out
}

// Options configures validation and formatting of a raw JSON value.
export type Options = { name: keyof FormatOptions; setting: boolean | string }

type FormatOptions = {
  allowDuplicateNames: boolean
  allowInvalidUTF8: boolean
  escapeForHTML: boolean
  escapeForJS: boolean
  preserveRawStrings: boolean
  canonicalizeRawInts: boolean
  canonicalizeRawFloats: boolean
  reorderRawObjects: boolean
  spaceAfterColon: boolean
  spaceAfterComma: boolean
  multiline: boolean
  indent: string
  indentPrefix: string
}

export const AllowDuplicateNames = (value: boolean): Options => ({
  name: 'allowDuplicateNames',
  setting: value,
})
export const AllowInvalidUTF8 = (value: boolean): Options => ({
  name: 'allowInvalidUTF8',
  setting: value,
})
export const EscapeForHTML = (value: boolean): Options => ({
  name: 'escapeForHTML',
  setting: value,
})
export const EscapeForJS = (value: boolean): Options => ({
  name: 'escapeForJS',
  setting: value,
})
export const PreserveRawStrings = (value: boolean): Options => ({
  name: 'preserveRawStrings',
  setting: value,
})
export const CanonicalizeRawInts = (value: boolean): Options => ({
  name: 'canonicalizeRawInts',
  setting: value,
})
export const CanonicalizeRawFloats = (value: boolean): Options => ({
  name: 'canonicalizeRawFloats',
  setting: value,
})
export const ReorderRawObjects = (value: boolean): Options => ({
  name: 'reorderRawObjects',
  setting: value,
})
export const SpaceAfterColon = (value: boolean): Options => ({
  name: 'spaceAfterColon',
  setting: value,
})
export const SpaceAfterComma = (value: boolean): Options => ({
  name: 'spaceAfterComma',
  setting: value,
})
export const Multiline = (value: boolean): Options => ({
  name: 'multiline',
  setting: value,
})
/** WithIndent sets the indentation string and enables multiline output. */
export function WithIndent(value: string): Options {
  if (/[^ \t]/.test(value)) throw new Error('json: invalid character in indent')
  return { name: 'indent', setting: value }
}

/** WithIndentPrefix sets the indentation prefix and enables multiline output. */
export function WithIndentPrefix(value: string): Options {
  if (/[^ \t]/.test(value))
    throw new Error('json: invalid character in indent prefix')
  return { name: 'indentPrefix', setting: value }
}

type Node =
  | {
      kind: 'object'
      members: { name: Extract<Node, { kind: 'string' }>; value: Node }[]
    }
  | { kind: 'array'; elements: Node[] }
  | { kind: 'string'; raw: string; text: string }
  | { kind: 'scalar'; raw: string }

function optionsOf(opts: Options[]): FormatOptions {
  const config: FormatOptions = {
    allowDuplicateNames: false,
    allowInvalidUTF8: false,
    escapeForHTML: false,
    escapeForJS: false,
    preserveRawStrings: false,
    canonicalizeRawInts: false,
    canonicalizeRawFloats: false,
    reorderRawObjects: false,
    spaceAfterColon: false,
    spaceAfterComma: false,
    multiline: false,
    indent: '\t',
    indentPrefix: '',
  }
  for (const opt of opts) {
    if (opt.name === 'indent' || opt.name === 'indentPrefix') {
      config[opt.name] = opt.setting as string
      config.multiline = true
    } else {
      // Each option has a single property, and the last occurrence wins.
      Object.assign(config, { [opt.name]: opt.setting })
    }
  }
  if (config.multiline && !opts.some((opt) => opt.name === 'spaceAfterColon')) {
    config.spaceAfterColon = true
  }
  return config
}

// binaryText preserves source bytes while parsing punctuation and tokens.
// Decoding the whole value would replace bytes PreserveRawStrings must copy.
function binaryText(bytes: Uint8Array): string {
  let text = ''
  for (const byte of bytes) text += String.fromCharCode(byte)
  return text
}

function binaryBytes(text: string): Uint8Array {
  const bytes = new Uint8Array(text.length)
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i)
  return bytes
}

function utf8Text(text: string): string {
  return binaryText(new TextEncoder().encode(text))
}

function parseValue(bytes: Value, config: FormatOptions): Node {
  if (bytes === null) {
    throw new Error('empty JSON value')
  }
  const text = binaryText($.bytesToUint8Array(bytes))
  let at = 0
  const whitespace = () => {
    while (at < text.length && ' \t\r\n'.includes(text[at])) at++
  }
  const fail = (): never => {
    throw new Error('invalid JSON value')
  }
  const string = (): Extract<Node, { kind: 'string' }> => {
    const start = at++
    while (at < text.length) {
      const c = text[at++]
      if (c === '\\') {
        if (at >= text.length) fail()
        at++
      } else if (c === '"') {
        const raw = text.slice(start, at)
        const decoded = JSON.parse(
          new TextDecoder('utf-8', {
            fatal: !config.allowInvalidUTF8,
            ignoreBOM: true,
          }).decode(binaryBytes(raw)),
        ) as string
        if (
          !config.allowInvalidUTF8 &&
          /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(
            decoded,
          )
        )
          fail()
        return { kind: 'string', raw, text: decoded }
      }
    }
    return fail()
  }
  const value = (depth: number): Node => {
    if (depth > 10000) fail()
    whitespace()
    const c = text[at]
    if (c === '"') return string()
    if (c === '{') {
      at++
      const members: {
        name: Extract<Node, { kind: 'string' }>
        value: Node
      }[] = []
      const names = new Set<string>()
      whitespace()
      if (text[at] === '}') {
        at++
        return { kind: 'object', members }
      }
      for (;;) {
        if (text[at] !== '"') fail()
        const name = string()
        if (!config.allowDuplicateNames && names.has(name.text)) fail()
        names.add(name.text)
        whitespace()
        if (text[at++] !== ':') fail()
        members.push({ name, value: value(depth + 1) })
        whitespace()
        const sep = text[at++]
        if (sep === '}') return { kind: 'object', members }
        if (sep !== ',') fail()
        whitespace()
      }
    }
    if (c === '[') {
      at++
      const elements: Node[] = []
      whitespace()
      if (text[at] === ']') {
        at++
        return { kind: 'array', elements }
      }
      for (;;) {
        elements.push(value(depth + 1))
        whitespace()
        const sep = text[at++]
        if (sep === ']') return { kind: 'array', elements }
        if (sep !== ',') fail()
      }
    }
    const start = at
    const match =
      /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(
        text.slice(at),
      )
    if (match === null) return fail()
    at += match[0].length
    return { kind: 'scalar', raw: text.slice(start, at) }
  }
  const result = value(0)
  whitespace()
  if (at !== text.length) fail()
  return result
}

// For equal names Go compares the formatted member bytes, including the quoted
// name, to make reordered duplicate members deterministic.
function compareMembers(
  a: { name: Extract<Node, { kind: 'string' }>; value: Node },
  b: { name: Extract<Node, { kind: 'string' }>; value: Node },
  config: FormatOptions,
): number {
  const left = render(a.name, config) + ':' + render(a.value, config)
  const right = render(b.name, config) + ':' + render(b.value, config)
  // Go compares the formatted member as UTF-16, falling back to raw bytes
  // when preserved strings contain malformed UTF-8.
  let leftText = left
  let rightText = right
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true })
    leftText = decoder.decode(binaryBytes(left))
    rightText = decoder.decode(binaryBytes(right))
  } catch {
    // Preserve the byte order for malformed strings.
  }
  return (
    leftText < rightText ? -1
    : leftText > rightText ? 1
    : 0
  )
}

function render(node: Node, config: FormatOptions, depth = 0): string {
  if (node.kind === 'scalar') {
    if (!config.canonicalizeRawInts && !config.canonicalizeRawFloats)
      return node.raw
    if (/^(true|false|null)$/.test(node.raw)) return node.raw
    const integer = !/[.eE]/.test(node.raw)
    if (
      node.raw !== '-0' &&
      ((integer && !config.canonicalizeRawInts) ||
        (!integer && !config.canonicalizeRawFloats))
    )
      return node.raw
    const number = Number(node.raw)
    return JSON.stringify(
      Number.isFinite(number) ? number : Math.sign(number) * Number.MAX_VALUE,
    )
  }
  if (node.kind === 'string') {
    let raw =
      config.preserveRawStrings ?
        node.raw
      : utf8Text(
          JSON.stringify(
            node.text.replace(
              /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/gu,
              '\ufffd',
            ),
          ),
        )
    if (config.escapeForHTML)
      raw = raw.replace(
        /[<>&]/g,
        (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
      )
    if (config.escapeForJS)
      raw = raw.replace(
        /\xE2\x80[\xA8\xA9]/g,
        (c) => `\\u202${c.charCodeAt(2) === 0xa8 ? '8' : '9'}`,
      )
    return raw
  }
  const parts =
    node.kind === 'object' ?
      (config.reorderRawObjects ?
        [...node.members].sort((a, b) =>
          a.name.text < b.name.text ? -1
          : a.name.text > b.name.text ? 1
          : compareMembers(a, b, config),
        )
      : node.members
      ).map(
        ({ name, value }) =>
          render(name, config, depth + 1) +
          ':' +
          (config.spaceAfterColon ? ' ' : '') +
          render(value, config, depth + 1),
      )
    : node.elements.map((element) => render(element, config, depth + 1))
  const open = node.kind === 'object' ? '{' : '['
  const close = node.kind === 'object' ? '}' : ']'
  if (!config.multiline || parts.length === 0)
    return open + parts.join(config.spaceAfterComma ? ', ' : ',') + close
  const pad = config.indentPrefix + config.indent.repeat(depth + 1)
  return (
    open +
    '\n' +
    pad +
    parts.join(',\n' + pad) +
    '\n' +
    config.indentPrefix +
    config.indent.repeat(depth) +
    close
  )
}

// Value_IsValid reports whether the bytes hold exactly one valid JSON value.
export function Value_IsValid(v: Value, ...opts: Options[]): boolean {
  try {
    parseValue(v, optionsOf(opts))
    return true
  } catch {
    return false
  }
}

// Value_Kind returns the normalized starting token kind without validation.
export function Value_Kind(v: Value): number {
  if (v === null) return 0
  const first = $.bytesToUint8Array(v).find((c) => ![32, 9, 10, 13].includes(c))
  if (first === undefined) return 0
  if (first === 45 || (first >= 48 && first <= 57)) return 48
  return [110, 102, 116, 34, 123, 125, 91, 93].includes(first) ? first : 0
}

// Value_format applies both option lists in order, leaving the value unchanged on error.
export function Value_format(
  v: $.VarRef<Value> | Value | null,
  opts1: Options[] | null,
  opts2: Options[] | null,
): $.GoError {
  if (!$.isVarRef(v)) return $.newError('jsontext.Value: Format on nil pointer')
  try {
    const config = optionsOf([...(opts1 ?? []), ...(opts2 ?? [])])
    const output = binaryBytes(render(parseValue(v.value, config), config))
    const input = $.bytesToUint8Array(v.value)
    if (
      input.length !== output.length ||
      input.some((byte, i) => byte !== output[i])
    )
      v.value = output
    return null
  } catch (error) {
    return $.newError(error instanceof Error ? error.message : String(error))
  }
}

// Value_Format validates and minimally formats the value in place.
export function Value_Format(
  v: $.VarRef<Value> | Value | null,
  ...opts: Options[]
): $.GoError {
  return Value_format(v, opts, null)
}

// Value_Compact removes whitespace but preserves raw string and number spelling.
export function Value_Compact(
  v: $.VarRef<Value> | Value | null,
  ...opts: Options[]
): $.GoError {
  return Value_format(
    v,
    [
      AllowDuplicateNames(true),
      AllowInvalidUTF8(true),
      PreserveRawStrings(true),
    ],
    opts,
  )
}

// Value_Indent expands arrays and objects while preserving raw tokens.
export function Value_Indent(
  v: $.VarRef<Value> | Value | null,
  ...opts: Options[]
): $.GoError {
  return Value_format(
    v,
    [
      AllowDuplicateNames(true),
      AllowInvalidUTF8(true),
      PreserveRawStrings(true),
      Multiline(true),
    ],
    opts,
  )
}

// Value_Canonicalize normalizes numbers and sorts object members.
export function Value_Canonicalize(
  v: $.VarRef<Value> | Value | null,
  ...opts: Options[]
): $.GoError {
  return Value_format(
    v,
    [
      CanonicalizeRawInts(true),
      CanonicalizeRawFloats(true),
      ReorderRawObjects(true),
    ],
    opts,
  )
}
