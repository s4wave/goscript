import * as $ from '@goscript/builtin/index.js'

// GOOS Runtime constants for the JavaScript/WebAssembly target.
export const GOOS: string = 'js'
export const GOARCH: string = 'wasm'
export const Compiler: string = 'gc'

// GOVERSION Version returns the Go version as a string.
export const GOVERSION: string = 'go1.25.3'
export function Version(): string {
  return GOVERSION
}

// GOROOT returns the root of the Go tree, from the GOROOT environment
// variable if it is set. A JavaScript program has no Go build tree to fall
// back on, so it returns "" otherwise.
export function GOROOT(): string {
  const env = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process?.env
  return env?.GOROOT ?? ''
}

// GOMAXPROCS sets the maximum number of operating system threads
//
// JavaScript is single threaded so this always returns 1.
export function GOMAXPROCS(_n: number): number {
  // In a full implementation, we would set the max procs
  // Since JavaScript only supports 1, just return 1.
  return 1
}

// NumCPU returns the number of logical CPUs on the system.
export function NumCPU(): number {
  // In browser environment, use navigator.hardwareConcurrency if available
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency
  }

  // Default to 1 if we can't determine
  return 1
}

// mutexProfileFraction is the rate SetMutexProfileFraction last set. No
// profile is collected, so the rates below have no other effect.
let mutexProfileFraction = 0

// SetMutexProfileFraction sets the rate of mutex contention profiling and
// returns the previous rate; a negative rate only reads it.
export function SetMutexProfileFraction(rate: number): number {
  const previous = mutexProfileFraction
  if (rate >= 0) {
    mutexProfileFraction = rate
  }
  return previous
}

// SetBlockProfileRate sets the rate of blocking profiling.
export function SetBlockProfileRate(_rate: number): void {}

// SetCPUProfileRate sets the rate of CPU profiling.
export function SetCPUProfileRate(_hz: number): void {}

// SetDefaultGOMAXPROCS restores the default GOMAXPROCS, which is fixed at 1.
export function SetDefaultGOMAXPROCS(): void {}

// NumCgoCall returns the number of cgo calls, which JavaScript never makes.
export function NumCgoCall(): bigint {
  return 0n
}

// GC runs a garbage collection and blocks the caller until the
// garbage collection is complete. In JavaScript, we can suggest GC but not force it.
export function GC(): void {
  // In JavaScript, we can't force garbage collection
  // Some engines have gc() function in development, but it's not standard
  const gc = (globalThis as { gc?: () => void }).gc
  if (typeof gc === 'function') {
    gc()
  }
  // Otherwise, this is a no-op
}

// Gosched yields the processor, allowing other goroutines to run.
//
// This must cross a real task boundary via queueTask, not queueMicrotask. A
// microtask runs before the event loop turns, so it never lets I/O, timers, or
// rendering make progress; a busy-wait loop that only advances through the
// underlying JS scheduler would then livelock, and pending I/O/timers would
// starve. queueTask yields one event-loop turn so that other work runs.
export function Gosched(): Promise<void> {
  return new Promise((resolve) => {
    $.queueTask(resolve)
  })
}

// LockOSThread wires the calling goroutine to its current operating system
// thread. JavaScript runs all goroutines on one thread, so this is a no-op.
export function LockOSThread(): void {}

// UnlockOSThread undoes an earlier call to LockOSThread. It is a no-op, as
// goroutines always run on the one JavaScript thread.
export function UnlockOSThread(): void {}

// GoexitError Goexit terminates the current goroutine after deferred calls run. The
// JavaScript runtime has no goroutine cancellation primitive to resume from, so
// throw a non-panic sentinel: generated defer stacks still dispose while
// recover() cannot intercept it as a Go panic.
export class GoexitError extends Error {
  constructor() {
    super('runtime.Goexit')
    this.name = 'GoexitError'
  }
}

export function Goexit(): never {
  throw new GoexitError()
}

// NumGoroutine returns the number of goroutines that currently exist.
export function NumGoroutine(): number {
  return $.numGoroutine()
}

