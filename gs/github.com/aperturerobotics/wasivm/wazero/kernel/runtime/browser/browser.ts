// Package browser_runtime implements VmRuntime backed by the browser
// WebAssembly API. Pure TypeScript, with no syscall/js indirection.

import * as $ from '@goscript/builtin/index.js'

import type * as vmruntime from '../runtime.js'

type ValueKind = 'i32' | 'i64' | 'f32' | 'f64' | 'unsupported'
type FunctionType = { params: ValueKind[]; results: ValueKind[] }
type ModuleTypes = {
  imports: Map<string, FunctionType>
  exports: Map<string, FunctionType>
}

class WasmReader {
  offset = 0

  constructor(private readonly bytes: Uint8Array) {}

  get done(): boolean {
    return this.offset >= this.bytes.length
  }

  byte(): number {
    if (this.done) throw new RangeError('unexpected end of WebAssembly module')
    return this.bytes[this.offset++]
  }

  unsigned(): number {
    let value = 0
    let shift = 0
    for (;;) {
      const byte = this.byte()
      value += (byte & 0x7f) * 2 ** shift
      if ((byte & 0x80) === 0) return value
      shift += 7
      if (shift > 49) throw new RangeError('oversized WebAssembly integer')
    }
  }

  take(length: number): Uint8Array {
    const end = this.offset + length
    if (end > this.bytes.length) {
      throw new RangeError('unexpected end of WebAssembly module')
    }
    const value = this.bytes.subarray(this.offset, end)
    this.offset = end
    return value
  }

  name(): string {
    return new TextDecoder().decode(this.take(this.unsigned()))
  }
}

function valueKind(byte: number): ValueKind {
  if (byte === 0x7f) return 'i32'
  if (byte === 0x7e) return 'i64'
  if (byte === 0x7d) return 'f32'
  if (byte === 0x7c) return 'f64'
  return 'unsupported'
}

function readLimits(reader: WasmReader): void {
  const flags = reader.unsigned()
  reader.unsigned()
  if ((flags & 1) !== 0) reader.unsigned()
}

// readModuleTypes retains the integer function ABI which the JavaScript
// WebAssembly reflection API does not expose. It only decodes declaration
// sections and never executes guest code.
function readModuleTypes(bytes: Uint8Array): ModuleTypes {
  const reader = new WasmReader(bytes)
  const header = reader.take(8)
  if (
    header[0] !== 0x00 ||
    header[1] !== 0x61 ||
    header[2] !== 0x73 ||
    header[3] !== 0x6d
  ) {
    throw new WebAssembly.CompileError('invalid WebAssembly module header')
  }

  const types: FunctionType[] = []
  const importedFunctionTypes: number[] = []
  const definedFunctionTypes: number[] = []
  const imports = new Map<string, FunctionType>()
  const exportedFunctions: Array<[string, number]> = []

  while (!reader.done) {
    const id = reader.byte()
    const section = new WasmReader(reader.take(reader.unsigned()))
    if (id === 1) {
      const count = section.unsigned()
      for (let i = 0; i < count; i++) {
        if (section.byte() !== 0x60) {
          throw new TypeError('browser runtime: unsupported WebAssembly type')
        }
        const params = Array.from({ length: section.unsigned() }, () =>
          valueKind(section.byte()),
        )
        const results = Array.from({ length: section.unsigned() }, () =>
          valueKind(section.byte()),
        )
        types.push({ params, results })
      }
    } else if (id === 2) {
      const count = section.unsigned()
      for (let i = 0; i < count; i++) {
        const moduleName = section.name()
        const name = section.name()
        const kind = section.byte()
        if (kind === 0) {
          const typeIndex = section.unsigned()
          importedFunctionTypes.push(typeIndex)
          const type = types[typeIndex]
          if (type === undefined) {
            throw new RangeError('invalid WebAssembly function type index')
          }
          imports.set(`${moduleName}.${name}`, type)
        } else if (kind === 1) {
          section.byte()
          readLimits(section)
        } else if (kind === 2) {
          readLimits(section)
        } else if (kind === 3) {
          section.byte()
          section.byte()
        } else if (kind === 4) {
          section.byte()
          section.unsigned()
        } else {
          throw new RangeError('invalid WebAssembly import kind')
        }
      }
    } else if (id === 3) {
      const count = section.unsigned()
      for (let i = 0; i < count; i++)
        definedFunctionTypes.push(section.unsigned())
    } else if (id === 7) {
      const count = section.unsigned()
      for (let i = 0; i < count; i++) {
        const name = section.name()
        const kind = section.byte()
        const index = section.unsigned()
        if (kind === 0) exportedFunctions.push([name, index])
      }
    }
  }

  const functionTypes = importedFunctionTypes.concat(definedFunctionTypes)
  const exports = new Map<string, FunctionType>()
  for (const [name, functionIndex] of exportedFunctions) {
    const type = types[functionTypes[functionIndex]]
    if (type === undefined) {
      throw new RangeError('invalid WebAssembly exported function index')
    }
    exports.set(name, type)
  }
  return { imports, exports }
}

