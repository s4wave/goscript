// Package browser_runtime implements VmRuntime backed by the browser
// WebAssembly API. Pure TypeScript, without syscall/js indirection.

import * as $ from '@goscript/builtin/index.js'
import type * as context from '@goscript/context/index.js'

import type * as vmruntime from '../runtime.js'

// Runtime implements VmRuntime using the browser WebAssembly API.
export class Runtime implements vmruntime.VmRuntime {
  // Compile calls WebAssembly.compile and returns a Module.
  async Compile(
    _ctx: context.Context | null,
    wasm: $.Slice<number>,
  ): Promise<[Module | null, $.GoError]> {
    try {
      const bytes = new Uint8Array($.asArray(wasm))
      const functionTypes = readFunctionTypes(bytes)
      const compiled = await WebAssembly.compile(bytes)
      return [new Module(compiled, functionTypes), null]
    } catch (err) {
      return [null, toGoError(err)]
    }
  }

  // Close is a no-op for the browser runtime.
  async Close(_ctx: context.Context | null): Promise<$.GoError> {
    return null
  }
}

// New creates a new browser-backed VmRuntime.
export function New(): Runtime {
  return new Runtime()
}

// Module wraps a WebAssembly.Module.
export class Module implements vmruntime.VmModule {
  constructor(
    private readonly wasmModule: WebAssembly.Module,
    private readonly functionTypes: ModuleFunctionTypes,
  ) {}

  // Instantiate creates an instance with host functions wired as imports.
  async Instantiate(
    ctx: context.Context | null,
    config:
      | vmruntime.VmModuleConfig
      | $.VarRef<vmruntime.VmModuleConfig>
      | null,
  ): Promise<[Instance | null, $.GoError]> {
    try {
      const hostFunctions = $.pointerValue(config).HostFunctions
      const { imports, instRef } = this.buildImports(ctx, hostFunctions)
      const wasmInst = await WebAssembly.instantiate(this.wasmModule, imports)
      const inst = new Instance(wasmInst, this.functionTypes.exports)
      instRef.current = inst
      return [inst, null]
    } catch (err) {
      return [null, toGoError(err)]
    }
  }

  // Close is a no-op.
  async Close(_ctx: context.Context | null): Promise<$.GoError> {
    return null
  }

  // buildImports constructs the WebAssembly imports object.
  private buildImports(
    ctx: context.Context | null,
    hostFns: Map<string, vmruntime.HostFunction | null> | null,
  ): {
    imports: WebAssembly.Imports
    instRef: { current: Instance | null }
  } {
    const imports: Record<string, Record<string, WebAssembly.ImportValue>> = {}
    const instRef: { current: Instance | null } = { current: null }
    if (!hostFns) return { imports, instRef }

    hostFns.forEach((fn, key) => {
      let modName = 'env'
      let funcName = key
      const dot = key.indexOf('.')
      if (dot !== -1) {
        modName = key.substring(0, dot)
        funcName = key.substring(dot + 1)
      }
      if (!imports[modName]) imports[modName] = {}

      const functionTypes = this.functionTypes.imports.get(
        `${modName}.${funcName}`,
      )
      if (!functionTypes) return
      let importIndex = 0
      Object.defineProperty(imports[modName], funcName, {
        configurable: true,
        get: () => {
          const functionType = functionTypes[importIndex++]
          if (!functionType) {
            throw $.newError(`unexpected WebAssembly import lookup: ${key}`)
          }
          return (...args: Array<number | bigint>) => {
            if (fn === null) {
              throw $.newError(`nil host function: ${key}`)
            }
            const stack = args.map((arg, index) =>
              wasmValueToStack(arg, functionType.parameters[index]),
            )
            const err = fn(ctx, instRef.current, stack)
            if (isPromiseLike(err)) {
              void Promise.resolve(err).catch(() => {})
              throw $.newError(`asynchronous WebAssembly host function: ${key}`)
            }
            if (err) throw err
            const results = functionType.results.map((type, index) =>
              stackToWasmValue(stack[index] ?? 0n, type),
            )
            if (results.length === 0) return
            return results.length === 1 ? results[0] : results
          }
        },
      })
    })

    return { imports, instRef }
  }
}

// Instance wraps a WebAssembly.Instance.
export class Instance implements vmruntime.VmInstance {
  private readonly exports: WebAssembly.Exports

  constructor(
    private readonly wasmInstance: WebAssembly.Instance,
    private readonly functionTypes: Map<string, WasmFunctionType>,
  ) {
    this.exports = wasmInstance.exports
  }

  // Call invokes an exported function by name.
  async Call(
    _ctx: context.Context | null,
    name: string,
    ...args: bigint[]
  ): Promise<[$.Slice<bigint>, $.GoError]> {
    const fn = this.exports[name]
    if (typeof fn !== 'function') return [null, null]
    try {
      const functionType = this.functionTypes.get(name)
      if (!functionType)
        return [null, $.newError(`unknown function type: ${name}`)]
      const wasmArgs = args.map((arg, index) =>
        stackToWasmValue(arg, functionType.parameters[index]),
      )
      const result = (fn as (...args: Array<number | bigint>) => unknown)(
        ...wasmArgs,
      )
      return [wasmResultsToStack(result, functionType.results), null]
    } catch (err) {
      return [null, toGoError(err)]
    }
  }

