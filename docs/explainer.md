# GoScript Architecture

GoScript compiles Go packages to readable TypeScript and keeps Go's behavior:
value copies, pointers, goroutines, channels, and `defer`. This document walks
through the compiler pipeline, the facts it computes before emitting code, and
the TypeScript it produces for each Go construct. Every example below is
current compiler output.

## Table of Contents

1. [Pipeline](#pipeline)
2. [Compiler Components](#compiler-components)
3. [Semantic Model](#semantic-model)
4. [Type Translation](#type-translation)
5. [Structs and Value Copies](#structs-and-value-copies)
6. [Pointers and VarRef](#pointers-and-varref)
7. [Concurrency](#concurrency)
8. [Control Flow](#control-flow)
9. [Runtime](#runtime)
10. [File Layout](#file-layout)

## Pipeline

```
┌──────────────────┐
│ Validate request │  package patterns, output path, module root, build flags
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Load packages    │  golang.org/x/tools/go/packages, GOOS=js GOARCH=wasm
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Semantic model   │  addressability, VarRef needs, async coloring, types
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Override plan    │  find handwritten gs/ packages and check their deps
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Lower            │  Go AST + semantic facts -> compiler IR
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Emit TypeScript  │  render files and package indexes from the IR
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Copy overrides   │  @goscript/builtin and the required gs/ packages
└──────────────────┘
```

Every stage reports structured diagnostics. When any stage reports an error,
the compiler stops before it writes output.

Three adapters feed the same pipeline. The CLI in `cmd/goscript` builds a
`compiler.Config` from its flags. The Go API, `compiler.Compiler`, passes
package patterns to `CompileService`. The browser adapter in `compiler/wasm`
type-checks one import-free source file, builds the same semantic model, and
reuses the lowering and emitter stages.

## Compiler Components

Each stage is one component in `compiler/`, and each component keeps one set
of rules:

| Component | Responsibility |
|-----------|----------------|
| `CompileService` | Runs the stages in order and collects diagnostics. |
| `CompileRequestOwner` | Normalizes adapter input and validates the requested packages. |
| `PackageGraphOwner` | Loads packages with `go/packages` and the build flags. |
| `SemanticModelOwner` | Computes type, method, addressability, VarRef, and async facts. |
| `OverrideRegistryOwner` | Reads `gs/` override metadata and plans which packages to copy. |
| `LoweringOwner` | Turns Go syntax and semantic facts into the IR in `lowered-program.go`. |
| `TypeScriptEmitOwner` | Renders deterministic, semicolon-free TypeScript from the IR. |
| `RuntimeContractOwner` | Keeps generated helper names and `@goscript/builtin` imports stable. |

The emitter runs last and only renders text. Package identity, imports, async
coloring, pointer shapes, interface descriptors, generic dictionaries, override
dependencies, and runtime helper names are all decided before it starts.

## Semantic Model

The semantic model answers two questions the emitter cannot answer from one
expression: which variables need a `VarRef` box, and which functions must be
`async`.

### VarRef

A variable gets a `VarRef` box when Go code can reach it through a pointer:

- its address is taken with `&x`;
- a pointer-receiver method is called on it, which takes its address
  implicitly;
- it holds a function and a function literal that captures it assigns to it.

Every other variable stays a plain TypeScript `let`.

### Async coloring

A function becomes `async` when its body can suspend. The direct causes are:

- a channel send or receive;
- a `select` statement;
- a call to `print` or `println`, which write through the async host output;
- a call through a function value, whose target is unknown at compile time;
- a call to an override function or method marked async in its `meta.json`,
  such as `sync.Mutex.Lock`.

`colorAsyncFunctions` in `semantic-async.go` then propagates the mark with one
worklist until nothing changes. A function that calls an async function becomes
async. An interface method becomes async when any implementation is. A callee
becomes async when a caller passes it an async function argument. Every call to
an async function is emitted with `await`.

## Type Translation

| Go type | TypeScript type |
|---------|-----------------|
| `int`, `uint`, `int32`, `uint32`, `float64`, `float32`, `rune`, `byte` | `number` |
| `int64`, `uint64` | `bigint` |
| `string` | `string` |
| `bool` | `boolean` |
| `error` | `$.GoError` |
| `[]T` | `$.Slice<T>` |
| `map[K]V` | `globalThis.Map<K, V> \| null` |
| `chan T` | `$.Channel<T> \| null` |
| `*T` | `T \| $.VarRef<T> \| null` |
| `interface{}` | `any` |

`int64` and `uint64` arithmetic goes through runtime helpers such as
`$.int64Add` so it wraps on overflow like Go. `uint` and `uintptr` arithmetic
uses the same helpers to keep 64-bit width. Plain `int` stays a `number` and
does not model 64-bit overflow.

## Structs and Value Copies

A struct becomes a class. Field values live in `_fields`, and
`$.bindStructFields` defines an accessor for each field on the prototype.

```go
type Point struct {
	X int
	Y int
}
```

```ts
export class Point {
	public declare X: number
	public declare Y: number

	public _fields: {
		X: number
		Y: number
	}

	constructor(init?: Partial<{X?: number, Y?: number}>) {
		this._fields = {
			X: init?.X ?? (0 as number),
			Y: init?.Y ?? (0 as number)
		}
	}

	public clone(): Point {
		return $.markAsStructValue(new Point(this))
	}

	static {
		$.bindStructFields(this.prototype, ["X", "Y"])
	}

	static __typeInfo = $.registerStructType(/* name, constructor, methods, fields */)
}
```

Go assignment copies a struct value, so the compiler emits a clone:

```go
original := Point{X: 10, Y: 20}
c := original
c.X = 100
return original.X // 10
```

```ts
let original = $.markAsStructValue(new Point({X: 10, Y: 20}))
let c = $.markAsStructValue($.cloneStructValue(original))
c.X = 100
return original.X
```

## Pointers and VarRef

A `VarRef<T>` is a box with a `value` field. A pointer to a boxed variable is
the box itself, so writes through the pointer and reads of the variable see the
same storage.

```go
x := 10
p := &x
*p = 20
return x // 20
```

```ts
let x = $.varRef(10)
let p = x
p!.value = 20
return x.value
```

```
   x ──┐
       ▼
   ┌────────────────┐
   │ VarRef<number> │
   │   value: 20    │
   └────────────────┘
       ▲
   p ──┘
```

A pointer to a struct can be the struct object itself or a `VarRef` holding it,
which is why `*T` translates to `T | $.VarRef<T> | null`. `$.pointerValue`
reads through either shape.

## Concurrency

Async functions use `async`/`await`. Channels, `select`, and goroutines map
onto runtime helpers.

```go
func Add(a, b int) int { return a + b }

func Recv(ch chan int) int { return <-ch }
```

```ts
export function Add(a: number, b: number): number {
	return a + b
}

export async function Recv(ch: $.Channel<number> | null): globalThis.Promise<number> {
	return await $.chanRecv(ch)
}
```

### Channels

| Go | TypeScript |
|----|------------|
| `ch := make(chan int, 1)` | `let ch = $.makeChannel<number>(1, 0, "both")` |
| `ch <- 42` | `await $.chanSend(ch, 42)` |
| `v := <-ch` | `let v = await $.chanRecv(ch)` |
| `v, ok := <-ch` | `let r = await $.chanRecvWithOk(ch)`, then `r.value` and `r.ok` |
| `close(ch)` | `ch!.close()` |

### Select

Each case becomes an entry passed to `$.selectStatement`. A receive case
handles its result in `onSelected`, and `default` is the entry with `id: -1`.

```go
select {
case v := <-ch1:
	use(v)
case ch2 <- data:
default:
}
```

```ts
const [hasReturn, value] = await $.selectStatement<any, void>([
	{
		id: 0,
		isSend: false,
		channel: ch1,
		onSelected: async (result) => {
			let v = result.value
			use(v)
		}
	},
	{ id: 1, isSend: true, channel: ch2, value: data },
	{ id: -1, isSend: false, channel: null }
], true)
if (hasReturn) {
	return value
}
```

The emitter prefixes the temporaries it introduces with `__goscript`; the names
above are shortened.

### Goroutines

A `go` statement queues the call as a microtask and does not wait for it:

```go
go func() {
	ch <- 1
}()
```

```ts
queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
	await $.chanSend(ch, 1)
})() })
```

### Defer

A function with `defer` opens a disposable stack with `using`, so deferred
calls run in reverse order when the function returns or throws. A synchronous
function uses `DisposableStack`:

```go
func Process() int {
	f := open()
	defer f.Close()
	return f.n
}
```

```ts
export function Process(): number {
	using __defer = new $.DisposableStack()
	let f: file | $.VarRef<file> | null = open()
	__defer.defer(() => { file.prototype.Close.call(f) })
	return $.pointerValue<file>(f).n
}
```

An async function uses `await using` with `AsyncDisposableStack`, and its
deferred calls are awaited.

## Control Flow

| Go | TypeScript |
|----|------------|
| `for i := 0; i < 3; i++ {}` | `for (let i = 0; i < 3; i++) {}` |
| `for n < 100 {}` | `while (n < 100) {}` |
| `for i, v := range s {}` | an index loop over a captured copy of `s`, reading `s[i]` |
| `for k, v := range m {}` | `for (const [k, v] of m?.entries() ?? []) {}` |
| `for i, r := range str {}` | `for (const [i, r] of $.rangeString(str)) {}`, yielding runes |
| `goto` and labels | a lowered state machine |

## Runtime

`@goscript/builtin` lives in `gs/builtin/` and holds the helpers generated code
imports as `$`:

| File | Provides |
|------|----------|
| `varRef.ts` | `VarRef<T>`, `varRef`, `unref` |
| `slice.ts` | `Slice<T>`, `makeSlice`, `append`, `copy`, `len`, `cap`, `rangeString` |
| `map.ts` | `makeMap`, `mapGet`, `mapSet`, `deleteMapEntry` |
| `channel.ts` | `Channel<T>`, `makeChannel`, `chanSend`, `chanRecv`, `chanRecvWithOk`, `selectStatement` |
| `type.ts` | `TypeInfo`, `TypeKind`, `registerStructType`, `typeAssert`, `cloneStructValue`, `markAsStructValue` |
| `defer.ts` | `DisposableStack`, `AsyncDisposableStack` |
| `panic.ts` | `panic`, `recover` |
| `errors.ts` | `GoError`, `newError` |
| `builtin.ts` | `print`, `println`, `pointerValue`, integer conversions, 64-bit arithmetic |
| `scheduler.ts` | `queueTask`, which yields one full event-loop turn |
| `hostio.ts` | host standard output and input |
| `deferred-package.ts` | late package initialization for `--deferred-function` |

Handwritten overrides for standard-library and third-party packages live
beside it under `gs/`; [gs/README.md](../gs/README.md) describes their layout.

## File Layout

```
goscript/
├── cmd/goscript/            CLI
├── compiler/                compiler components
│   ├── compiler.go          Go API over CompileService
│   ├── service.go           runs the pipeline
│   ├── compile-request.go   adapter input and request validation
│   ├── package-graph.go     package loading
│   ├── semantic-model.go    semantic facts
│   ├── semantic-async.go    async coloring
│   ├── lowering.go          Go AST + facts -> IR
│   ├── lowered-program.go   IR types
│   ├── typescript-emitter.go
│   ├── runtime-contract.go  helper names and runtime imports
│   ├── override-registry.go gs/ metadata and copy plans
│   └── wasm/                browser source compilation
├── gs/                      runtime and handwritten overrides
│   └── builtin/             @goscript/builtin
├── design/                  older design notes; check against source
├── tests/tests/             560+ compliance fixtures
└── docs/explainer.md        this file
```