function isGoError(value: unknown): value is Exclude<$.GoError, null> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'Error' in value &&
    typeof value.Error === 'function'
  )
}

function callError(err: unknown): Exclude<$.GoError, null> {
  const value = $.panicValue(err)
  if (isGoError(value)) return value
  if (err instanceof WebAssembly.RuntimeError) return $.toGoError(err)!
  throw err
}

function toJSValue(value: bigint, kind: ValueKind): number | bigint {
  if (kind === 'i32') return Number(BigInt.asIntN(32, value))
  if (kind === 'i64') return BigInt.asIntN(64, value)
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)
  if (kind === 'f32') {
    view.setUint32(0, Number(BigInt.asUintN(32, value)), true)
    return view.getFloat32(0, true)
  }
  if (kind === 'f64') {
    view.setBigUint64(0, BigInt.asUintN(64, value), true)
    return view.getFloat64(0, true)
  }
  throw new TypeError(
    'browser runtime: unsupported WebAssembly reference value',
  )
}

function fromJSValue(value: unknown, kind: ValueKind): bigint {
  if (kind === 'i32' && typeof value === 'number') {
    return BigInt.asUintN(32, BigInt(value))
  }
  if (kind === 'i64' && typeof value === 'bigint') {
    return BigInt.asUintN(64, value)
  }
  if ((kind === 'f32' || kind === 'f64') && typeof value === 'number') {
    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    if (kind === 'f32') {
      view.setFloat32(0, value, true)
      return BigInt(view.getUint32(0, true))
    }
    view.setFloat64(0, value, true)
    return view.getBigUint64(0, true)
  }
  if (kind === 'unsupported') {
    throw new TypeError(
      'browser runtime: unsupported WebAssembly reference value',
    )
  }
  throw new TypeError(`browser runtime: unexpected ${kind} WebAssembly value`)
}

function invokeFunction(
  fn: (...args: Array<number | bigint>) => unknown,
  type: FunctionType,
  args: bigint[],
): $.Slice<bigint> {
  const result = fn(
    ...type.params.map((kind, index) => toJSValue(args[index], kind)),
  )
  if (type.results.length === 0) return null
  const values = type.results.length === 1 ? [result] : (result as unknown[])
  return type.results.map((kind, index) => fromJSValue(values[index], kind))
}

// Runtime implements VmRuntime using the browser WebAssembly API.
export class Runtime implements vmruntime.VmRuntime {
  async Compile(_ctx: any, wasm: $.Bytes): Promise<[Module | null, $.GoError]> {
    const bytes = $.bytesToUint8Array(wasm)
    try {
      const compiled = await WebAssembly.compile(bytes as BufferSource)
      return [new Module(compiled, readModuleTypes(bytes)), null]
    } catch (err) {
      if (err instanceof WebAssembly.CompileError) {
        return [null, $.toGoError(err)]
      }
      throw err
    }
  }

  async Close(_ctx: any): Promise<$.GoError> {
    return null
  }
}

export function New(): Runtime {
  return new Runtime()
}

// Module wraps a WebAssembly.Module and its declaration-only integer ABI.
export class Module implements vmruntime.VmModule {
  constructor(
    private readonly wasmModule: WebAssembly.Module,
    private readonly types: ModuleTypes,
  ) {}