  // Memory returns the instance's linear memory.
  Memory(): BrowserMemory | null {
    const mem = this.exports.memory
    if (!(mem instanceof WebAssembly.Memory)) return null
    return new BrowserMemory(mem)
  }

  // ExportedFunction returns a callable reference.
  ExportedFunction(name: string): BrowserFunction | null {
    const fn = this.exports[name]
    if (typeof fn !== 'function') return null
    const functionType = this.functionTypes.get(name)
    if (!functionType) return null
    return new BrowserFunction(
      fn as (...args: Array<number | bigint>) => unknown,
      functionType,
    )
  }

  // ExportedGlobal returns a reference to an exported global.
  ExportedGlobal(name: string): BrowserGlobal | null {
    const global = this.exports[name]
    if (!(global instanceof WebAssembly.Global)) return null
    return new BrowserGlobal(global)
  }

  // Close is a no-op.
  async Close(_ctx: context.Context | null): Promise<$.GoError> {
    return null
  }
}

// BrowserFunction wraps a WebAssembly exported function.
export class BrowserFunction implements vmruntime.VmFunction {
  constructor(
    private readonly fn: (...args: Array<number | bigint>) => unknown,
    private readonly functionType: WasmFunctionType,
  ) {}

  async Call(
    _ctx: context.Context | null,
    ...args: bigint[]
  ): Promise<[$.Slice<bigint>, $.GoError]> {
    try {
      const wasmArgs = args.map((arg, index) =>
        stackToWasmValue(arg, this.functionType.parameters[index]),
      )
      const result = this.fn(...wasmArgs)
      return [wasmResultsToStack(result, this.functionType.results), null]
    } catch (err) {
      return [null, toGoError(err)]
    }
  }
}

// BrowserGlobal wraps a WebAssembly.Global.
export class BrowserGlobal implements vmruntime.VmGlobal {
  constructor(private readonly global: WebAssembly.Global) {}

  Get(): bigint {
    return BigInt(this.global.value)
  }

  Set(val: bigint): void {
    this.global.value =
      typeof this.global.value === 'bigint' ? val : Number(val)
  }
}

// BrowserMemory wraps WebAssembly.Memory with typed DataView access.
export class BrowserMemory implements vmruntime.VmMemory {
  constructor(private readonly mem: WebAssembly.Memory) {}

  private get buf(): ArrayBuffer {
    return this.mem.buffer
  }

  Read(offset: number, length: number): [$.Slice<number>, boolean] {
    if (offset + length > this.buf.byteLength) return [null, false]
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
    return [new DataView(this.buf).getBigUint64(offset, true), true]
  }

  Write(offset: number, data: $.Slice<number>): boolean {
    const bytes =
      data instanceof Uint8Array ? data : new Uint8Array($.asArray(data))
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
    new DataView(this.buf).setBigUint64(offset, val, true)
    return true
  }

  Size(): number {
    return this.buf.byteLength
  }

  Grow(pages: number): [number, boolean] {
    try {
      return [this.mem.grow(pages), true]
    } catch {
      return [0, false]
    }
  }
}

type WasmValueType =
  | 'i32'
  | 'i64'
  | 'f32'
  | 'f64'
  | 'v128'
  | 'funcref'
  | 'externref'

type WasmFunctionType = {
  parameters: WasmValueType[]
  results: WasmValueType[]
}

type ModuleFunctionTypes = {
  imports: Map<string, WasmFunctionType[]>
  exports: Map<string, WasmFunctionType>
}

function toGoError(err: unknown): $.GoError {
  if (
    (typeof err === 'object' || typeof err === 'function') &&
    err !== null &&
    'Error' in err &&
    typeof err.Error === 'function'
  ) {
    return err as $.GoError
  }
  return err instanceof Error ? $.toGoError(err) : $.newError(String(err))
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    (typeof value === 'object' || typeof value === 'function') &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function'
  )
}

function wasmValueToStack(value: number | bigint, type: WasmValueType): bigint {
  switch (type) {
    case 'i32':
      return BigInt((value as number) >>> 0)
    case 'i64':
      return BigInt.asUintN(64, value as bigint)
    case 'f32': {
      const view = new DataView(new ArrayBuffer(4))
      view.setFloat32(0, value as number, true)
      return BigInt(view.getUint32(0, true))
    }
    case 'f64': {
      const view = new DataView(new ArrayBuffer(8))
      view.setFloat64(0, value as number, true)
      return view.getBigUint64(0, true)
    }
    default:
      throw new Error(`unsupported WebAssembly value type: ${type}`)
  }
}

