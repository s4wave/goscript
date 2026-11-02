# GoScript Package Override System

## Overview

GoScript provides a package override system that allows hand-written TypeScript implementations to replace Go standard library packages. This system is used for packages like `sync`, `unicode`, `time`, `errors`, etc., where native TypeScript implementations can provide better performance or more appropriate semantics than transpiled Go code.

## Directory Structure

Override packages are located in the `gs/` directory. The directory path is
the Go import path, and `index.ts` is the package entrypoint:

```
gs/
└── hash/
    └── crc32/
        ├── index.ts       # TypeScript implementation or re-exports
        ├── index.test.ts  # Package-local behavior tests
        ├── meta.json      # Optional compiler metadata
        └── parity.json    # Optional exported API parity ledger
```

The compiler discovers override packages from `index.ts`. Implementations may
live directly in that file or be split into sibling modules and re-exported.
Test files are not copied into compiler output.

## API Parity Ledgers

Override packages can include `parity.json` to make exported Go API coverage a
compiler-owned contract. A strict ledger lists every exported symbol from the
JS/WASM Go package and classifies each symbol:

```json
{
  "schemaVersion": 1,
  "strict": true,
  "symbols": {
    "Marshal": { "status": "real" },
    "FuncOf": {
      "status": "blocked",
      "reason": "dynamic function type construction is not implemented"
    }
  }
}
```

`real` means the effective TypeScript package export exists. The verifier
resolves `index.ts`, named re-exports, and `export *` chains, including
re-exports of other override packages through `@goscript/`, using the same
override package roots as copy planning. `blocked` means the symbol is not
exported and carries the reason callers cannot use it yet. If Go source selects
a blocked symbol, compilation fails with a structured parity diagnostic before
TypeScript typechecking or bundling sees an undefined import.

`deferred` is accepted only while a ledger is being seeded. Package-local tests
should keep checked-in ledgers at zero deferred symbols.

## Generated Stubs

Compiled code can refer to any export of a Go package, even one it never
calls: yaegi's symbol tables take the value of every exported function and
variable, and a method table of a named non-struct type lists the method
function `Type_Method` of each of its methods, including unexported ones. So
that each such reference resolves, `TestOverrideStubsCurrent`
(`compiler/override-stubs_test.go`) compares each standard library override
package with the exported API of its Go package for the js/wasm port and
generates `stubs.gs.ts`, which `index.ts` re-exports, declaring what the
hand-written TypeScript lacks:

- a missing function panics with `goscript: <pkg>.<Name> is not implemented`
  when called (`$.notImplemented`);
- a missing variable holds its zero value;
- a missing struct type is a class that panics when constructed, and any
  other missing type is `any`;
- a missing method function of a type the override declares as a class calls
  the class's method (`$.callOverrideMethod`), and panics as above if the
  class lacks it; that of any other type panics.

Constants are inlined, and symbols a parity ledger blocks get no stub. Each
stub is a plain declaration, so a bundler drops those a program does not use.
Run `go generate` after changing an override's exports: the test fails while
a stub module is stale.

## Metadata System

### Purpose
The metadata system allows defining which functions/methods are asynchronous, package dependencies, and other compiler-relevant information without modifying the main compiler logic.

### Metadata File Format

An override package may include a `meta.json` file that defines metadata:

```json
{
  "dependencies": ["package1", "package2"],
  "asyncFunctions": {
    "FunctionName": true
  },
  "callbackAsyncFunctions": {
    "IndexFunc": true
  },
  "asyncMethods": {
    "TypeName.MethodName": true,
    "OtherType.Method": false
  },
  "asyncCallbacks": {
    "TypeName.MethodName": ["handler"]
  },
  "asyncWhenMethods": {
    "FunctionName": ["MethodName"]
  },
  "syncInterfaces": {
    "InterfaceName": true
  }
}
```

### Fields