  async Instantiate(
    ctx: any,
    config:
      | vmruntime.VmModuleConfig
      | $.VarRef<vmruntime.VmModuleConfig>
      | null,
  ): Promise<[Instance | null, $.GoError]> {
    if (config === null) {
      return [null, $.newError('browser runtime: nil module config')]
    }
    const moduleConfig = $.pointerValue(config)
    for (const [key, fn] of moduleConfig.HostFunctions ?? []) {
      if (fn?.constructor.name === 'AsyncFunction') {
        return [
          null,
          $.newError(
            `browser runtime: asynchronous host function ${key} is unsupported`,
          ),
        ]
      }
    }
    const [imports, instRef] = this.buildImports(
      ctx,
      moduleConfig.HostFunctions,
    )
    try {
      const wasmInst = await WebAssembly.instantiate(this.wasmModule, imports)
      const inst = new Instance(wasmInst, this.types.exports)
      instRef.current = inst
      return [inst, null]
    } catch (err) {
      if (err instanceof WebAssembly.LinkError) {
        return [null, $.toGoError(err)]
      }
      throw err
    }
  }

  async Close(_ctx: any): Promise<$.GoError> {
    return null
  }

  private buildImports(
    ctx: any,
    hostFns: Map<string, vmruntime.HostFunction | null> | null,
  ): [WebAssembly.Imports, { current: Instance | null }] {
    const imports: Record<string, Record<string, WebAssembly.ImportValue>> = {}
    const instRef: { current: Instance | null } = { current: null }
    if (!hostFns) return [imports, instRef]

    hostFns.forEach((fn, key) => {
      if (fn === null) return
      const dot = key.indexOf('.')
      const moduleName = dot === -1 ? 'env' : key.substring(0, dot)
      const functionName = dot === -1 ? key : key.substring(dot + 1)
      const type = this.types.imports.get(`${moduleName}.${functionName}`)
      if (type === undefined) return
      if (!imports[moduleName]) imports[moduleName] = {}

      imports[moduleName][functionName] = (
        ...args: Array<number | bigint>
      ): unknown => {
        const stack: $.Slice<bigint> = Array.from(
          { length: Math.max(type.params.length, type.results.length) },
          (_, index) =>
            index < type.params.length ?
              fromJSValue(args[index], type.params[index])
            : 0n,
        )
        let err: $.GoError | Promise<$.GoError>
        try {
          err = fn(ctx, instRef.current, stack)
        } catch (cause) {
          throw $.panicValue(cause)
        }
        if (
          err instanceof Promise ||
          (typeof err === 'object' &&
            err !== null &&
            'then' in err &&
            typeof err.then === 'function')
        ) {
          throw new WebAssembly.RuntimeError(
            `browser runtime: asynchronous host function ${key} is unsupported`,
          )
        }
        if (err) throw err
        if (type.results.length === 0) return undefined
        const results = type.results.map((kind, index) =>
          toJSValue(stack[index] ?? 0n, kind),
        )
        return results.length === 1 ? results[0] : results
      }
    })
    return [imports, instRef]
  }
}

export class Instance implements vmruntime.VmInstance {
  private readonly exports: WebAssembly.Exports

  constructor(
    private readonly wasmInstance: WebAssembly.Instance,
    private readonly types: Map<string, FunctionType>,
  ) {
    this.exports = wasmInstance.exports
  }

  async Call(
    _ctx: any,
    name: string,
    ...args: bigint[]
  ): Promise<[$.Slice<bigint>, $.GoError]> {
    const fn = this.exports[name]
    const type = this.types.get(name)
    if (typeof fn !== 'function' || type === undefined) return [null, null]
    try {
      return [
        invokeFunction(
          fn as (...values: Array<number | bigint>) => unknown,
          type,
          args,
        ),
        null,
      ]
    } catch (err) {
      return [null, callError(err)]
    }
  }

  Memory(): BrowserMemory | null {
    const mem = this.exports.memory
    return mem instanceof WebAssembly.Memory ? new BrowserMemory(mem) : null
  }

