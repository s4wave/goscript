# GoScript Async Interface Compatibility Design

## Overview

GoScript addresses a fundamental impedance mismatch between Go's synchronous-appearing concurrency model and TypeScript's explicit async/await model. This document describes how GoScript determines when TypeScript interfaces should have async methods based on actual implementation requirements.

## Problem Statement

### The Core Challenge

**Go's model**: All operations appear synchronous to the programmer - goroutines block transparently when encountering channel operations or async system calls.

**TypeScript's model**: Async operations must explicitly return Promises and use await syntax.

This creates an interface compatibility problem:

```go
// Go interface - appears synchronous
type Locker interface {
    Lock()   // may block goroutine waiting for mutex
    Unlock() // immediate operation
}
```

Without proper analysis, this generates inconsistent TypeScript:

```typescript
// PROBLEMATIC: Methods have different async requirements
export interface Locker {
  Lock(): Promise<void>    // async because sync.Mutex.Lock() uses Promises
  Unlock(): void          // sync because it's immediate
}

// Implementations become incompatible:
class FastLocker implements Locker {
  Lock(): void { /* immediate */ }     // ❌ Type error - doesn't return Promise
  Unlock(): void { /* immediate */ }   // ✅ OK
}
```

### Requirements

1. **Type Safety**: All implementations must be compatible with generated interfaces
2. **Correctness**: Interface method signatures must reflect actual async needs
3. **Granularity**: Per-method analysis (not all-or-nothing per interface)
4. **Cross-Package**: Support for external package implementations

## Solution Architecture

### Core Principle

**"Interface method async status is determined by analyzing all known implementations"**

If ANY implementation of an interface method requires async behavior (due to channel operations, async calls, etc.), then:
1. The interface method becomes async (returns Promise)
2. All implementations are forced to be async-compatible

### Open and Closed Interfaces

The rule above applies only where every implementation is known. The current
compiler (`compiler/semantic-model.go`, `compiler/semantic-whole-program.go`)
distinguishes:

- **Package-sealed interfaces** (with an unexported method): every
  implementation is in the compiled graph, so the implementations color the
  methods.
- **Closed exported interfaces**, in a whole-program build (the requested
  packages are main packages and their dependencies, or a test binary): an
  exported, non-generic interface whose implementations are all compiled Go
  methods with bodies, or methods of other closed interfaces (embedded
  interface fields). No type of a hand-written override package may
  implement it, and no interface that an override package declares or
  exposes in its API may have all of its methods, since override values are
  TypeScript objects whose methods may suspend without metadata saying so.
  The exposed API is walked into the exported methods and fields of the
  compiled types it mentions, but not their unexported fields, which only the
  compiled package's own code sets.
  The exception is an interface that override metadata declares sync
  (`syncInterfaces` in `meta.json`, such as `reflect.Type`, `fmt.Stringer`
  and `sort.Interface`): its override values suspend only in methods of
  named override types that metadata marks async, which the implementation
  graph colors. Such an interface is closed like a compiled one, even when
  it is package-sealed or has no implementation in the graph, and an
  override type or exposed interface that implements it does not open
  another interface in those methods.
- **Open interfaces**: every other interface. A call of an open interface
  method makes its caller async, but the method itself stays sync unless a
  compiled implementation is async.

A library build keeps every exported interface open
(`SemanticBuildOptions.WholeProgram` false).

### Calls Through Function Values

A call through a function value (a variable, field, parameter, element, call
result or type assertion of func type) is colored by the function values the
program takes (`compiler/semantic-func-values.go`,
`compiler/semantic-func-classes.go`, `compiler/semantic-func-shape.go`):

- The values are declared functions and methods named outside a call,
  method values and method expressions (including interface methods),
  function literals, and the body of each range-over-func loop, which is the
  yield callback.
- Calls and values are grouped by the shape of their underlying signature.
  Each called shape is a class with a synthetic key; a call through a value
  is a call of its class, and a class is async when a value whose shape
  matches is async. A type parameter matches any type, so calls and values
  in generic code match conservatively.
- Function literals and the initializers of lazily initialized package
  variables are nodes of the analysis like declared functions. A literal is
  lowered async exactly when the analysis colors it async. A function that
  reads a lazily initialized variable waits for its initializer.
- Function values from override packages (function results, func-typed
  fields and variables, and the callbacks an override passes to Go
  functions) suspend only by calling the Go functions they were given: their
  own function parameters and those of the function that produced them.
  Override metadata can instead say that the values a function hands out
  suspend (`suspendingValues`): `iter.Pull`'s `next` and `stop` and the yield
  callback it passes to the sequence are async values of their instantiated
  func types, recorded at each call of `Pull`.
