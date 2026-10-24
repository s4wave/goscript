// Handwritten TypeScript implementation of Go's fmt package
// Optimized for JavaScript runtime and simplified for common use cases

import * as $ from '@goscript/builtin/index.js'
import { writeHostStdoutText } from '@goscript/builtin/hostio.js'
import {
  Array as ArrayKind,
  PointerTo,
  Slice as SliceKind,
  Struct,
  TypeOf,
  Value,
} from '@goscript/reflect/type.js'
import {
  CanBackquote,
  Quote,
  QuoteRune,
  QuoteRuneToASCII,
  QuoteToASCII,
} from '@goscript/strconv/index.js'

// padRunes pads the Go string s with fill to width runes, as Go counts a
// width in runes, before s if left is true or else after it.
function padRunes(
  s: string,
  width: number,
  fill: string,
  left: boolean,
): string {
  // Each byte that is not a continuation byte starts a rune.
  let runes = 0
  for (let i = 0; i < s.length; i++) {
    if ((s.charCodeAt(i) & 0xc0) !== 0x80) {
      runes++
    }
  }

  // The fill makes up the runes short of width.
  if (runes >= width) {
    return s
  }
  const pad = fill.repeat(width - runes)
  return left ? pad + s : s + pad
}

// Stringer Basic interfaces.
export interface Stringer {
  String(): string
}

export interface GoStringer {
  GoString(): string
}

export interface Formatter {
  Format(f: State, verb: number): void
}

export interface State {
  Flag(c: number): boolean
  Precision(): [number, boolean]
  Width(): [number, boolean]
  Write(b: $.Bytes): [number, $.GoError | null]
}

// The fmt interfaces are registered with the runtime type system, so that
// type assertions and reflect.TypeFor know them by name.
$.registerInterfaceType('fmt.Stringer', null, [
  $.methodSignature('String', [], [$.basicType('string')]),
])
$.registerInterfaceType('fmt.GoStringer', null, [
  $.methodSignature('GoString', [], [$.basicType('string')]),
])
$.registerInterfaceType('fmt.State', null, [
  $.methodSignature('Flag', [['c', $.basicType('int')]], [$.basicType('bool')]),
  $.methodSignature('Precision', [], [$.basicType('int'), $.basicType('bool')]),
  $.methodSignature('Width', [], [$.basicType('int'), $.basicType('bool')]),
  $.methodSignature(
    'Write',
    [['b', $.sliceType($.basicType('uint8'))]],
    [$.basicType('int'), 'error'],
  ),
])
$.registerInterfaceType('fmt.Formatter', null, [
  $.methodSignature('Format', [
    ['f', 'fmt.State'],
    ['verb', $.basicType('int32')],
  ]),
])

// basicValue returns the primitive inside a boxed basic interface value, or
// value itself when it is not boxed.
function basicValue(value: unknown): unknown {
  return value !== null && typeof value === 'object' && '__goValue' in value ?
      value.__goValue
    : value
}

// formatInt renders an integer value in the given radix, applying Go's # flag
// (0x/0X/0 base prefix) and +/space sign flags. The sign precedes the prefix,
// matching fmt's "%+#x" ordering.
function formatInt(
  value: unknown,
  radix: number,
  flags: string,
  upper: boolean,
): string {
  const primitive = basicValue(value)
  const neg =
    typeof primitive === 'bigint' ? primitive < 0n : Number(primitive) < 0
  let digits =
    typeof primitive === 'bigint' ?
      (neg ? -primitive : primitive).toString(radix)
    : Math.abs(Math.trunc(Number(primitive))).toString(radix)
  if (upper) {
    digits = digits.toUpperCase()
  }
  let prefix = ''
  if (flags.includes('#')) {
    if (radix === 16) {
      prefix = upper ? '0X' : '0x'
    } else if (radix === 8 && !digits.startsWith('0')) {
      prefix = '0'
    }
  }
  let sign = ''
  if (neg) {
    sign = '-'
  } else if (flags.includes('+')) {
    sign = '+'
  } else if (flags.includes(' ')) {
    sign = ' '
  }
  return sign + prefix + digits
}

// formatHexBytes formats a byte slice or the bytes of a string in hexadecimal
// for %x and %X, two digits per byte, with the space and # flags as in Go.
function formatHexBytes(
  value: Uint8Array | string,
  flags: string,
  upper: boolean,
): string {
  // Read the bytes and the prefix and spacing the flags ask for.
  const bytes = typeof value === 'string' ? $.stringToBytes(value) : value
  const prefix =
    flags.includes('#') ?
      upper ? '0X'
      : '0x'
    : ''
  const space = flags.includes(' ')

  // Write two digits per byte, prefixing each spaced byte or only the first.
  let result = ''
  for (let i = 0; i < bytes.length; i++) {
    if (space && i > 0) {
      result += ' '
    }
    if (prefix !== '' && (space || i === 0)) {
      result += prefix
    }
    const hex = bytes[i].toString(16).padStart(2, '0')
    result += upper ? hex.toUpperCase() : hex
  }
  return result
}

// elementwiseVerbs are the verbs that Go applies to each element of a slice or
// array.
const elementwiseVerbs = new Set([
  'd',
  'f',
  'F',
  'q',
  't',
  'c',
  'x',
  'X',
  'o',
  'b',
  'e',
  'E',
  'g',
  'G',
])

// formatQuoted applies %q with Go's quoting rules: an integer is a rune
// literal, anything else a string literal. The + flag escapes non-ASCII and
// the # flag prefers a raw string literal.
function formatQuoted(value: any, flags: string): string {
  const ascii = flags.includes('+')
  const primitive = basicValue(value)
  if (typeof primitive === 'number' && Number.isInteger(primitive)) {
    return ascii ? QuoteRuneToASCII(primitive) : QuoteRune(primitive)
  }
  const str =
    primitive instanceof Uint8Array ?
      $.bytesToString(primitive)
    : String(primitive)
  if (flags.includes('#') && CanBackquote(str)) {
    return '`' + str + '`'
  }
  return ascii ? QuoteToASCII(str) : Quote(str)
}

