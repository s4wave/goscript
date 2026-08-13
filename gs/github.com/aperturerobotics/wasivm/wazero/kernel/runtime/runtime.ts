// Package vmruntime defines abstract interfaces for WASM execution engines.

import type * as $ from '@goscript/builtin/index.js'
import type * as context from '@goscript/context/index.js'

// VmRuntime abstracts the WASM execution engine.
export interface VmRuntime {
  Compile(
    ctx: context.Context | null,
    wasm: $.Slice<number>,
  ): Promise<[VmModule | null, $.GoError]>
  Close(ctx: context.Context | null): Promise<$.GoError>
}

// VmModule represents a compiled WASM module.
export interface VmModule {
  Instantiate(
    ctx: context.Context | null,
    config: VmModuleConfig | $.VarRef<VmModuleConfig> | null,
  ): Promise<[VmInstance | null, $.GoError]>
  Close(ctx: context.Context | null): Promise<$.GoError>
}

// VmModuleConfig contains configuration for module instantiation.
export class VmModuleConfig {
  Name: string
  Args: $.Slice<string>
  Env: $.Slice<string>
  Stdin: any
  Stdout: any
  Stderr: any
  HostFunctions: Map<string, HostFunction | null> | null

  constructor(init: Partial<VmModuleConfig> = {}) {
    this.Name = init.Name ?? ''
    this.Args = init.Args ?? null
    this.Env = init.Env ?? null
    this.Stdin = init.Stdin ?? null
    this.Stdout = init.Stdout ?? null
    this.Stderr = init.Stderr ?? null
    this.HostFunctions = init.HostFunctions ?? null
  }
}

// HostFunction is a host-provided function callable from WASM.
export type HostFunction =
  | ((
      ctx: context.Context | null,
      inst: VmInstance | null,
      stack: $.Slice<bigint>,
    ) => $.GoError | Promise<$.GoError>)
  | null

// VmInstance represents a running WASM module instance.
export interface VmInstance {
  Call(
    ctx: context.Context | null,
    name: string,
    ...args: bigint[]
  ): Promise<[$.Slice<bigint>, $.GoError]>
  Memory(): VmMemory | null
  ExportedFunction(name: string): VmFunction | null
  ExportedGlobal(name: string): VmGlobal | null
  Close(ctx: context.Context | null): Promise<$.GoError>
}

// VmFunction represents an exported WASM function.
export interface VmFunction {
  Call(
    ctx: context.Context | null,
    ...args: bigint[]
  ): Promise<[$.Slice<bigint>, $.GoError]>
}

// VmGlobal represents an exported WASM global variable.
export interface VmGlobal {
  Get(): bigint
  Set(val: bigint): void
}

// VmMemory abstracts access to WASM linear memory.
export interface VmMemory {
  Read(offset: number, length: number): [$.Slice<number>, boolean]
  ReadByteAt(offset: number): [number, boolean]
  ReadUint32Le(offset: number): [number, boolean]
  ReadUint64Le(offset: number): [bigint, boolean]
  Write(offset: number, data: $.Slice<number>): boolean
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
  Snapshot(): Snapshot | null
}

// Snapshot represents a captured execution state.
export interface Snapshot {
  Restore(returnValues: $.Slice<bigint>): void
}