- **dependencies**: Array of package paths this package depends on (relative to `gs/` directory)
- **asyncFunctions**: Object mapping a package-level function name to boolean indicating if async
- **callbackAsyncFunctions**: Object mapping a package-level function name, or a `TypeName.MethodName` key, to boolean indicating that it calls its function arguments before returning and suspends exactly when one of them does. Its TypeScript returns a promise only when a callback returned one. The compiler awaits a call, and colors its caller async, only when an argument may suspend: a function value, a literal that suspends, or a declared function colored async. `slices.IndexFunc` and `slices.SortFunc` use it, so a synchronous predicate keeps its caller synchronous, and so do `sync`'s `Once.Do` and `Map.Range`.
- **asyncMethods**: Object mapping `TypeName.MethodName` to boolean indicating if async
- **asyncCallbacks**: Object mapping a function name or `TypeName.MethodName` to the names of its function-typed parameters that the runtime stores and awaits. A function literal passed for one lowers as an async function, so its interface calls are awaited. A named parameter is needed because Go often declares such a parameter with an unnamed function type, which carries no async metadata.
- **syncInterfaces**: Object naming interfaces the package declares whose methods no override value suspends in, except the methods of named override types that `asyncMethods` marks async. It is a promise about every override package: any TypeScript object that stands for a value of the interface, including one an override returns as an interface value or wraps around another value, must suspend only where metadata says. In a whole program the compiler then closes the interface over the implementation graph like a compiled one, and also any interface, such as a local `interface{ String() string }`, whose override implementations implement a declared interface with those methods. `reflect` declares `Type`, `fmt` declares `Formatter`, `GoStringer`, `State` and `Stringer`, and `sort` declares `Interface`. A call of such an interface method that the program leaves sync is not awaited, and its result is asserted to its Go type, since its TypeScript type may admit a promise.
- **asyncWhenMethods**: Object mapping a package-level function name to method names. The function is async in a program where a compiled method with one of those names is async, and synchronous otherwise. `encoding/json` uses it for `Marshal` and `Unmarshal`, which call a `MarshalJSON` or `UnmarshalJSON` that may suspend (for example, one that encodes an image through an `io.Writer`). The override must then return a Promise when such a method suspends, and a plain value otherwise.
- **asyncWhenOperands**: Object naming `asyncWhenMethods` functions that call the methods they list only on the values of their arguments. A call of one is then decided by the static types of its arguments rather than by every method of those names in the program: an argument for a parameter of a non-empty interface type by its type's methods of that interface, and any other by the methods fmt calls on the values it formats (`Error`, `Format`, `GoString`, `String`, and those of the values inside it). `fmt` uses it for its print functions and `sort` for `Sort`, `Stable` and `IsSorted`.
- **suspendingValues**: Object naming package-level functions whose function values suspend: the function results they return and the callbacks they pass to their function arguments. At each call, and where the function's value is taken, the compiler adds an async value of each such func type as instantiated there, so calls through values of those types are awaited and functions that call them are colored async. `iter` uses it for `Pull` and `Pull2`, which run the sequence as a coroutine: `next` and `stop` wait for the sequence, and the yield callback the sequence receives waits for the following `next` or `stop`, so the yield calls of every sequence of that element type are awaited.
- **typeArgFunctions**: Object naming package-level generic functions whose TypeScript takes the descriptor of their type arguments as the first argument, as calls of compiled generic functions do. `iter.Pull` uses it to return the zero value of its element type at the end of the sequence.
- **asyncWhenFields**: Object mapping a `TypeName.MethodName` key to the func-typed fields of the receiver that the method calls. The method suspends exactly when a call through one of those fields may, so the compiler decides a call of it by the class of the field's func type. `sync` uses it for `Pool.Get`, which calls `New`.

### Example: sync package metadata

```json
{
  "dependencies": ["unsafe"],
  "asyncMethods": {
    "Mutex.Lock": true,
    "RWMutex.Lock": true,
    "RWMutex.RLock": true,
    "WaitGroup.Wait": true,
    "Once.Do": true,
    "Cond.Wait": true,
    "Map.Delete": true,
    "Map.Load": true,
    "Map.LoadAndDelete": true,
    "Map.LoadOrStore": true,
    "Map.Range": true,
    "Map.Store": true
  }
}
```

