// DeepEqual reports whether x and y are "deeply equal," defined as follows.
// Two values of identical type are deeply equal if one of the following cases applies.
// Values of distinct types are never deeply equal.
//
// Array values are deeply equal when their corresponding elements are deeply equal.
//
// Struct values are deeply equal if their corresponding fields,
// both exported and unexported, are deeply equal.
//
// Func values are deeply equal if both are nil; otherwise they are not deeply equal.
//
// Interface values are deeply equal if they hold deeply equal concrete values.
//
// Map values are deeply equal when all of the following are true:
// they are both nil or both non-nil, they have the same length,
// and either they are the same map object or their corresponding keys
// (matched using Go equality) map to deeply equal values.
//
// Pointer values are deeply equal if they are equal using Go's == operator
// or if they point to deeply equal values.
//
// Slice values are deeply equal when all of the following are true:
// they are both nil or both non-nil, they have the same length,
// and either they point to the same initial entry of the same underlying array
// (that is, &x[0] == &y[0]) or their corresponding elements (up to length) are deeply equal.
// Note that a non-nil empty slice and a nil slice (for example, []byte{} and []byte(nil))
// are not deeply equal.
//
// Other values - numbers, bools, strings, and channels - are deeply equal
// if they are equal using Go's == operator.
//
// In general DeepEqual is a recursive relaxation of Go's == operator.
// However, this idea is impossible to implement without some inconsistency.
// Specifically, it is possible for a value to be unequal to itself,
// either because it is of func type (uncomparable in general)
// or because it is a floating-point NaN value (not equal to itself in floating-point comparison),
// or because it is an array, struct, or interface containing
// such a value.
// On the other hand, pointer values are always equal to themselves,
// even if they point at or contain such problematic values,
// because they compare equal using Go's == operator, and that
// is a sufficient condition to be deeply equal, regardless of content.
// DeepEqual has been defined so that the same short-cut applies
// to slices and maps: if x and y are the same slice or the same map,
// they are deeply equal regardless of content.
//
// As DeepEqual traverses the data values it may find a cycle. The
// second and subsequent times that DeepEqual compares two pointer
// values that have been compared before, it treats the values as
// equal rather than examining the values to which they point.
// This ensures that DeepEqual terminates.
import { isNamedValueBox, isStructObject, isVarRef } from '../builtin/index.js'
import { ReflectValue } from './types.js'

