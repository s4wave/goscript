import { asArray, isSliceProxy, type Slice } from './slice.js'

// A transpiled Go Error(), String(), or GoString() method may be async, so
// printed operands render through the MaybePromise convention: text when the
// method is synchronous, a Promise that joinMaybeText settles otherwise. No
// sink stringifies a Promise in place of the rendered text.
type MaybeText = string | PromiseLike<string>

function isThenableText(value: unknown): value is PromiseLike<string> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}

function joinMaybeText(parts: MaybeText[], separator: string): MaybeText {
  if (parts.some(isThenableText)) {
    return Promise.all(parts.map((part) => Promise.resolve(part))).then(
      (resolved) => resolved.join(separator),
    )
  }
  return (parts as string[]).join(separator)
}

function surroundMaybeText(
  parts: MaybeText[],
  separator: string,
  open: string,
  close: string,
): MaybeText {
  const joined = joinMaybeText(parts, separator)
  if (isThenableText(joined)) {
    return Promise.resolve(joined).then((text) => `${open}${text}${close}`)
  }
  return `${open}${joined}${close}`
}

/**
 * formatPrintedArgs formats builtin print/println arguments deterministically.
 */
export function formatPrintedArgs(args: readonly any[]): MaybeText {
  return surroundMaybeText(args.map(formatPrintedValue), ' ', '', '')
}

/**
 * formatPrintedValue formats a single builtin print/println argument.
 */
export function formatPrintedValue(value: any): MaybeText {
  return formatValue(value, 0, false, new WeakSet<object>())
}

function formatValue(
  value: any,
  depth: number,
  nested: boolean,
  seen: WeakSet<object>,
): MaybeText {
  if (value === null) {
    return 'null'
  }

  if (value === undefined) {
    return '<nil>'
  }

  if (typeof value === 'string') {
    return nested ? JSON.stringify(value) : value
  }

  if (typeof value === 'boolean') {
    return String(value)
  }

  if (typeof value === 'number') {
    if (value === Infinity) {
      return '+Inf'
    }
    if (value === -Infinity) {
      return '-Inf'
    }
    return String(value)
  }

  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (value instanceof Uint8Array) {
    return formatUint8Array(value)
  }

  if (Array.isArray(value)) {
    return formatArray(value, depth, seen)
  }

  if (isSliceProxy(value as Slice<unknown>)) {
    return formatArray(asArray(value as Slice<unknown>), depth, seen)
  }

  if (typeof value === 'function') {
    return value.name ? `[Function: ${value.name}]` : '[Function]'
  }

  if (typeof value !== 'object') {
    return String(value)
  }

  if (seen.has(value)) {
    return '[Circular]'
  }
  seen.add(value)

  try {
    if (value instanceof Map) {
      return formatArray(
        Array.from(value.entries()).map(([k, v]) =>
          joinMaybeText(
            [formatValue(k, depth + 1, true, seen), formatValue(v, depth + 1, true, seen)],
            ' => ',
          ),
        ),
        depth,
        seen,
      )
    }

    if (value instanceof Set) {
      return formatArray(Array.from(value.values()), depth, seen)
    }

    if (value instanceof Error) {
      return value.message || value.toString()
    }

    if (typeof value.GoString === 'function') {
      return value.GoString() as MaybeText
    }

    if (typeof value.Error === 'function') {
      return value.Error() as MaybeText
    }

    if (typeof value.String === 'function') {
      return value.String() as MaybeText
    }

    const entries = getObjectEntries(value)
    if (entries.length === 0) {
      return '{}'
    }

    return formatObject(entries, depth, seen)
  } finally {
    seen.delete(value)
  }
}

function formatUint8Array(value: Uint8Array): string {
  if (value.length === 0) {
    return 'Uint8Array(0) []'
  }

  return `Uint8Array(${value.length}) [ ${Array.from(value).join(', ')} ]`
}

function formatArray(
  value: readonly any[],
  depth: number,
  seen: WeakSet<object>,
): MaybeText {
  if (value.length === 0) {
    return '[]'
  }

  return surroundMaybeText(
    value.map((item) => formatValue(item, depth + 1, true, seen)),
    ', ',
    '[ ',
    ' ]',
  )
}

function formatObject(
  entries: readonly [string, any][],
  depth: number,
  seen: WeakSet<object>,
): MaybeText {
  const pad = '  '.repeat(depth + 1)
  const closePad = '  '.repeat(depth)
  const lines = entries.map(([key, value]) =>
    joinMaybeText(
      [`${pad}${key}: `, formatValue(value, depth + 1, true, seen), ','],
      '',
    ),
  )

  return surroundMaybeText(lines, '\n', '{\n', `\n${closePad}}`)
}

function getObjectEntries(value: Record<string, any>): [string, any][] {
  const fields = value._fields
  if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
    return Object.keys(fields).map((key) => {
      const field = fields[key]
      if (field && typeof field === 'object' && 'value' in field) {
        return [key, field.value]
      }
      return [key, field]
    })
  }

  return Object.entries(value).filter(
    ([, entry]) => typeof entry !== 'function',
  )
}