- A func type asserted from an interface value keeps its classes async when
  the program uses a function that override metadata lists in
  `funcValueMakers` (`reflect.MakeFunc`, `reflect.Value.MethodByName`),
  since reflection can make a function of any type.
- In such a program, `reflect.Value.Call` may also pass made functions to the
  func parameters of the exported, non-generic functions and methods it
  calls (`compiler/semantic-reflect-twins.go`). A callback parameter, which
  the function only calls, compares with nil and passes to callback
  parameters of other functions or of methods of their receivers' own struct
  types, all during the call, does not open its type: the function gets a
  twin (`F$reflect`, an async copy of its body that awaits the parameter's
  calls and calls the twins of the functions it passes it to), which
  `reflect.Value.Call` calls instead of the function. A package function is
  linked to its twin by `$.setReflectTwin`; a method's twin is the class
  member of that name, which `Value.Method` binds, and a promoted method's
  forwarder has a twin too. Any other func parameter, one that the function
  keeps, returns, converts, captures in a literal, uses in a go or defer
  statement, or passes to an interface method, a function value or a generic
  function, opens its type as an asserted one does, and so does every func
  parameter of a deferred function, a method of a named non-struct type and a
  method whose value the program takes. Generic functions and methods of
  generic types are skipped: reflection cannot call a generic function, and
  an interpreter names no instance of a generic type.
- The iteration reaches one fixed point with the interface coloring: an async
  implementation can make a function value async and the reverse.

A library build keeps every class async. A call through a value of a sync
class is not awaited, and its result is asserted to its Go type, since the
TypeScript type of a function value admits a promise.

### Conditionally Async Overrides

Override metadata can make a function, a method or an interface method async
only in a program with an async compiled method of given names
(`asyncWhenMethods` in `meta.json`, keyed by a function name or
`Type.Method`, with `builtin` holding universe objects):

- The fmt print functions (`Sprint*`, `Print*`, `Append*`, and `Fprint*`,
  which also call their writer's `Write`) depend on `Error`, `Format`,
  `GoString` and `String`, the methods they may call. They return a plain
  value when every operand renders synchronously and the writer writes
  synchronously. Metadata lists them in `asyncWhenOperands` as well, since
  they call those methods only on their operands, so each call is decided
  by the static types of its operands (`compiler/semantic-format-operands.go`):
  a concrete type allows its own methods and those of the types fmt formats
  inside it (struct fields, pointer, slice, array and map elements); an
  interface with `Error()` allows `error.Error` and any `Format` or
  `GoString` method; an interface with `String()` allows its `String`, which
  its implementations color, `error.Error` and any `Format` or `GoString`
  method; an argument for a parameter of a non-empty interface type, such as
  `Fprintf`'s `io.Writer`, allows its static type's methods of that
  interface, the interface's own methods for an interface argument. An operand of any other interface
  type, a type parameter or a `reflect.Value` may hold anything, and leaves
  the call to the function's own condition.
- `sort.Sort`, `Stable` and `IsSorted` call only their argument's `Len`,
  `Less` and `Swap`, and are listed in `asyncWhenOperands` the same way, so a
  call is decided by its argument's static type. They return a plain value
  when every method call does.
- Override error types whose `Error` wraps another error's (`strconv.NumError`,
  `fs.PathError`, `os.LinkError`, `os.SyscallError`, `scanner.ErrorList`,
  `pkg/errors`, `cryptobyte.BuildError`) depend on the same names.
- `error.Error` (in `gs/builtin/meta.json`) depends on the same names: the
  error values override packages produce suspend only by formatting operands
  or wrapping other errors. In a whole program, `error` is therefore closed:
  a call of `Error` suspends only where a compiled method of one of those
  names is async, or an override method of one is marked async.

A call of such a target that the program leaves sync is not awaited, and its
result is asserted to its Go type, since its TypeScript type admits a
promise.

### Mutex Locks

`sync.Mutex` and `sync.RWMutex` `Lock` and `RLock` are async in metadata,
since they wait for another goroutine to unlock. The runtime runs one
goroutine at a time and switches only where one suspends, so another
goroutine can hold a lock only across a suspension inside a critical section.
The analysis (`compiler/semantic-mutex.go`) therefore decides each `Lock` by
the critical sections of its mutex:

- A mutex is known by the struct field or package variable that holds it (all
  values of a struct share the field). A `Lock` of a mutex reached any other
  way, such as through a pointer or a local variable, stays async.
- The critical section of a `Lock` statement is the statements up to the
  first `Unlock` of the same mutex after it in the same statement list, or,
  when the `Unlock` is deferred or elsewhere in the function body, the whole
  body. Each section is an analysis node, like a literal; each mutex has a node
  that calls its sections, and a function that locks it calls that node. So
  a `Lock` is async exactly when a section of its mutex may suspend, at the
  same fixed point as everything else, nested locks included.
