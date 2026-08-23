// Package vmruntime defines abstract interfaces for WASM execution engines.

import * as $ from '@goscript/builtin/index.js'

// VmRuntime abstracts the WASM execution engine.
export interface VmRuntime {
  Compile(ctx: any, wasm: $.Bytes): Promise<[VmModule | null, $.GoError]>
  Close(ctx: any): Promise<$.GoError>
}

// VmModule represents a compiled WASM module.
export interface VmModule {
  Instantiate(
    ctx: any,
    config: VmModuleConfig | $.VarRef<VmModuleConfig> | null,
  ): Promise<[VmInstance | null, $.GoError]>
  Close(ctx: any): Promise<$.GoError>
}

// VmModuleConfig contains configuration for module instantiation.
export class VmModuleConfig {
  Name = ''
  Args: string[] | null = null
  Env: string[] | null = null
  Stdin: any = null
  Stdout: any = null
  Stderr: any = null
  HostFunctions: Map<string, HostFunction | null> | null = null

  constructor(init?: Partial<VmModuleConfig>) {
    Object.assign(this, init)
  }
}

// HostFunction is a host-provided function callable from WASM. The browser
// adapter requires it to complete synchronously because WebAssembly imports
// cannot suspend without JSPI or Asyncify. It rejects declared async functions
// at instantiation and a Promise returned by another function on its first call.
export type HostFunction = (
  ctx: any,
  inst: VmInstance | null,
  stack: $.Slice<bigint>,
) => $.GoError | Promise<$.GoError>

// VmInstance represents a running WASM module instance.
export interface VmInstance {
  Call(
    ctx: any,
    name: string,
    ...args: bigint[]
  ): Promise<[$.Slice<bigint>, $.GoError]>
  Memory(): VmMemory | null
  ExportedFunction(name: string): VmFunction | null
  ExportedGlobal(name: string): VmGlobal | null
  Close(ctx: any): Promise<$.GoError>
}

// VmFunction represents an exported WASM function.
export interface VmFunction {
  Call(ctx: any, ...args: bigint[]): Promise<[$.Slice<bigint>, $.GoError]>
}

// VmGlobal represents an exported WASM global variable.
export interface VmGlobal {
  Get(): bigint
  Set(val: bigint): void
}

// VmMemory abstracts access to WASM linear memory.
export interface VmMemory {
  Read(offset: number, length: number): [$.Bytes, boolean]
  ReadByteAt(offset: number): [number, boolean]
  ReadUint32Le(offset: number): [number, boolean]
  ReadUint64Le(offset: number): [bigint, boolean]
  Write(offset: number, data: $.Bytes): boolean
  WriteByteAt(offset: number, val: number): boolean
  WriteUint32Le(offset: number, val: number): boolean
  WriteUint64Le(offset: number, val: bigint): boolean
  Size(): number
  Grow(pages: number): [number, boolean]
}

// ExitError represents a clean process exit with a status code.
export class ExitError extends Error {
  public Code: number

  constructor(code: number) {
    super('exit: ' + code)
    this.Code = code
  }

  Error(): string {
    return this.message
  }

  ExitCode(): number {
    return this.Code
  }
}

// NewExitError creates an ExitError with the given code.
export function NewExitError(code: number): ExitError {
  return new ExitError(code)
}

// Snapshotable is an optional extension for VmInstance.
export interface Snapshotable {
  Snapshot(): Snapshot
}

// Snapshot represents a captured execution state.
export interface Snapshot {
  Restore(returnValues: $.Slice<bigint>): void
}