export function DeepEqual(
  x: ReflectValue | null | undefined,
  y: ReflectValue | null | undefined,
): boolean {
  // Handle null/undefined cases
  if (x === y) {
    return true
  }

  if (x === null || y === null || x === undefined || y === undefined) {
    return x === y
  }

  // Boxed named-type interface values: their valueOf, toString, and
  // symbol-keyed members are runtime plumbing closures, not Go-level data.
  // Two boxes compare by Go type and value; a box against a raw value
  // unwraps the box, because it is a transparent carrier for the value.
  if (isNamedValueBox(x) && isNamedValueBox(y)) {
    if (x.__goType !== y.__goType) {
      return false
    }
    return DeepEqual(x.__goValue as ReflectValue, y.__goValue as ReflectValue)
  }
  if (isNamedValueBox(x)) {
    return DeepEqual(x.__goValue as ReflectValue, y as ReflectValue)
  }
  if (isNamedValueBox(y)) {
    return DeepEqual(x as ReflectValue, y.__goValue as ReflectValue)
  }

  // A pointer to a struct is either the struct object itself, as &T{} and
  // reflect.New make it, or a reference to a struct variable, as &v makes
  // it; both point to the struct, so the reference compares as its struct.
  // A struct object is also a struct value, so the types that interface
  // values were boxed with tell a pointer from a value, which are unequal.
  const xp = structPointee(x)
  const yp = structPointee(y)
  if (xp !== null || yp !== null || isStructObject(x)) {
    const xPointer = boxedAsPointer(x)
    const yPointer = boxedAsPointer(y)
    if (
      xPointer !== undefined &&
      yPointer !== undefined &&
      xPointer !== yPointer
    ) {
      return false
    }
  }
  if ((xp !== null) !== (yp !== null)) {
    return DeepEqual(xp ?? x, yp ?? y)
  }

  // Check for identical references first
  if (x === y) {
    return true
  }

  // Different types are never equal
  if (typeof x !== typeof y) {
    return false
  }

  // Handle arrays and slices, which are JavaScript arrays or windows on a
  // backing array.
  const xs = sliceWindow(x)
  const ys = sliceWindow(y)
  if (xs !== null && ys !== null) {
    if (xs.length !== ys.length) {
      return false
    }
    for (let i = 0; i < xs.length; i++) {
      if (
        !DeepEqual(
          xs.backing[xs.offset + i] as ReflectValue,
          ys.backing[ys.offset + i] as ReflectValue,
        )
      ) {
        return false
      }
    }
    return true
  }

  // Dates (such as within time.Time) have no enumerable fields to compare.
  if (x instanceof globalThis.Date && y instanceof globalThis.Date) {
    return x.getTime() === y.getTime()
  }

  // Handle Maps
  if (x instanceof globalThis.Map && y instanceof globalThis.Map) {
    if (x.size !== y.size) {
      return false
    }
    for (const [key, value] of x) {
      if (
        !y.has(key) ||
        !DeepEqual(value as ReflectValue, y.get(key) as ReflectValue)
      ) {
        return false
      }
    }
    return true
  }

  // Handle objects (structs)
  if (typeof x === 'object' && typeof y === 'object') {
    // A struct object only equals a struct object.
    if (isStructObject(x) !== isStructObject(y)) {
      return false
    }

    const keysX = Object.keys(x)
    const keysY = Object.keys(y)
    if (keysX.length !== keysY.length) {
      return false
    }
    for (const key of keysX) {
      const xObj = x as Record<string, ReflectValue>
      const yObj = y as Record<string, ReflectValue>
      if (!keysY.includes(key) || !DeepEqual(xObj[key], yObj[key])) {
        return false
      }
    }
    return true
  }

  // For primitive values, use direct comparison
  return x === y
}

// sliceWindow returns the elements of a JavaScript array or of a slice window
// as a backing array, offset and length, or null for any other value.
function sliceWindow(
  value: unknown,
): { backing: ArrayLike<unknown>; offset: number; length: number } | null {
  // An array, or a typed slice, which is a view of exactly its elements, is a
  // window over itself.
  if (globalThis.Array.isArray(value) || ArrayBuffer.isView(value)) {
    const elements = value as ArrayLike<unknown>
    return { backing: elements, offset: 0, length: elements.length }
  }

  // A slice window carries its backing array, offset and length.
  if (value !== null && typeof value === 'object' && '__meta__' in value) {
    const meta = (
      value as {
        __meta__?: { backing?: unknown; offset?: number; length?: number }
      }
    ).__meta__
    if (
      meta &&
      (globalThis.Array.isArray(meta.backing) ||
        ArrayBuffer.isView(meta.backing)) &&
      typeof meta.length === 'number'
    ) {
      return {
        backing: meta.backing as ArrayLike<unknown>,
        offset: meta.offset ?? 0,
        length: meta.length,
      }
    }
  }

  // Any other value is not a slice.
  return null
}

// structPointee returns the struct that a reference to a struct variable
// points to, or null for any other value.
function structPointee(value: unknown): ReflectValue | null {
  if (isVarRef(value) && isStructObject(value.value)) {
    return value.value as ReflectValue
  }
  return null
}

// boxedAsPointer reports whether value was boxed in an interface as a
// pointer, as a value, or neither (undefined).
function boxedAsPointer(value: unknown): boolean | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined
  }
  const name = (value as { __goType?: unknown }).__goType
  return typeof name === 'string' ? name.startsWith('*') : undefined
}