function stackToWasmValue(value: bigint, type: WasmValueType): number | bigint {
  switch (type) {
    case 'i32':
      return Number(BigInt.asIntN(32, value))
    case 'i64':
      return BigInt.asIntN(64, value)
    case 'f32': {
      const view = new DataView(new ArrayBuffer(4))
      view.setUint32(0, Number(BigInt.asUintN(32, value)), true)
      return view.getFloat32(0, true)
    }
    case 'f64': {
      const view = new DataView(new ArrayBuffer(8))
      view.setBigUint64(0, BigInt.asUintN(64, value), true)
      return view.getFloat64(0, true)
    }
    default:
      throw new Error(`unsupported WebAssembly value type: ${type}`)
  }
}

function wasmResultsToStack(
  result: unknown,
  resultTypes: WasmValueType[],
): $.Slice<bigint> {
  if (resultTypes.length === 0) return null
  const results = resultTypes.length === 1 ? [result] : (result as unknown[])
  return results.map((value, index) =>
    wasmValueToStack(value as number | bigint, resultTypes[index]),
  )
}

function readFunctionTypes(bytes: Uint8Array): ModuleFunctionTypes {
  const reader = new WasmReader(bytes)
  reader.expect([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00])

  const types: WasmFunctionType[] = []
  const importedTypeIndexes: number[] = []
  const importedNames: string[] = []
  const definedTypeIndexes: number[] = []
  const exportedFunctions = new Map<string, number>()

  while (!reader.done) {
    const sectionID = reader.byte()
    const section = reader.section()
    switch (sectionID) {
      case 1:
        section.vector(() => {
          if (section.byte() !== 0x60) throw new Error('invalid function type')
          types.push({
            parameters: section.vector(() => section.valueType()),
            results: section.vector(() => section.valueType()),
          })
        })
        break
      case 2:
        section.vector(() => {
          const moduleName = section.name()
          const fieldName = section.name()
          const kind = section.byte()
          if (kind === 0) {
            importedTypeIndexes.push(section.uint())
            importedNames.push(`${moduleName}.${fieldName}`)
          } else {
            section.skipImportType(kind)
          }
        })
        break
      case 3:
        definedTypeIndexes.push(...section.vector(() => section.uint()))
        break
      case 7:
        section.vector(() => {
          const name = section.name()
          const kind = section.byte()
          const index = section.uint()
          if (kind === 0) exportedFunctions.set(name, index)
        })
        break
    }
  }

  const imports = new Map<string, WasmFunctionType[]>()
  importedNames.forEach((name, index) => {
    const functionType = types[importedTypeIndexes[index]]
    const functionTypes = imports.get(name)
    if (functionTypes) functionTypes.push(functionType)
    else imports.set(name, [functionType])
  })
  const functionTypeIndexes = importedTypeIndexes.concat(definedTypeIndexes)
  const exports = new Map<string, WasmFunctionType>()
  exportedFunctions.forEach((index, name) => {
    exports.set(name, types[functionTypeIndexes[index]])
  })
  return { imports, exports }
}

class WasmReader {
  private offset = 0

  constructor(private readonly bytes: Uint8Array) {}

  get done(): boolean {
    return this.offset === this.bytes.length
  }

  byte(): number {
    const value = this.bytes[this.offset]
    if (value === undefined) throw new Error('unexpected end of WebAssembly')
    this.offset++
    return value
  }

  uint(): number {
    let value = 0
    let shift = 0
    while (true) {
      const byte = this.byte()
      value += (byte & 0x7f) * 2 ** shift
      if ((byte & 0x80) === 0) return value
      shift += 7
      if (shift > 49) throw new Error('WebAssembly integer is too large')
    }
  }

  name(): string {
    const length = this.uint()
    const start = this.offset
    this.offset += length
    if (this.offset > this.bytes.length) {
      throw new Error('unexpected end of WebAssembly name')
    }
    return new TextDecoder().decode(this.bytes.subarray(start, this.offset))
  }

  vector<T>(read: () => T): T[] {
    return Array.from({ length: this.uint() }, read)
  }

  valueType(): WasmValueType {
    switch (this.byte()) {
      case 0x7f:
        return 'i32'
      case 0x7e:
        return 'i64'
      case 0x7d:
        return 'f32'
      case 0x7c:
        return 'f64'
      case 0x7b:
        return 'v128'
      case 0x70:
        return 'funcref'
      case 0x6f:
        return 'externref'
      default:
        throw new Error('invalid WebAssembly value type')
    }
  }

  section(): WasmReader {
    const length = this.uint()
    const start = this.offset
    this.offset += length
    if (this.offset > this.bytes.length) {
      throw new Error('unexpected end of WebAssembly section')
    }
    return new WasmReader(this.bytes.subarray(start, this.offset))
  }

  expect(expected: number[]): void {
    for (const byte of expected) {
      if (this.byte() !== byte) throw new Error('invalid WebAssembly header')
    }
  }

  skipImportType(kind: number): void {
    switch (kind) {
      case 1:
        this.byte()
        this.skipLimits()
        return
      case 2:
        this.skipLimits()
        return
      case 3:
        this.byte()
        this.byte()
        return
      case 4:
        this.byte()
        this.uint()
        return
      default:
        throw new Error('invalid WebAssembly import type')
    }
  }

  private skipLimits(): void {
    const flags = this.uint()
    this.uint()
    if ((flags & 1) !== 0) this.uint()
  }
}