  ExportedFunction(name: string): BrowserFunction | null {
    const fn = this.exports[name]
    const type = this.types.get(name)
    if (typeof fn !== 'function' || type === undefined) return null
    return new BrowserFunction(
      fn as (...args: Array<number | bigint>) => unknown,
      type,
    )
  }

  ExportedGlobal(name: string): BrowserGlobal | null {
    const global = this.exports[name]
    return global instanceof WebAssembly.Global ?
        new BrowserGlobal(global)
      : null
  }

  async Close(_ctx: any): Promise<$.GoError> {
    return null
  }
}

export class BrowserFunction implements vmruntime.VmFunction {
  constructor(
    private readonly fn: (...args: Array<number | bigint>) => unknown,
    private readonly type: FunctionType,
  ) {}

  async Call(
    _ctx: any,
    ...args: bigint[]
  ): Promise<[$.Slice<bigint>, $.GoError]> {
    try {
      return [invokeFunction(this.fn, this.type, args), null]
    } catch (err) {
      return [null, callError(err)]
    }
  }
}

export class BrowserGlobal implements vmruntime.VmGlobal {
  constructor(private readonly global: WebAssembly.Global) {}

  Get(): bigint {
    const value = this.global.value
    return typeof value === 'bigint' ?
        BigInt.asUintN(64, value)
      : BigInt.asUintN(32, BigInt(value))
  }

  Set(value: bigint): void {
    this.global.value =
      typeof this.global.value === 'bigint' ?
        BigInt.asIntN(64, value)
      : Number(BigInt.asIntN(32, value))
  }
}

// BrowserMemory wraps WebAssembly.Memory with typed DataView access.
export class BrowserMemory implements vmruntime.VmMemory {
  constructor(private readonly mem: WebAssembly.Memory) {}

  private get buf(): ArrayBuffer {
    return this.mem.buffer
  }

  Read(offset: number, length: number): [$.Bytes, boolean] {
    if (offset + length > this.buf.byteLength) return [new Uint8Array(0), false]
    return [new Uint8Array(this.buf, offset, length), true]
  }

  ReadByteAt(offset: number): [number, boolean] {
    if (offset >= this.buf.byteLength) return [0, false]
    return [new Uint8Array(this.buf, offset, 1)[0], true]
  }

  ReadUint32Le(offset: number): [number, boolean] {
    if (offset + 4 > this.buf.byteLength) return [0, false]
    return [new DataView(this.buf).getUint32(offset, true), true]
  }

  ReadUint64Le(offset: number): [bigint, boolean] {
    if (offset + 8 > this.buf.byteLength) return [0n, false]
    const dv = new DataView(this.buf)
    const lo = BigInt(dv.getUint32(offset, true))
    const hi = BigInt(dv.getUint32(offset + 4, true))
    return [lo | (hi << 32n), true]
  }

  Write(offset: number, data: $.Bytes): boolean {
    const bytes = $.bytesToUint8Array(data)
    if (offset + bytes.length > this.buf.byteLength) return false
    new Uint8Array(this.buf, offset, bytes.length).set(bytes)
    return true
  }

  WriteByteAt(offset: number, val: number): boolean {
    if (offset >= this.buf.byteLength) return false
    new Uint8Array(this.buf, offset, 1)[0] = val
    return true
  }

  WriteUint32Le(offset: number, val: number): boolean {
    if (offset + 4 > this.buf.byteLength) return false
    new DataView(this.buf).setUint32(offset, val, true)
    return true
  }

  WriteUint64Le(offset: number, val: bigint): boolean {
    if (offset + 8 > this.buf.byteLength) return false
    const v = val
    const dv = new DataView(this.buf)
    dv.setUint32(offset, Number(v & 0xffffffffn), true)
    dv.setUint32(offset + 4, Number((v >> 32n) & 0xffffffffn), true)
    return true
  }

  Size(): number {
    return this.buf.byteLength
  }

  Grow(pages: number): [number, boolean] {
    try {
      const prev = this.mem.grow(pages)
      return [prev, true]
    } catch {
      return [0, false]
    }
  }
}
