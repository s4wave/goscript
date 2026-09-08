import { runtimePanic } from './panic.js'

export interface OwnedPointerHandle<T = unknown> {
  readonly __goOwnedPointer: true
  __goAddress: () => number
  __goRef: () => VarRef<T>
  __goSlice?: (length: number) => unknown
}

/**
 * VarRef represents a Go variable which can be referred to by other variables.
 *
 * For example:
 *   var myVariable int // variable referenced
 *   myOtherVar := &myVariable.
 */
export type VarRef<T> = {
  value: T
  __isVarRef?: true
  __goType?: string
  __goAddress?: () => number
  __goCollection?: unknown
  __goIndex?: number
  __goPointer?: OwnedPointerHandle<T>
}

const pointerAddressStride = 0x100000000
const pointerAddresses = new WeakMap<object, number>()
const fieldReferences = new WeakMap<
  object,
  globalThis.Map<PropertyKey, VarRef<unknown>>
>()
let nextPointerAddress = 1

function pointerAddress(value: object): number {
  let address = pointerAddresses.get(value)
  if (address === undefined) {
    address = nextPointerAddress * pointerAddressStride
    nextPointerAddress++
    pointerAddresses.set(value, address)
  }
  return address
}

function refPointer<T>(
  ref: VarRef<T>,
  address: () => number,
): OwnedPointerHandle<T> {
  return {
    __goOwnedPointer: true,
    __goAddress: address,
    __goRef: () => ref,
  }
}

/** VariableRef allocates pointer machinery only when its address is requested. */
class VariableRef<T> implements VarRef<T> {
  readonly __isVarRef = true
  private pointer?: OwnedPointerHandle<T>

  constructor(public value: T) {}

  get __goPointer(): OwnedPointerHandle<T> {
    return (this.pointer ??= refPointer(this, () => pointerAddress(this)))
  }

  get __goAddress(): () => number {
    return this.__goPointer.__goAddress
  }
}

/** varRef wraps a variable with distinct pointer identity. */
export function varRef<T>(v: T): VarRef<T> {
  return new VariableRef(v)
}

/** bindStructFields installs properties over a struct's mutable field record. */
export function bindStructFields(
  prototype: object,
  names: readonly string[],
): void {
  for (const name of names) {
    Object.defineProperty(prototype, name, {
      get(this: { _fields: Record<string, unknown> }) {
        return this._fields[name]
      },
      set(this: { _fields: Record<string, unknown> }, value: unknown) {
        this._fields[name] = value
      },
      configurable: true,
    })
  }
}

/** fieldRef returns the stable reference to a mutable object field. */
export function fieldRef<T extends object, K extends keyof T>(
  target: T,
  key: K,
): VarRef<T[K]> {
  let references = fieldReferences.get(target)
  if (references === undefined) {
    references = new globalThis.Map<PropertyKey, VarRef<unknown>>()
    fieldReferences.set(target, references)
  }
  const existing = references.get(key)
  if (existing !== undefined) return existing as VarRef<T[K]>
  const address = () => pointerAddress(ref)
  const ref: VarRef<T[K]> = {
    get value(): T[K] {
      return target[key]
    },
    set value(value: T[K]) {
      target[key] = value
    },
    __isVarRef: true,
    __goAddress: address,
  }
  ref.__goPointer = refPointer(ref, address)
  references.set(key, ref)
  return ref
}

/** isVarRef reports whether a value carries the variable-reference marker. */
export function isVarRef(v: unknown): v is VarRef<unknown> {
  return v !== null && typeof v === 'object' && (v as any).__isVarRef === true
}

export function isOwnedPointerHandle(
  value: unknown,
): value is OwnedPointerHandle {
  return (
    value !== null &&
    typeof value === 'object' &&
    (value as { __goOwnedPointer?: unknown }).__goOwnedPointer === true
  )
}

export function ownedPointerFromRef<T>(
  ref: VarRef<T>,
): OwnedPointerHandle<T> | undefined {
  return ref.__goPointer
}

export function ownedPointerAddress(pointer: OwnedPointerHandle): number {
  return pointer.__goAddress()
}

export function ownedPointerRef<T>(pointer: OwnedPointerHandle<T>): VarRef<T> {
  return pointer.__goRef()
}

/** unref Dereference a variable reference; a null ref raises a Go runtime panic. */
export function unref<T>(b: VarRef<T>): T {
  if (b === null) {
    runtimePanic(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  return b.value
}

export function unsupportedPointerRef<T>(_value: unknown): VarRef<T> {
  return {
    get value(): T {
      throw new Error(
        'unsafe pointer dereference is not supported in JavaScript/TypeScript',
      )
    },
    set value(_value: T) {
      throw new Error(
        'unsafe pointer dereference is not supported in JavaScript/TypeScript',
      )
    },
    __isVarRef: true,
  }
}
