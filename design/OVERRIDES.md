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
resolves `index.ts`, named re-exports, and `export *` chains using the same
override package roots as copy planning. `blocked` means the symbol is not
exported and carries the reason callers cannot use it yet. If Go source selects
a blocked symbol, compilation fails with a structured parity diagnostic before
TypeScript typechecking or bundling sees an undefined import.

`deferred` is accepted only while a ledger is being seeded. Package-local tests
should keep checked-in ledgers at zero deferred symbols.

## Metadata System

### Purpose
The metadata system allows defining which functions/methods are asynchronous, package dependencies, and other compiler-relevant information without modifying the main compiler logic.

### Metadata File Format

An override package may include a `meta.json` file that defines metadata:

```json
{
  "dependencies": ["package1", "package2"],
  "asyncMethods": {
    "TypeName.MethodName": true,
    "OtherType.Method": false
  }
}
```

### Fields

- **dependencies**: Array of package paths this package depends on (relative to `gs/` directory)
- **asyncMethods**: Object mapping `TypeName.MethodName` to boolean indicating if async

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