// stackFrame is a call frame parsed from a JavaScript stack trace.
interface stackFrame {
  name: string
  file: string
  line: number
}

// frameTable holds the frames that program counters refer to: the program
// counter of frameTable[i] is i+1, so that 0 is never a valid one.
const frameTable: stackFrame[] = []

// frameIndex maps a frame's key to its index in frameTable, so that each
// distinct call site gets one program counter.
const frameIndex = new globalThis.Map<string, number>()

// framePC returns the program counter for the frame, registering it in
// frameTable if needed.
function framePC(frame: stackFrame): number {
  const key = frame.name + '\0' + frame.file + '\0' + frame.line
  let index = frameIndex.get(key)
  if (index === undefined) {
    index = frameTable.length
    frameTable.push(frame)
    frameIndex.set(key, index)
  }
  return index + 1
}

// v8FrameRe matches a V8 or Bun stack line, such as "at name (file:1:2)",
// "at async name (file:1:2)" or "at file:1:2".
const v8FrameRe =
  /^\s*at (?:async )?(?:(.*?) \((.*):(\d+):\d+\)|(.*):(\d+):\d+)$/

// geckoFrameRe matches a Firefox or Safari stack line, such as
// "name@file:1:2".
const geckoFrameRe = /^(.*?)@(.*):(\d+):\d+$/

// currentFrames returns the frames of the current JavaScript stack, with
// the caller of currentFrames first.
function currentFrames(limit: number): stackFrame[] {
  const errorType = globalThis.Error as { stackTraceLimit?: number }
  const savedLimit = errorType.stackTraceLimit
  if (typeof savedLimit === 'number' && savedLimit < limit + 1) {
    errorType.stackTraceLimit = limit + 1
  }
  const stack = new globalThis.Error().stack ?? ''
  if (typeof savedLimit === 'number') {
    errorType.stackTraceLimit = savedLimit
  }
  const frames: stackFrame[] = []
  for (const text of stack.split('\n')) {
    const v8 = v8FrameRe.exec(text)
    if (v8 !== null) {
      frames.push(
        v8[2] !== undefined ?
          { name: v8[1], file: v8[2], line: Number(v8[3]) }
        : { name: '', file: v8[4], line: Number(v8[5]) },
      )
      continue
    }
    const gecko = geckoFrameRe.exec(text)
    if (gecko !== null) {
      frames.push({ name: gecko[1], file: gecko[2], line: Number(gecko[3]) })
    }
  }
  // Drop the frame of currentFrames itself.
  return frames.slice(1)
}

// Caller returns the program counter, file and line of a function on the
// calling goroutine's stack: skip 0 is the caller of Caller. A call made in
// a function that //goscript:callsite marks passes its call site, which links
// the call sites of the marked functions that called it, and the frames that
// chain reaches report their Go file and line. Other frames come from the
// JavaScript stack trace, and their file and line refer to the generated
// JavaScript.
export function Caller(
  skip: number,
  site?: $.CallSite,
): [number, string, number, boolean] {
  // Walk the chain of call sites to the frame, if it reaches that far.
  let frameSite = site
  for (let i = 0; i < skip && frameSite !== undefined; i++) {
    frameSite = frameSite.caller
  }
  if (frameSite !== undefined) {
    const { file, line } = frameSite
    return [framePC({ name: '', file, line }), file, line, true]
  }

  // Otherwise read the frame from the JavaScript stack.
  const frames = currentFrames(skip + 2)
  const frame = frames[skip + 1]
  if (frame === undefined) {
    return [0, '', 0, false]
  }
  return [framePC(frame), frame.file, frame.line, true]
}

// Func represents metadata for a function in a stack frame.
export class Func {
  constructor(
    private readonly pc: number = 0,
    private readonly name: string = frameTable[pc - 1]?.name ?? '',
  ) {}

  public Entry(): number {
    return this.pc
  }