## Compiler Integration

### Analysis Phase

The override system integrates with the compiler's analysis phase:

1. **Metadata Loading**: Reads `meta.json` files from gs packages
2. **IsMethodAsync()**: Checks if a method call should be async based on metadata
3. **Function Coloring**: Propagates async status through the call chain
4. **Dependency Resolution**: Automatically resolves and copies package dependencies

### Method Call Detection

When the compiler encounters a method call like `mu.Lock()`, it:

1. Determines the receiver type and package
2. Looks up the method in the `asyncMethods` map from `meta.json`
3. Generates appropriate `await` if the method is marked async

Example:
```go
mu.Lock()  // Generates: await mu.Lock()
mu.Unlock() // Generates: mu.Unlock() (no await)
```

## TypeScript Implementation Guidelines

### Class Structure

Override packages should follow Go's API closely while using idiomatic TypeScript:

```typescript
export class Mutex implements Locker {
  private _locked: boolean = false
  private _waitQueue: Array<() => void> = []

  constructor(init?: Partial<{}>) {
    // Mutex has no public fields to initialize
  }

  // Async method (marked in metadata)
  public async Lock(): Promise<void> {
    // Implementation using Promises for blocking behavior
  }

  // Sync method (marked in metadata)
  public Unlock(): void {
    // Synchronous implementation
  }

  // Required for Go value semantics
  public clone(): Mutex {
    return new Mutex()
  }
}
```

### Key Requirements

1. **Constructor**: Accept optional `init` parameter for field initialization
2. **Clone Method**: Implement `clone()` for value semantics
3. **Async Methods**: Use `Promise<T>` return types for async methods
4. **Go API Compatibility**: Match Go's method signatures and behavior

### Async Implementation Patterns

For blocking operations, use Promises with queues:

```typescript
public async Lock(): Promise<void> {
  if (!this._locked) {
    this._locked = true
    return
  }

  // Block using Promise
  return new Promise<void>((resolve) => {
    this._waitQueue.push(resolve)
  })
}

public Unlock(): void {
  this._locked = false
  
  // Wake up next waiter
  if (this._waitQueue.length > 0) {
    const next = this._waitQueue.shift()!
    this._locked = true
    queueMicrotask(() => next())
  }
}
```

## Import Resolution

### Compiler Behavior

When the compiler encounters an import of an overridden package:

1. **Skip Compilation**: The compiler skips transpiling the Go package
2. **Import Mapping**: TypeScript imports resolve to `@goscript/{package}`
3. **Runtime Resolution**: The runtime maps to the actual `gs/{package}/` files

### Generated Import Statements

```typescript
// Go code:
import "sync"

// Generated TypeScript:
import * as sync from "@goscript/sync"
```

### Package Entrypoint

Each override package must have an `index.ts` file. It may contain the
implementation directly, as `gs/hash/crc32/index.ts` does, or re-export sibling
modules:

```typescript
export * from './implementation.js'
```

This allows the import system to resolve `@goscript/<package-path>` to the
TypeScript implementation.

## Project Override Roots

Projects can provide additional override roots with `--gs-path` (alias:
`--override-dir`) on `goscript compile` and `goscript test`.

Each root uses the same package-path layout as the built-in `gs/` tree:

```text
project/gs/
├── github.com/example/project/sdk/foo/
│   ├── index.ts
│   └── meta.json
```

When a package has a matching override, GoScript treats that package as an
override boundary in the package graph and does not compile its Go imports. The
override files are copied into the generated `@goscript/<package-path>/` output
tree with any `meta.json` dependencies.

Project roots take precedence over built-in overrides. Use project overrides
when a repository already owns an equivalent TypeScript SDK package and the Go
implementation imports native-only transport, crypto, filesystem, or service
code that should not be part of the generated JavaScript graph.

## Adding New Override Packages

### Step 1: Create the package entrypoint