- A mutex escapes, and every `Lock` of it stays async, when its address is
  taken, a method of it is taken as a value, a `Lock` of it has no `Unlock`
  in the same function body, a function body unlocks it without locking it,
  a `TryLock` or `TryRLock` takes it, or, for an embedded mutex, when the program has a
  type whose promoted `Lock` or `RLock` implements an interface method, or
  makes functions by reflection.

The runtime acquires a free lock synchronously and returns nothing, so a
`Lock` the analysis leaves sync is not awaited. `sync.Map`'s methods never
suspend, since none but `Range` calls back into Go code; `Range` and
`Once.Do` are callback async (`callbackAsyncFunctions`, which takes
`Type.Method` keys): they return a promise only when their function argument
does. `Pool.Get` calls its `New` field (`asyncWhenFields`), so a call of it is
async exactly when a call through a `func() any` value may be.

### Directives

Two directives in the doc comment of a declaration override the analysis
(`compiler/semantic-directives.go`). The semantic model collects them from
every compiled package before any package's facts.

- `//goscript:async` on an interface type, an interface method, a func type,
  or a func-typed struct field or package variable: the interface methods it
  covers (an interface type covers the methods it declares, not those of the
  interfaces it embeds) are roots of the coloring, and a call through the
  field, variable or func type makes its caller async by itself. It is for
  implementations and callbacks outside the compiled program.
- `//goscript:sync` on the same declarations: a call through the field,
  variable or func type is not a call of its class, a function argument passed
  to a parameter of the func type does not make the callee async, and the
  interface methods it covers are never marked, so callers stay sync. The
  method types of such an interface admit a promise, so that implementations
  the coloring made async stay assignable, and their calls assert the result.
- `//goscript:sync` on a function or method: the coloring never marks it. A
  suspending operation in its own body (a channel operation, `select`, an
  async override call such as a mutex lock, or a deferred call that may
  suspend) and a direct call of a compiled function or a read of a lazy
  variable that the coloring made async are compile errors, since those
  always return a promise. A call through an interface method or a function
  value that may suspend is wrapped in `$.syncResult`, which panics if it
  returns a promise.

The sync directive is a promise by the programmer, and an implementation or
value that does suspend is not awaited.

### Reporting Async Roots

`-report-async` (`CompileRequest.ReportAsync`) reports where the async
functions of a program come from, without changing the output
(`compiler/semantic-async-report.go`, `compiler/async-report.go`). Every mark
of the coloring is made at a root or along one edge from the mark being
propagated, so the coloring records the roots and every edge, including
edges to functions already async. The report lists each root with its kind
and cause, its spread (the functions it reaches in that graph, by package),
the functions only it reaches (its subtree in the dominator tree, with a
source above every root), and one chain of marks to `main`. It sums the roots
by kind and lists the classes and interface methods that one async value or
implementation made async, and each `//goscript:sync` declaration with the
mark it stopped or, for a func type, field or variable, whether other calls of
its shape are async. A reporting build checks every body and does not
replay the program from the cache, since body summaries do not keep causes.

### Implementation Analysis Flow

```
1. Control Flow Analysis
   ├── Detect async operations (channels, async calls)
   ├── Mark functions as async/sync based on body analysis
   └── Store results in Analysis.FunctionData

2. Interface Implementation Tracking  
   ├── Find all interface declarations
   ├── Locate struct types implementing each interface
   ├── Map interface methods to struct implementations
   └── Store in Analysis.InterfaceImplementations

3. Interface Method Resolution
   ├── For each interface method, check all implementations
   ├── If ANY implementation is async → interface method is async
   ├── Cache results in Analysis.InterfaceMethodAsyncStatus
   └── Force sync implementations to be async-compatible

4. Code Generation
   ├── Generate interfaces with resolved async status
   ├── Generate struct methods with consistency checking
   └── Ensure implementation compatibility
```

## Implementation Details

### Data Structures

```go
type Analysis struct {
    // Track which struct types implement which interface methods
    InterfaceImplementations map[InterfaceMethodKey][]ImplementationInfo
    
    // Cache resolved async status for interface methods  
    InterfaceMethodAsyncStatus map[InterfaceMethodKey]bool
    
    // Existing function async analysis
    FunctionData map[types.Object]*FunctionInfo
    
    // Cross-package support
    AllPackages map[string]*packages.Package
}

type InterfaceMethodKey struct {
    InterfaceType string // String representation of interface type
    MethodName    string // Method name (e.g., "Lock")
}

type ImplementationInfo struct {
    StructType    *types.Named // The implementing struct type
    Method        *types.Func  // The method object
    IsAsyncByFlow bool         // Whether this implementation requires async
}
```