  public FileLine(pc: number): [string, number] {
    const frame = frameTable[pc - 1]
    return frame === undefined ? ['', 0] : [frame.file, frame.line]
  }

  // Name returns the name of the function, or "" for a nil Func, as in Go.
  public Name(): string {
    return (this as Func | null)?.name ?? ''
  }
}

// FuncForPC returns function metadata for a program counter returned by
// Caller or Callers, or for the Pointer of a function value from reflect,
// whose name is its Go name where the compiler recorded one, or else that of
// the JavaScript function. It returns nil for any other value.
export function FuncForPC(pc: number): Func | null {
  if (frameTable[pc - 1] !== undefined) {
    return new Func(pc)
  }
  const fn = $.objectAtAddress(pc)
  return typeof fn === 'function' ? new Func(pc, $.goFunctionName(fn)) : null
}

// StartTrace enables execution tracing.
export function StartTrace(): $.GoError {
  return $.newError('runtime: execution tracing is unsupported in GoScript')
}

// StopTrace stops execution tracing.
export function StopTrace(): void {}

// ReadTrace returns the next execution trace chunk.
export function ReadTrace(): $.Slice<number> {
  return null
}

// Frame represents a single call frame.
export class Frame {
  public PC = 0
  public Func: Func | null = null
  public Function = ''
  public File = ''
  public Line = 0
  public Entry = 0
}

// Frames iterates over call frames.
export class Frames {
  private readonly frames: Frame[]
  private index = 0

  constructor(frames: Frame[] = []) {
    this.frames = frames
  }

  public Next(): [Frame, boolean] {
    if (this.index >= this.frames.length) {
      return [new Frame(), false]
    }

    const frame = this.frames[this.index]
    this.index++
    return [frame, this.index < this.frames.length]
  }
}

// Callers fills pc with the program counters of the calling goroutine's
// stack, using the JavaScript stack trace: skip 0 is the frame of Callers
// itself, and 1 is its caller. It returns the number of entries written.
export function Callers(skip: number, pc: $.Slice<number>): number {
  const max = $.len(pc)
  const frames = currentFrames(skip + max).slice(skip)
  const n = Math.min(max, frames.length)
  for (let i = 0; i < n; i++) {
    $.indexRef(pc, i).value = framePC(frames[i])
  }
  return n
}

// CallersFrames returns an iterator over the call frames of program
// counters returned by Callers.
export function CallersFrames(callers: $.Slice<number>): Frames {
  const frames: Frame[] = []
  for (let i = 0; i < $.len(callers); i++) {
    const pc = $.index(callers, i) as number
    const stack = frameTable[pc - 1]
    if (stack === undefined) {
      continue
    }
    const frame = new Frame()
    frame.PC = pc
    frame.Func = new Func(pc)
    frame.Function = stack.name
    frame.File = stack.file
    frame.Line = stack.line
    frame.Entry = pc
    frames.push(frame)
  }
  return new Frames(frames)
}

// Stack writes the current JavaScript stack into buf and returns bytes written.
// The host does not expose suspended goroutine stacks when all is requested.
export function Stack(buf: $.Slice<number>, _all: boolean): number {
  const stack = new Error().stack || 'stack trace unavailable'
  return $.copy(buf, new TextEncoder().encode(stack))
}

// MemStats represents memory allocation statistics.
export class MemStats {
  // Simplified memory stats for goscript
  public Alloc: number = 0 // bytes allocated and not yet freed
  public TotalAlloc: number = 0 // bytes allocated (even if freed)
  public Sys: number = 0 // bytes obtained from system
  public HeapAlloc: number = 0 // bytes allocated and not yet freed on the heap
  public HeapSys: number = 0 // bytes obtained from system for the heap
  public HeapInuse: number = 0 // bytes in in-use heap spans
  public StackInuse: number = 0 // bytes in stack spans
  public StackSys: number = 0 // bytes obtained from system for stacks
  public Lookups: number = 0 // number of pointer lookups
  public Mallocs: number = 0 // number of mallocs
  public Frees: number = 0 // number of frees