Create `gs/{package-path}/index.ts` and implement the exported Go surface. The
directory name must match the complete Go import path.

### Step 2: Add compiler metadata when needed

Add `meta.json` only when the override has explicit copy dependencies or async
function and method metadata:

```json
{
  "dependencies": ["other-package-if-needed"],
  "asyncMethods": {
    "SomeType.AsyncMethod": true
  }
}
```

Imports from `@goscript/...` are discovered as copy dependencies automatically.

### Step 3: Declare and test API parity

Add a strict `parity.json` ledger for the package's exported Go symbols and a
package-local `index.test.ts` behavior test. Add a compliance fixture when the
contract must also be exercised through compiled Go.

The compiler automatically detects the override when the package is imported.

## Testing Override Packages

### Compliance Tests

Create compliance tests in `tests/tests/package_import_{package}/`:

```
tests/tests/package_import_{package}/
├── package_import_{package}.go    # Go test code
├── expected.log                   # Expected output
├── index.ts                       # Empty file
└── tsconfig.json                  # TypeScript config
```

### Test Structure

```go
package main

import "{package}"

func main() {
    // Test package functionality
    // Use only println() for output
    // Avoid importing other packages
    
    println("test finished")
}
```

### Running Tests

Run the fixture by its category and directory name:

```bash
go test -timeout 60s -run '^TestCompliance/core/hash_crc32$' ./compiler
```

## Host Filesystem

The `os` override accesses files through the first host filesystem it finds:

1. Deno's synchronous file API, when the `Deno` global has it.
2. The synchronous `node:fs` module of Node.js or Bun.
3. A callback filesystem on the `fs` global, as in a browser.

The callback filesystem has the callback API of Node.js (`open`, `close`,
`read`, `write`, `fstat`, `stat`, `lstat`, `mkdir`, `readdir`, `unlink`,
`rmdir`, `rename`, and so on, each taking a final `callback(err, ...results)`,
plus `constants` with the `O_*` flags). This is the API that Go's js/wasm port
calls through the `fs` object of `wasm_exec.js`, so a filesystem written for
Go's wasm port, such as one over IndexedDB, works unchanged. A program may
install it at run time: `os` looks for it on each call (`gs/os/callbackfs.ts`).
Paths are resolved against a working directory that `os.Chdir` sets, and each
`os.File` tracks its own position, which it passes to `read` and `write`.

Every call to the callback filesystem completes asynchronously, so the `os`
functions and `File` methods that access files are async (see
`gs/os/meta.json`), on every host. Since `io.Reader`, `io.Writer` and the
`io/fs` interfaces are already async where an implementation suspends, this
only adds `await` to direct calls such as `os.ReadFile`. `io/fs.ReadFile` and
`fs.FS.Open` may return a Promise for the same reason.

## Representative Override Packages

| Package      | Description                                          |
|--------------|------------------------------------------------------|
| `sync`       | Synchronization primitives                           |
| `unicode`    | Unicode character classification and conversion      |
| `time`       | Time and duration handling                           |
| `errors`     | Error creation and handling                          |
| `context`    | Context cancellation and timeouts                    |
| `slices`     | Slice utility functions                              |
| `hash/crc32` | Typed-array slicing-by-eight CRC-32 implementation    |

## Benefits of Override System

1. **Performance**: Native TypeScript implementations can be more efficient
2. **Semantics**: Better alignment with JavaScript/TypeScript idioms
3. **Async Support**: Proper async/await integration for blocking operations
4. **Maintainability**: Cleaner, more readable generated code
5. **Extensibility**: Easy to add new packages without modifying core compiler

## Secure Entropy

`crypto/internal/sysrand.Read` fills bytes from Web Crypto rather than
translating the Go js/wasm entropy import, which has no Go body. The public
`crypto/rand` Reader and sysrand share the secure fill primitive, including
the 65,536-byte Web Crypto quota. Sysrand bypasses the mutable public Reader
so standard-library key generation receives host entropy. Missing Web Crypto
fails the read; there is no deterministic fallback.