### Analysis Process

#### Phase 1: Control Flow Analysis

```go
func (v *analysisVisitor) containsAsyncOperations(node ast.Node) bool {
    // Detect:
    // - Channel operations: ch <- value, <-ch
    // - Calls to known async functions
    // - Method calls on async types (sync.Mutex.Lock, etc.)
    // - Context-based operations
}
```

#### Phase 2: Implementation Discovery

```go
func (v *interfaceImplementationVisitor) Visit(node ast.Node) ast.Visitor {
    switch n := node.(type) {
    case *ast.GenDecl:
        // Find interface declarations
        for _, spec := range n.Specs {
            if typeSpec, ok := spec.(*ast.TypeSpec); ok {
                if interfaceType, ok := typeSpec.Type.(*ast.InterfaceType); ok {
                    v.findInterfaceImplementations(typeSpec, interfaceType)
                }
            }
        }
    }
}
```

Implementation discovery includes:
- **Type assertions**: `obj.(SomeInterface)` 
- **Interface assignments**: `var locker Locker = &myStruct{}`
- **Cross-package analysis**: Scanning all loaded packages

#### Phase 3: Async Status Resolution

```go
func (a *Analysis) IsInterfaceMethodAsync(interfaceType *types.Interface, methodName string) bool {
    key := InterfaceMethodKey{
        InterfaceType: interfaceType.String(),
        MethodName:    methodName,
    }
    
    // Check cache first
    if result, exists := a.InterfaceMethodAsyncStatus[key]; exists {
        return result
    }
    
    // Find all implementations
    implementations := a.InterfaceImplementations[key]
    
    // If ANY implementation is async, interface method is async
    for _, impl := range implementations {
        if impl.IsAsyncByFlow {
            a.InterfaceMethodAsyncStatus[key] = true
            return true
        }
    }
    
    a.InterfaceMethodAsyncStatus[key] = false
    return false
}
```

### Code Generation Integration

#### Interface Lowering

```go
func (o *LoweringOwner) tsMethodSignature(ctx lowerFileContext, method *types.Func) string {
    signature, _ := method.Type().(*types.Signature)
    if signature == nil {
        return method.Name() + "(): unknown"
    }
    async := o.functionAsync(ctx, method)
    return method.Name() + "(" + tsSignatureParams(signature) + "): " +
        asyncResultType(tsSignatureResult(signature), async)
}
```

#### Struct Method Lowering

```go
func (o *LoweringOwner) lowerFuncDecl(ctx lowerFileContext, decl *ast.FuncDecl) (*loweredFunction, []Diagnostic) {
    // SemanticModelOwner colors functions and interface-compatible methods
    // before lowering. Lowering records the final async status in IR; the
    // emitter only renders that decision.
    fnObj := ctx.pkg.TypesInfo.Defs[decl.Name].(*types.Func)
    async := ctx.model.functions[fnObj] != nil && ctx.model.functions[fnObj].async
    lowered := &loweredFunction{async: async}
    _ = lowered
}
```

## Examples

### Example 1: Consistent Async Interface

```go
// Input Go code
type Locker interface {
    Lock()
    Unlock()
}

type SyncMutex struct{}
func (m *SyncMutex) Lock()   { /* immediate */ }
func (m *SyncMutex) Unlock() { /* immediate */ }

type AsyncMutex struct{}
func (m *AsyncMutex) Lock()   { /* channel operation - detected as async */ }
func (m *AsyncMutex) Unlock() { /* immediate */ }
```

```typescript
// Generated TypeScript - consistent interface
export interface Locker {
  Lock(): Promise<void>    // ✅ ASYNC - because AsyncMutex.Lock() needs it
  Unlock(): void          // ✅ SYNC - all implementations are sync
}

class SyncMutex implements Locker {
  async Lock(): Promise<void> { /* forced async for compatibility */ }
  Unlock(): void { /* immediate */ }
}

class AsyncMutex implements Locker {
  async Lock(): Promise<void> { /* naturally async */ }
  Unlock(): void { /* immediate */ }
}
```

### Example 2: Cross-Package Implementation

```go
// Package A: interface definition
package a
type Writer interface {
    Write(data []byte) error
}

// Package B: sync implementation  
package b
type FileWriter struct{}
func (w *FileWriter) Write(data []byte) error { /* immediate */ }

// Package C: async implementation
package c  
type NetworkWriter struct{}
func (w *NetworkWriter) Write(data []byte) error { /* channel ops */ }
```

GoScript analyzes ALL packages and determines:
- `NetworkWriter.Write()` requires async (channel operations)
- Therefore `Writer.Write()` interface method becomes async
- `FileWriter.Write()` forced to be async-compatible