// Simple printf-style formatting implementation for verbs that cannot
// produce async results (numbers, runes, booleans). Value formatting that can
// consult Error/String/GoString goes through formatValueMaybe instead.
function formatValue(value: any, verb: string, flags = ''): string {
  if (value === null || value === undefined) {
    return '<nil>'
  }

  switch (verb) {
    case 'd': // decimal integer
      return formatInt(value, 10, flags, false)
    case 'f': // decimal point, no exponent
    case 'F':
      return formatFloatVerb(value, verb, '')
    case 's': // string
      if (typeof value === 'string') return value
      if (value instanceof Uint8Array) return $.bytesToString(value)
      return String(defaultFormatMaybe(value))
    case 't': // boolean
      return value ? 'true' : 'false'
    case 'T': // type (approximate Go names for primitives we need)
      if (hasGoTypeName(value)) return $.goTypeString(value.__goType)
      if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'float64'
      }
      if (typeof value === 'boolean') return 'bool'
      if (typeof value === 'string') return 'string'
      return typeof value
    case 'c': // character (Unicode code point)
      // Go's %c encodes the rune as a Unicode character; fromCharCode truncates
      // any code point above U+FFFF and mangles surrogates. runeToString owns
      // the Go string(rune) rule (astral intact, invalid -> U+FFFD, no throw).
      return $.runeToString(Number(value))
    case 'x': // hexadecimal lowercase
      if (value instanceof Uint8Array || typeof value === 'string') {
        return formatHexBytes(value, flags, false)
      }
      return formatInt(value, 16, flags, false)
    case 'X': // hexadecimal uppercase
      if (value instanceof Uint8Array || typeof value === 'string') {
        return formatHexBytes(value, flags, true)
      }
      return formatInt(value, 16, flags, true)
    case 'o': // octal
      return formatInt(value, 8, flags, false)
    case 'b': // binary
      return formatInt(value, 2, flags, false)
    case 'e': // scientific notation
    case 'E':
    case 'g': // %e for large exponents, %f otherwise
    case 'G':
      return formatFloatVerb(value, verb, '')
    case 'q': // quoted string / rune
      return formatQuoted(value, flags)
    case 'p': {
      return formatPointer(value)
    }
    default:
      return String(value)
  }
}

// elementTypeInfo returns the element type of a slice or array type, if known.
// isNumberTypedSlice reports whether value is a slice of numbers other than
// bytes held in a typed array, which formats element by element as a slice
// held in a plain array does, where a byte slice formats as a whole.
function isNumberTypedSlice(value: unknown): value is $.TypedSlice {
  return $.isTypedSlice(value) && !(value instanceof Uint8Array)
}

// sliceItems returns the elements of a slice or array as an array to map.
function sliceItems(
  value: unknown[] | $.SliceProxy<unknown> | $.TypedSlice,
): unknown[] {
  return $.isTypedSlice(value) ?
      globalThis.Array.from(value)
    : value.map((item) => item)
}

function elementTypeInfo(
  typeInfo?: $.TypeInfo | string,
): $.TypeInfo | string | undefined {
  const info = $.resolveTypeInfo(typeInfo)
  if (info?.kind === $.TypeKind.Slice || info?.kind === $.TypeKind.Array) {
    return info.elemType
  }
  return undefined
}

// floatBits returns 32 or 64 if the value (or the given type) is a float32 or
// float64, so that it is formatted at that precision as in Go, or 0 otherwise.
function floatBits(value: unknown, typeInfo?: $.TypeInfo | string): number {
  const info =
    typeInfo ??
    (value !== null && typeof value === 'object' ?
      (value as { __goTypeInfo?: $.TypeInfo | string }).__goTypeInfo
    : undefined)
  const name =
    typeof info === 'string' ? info
    : info?.kind === $.TypeKind.Basic ? info.name
    : undefined
  if (name === 'float32') return 32
  if (name === 'float64') return 64
  return 0
}

// formatFloatVerb formats a float for the e, E, f, F, g and G verbs, with an
// optional precision, as in Go.
function formatFloatVerb(
  value: unknown,
  verb: string,
  precision: string,
): string {
  const bits = floatBits(value) || 64
  let prec = precision === '' ? -1 : parseInt(precision)
  if (prec < 0 && verb !== 'g' && verb !== 'G') {
    prec = 6
  }
  return $.formatFloat(Number(value), verb === 'F' ? 'f' : verb, prec, bits)
}

function hasGoTypeName(value: unknown): value is { __goType: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { __goType?: unknown }).__goType === 'string'
  )
}

// pointerReceiverOnly reports whether value is a struct value, rather than
// a pointer to one, whose method name has a pointer receiver, so that the
// value does not have the method in Go. A struct value is known by its
// declared type, or else by the type it was boxed with in an interface.
function pointerReceiverOnly(
  value: any,
  typeInfo: $.TypeInfo | string | undefined,
  name: string,
): boolean {
  // Only an object can have methods.
  if (value === null || typeof value !== 'object') {
    return false
  }

  // A pointer already has the pointer method set.
  const declared = $.resolveTypeInfo(typeInfo)
  if (declared?.kind === $.TypeKind.Pointer) {
    return false
  }

  // An interface or type parameter holds a struct value only when it is marked as one.
  if (declared?.kind !== $.TypeKind.Struct) {
    const tag = value.__goType
    if (
      typeof tag !== 'string' ||
      tag.startsWith('*') ||
      !$.isMarkedAsStructValue(value)
    ) {
      return false
    }
  }

  // The struct type declares the method on its pointer receiver.
  const info = $.resolveTypeInfo(value.constructor?.__typeInfo)
  return (
    info?.kind === $.TypeKind.Struct &&
    info.methods.some(
      (method) => method.name === name && method.pointerReceiver === true,
    )
  )
}

// hasGoString reports whether value implements the GoStringer interface. Go
// invokes GoString only for the %#v verb, never for %v, %s, or Sprint.
function hasGoString(value: unknown): value is { GoString: () => string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { GoString?: unknown }).GoString === 'function'
  )
}

type MaybeString = string | PromiseLike<string>

function isPromiseLike<T = unknown>(value: unknown): value is PromiseLike<T> {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}

function toMaybeString(value: unknown): MaybeString {
  if (isPromiseLike(value)) {
    return value.then((resolved) => String(resolved))
  }
  return String(value)
}