  constructor() {
    // Initialize with some default values
    // In a real environment, these would be obtained from the JS runtime
    this.updateMemoryStats()
  }

  private updateMemoryStats(): void {
    updateMemoryStats(this)
  }
}

// ReadMemStats populates m with memory allocator statistics.
export function ReadMemStats(m: MemStats | $.VarRef<MemStats> | null): void {
  m = $.pointerValue<MemStats>(m)
  updateMemoryStats(m)
}

function updateMemoryStats(m: MemStats): void {
  if (typeof performance !== 'undefined' && (performance as any).memory) {
    const mem = (performance as any).memory
    m.Alloc = mem.usedJSHeapSize || 0
    m.Sys = mem.totalJSHeapSize || 0
    m.TotalAlloc = m.Alloc // Simplified
  }
  m.HeapAlloc = m.Alloc
  m.HeapSys = m.Sys
  m.HeapInuse = m.Alloc
  m.StackInuse = 0
  m.StackSys = 0
}

// Error interface for runtime errors. Error may be async: a transpiled Go
// Error() method that awaits returns a Promise, so callers must await.
export interface Error {
  Error(): string | PromiseLike<string>
}

// Error is registered with the runtime type system, so type assertions to
// runtime.Error see its methods.
$.registerInterfaceType('runtime.Error', null, [
  {
    name: 'Error',
    args: [],
    returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
  },
  { name: 'RuntimeError', args: [], returns: [] },
])

// TypeAssertionError represents a failed type assertion.
export class TypeAssertionError implements Error {
  constructor(
    public readonly interfaceType: string,
    public readonly concrete: string,
    public readonly assertedType: string,
    public readonly missingMethod?: string,
  ) {}

  Error(): string {
    if (this.missingMethod) {
      return `interface conversion: ${this.interfaceType} is ${this.concrete}, not ${this.assertedType} (missing ${this.missingMethod} method)`
    }
    return `interface conversion: ${this.interfaceType} is ${this.concrete}, not ${this.assertedType}`
  }
}

// PanicNilError is the value of a panic called with a nil argument, as Go
// 1.21 and later panic with.
export class PanicNilError {
  constructor(_init?: Partial<{}>) {}

  public clone(): PanicNilError {
    return new PanicNilError()
  }

  public Error(): string {
    return 'runtime error: panic called with nil argument'
  }

  public RuntimeError(): void {}

  // PanicNilError is registered with the runtime type system; the compiler
  // gives its method signatures, for reflection.
  static __typeInfo = $.registerStructType(
    'runtime.PanicNilError',
    new PanicNilError(),
    [],
    PanicNilError,
  )
}

// PanicError represents a panic.
export class PanicError implements Error {
  constructor(public readonly value: any) {}

  Error(): string {
    return `panic: ${this.value}`
  }
}

// SetFinalizer sets the finalizer associated with obj to the provided finalizer function.
export function SetFinalizer(
  _obj: object,
  _finalizer: ((obj: object) => void) | null,
): void {
  // JavaScript runtimes do not expose Go's finalizer scheduling contract. Treat
  // registration and clearing as no-ops so cleanup backstops don't become fatal.
}

// Cleanup is a handle to a cleanup call for a specific object.
export class Cleanup {
  public Stop(): void {}

  public clone(): Cleanup {
    return new Cleanup()
  }
}

// AddCleanup registers cleanup to run when ptr is no longer reachable.
export function AddCleanup<T, S>(
  _ptr: T,
  _cleanup: (arg: S) => void | Promise<void>,
  _arg: S,
): Cleanup {
  // JavaScript runtimes do not provide Go's cleanup scheduling contract here.
  return new Cleanup()
}

// KeepAlive keeps obj reachable until the point where KeepAlive is called.
export function KeepAlive(obj: any): void {
  // In JavaScript, just accessing the object keeps it alive for this call
  // This is mostly a no-op but we touch the object to ensure it's not optimized away
  if (obj !== null && obj !== undefined) {
    // Touch the object to keep it alive
    void obj
  }
}
