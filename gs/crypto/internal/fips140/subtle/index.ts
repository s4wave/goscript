import * as $ from '@goscript/builtin/index.js'

export function ConstantTimeCompare(x: $.Bytes, y: $.Bytes): number {
  if ($.len(x) !== $.len(y)) {
    return 0
  }

  let v = 0
  for (let i = 0; i < $.len(x); i++) {
    v |= x![i] ^ y![i]
  }
  return v === 0 ? 1 : 0
}

export function ConstantTimeLessOrEqBytes(x: $.Bytes, y: $.Bytes): number {
  if ($.len(x) !== $.len(y)) {
    return 0
  }

  let less = 0
  let greater = 0
  for (let i = 0; i < $.len(x); i++) {
    const xLess = ((x![i] - y![i]) >>> 31) & 1
    const xGreater = ((y![i] - x![i]) >>> 31) & 1
    const undecided = 1 ^ (less | greater)
    less |= undecided & xLess
    greater |= undecided & xGreater
  }
  return 1 ^ greater
}

export function ConstantTimeCopy(v: number, x: $.Bytes, y: $.Bytes): void {
  if ($.len(x) !== $.len(y)) {
    $.panic('subtle: slices have different lengths')
  }

  const xmask = (v - 1) & 0xff
  const ymask = ~(v - 1) & 0xff
  for (let i = 0; i < $.len(x); i++) {
    x![i] = (x![i] & xmask) | (y![i] & ymask)
  }
}

export function XORBytes(dst: $.Bytes, x: $.Bytes, y: $.Bytes): number {
  const n = Math.min($.len(x), $.len(y))
  if (n === 0) {
    return 0
  }
  if (n > $.len(dst)) {
    $.panic('subtle.XORBytes: dst too short')
  }
  if (inexactOverlap(dst, x, n) || inexactOverlap(dst, y, n)) {
    $.panic('subtle.XORBytes: invalid overlap')
  }

  for (let i = 0; i < n; i++) {
    dst![i] = x![i] ^ y![i]
  }
  return n
}

function inexactOverlap(x: $.Bytes, y: $.Bytes, n: number): boolean {
  if (x == null || y == null) {
    return false
  }

  if (x instanceof Uint8Array || y instanceof Uint8Array) {
    if (!(x instanceof Uint8Array) || !(y instanceof Uint8Array)) {
      return false
    }
    if (x.buffer !== y.buffer || x.byteOffset === y.byteOffset) {
      return false
    }
    return x.byteOffset < y.byteOffset + n && y.byteOffset < x.byteOffset + n
  }

  const xMeta = $.isSliceProxy(x) ? x.__meta__ : null
  const yMeta = $.isSliceProxy(y) ? y.__meta__ : null
  const xBacking = xMeta?.backing ?? x
  const yBacking = yMeta?.backing ?? y
  const xOffset = xMeta?.offset ?? 0
  const yOffset = yMeta?.offset ?? 0
  if (xBacking !== yBacking || xOffset === yOffset) {
    return false
  }
  return xOffset < yOffset + n && yOffset < xOffset + n
}