function joinMaybe(
  parts: MaybeString[],
  separator: string,
  prefix = '',
  suffix = '',
): MaybeString {
  if (parts.some(isPromiseLike)) {
    return Promise.all(parts.map((part) => Promise.resolve(part))).then(
      (resolved) => `${prefix}${resolved.join(separator)}${suffix}`,
    )
  }
  return `${prefix}${(parts as string[]).join(separator)}${suffix}`
}

/** formatPointer renders a stable runtime address without inspecting the pointee. */
function formatPointer(value: any): string {
  const pointer = new Value(value, PointerTo(TypeOf(value)))
  return '0x' + pointer.Pointer().toString(16)
}

// formattingStructs holds the storage of the structs being formatted, to
// detect cycles through pointers that lack type information.
const formattingStructs = new Set<object>()

/** formatStructFields renders the fields of a struct value. */
function formatStructFields(
  value: any,
  info: $.TypeInfo | undefined,
  fields: $.StructFieldInfo[],
  storage: any,
  flags: string,
  depth: number,
  allowMethods: boolean,
): MaybeString {
  const parts = fields.map((field) => {
    const formatted = defaultFormatMaybe(
      storage[$.structFieldRuntimeKey(field)],
      flags,
      depth + 1,
      field.type,
      allowMethods && (field.exported ?? /^\p{Lu}/u.test(field.name)),
    )
    const prefix =
      flags.includes('+') || flags.includes('#') ? field.name + ':' : ''
    return joinMaybe([formatted], '', prefix)
  })
  const name = flags.includes('#') ? $.goTypeString(info?.name ?? '') : ''
  return joinMaybe(parts, flags.includes('#') ? ', ' : ' ', name + '{', '}')
}

// nilString formats a nil value of the type info describes. A nil slice or
// map prints as an empty one, and %#v spells the type of a nil slice, map,
// pointer, func or channel, as in Go.
function nilString(
  info: $.TypeInfo | string | undefined,
  flags: string,
): string {
  // %#v writes the type and nil, in parentheses when the type is not a name
  // or a composite type literal.
  const resolved = $.resolveTypeInfo(info)
  if (flags.includes('#')) {
    const name = $.typeInfoGoString(info)
    if (name === undefined) return '<nil>'
    switch (resolved?.kind) {
      case $.TypeKind.Slice:
      case $.TypeKind.Map:
        return name + '(nil)'
      case $.TypeKind.Pointer:
      case $.TypeKind.Function:
      case $.TypeKind.Channel:
        return '(' + name + ')(nil)'
    }
    return '<nil>'
  }

  // Other verbs print a nil slice or map as an empty one.
  if (resolved?.kind === $.TypeKind.Slice) return '[]'
  if (resolved?.kind === $.TypeKind.Map) return 'map[]'
  return '<nil>'
}

/** defaultFormatMaybe renders Go values without exposing their runtime storage. */
function defaultFormatMaybe(
  value: any,
  flags = '',
  depth = 0,
  typeInfo?: $.TypeInfo | string,
  allowMethods = true,
): MaybeString {
  if (value === null || value === undefined) {
    return nilString(typeInfo, flags)
  }
  if ($.isTypedNilValue(value)) {
    return nilString(value.__goTypeInfo ?? value.__goType, flags)
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'string')
    return flags.includes('#') ? Quote(value) : value
  if (typeof value === 'number' || typeof value === 'bigint') {
    const bits = typeof value === 'number' ? floatBits(value, typeInfo) : 0
    return bits ?
        $.formatFloat(value as number, 'g', -1, bits)
      : value.toString()
  }
  if ($.isArrayOrGoSlice(value) || isNumberTypedSlice(value)) {
    // Elements are formatted with the element type, so that pointers print
    // as addresses, and the elements of a typed slice at least with the type
    // of its typed array, so that float32 elements print as float32.
    const elemType =
      elementTypeInfo(
        typeInfo ??
          (value as { __goTypeInfo?: $.TypeInfo | string }).__goTypeInfo ??
          $.arrayValueTypeInfo(value),
      ) ?? $.typedSliceHintOf(value)
    return joinMaybe(
      sliceItems(value).map((item) =>
        defaultFormatMaybe(item, flags, depth + 1, elemType, allowMethods),
      ),
      ' ',
      '[',
      ']',
    )
  }
  if (typeof value === 'function') {
    // A func prints as its address, as %p prints it, rather than as its
    // JavaScript source; %#v also spells its type, as in Go.
    const address = '0x' + $.functionAddress(value).toString(16)
    const name =
      flags.includes('#') ?
        ($.typeInfoGoString(typeInfo) ?? TypeOf(value)?.String())
      : undefined
    return name !== undefined ? '(' + name + ')(' + address + ')' : address
  }
  if (typeof value === 'object') {
    // Go consults methods on exported fields, with GoString reserved for %#v.
    const methodValue = $.isVarRef(value) ? value.value : value
    if (allowMethods && flags.includes('#') && hasGoString(methodValue)) {
      return toMaybeString(methodValue.GoString())
    }
    if (
      allowMethods &&
      !flags.includes('#') &&
      typeof methodValue?.Error === 'function' &&
      !pointerReceiverOnly(methodValue, typeInfo, 'Error')
    ) {
      try {
        return toMaybeString(methodValue.Error())
      } catch {
        // Ignore error by continuing to next case.
      }
    }
    if (
      allowMethods &&
      !flags.includes('#') &&
      typeof methodValue?.String === 'function' &&
      !pointerReceiverOnly(methodValue, typeInfo, 'String')
    ) {
      try {
        return toMaybeString(methodValue.String())
      } catch {
        // Ignore error by continuing to next case.
      }
    }
    const declared = $.resolveTypeInfo(typeInfo)
    const descriptor =
      (declared?.kind === $.TypeKind.Interface ? undefined : declared) ??
      value.__goTypeInfo ??
      value.constructor?.__typeInfo
    const info = $.resolveTypeInfo(descriptor)
    if ($.isVarRef(value) || info?.kind === $.TypeKind.Pointer) {
      const pointee =
        $.isVarRef(value) ? value.value : (value.__goValue ?? value)
      const elementDescriptor =
        info?.kind === $.TypeKind.Pointer ? info.elemType : undefined
      const element = $.resolveTypeInfo(elementDescriptor)
      if (
        depth === 0 &&
        pointee !== null &&
        typeof pointee === 'object' &&
        (element?.kind === $.TypeKind.Struct ||
          element?.kind === $.TypeKind.Array ||
          element?.kind === $.TypeKind.Slice ||
          (element === undefined &&
            [Struct, ArrayKind, SliceKind].includes(
              TypeOf(pointee)?.Kind() ?? 0,
            )))
      ) {
        return joinMaybe(
          [
            defaultFormatMaybe(
              pointee,
              flags,
              depth + 1,
              element ?? pointee.constructor?.__typeInfo,
              allowMethods,
            ),
          ],
          '',
          '&',
        )
      }
      return formatPointer(value)
    }
    if (value instanceof Uint8Array) {
      const bytes = globalThis.Array.from(value)
      if (flags.includes('#')) {
        const hex = bytes.map((b) => '0x' + b.toString(16))
        return `[]byte{${hex.join(', ')}}`
      }
      return `[${bytes.join(' ')}]`
    }
    if ('__goValue' in value) {
      return defaultFormatMaybe(
        value.__goValue,
        flags,
        depth,
        typeInfo ?? value.__goTypeInfo,
        allowMethods,
      )
    }
    if (
      info?.kind === $.TypeKind.Struct ||
      $.isStructObject(value) ||
      value.constructor === Object
    ) {
      const fields: $.StructFieldInfo[] =
        info?.kind === $.TypeKind.Struct ?
          info.fields
        : Object.keys(value).map((name) => ({
            name,
            key: name,
            type: $.basicType('unknown'),
          }))
      const storage = value
      // A struct reached again through its own fields is reached through a
      // pointer, which prints as an address, as Go prints nested pointers.
      if (formattingStructs.has(storage)) {
        return formatPointer(value)
      }
      formattingStructs.add(storage)
      try {
        return formatStructFields(
          value,
          info,
          fields,
          storage,
          flags,
          depth,
          allowMethods,
        )
      } finally {
        formattingStructs.delete(storage)
      }
    }
    // Basic Map/Set rendering
    if (value instanceof Map) {
      const parts: MaybeString[] = []
      for (const [k, v] of (value as Map<any, any>).entries()) {
        const key = defaultFormatMaybe(k, flags, depth + 1)
        const elem = defaultFormatMaybe(v, flags, depth + 1)
        if (isPromiseLike(key) || isPromiseLike(elem)) {
          parts.push(
            Promise.all([Promise.resolve(key), Promise.resolve(elem)]).then(
              ([resolvedKey, resolvedElem]) => `${resolvedKey}:${resolvedElem}`,
            ),
          )
        } else {
          parts.push(`${key}:${elem}`)
        }
      }
      return joinMaybe(parts, ' ', '{', '}')
    }
    if (value instanceof Set) {
      const parts: MaybeString[] = []
      for (const v of (value as Set<any>).values()) {
        parts.push(defaultFormatMaybe(v, flags, depth + 1))
      }
      return joinMaybe(parts, ' ', '[', ']')
    }
    // Default object representation
    if (
      (value as any).constructor?.name &&
      (value as any).constructor.name !== 'Object'
    ) {
      const parts = Object.entries(value as Record<string, any>).map(
        ([k, v]) => {
          const formatted = defaultFormatMaybe(v, flags, depth + 1)
          if (isPromiseLike(formatted)) {
            return formatted.then((resolved) => `${k}:${resolved}`)
          }
          return `${k}:${formatted}`
        },
      )
      return joinMaybe(parts, ' ', '{', '}')
    }
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

function formatValueMaybe(value: any, verb: string, flags = ''): MaybeString {
  switch (verb) {
    case 'v':
      if (flags.includes('#') && hasGoString(value)) {
        return toMaybeString(value.GoString())
      }
      return defaultFormatMaybe(value, flags)
    case 'w':
      return defaultFormatMaybe(value)
    case 's':
      if (typeof value === 'string') return value
      if (value instanceof Uint8Array) return $.bytesToString(value)
      return defaultFormatMaybe(value)
    default:
      return formatValue(value, verb, flags)
  }
}

function applyFormatOptions(
  formatted: MaybeString,
  arg: any,
  verb: string,
  flags: string,
  width: string,
  precision: string,
): MaybeString {
  const apply = (text: string): string => {
    let result = text
    if (width && !precision) {
      const w = parseInt(width)
      if (flags.includes('-')) {
        result = padRunes(result, w, ' ', false)
      } else {
        result = padRunes(result, w, flags.includes('0') ? '0' : ' ', true)
      }
    } else if (precision && 'eEfFgG'.includes(verb)) {
      result = formatFloatVerb(arg, verb, precision)

      if (width) {
        const w = parseInt(width)
        if (flags.includes('-')) {
          result = padRunes(result, w, ' ', false)
        } else {
          result = padRunes(result, w, ' ', true)
        }
      }
    }
    return result
  }
  if (isPromiseLike(formatted)) {
    return formatted.then(apply)
  }
  return apply(formatted)
}

// starOperand returns the int operand of a * width or precision, or null
// when the operand is missing or not an integer.
function starOperand(arg: unknown): number | null {
  const value = basicValue(arg)
  if (typeof value === 'bigint') {
    return Number(value)
  }
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value
  }
  return null
}

// nilSliceOperand returns the empty slice a typed nil slice formats as, or
// undefined for any other operand. Go formats a nil slice as an empty one
// under every verb except %#v, %T and %p, which report its type or address.
function nilSliceOperand(
  arg: unknown,
  verb: string,
  flags: string,
): Uint8Array | never[] | undefined {
  if (
    !$.isTypedNilValue(arg) ||
    'Tp'.includes(verb) ||
    (verb === 'v' && flags.includes('#'))
  ) {
    return undefined
  }
  const info = $.resolveTypeInfo(arg.__goTypeInfo ?? arg.__goType)
  if (info?.kind !== $.TypeKind.Slice) {
    return undefined
  }
  const elem = $.resolveTypeInfo(info.elemType)
  const bytes =
    elem?.kind === $.TypeKind.Basic &&
    (elem.name === 'uint8' || elem.name === 'byte')
  return bytes ? new Uint8Array(0) : []
}

// formatOperandMaybe formats arg for one verb with its flags, width and
// precision. Go applies the verb to each element of a slice or array, as in %q
// of a []string or %5d of a []int. Byte slices are Uint8Arrays rather than
// JavaScript arrays here, so they format as a whole.
function formatOperandMaybe(
  arg: any,
  verb: string,
  flags: string,
  width: string,
  precision: string,
): MaybeString {
  if (
    ($.isArrayOrGoSlice(arg) || isNumberTypedSlice(arg)) &&
    elementwiseVerbs.has(verb)
  ) {
    const elems = sliceItems(arg).map((elem) =>
      formatOperandMaybe(elem, verb, flags, width, precision),
    )
    return joinMaybe(elems, ' ', '[', ']')
  }
  const empty = nilSliceOperand(arg, verb, flags)
  if (empty !== undefined) {
    return formatOperandMaybe(empty, verb, flags, width, precision)
  }

  // A Formatter owns its whole output, including width and precision.
  const custom = formatWithStateMaybe(arg, verb, flags, width, precision)
  if (custom !== null) {
    return custom
  }
  return applyFormatOptions(
    formatValueMaybe(arg, verb, flags),
    arg,
    verb,
    flags,
    width,
    precision,
  )
}

function parseFormatMaybe(format: string, args: any[]): MaybeString {
  const parts: MaybeString[] = []
  let argIndex = 0

  for (let i = 0; i < format.length; i++) {
    if (format[i] === '%') {
      if (i + 1 < format.length) {
        const nextChar = format[i + 1]
        if (nextChar === '%') {
          parts.push('%')
          i++ // skip the next %
          continue
        }

        // Parse format specifier
        let j = i + 1
        let width = ''
        let precision = ''
        let flags = ''

        // Parse flags (-, +, #, 0, space)
        while (j < format.length && '+-# 0'.includes(format[j])) {
          flags += format[j]
          j++
        }

        // Parse width, which * takes from the next operand.
        let badArg = ''
        if (format[j] === '*') {
          j++
          const n = starOperand(args[argIndex++])
          if (n === null) {
            badArg = '%!(BADWIDTH)'
          } else if (n < 0) {
            flags += '-'
            width = String(-n)
          } else {
            width = String(n)
          }
        } else {
          while (j < format.length && format[j] >= '0' && format[j] <= '9') {
            width += format[j]
            j++
          }
        }

        // Parse precision, which * also takes from the next operand.
        if (j < format.length && format[j] === '.') {
          j++
          if (format[j] === '*') {
            j++
            const n = starOperand(args[argIndex++])
            if (n === null || n < 0) {
              badArg = '%!(BADPREC)'
            } else {
              precision = String(n)
            }
          } else {
            while (j < format.length && format[j] >= '0' && format[j] <= '9') {
              precision += format[j]
              j++
            }
          }
        }
        if (badArg !== '') {
          parts.push(badArg)
        }

        // Get the verb
        if (j < format.length) {
          const verb = format[j]

          if (argIndex < args.length) {
            parts.push(
              formatOperandMaybe(args[argIndex], verb, flags, width, precision),
            )
            argIndex++
          } else {
            parts.push(`%!${verb}(MISSING)`)
          }

          i = j
        } else {
          parts.push(format[i])
        }
      } else {
        parts.push(format[i])
      }
    } else {
      parts.push(format[i])
    }
  }

  return joinMaybe(parts, '')
}

function formatWithStateMaybe(
  value: any,
  verb: string,
  flags: string,
  width: string,
  precision: string,
): MaybeString | null {
  if (!value || typeof value.Format !== 'function' || value.Format.length < 2) {
    return null
  }

  let out = ''
  const state: State = {
    Flag(c: number): boolean {
      return flags.includes(String.fromCharCode(c))
    },
    Precision(): [number, boolean] {
      return precision === '' ? [0, false] : [parseInt(precision), true]
    },
    Width(): [number, boolean] {
      return width === '' ? [0, false] : [parseInt(width), true]
    },
    Write(b: $.Bytes): [number, $.GoError | null] {
      const text = $.bytesToString(b)
      out += text
      return [text.length, null]
    },
  }

  const result = value.Format(state, verb.codePointAt(0) ?? 0)
  if (isPromiseLike(result)) {
    return result.then(() => out)
  }
  return out
}

// Global stdout simulation for Print functions
let stdout = {
  write: (data: string) => {
    writeHostStdoutText(data)
  },
}

// Print functions.
//
// Operands may implement Error/String/Format/GoString asynchronously (a
// transpiled Go method that awaits), so every operand renders through the
// Maybe pipeline. A function returns plain values when every operand renders
// synchronously, and a Promise only when one does not: the compiler treats
// these functions as async only in a program with an async method of one of
// those names, so a synchronous call must not see a Promise.

// settle returns a promise-like result as a Promise, which callers can test
// for, and any other result as it is.
function settle<T>(value: T | PromiseLike<T>): T | Promise<T> {
  return isPromiseLike<T>(value) ? Promise.resolve(value) : value
}

// thenMaybe applies f to a result that may be a Promise.
function thenMaybe<T, R>(
  value: T | PromiseLike<T>,
  f: (value: T) => R,
): R | Promise<R> {
  return isPromiseLike<T>(value) ? Promise.resolve(value).then(f) : f(value)
}

// sprintOperands renders operands with Go's Print spacing rule: a space is
// added between operands only when neither side is a string.
function sprintOperands(a: any[]): MaybeString {
  const parts: MaybeString[] = []
  for (let i = 0; i < a.length; i++) {
    if (i > 0) {
      const prevIsString = typeof a[i - 1] === 'string'
      const currIsString = typeof a[i] === 'string'
      if (!prevIsString && !currIsString) parts.push(' ')
    }
    parts.push(defaultFormatMaybe(a[i]))
  }
  return joinMaybe(parts, '')
}

// sprintlnOperands renders operands with Go's Println rule: always
// space-separated, terminated by a newline.
function sprintlnOperands(a: any[]): MaybeString {
  return joinMaybe(
    a.map((operand) => defaultFormatMaybe(operand)),
    ' ',
    '',
    '\n',
  )
}

// writeStdout writes rendered text to standard output.
function writeStdout(
  out: MaybeString,
): [number, $.GoError | null] | Promise<[number, $.GoError | null]> {
  return thenMaybe(out, (text): [number, $.GoError | null] => {
    stdout.write(text)
    return [text.length, null]
  })
}

export function Print(
  ...a: any[]
): [number, $.GoError | null] | Promise<[number, $.GoError | null]> {
  return writeStdout(sprintOperands(a))
}

export function Printf(
  format: string,
  ...a: any[]
): [number, $.GoError | null] | Promise<[number, $.GoError | null]> {
  return writeStdout(parseFormatMaybe(format, a))
}

export function Println(
  ...a: any[]
): [number, $.GoError | null] | Promise<[number, $.GoError | null]> {
  return writeStdout(sprintlnOperands(a))
}

// Sprint functions (return strings)
export function Sprint(...a: any[]): string | Promise<string> {
  return settle(sprintOperands(a))
}

export function Sprintf(format: string, ...a: any[]): string | Promise<string> {
  return settle(parseFormatMaybe(format, a))
}

export function Sprintln(...a: any[]): string | Promise<string> {
  return settle(sprintlnOperands(a))
}

// writeToWriter writes the rendered text to w. It returns a promise only
// when the text or w's Write does, so a call with sync operands and a sync
// writer returns its result directly.
function writeToWriter(
  w: any,
  out: MaybeString,
): [number, $.GoError | null] | Promise<[number, $.GoError | null]> {
  return settle(
    thenMaybe(
      out,
      (
        text,
      ):
        | [number, $.GoError | null]
        | PromiseLike<[number, $.GoError | null]> => {
        if (w && w.Write) {
          return w.Write($.stringToBytes(text))
        }
        return [0, $.newError('Writer does not implement Write method')]
      },
    ),
  ) as [number, $.GoError | null] | Promise<[number, $.GoError | null]>
}

// Fprint functions (write to Writer). They suspend only when an operand's
// formatting method or the Writer's Write does.
export function Fprint(
  w: any,
  ...a: any[]
): [number, $.GoError | null] | Promise<[number, $.GoError | null]> {
  // Same spacing as Print
  return writeToWriter(w, sprintOperands(a))
}

export function Fprintf(
  w: any,
  format: string,
  ...a: any[]
): [number, $.GoError | null] | Promise<[number, $.GoError | null]> {
  return writeToWriter(w, parseFormatMaybe(format, a))
}

export function Fprintln(
  w: any,
  ...a: any[]
): [number, $.GoError | null] | Promise<[number, $.GoError | null]> {
  // Same behavior as Println
  return writeToWriter(w, sprintlnOperands(a))
}

// Append functions (append to byte slice)
export function Append(b: $.Bytes, ...a: any[]): $.Bytes | Promise<$.Bytes> {
  return thenMaybe(sprintOperands(a), (result) => appendText(b, result))
}

export function Appendf(
  b: $.Bytes,
  format: string,
  ...a: any[]
): $.Bytes | Promise<$.Bytes> {
  return thenMaybe(parseFormatMaybe(format, a), (result) =>
    appendText(b, result),
  )
}

export function Appendln(b: $.Bytes, ...a: any[]): $.Bytes | Promise<$.Bytes> {
  return thenMaybe(sprintlnOperands(a), (result) => appendText(b, result))
}

function appendText(b: $.Bytes, result: string): $.Bytes {
  const encoded = $.stringToBytes(result)
  const base = $.bytesToUint8Array(b)
  const newArray = new Uint8Array(base.length + encoded.length)
  newArray.set(base)
  newArray.set(encoded, base.length)
  return newArray
}

// Errorf Error creation
//
// Errorf stays a synchronous Go API: it returns the error immediately and
// resolves operand text lazily when Error is called, so protobuf-generated
// sync methods can keep using it while async Error/String operands still
// render through the MaybePromise convention.
export function Errorf(format: string, ...a: any[]): any {
  const err: Exclude<$.GoError, null> = {
    Error: (): string | PromiseLike<string> => parseFormatMaybe(format, a),
  }
  // %w operands are wrapped: the result must Unwrap to them so errors.Is/As can
  // walk the chain. One %w unwraps to a single error; multiple %w (Go 1.20+)
  // unwrap to an []error, matching the depth-first traversal in errors.Is.
  const wrapped = errorfWrappedArgs(format, a)
  if (wrapped.length === 1) {
    ;(err as any).Unwrap = (): $.GoError => wrapped[0]
  } else if (wrapped.length > 1) {
    ;(err as any).Unwrap = (): $.GoError[] => wrapped
  }
  return err
}

// errorfWrappedArgs returns the error operands consumed by %w verbs, in order.
// It walks the format string with the same flag/width/precision/verb skip and
// the same positional arg consumption as parseFormat, so the operand a %w binds
// to here is exactly the one it formatted in the message.
function errorfWrappedArgs(format: string, args: any[]): $.GoError[] {
  const wrapped: $.GoError[] = []
  let argIndex = 0
  for (let i = 0; i < format.length; i++) {
    if (format[i] !== '%' || i + 1 >= format.length) {
      continue
    }
    if (format[i + 1] === '%') {
      i++
      continue
    }
    let j = i + 1
    while (j < format.length && '+-# 0'.includes(format[j])) j++
    if (format[j] === '*') {
      j++
      argIndex++
    }
    while (j < format.length && format[j] >= '0' && format[j] <= '9') j++
    if (j < format.length && format[j] === '.') {
      j++
      if (format[j] === '*') {
        j++
        argIndex++
      }
      while (j < format.length && format[j] >= '0' && format[j] <= '9') j++
    }
    if (j < format.length) {
      if (argIndex < args.length) {
        if (format[j] === 'w') {
          wrapped.push(args[argIndex] as $.GoError)
        }
        argIndex++
      }
      i = j
    }
  }
  return wrapped
}

// FormatString - simplified implementation.
export function FormatString(state: State, verb: number): string {
  let result = '%'

  // Add flags
  if (state.Flag(32)) result += ' ' // space
  if (state.Flag(43)) result += '+' // plus
  if (state.Flag(45)) result += '-' // minus
  if (state.Flag(35)) result += '#' // hash
  if (state.Flag(48)) result += '0' // zero

  // Add width
  const [width, hasWidth] = state.Width()
  if (hasWidth) {
    result += width.toString()
  }

  // Add precision
  const [precision, hasPrecision] = state.Precision()
  if (hasPrecision) {
    result += '.' + precision.toString()
  }

  // Add verb
  result += String.fromCharCode(verb)

  return result
}

// Scanning functions - stubbed for now.
export function Scan(..._a: any[]): [number, $.GoError | null] {
  // TODO: Implement scanning from stdin
  return [0, $.newError('Scan not implemented')]
}

export function Scanf(
  _format: string,
  ..._a: any[]
): [number, $.GoError | null] {
  // TODO: Implement formatted scanning from stdin
  return [0, $.newError('Scanf not implemented')]
}

export function Scanln(..._a: any[]): [number, $.GoError | null] {
  // TODO: Implement line scanning from stdin
  return [0, $.newError('Scanln not implemented')]
}

export function Sscan(str: string, ...a: any[]): [number, $.GoError | null] {
  const sc = new stringScanner(str)
  let n = 0
  for (const target of a) {
    sc.skipSpace(true)
    const err = sc.scanOne(target, 'v', 0, true)
    if (err !== null) {
      return [n, err]
    }
    n++
  }
  return [n, null]
}

export function Sscanf(
  str: string,
  format: string,
  ...a: any[]
): [number, $.GoError | null] {
  const sc = new stringScanner(str)
  let n = 0
  let arg = 0
  for (let i = 0; i < format.length; ) {
    const ch = format[i]
    if (ch !== '%') {
      if (isScanSpace(ch)) {
        // A run of spaces in the format matches zero or more spaces in the
        // input, and a newline in the format must match one in the input.
        let newlines = 0
        while (i < format.length && isScanSpace(format[i])) {
          if (format[i] === '\n') newlines++
          i++
        }
        sc.skipSpace(false)
        for (; newlines > 0; newlines--) {
          if (sc.peek() !== '\n') {
            return [n, $.newError('newline in format does not match input')]
          }
          sc.pos++
          sc.skipSpace(false)
        }
        continue
      }
      if (sc.peek() !== ch) {
        return [n, $.newError('input does not match format')]
      }
      sc.pos++
      i++
      continue
    }
    i++
    let width = 0
    while (i < format.length && format[i] >= '0' && format[i] <= '9') {
      width = width * 10 + (format.charCodeAt(i) - 48)
      i++
    }
    const verb = format[i++]
    if (verb === undefined) {
      return [n, $.newError('too few operands for format')]
    }
    if (verb === '%') {
      sc.skipSpace(false)
      if (sc.peek() !== '%') {
        return [n, $.newError('missing literal %')]
      }
      sc.pos++
      continue
    }
    if (arg >= a.length) {
      return [n, $.newError(`too few operands for format '%${verb}'`)]
    }
    if (verb !== 'c') {
      sc.skipSpace(false)
    }
    const err = sc.scanOne(a[arg++], verb, width, false)
    if (err !== null) {
      return [n, err]
    }
    n++
  }
  if (arg < a.length) {
    return [n, $.newError('too many operands')]
  }
  return [n, null]
}

function isScanSpace(ch: string | undefined): boolean {
  return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n'
}

// scanIntKinds maps the integer kinds to their bit sizes and signedness.
const scanIntKinds: Record<string, [number, boolean]> = {
  int: [64, true],
  int8: [8, true],
  int16: [16, true],
  int32: [32, true],
  rune: [32, true],
  int64: [64, true],
  uint: [64, false],
  uint8: [8, false],
  byte: [8, false],
  uint16: [16, false],
  uint32: [32, false],
  uint64: [64, false],
  uintptr: [64, false],
}

// stringScanner scans values from a string, as for Sscan and Sscanf.
class stringScanner {
  public pos = 0

  constructor(private readonly str: string) {}

  peek(): string | undefined {
    return this.str[this.pos]
  }

  // skipSpace skips spaces, and newlines too when newlines is true.
  skipSpace(newlines: boolean): void {
    while (this.pos < this.str.length) {
      const ch = this.str[this.pos]
      if (ch === '\n' && !newlines) {
        return
      }
      if (!isScanSpace(ch)) {
        return
      }
      this.pos++
    }
  }

  // token returns the longest prefix of at most width characters (or of any
  // length when width is 0) whose characters satisfy accept.
  token(width: number, accept: (ch: string, index: number) => boolean): string {
    const start = this.pos
    while (
      this.pos < this.str.length &&
      (width === 0 || this.pos - start < width) &&
      accept(this.str[this.pos], this.pos - start)
    ) {
      this.pos++
    }
    return this.str.slice(start, this.pos)
  }

  // scanOne scans a value for the verb into target, which is a pointer.
  scanOne(
    target: any,
    verb: string,
    width: number,
    newlineIsSpace: boolean,
  ): $.GoError | null {
    const dest = scanDestination(target)
    if (dest === null) {
      return $.newError("can't scan type: not a pointer")
    }
    if (this.pos >= this.str.length) {
      return $.newError('unexpected EOF')
    }
    if (!newlineIsSpace && this.peek() === '\n' && verb !== 'c') {
      return $.newError('unexpected newline')
    }
    const kind = dest.kind
    if (kind !== undefined && kind in scanIntKinds) {
      return this.scanInt(dest.ref, verb, width, scanIntKinds[kind])
    }
    if (kind === 'float32' || kind === 'float64') {
      const tok = this.token(
        width,
        (ch, i) =>
          /[0-9.eEpP_xX]/.test(ch) ||
          ((ch === '+' || ch === '-') &&
            (i === 0 || /[eEpP]/.test(this.str[this.pos - 1]))),
      )
      const value = Number(tok.replace(/_/g, ''))
      if (tok === '' || Number.isNaN(value)) {
        return $.newError(
          'strconv.ParseFloat: parsing ' + Quote(tok) + ': invalid syntax',
        )
      }
      dest.ref.value = kind === 'float32' ? Math.fround(value) : value
      return null
    }
    if (kind === 'bool') {
      const tok = this.token(width, (ch) => /[a-zA-Z0-9]/.test(ch))
      const value =
        /^(1|t|T|true|TRUE|True)$/.test(tok) ? true
        : /^(0|f|F|false|FALSE|False)$/.test(tok) ? false
        : undefined
      if (value === undefined) {
        return $.newError('syntax error scanning boolean')
      }
      dest.ref.value = value
      return null
    }
    if (kind === 'string') {
      const tok =
        verb === 'c' ?
          this.token(1, () => true)
        : this.token(width, (ch) => !isScanSpace(ch))
      dest.ref.value = tok
      return null
    }
    return $.newError(`can't scan type: ${dest.typeName}`)
  }

  scanInt(
    ref: $.VarRef<any>,
    verb: string,
    width: number,
    [bits, signed]: [number, boolean],
  ): $.GoError | null {
    if (verb === 'c') {
      // %c reads one rune, of one to four bytes.
      const [r, size] = $.decodeRuneInString(this.str, this.pos)
      this.pos += size
      ref.value = bits === 64 && !isNumberBacked(ref) ? BigInt(r) : r
      return null
    }
    let base =
      verb === 'x' || verb === 'X' ? 16
      : verb === 'o' ? 8
      : verb === 'b' ? 2
      : 10
    const start = this.pos
    let sign = ''
    if (this.peek() === '+' || this.peek() === '-') {
      sign = this.str[this.pos++]
    }
    if (verb === 'v' && this.peek() === '0') {
      const prefix = this.str[this.pos + 1]?.toLowerCase()
      if (prefix === 'x' || prefix === 'b' || prefix === 'o') {
        base =
          prefix === 'x' ? 16
          : prefix === 'b' ? 2
          : 8
        this.pos += 2
      }
    }
    const remaining = width === 0 ? 0 : Math.max(width - (this.pos - start), 0)
    if (width !== 0 && remaining === 0) {
      return $.newError('expected integer')
    }
    const digits = this.token(remaining, (ch) => {
      const d = parseInt(ch, 36)
      return ch !== '_' && !Number.isNaN(d) && d < base
    })
    if (digits === '') {
      this.pos = start
      return $.newError('expected integer')
    }
    let value: bigint
    try {
      value = BigInt(
        (base === 16 ? '0x'
        : base === 8 ? '0o'
        : base === 2 ? '0b'
        : '') + digits,
      )
    } catch {
      return $.newError('expected integer')
    }
    if (sign === '-') {
      if (!signed) {
        return $.newError('expected integer')
      }
      value = -value
    }
    const limit = 1n << BigInt(signed ? bits - 1 : bits)
    if (
      (signed && (value >= limit || value < -limit)) ||
      (!signed && value >= limit)
    ) {
      return $.newError(
        'integer overflow on token ' + this.str.slice(start, this.pos),
      )
    }
    ref.value = bits === 64 && !isNumberBacked(ref) ? value : Number(value)
    return null
  }
}

// isNumberBacked reports whether the 64-bit integer variable ref holds a
// number, as int and uint do, rather than a bigint.
function isNumberBacked(ref: $.VarRef<any>): boolean {
  return typeof ref.value === 'number'
}

// scanDestination returns the variable that a scan argument points to and
// the name of its basic type, when known.
function scanDestination(
  target: any,
): { ref: $.VarRef<any>; kind: string | undefined; typeName: string } | null {
  const ref =
    $.isVarRef(target) ? target
    : (
      target != null &&
      typeof target === 'object' &&
      $.isVarRef(target.__goValue)
    ) ?
      target.__goValue
    : null
  if (ref == null) {
    return null
  }
  const typeName: string = target.__goType ?? ''
  const info = target.__goTypeInfo
  const elem = info && typeof info === 'object' ? info.elemType : undefined
  let kind: string | undefined =
    elem && typeof elem === 'object' && elem.kind === $.TypeKind.Basic ?
      elem.name
    : undefined
  if (kind === undefined && typeName.startsWith('*')) {
    const name = typeName.slice(1)
    if (name in scanIntKinds || /^(float32|float64|bool|string)$/.test(name)) {
      kind = name
    }
  }
  if (kind === undefined) {
    // Infer the kind from the current value of the variable.
    switch (typeof ref.value) {
      case 'number':
        kind = Number.isInteger(ref.value) ? 'int' : 'float64'
        break
      case 'bigint':
        kind = 'int64'
        break
      case 'string':
        kind = 'string'
        break
      case 'boolean':
        kind = 'bool'
        break
    }
  }
  return { ref, kind, typeName }
}

export function Sscanln(str: string, ...a: any[]): [number, $.GoError | null] {
  const sc = new stringScanner(str)
  let n = 0
  for (const target of a) {
    sc.skipSpace(false)
    const err = sc.scanOne(target, 'v', 0, false)
    if (err !== null) {
      return [n, err]
    }
    n++
  }
  sc.skipSpace(false)
  if (sc.pos < str.length && sc.peek() !== '\n') {
    return [n, $.newError('expected newline')]
  }
  return [n, null]
}

export function Fscan(_r: any, ..._a: any[]): [number, $.GoError | null] {
  // TODO: Implement scanning from Reader
  return [0, $.newError('Fscan not implemented')]
}

export function Fscanf(
  _r: any,
  _format: string,
  ..._a: any[]
): [number, $.GoError | null] {
  // TODO: Implement formatted scanning from Reader
  return [0, $.newError('Fscanf not implemented')]
}

export function Fscanln(_r: any, ..._a: any[]): [number, $.GoError | null] {
  // TODO: Implement line scanning from Reader
  return [0, $.newError('Fscanln not implemented')]
}

// Scanner and ScanState interfaces - stubbed.
export interface Scanner {
  Scan(state: ScanState, verb: number): $.GoError | null
}

export interface ScanState {
  ReadRune(): [number, number, $.GoError | null]
  UnreadRune(): $.GoError | null
  SkipSpace(): void
  Token(
    skipSpace: boolean,
    f: (r: number) => boolean,
  ): [Uint8Array, $.GoError | null]
  Width(): [number, boolean]
  Read(buf: $.Bytes): [number, $.GoError | null]
}
