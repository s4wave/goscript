<div align="center">
  <h3>GoScript: Go to TypeScript Compiler</h3>

  <p>
    Compile Go to readable TypeScript for Node, Bun, and modern browsers.
  </p>


  <div align="center">
    <img src="./docs/assets/readme-transpile-demo.svg?cachebuster=4" alt="GoScript side-by-side Go source and generated TypeScript output showing a channel send, goroutine scheduling, and awaited channel receive." />
  </div>

  <p>
    <a href="https://godoc.org/github.com/s4wave/goscript">
      <img src="https://godoc.org/github.com/s4wave/goscript?status.svg" alt="GoDoc" />
    </a>
    <a href="https://deepwiki.com/s4wave/goscript">
      <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" />
    </a>
  </p>

</div>

## Overview

**GoScript** is an experimental Go-to-TypeScript compiler for sharing real Go
code with TypeScript projects. It loads packages from a Go module, type-checks
them with the Go toolchain, and emits deterministic TypeScript packages under
`@goscript/<go-package>/`.

GoScript handles package graphs, generics, interfaces, pointer and value
semantics, goroutines, channels, `select`, `defer`, async call propagation,
package tests, and a practical standard-library override surface. The generated
TypeScript stays readable enough to inspect, bundle, and debug like normal
application code.

GoScript is developed and tuned against
[Spacewave](https://github.com/s4wave/spacewave), a large Go and TypeScript app
framework. Spacewave compiles its browser core plugin through GoScript,
including its go-git storage backend and the go-mysql-server SQL engine, and
runs its core package tests through `goscript test` in CI. That dogfooding keeps
build speed and runtime compatibility tied to complex application code instead
of toy examples.

GoScript shares GopherJS's long-term browser goal: make ordinary Go programs
run in JavaScript environments. The difference is the runtime strategy.
GopherJS models a Go runtime with its own goroutine scheduler. GoScript emits
readable TypeScript modules and maps concurrency onto JavaScript async work and
runtime channel helpers instead of implementing a full goroutine scheduler.

### Why GoScript?

Use GoScript when your Go code is the source of truth, but part of your product
needs to run in a TypeScript runtime. GoScript compiles real application code:
database engines, git implementations, cryptography, and concurrent framework
code, not just self-contained algorithms.

Good fits today include:

- Sharing validation, formatting, parsing, and business rules between Go services and TypeScript applications
- Publishing TypeScript packages from Go data structures and algorithms
- Running Go application and framework code in Bun, browsers, and modern bundlers
- Moving Go framework code into browser/plugin paths without rewriting it in TypeScript
- Building package-level test workflows that exercise generated TypeScript instead of handwritten ports

GoScript does not run every valid Go program: code that depends on `unsafe`
memory operations, cgo, or standard-library packages without an override or
clean transpilation is unsupported. See [Limitations](#limitations) for the
precise list.

Useful docs:

- [Architecture explainer](./docs/explainer.md)
- [Compiler design](./design/DESIGN.md)
- [Compliance tests](./tests/README.md)
- [Runtime packages](./gs/README.md)

## Current Surface

### Works Today

The compiler runs large real-world package graphs. Each claim below names its
proof: a compliance fixture under [tests/tests](./tests/tests) (500+ fixtures,
each a Go program compiled, typechecked, and executed against expected output),
a runtime test under [gs/](./gs), or a consuming project.

- Go package loading through `go/packages` with `GOOS=js` and `GOARCH=wasm`,
  with build tags through CLI build flags (`tests/tests/*`, all fixtures)
- Structs, methods, interfaces, type assertions, typed nils, and value copying
  (`struct_*`, `interface_*` fixtures)
- Pointers and address-taken variables through the `VarRef` runtime model
  (`address_of_pointer_deref`, `gs/builtin/varRef.ts`)
- Arrays, slices, maps, strings, named types, complex values, and builtins
  (`array_*`, `slice_*`, `map_*` fixtures)
- Generics through generated type-argument dictionaries (`generic_*` fixtures)
- Goroutines, channels, `select`, `defer`, and async call propagation, mapped
  onto JavaScript async/await plus the runtime scheduler
  (`goroutines*`, `channel_*`, `select_*` fixtures; `gs/builtin/scheduler.ts`)
- `goto` and labeled statements through state-machine lowering
  (`forward_goto_statement`)
- Exact 64-bit integers: `int64` and `uint64` compile to TypeScript `bigint`
  with Go overflow semantics (`wide_uint64_exact_arithmetic`,
  `constant_shift_64`, `gs/builtin/wide-int.test.ts`)
- 32-bit integer multiplication through `Math.imul` (`imul_32bit`), `float32`
  rounding through `Math.fround` (`float32_rounding`), and bit operations
  through `Math.clz32` (`gs/math/bits`)
- A working `reflect` subset covering types, values, struct fields, maps,
  `MakeFunc`, `FuncOf`, and `DeepEqual` (`reflect_*` fixtures, `gs/reflect/`)
- Handwritten standard-library overrides under [gs/](./gs), including `crypto`
  (aes, cipher, ecdh, ed25519, rand, sha1, sha256, sha512), `compress`
  (gzip, zlib), `encoding` (binary, json), `os` and `syscall/js` filesystem
  support, `net/http`, `database/sql/driver`, `go/token`, `go/scanner`,
  `time`, `sync`, `reflect`, and `testing`
- Third-party package overrides under `gs/github.com/`, including
  go-git/go-billy, klauspost/compress, zeebo/blake3, mr-tron/base58,
  pkg/errors, hack-pad/safejs, and protobuf-go-lite
- `goscript test`, which compiles Go package tests to TypeScript, typechecks
  the generated workspace, and runs it with Bun or in a Chromium browser
  (`--browser`), reporting failures with compiler-stage classifications
- Real application graphs: Spacewave's browser core plugin compiles and boots
  through GoScript in its end-to-end WASM harness, a package graph that
  includes go-git and the go-mysql-server SQL engine; Spacewave also runs its
  core package tests through `goscript test`
  ([spacewave/package.json](https://github.com/s4wave/spacewave/blob/master/package.json),
  scripts `test:go:goscript` and `test:go:e2e:wasm:goscript`)
- Browser/WASM compilation for import-free single-file demos
  (`compiler/wasm/compile_test.go`, the website playground)

### Limitations

- CLI, Go API, and Node API inputs are package patterns, not direct `main.go`
  files.
- Browser source compilation is import-free only; package imports return a
  structured `goscript/wasm:imports-unsupported` diagnostic
  (`compiler/wasm/compile_test.go`). Imported code uses the package workflow.
- `unsafe` type-checks, but most operations (`Alignof`, `Offsetof`, `Sizeof`,
  pointer conversion) throw at runtime (`gs/unsafe/unsafe.ts`). Pointer
  arithmetic and cgo are unsupported.
- Plain `int`, `uint`, `uintptr`, and integers narrower than 64 bits compile
  to JavaScript `number`; only `int64` and `uint64` are `bigint`. `uint` and
  `uintptr` arithmetic routes through the 64-bit runtime helpers to preserve
  full width, but plain `int` does not model 64-bit overflow
  (`compiler/lowering.go`, `isBigIntBackedType`).
- Standard-library coverage is override-driven, not complete. A package
  without a `gs/` override must transpile cleanly or it is unsupported; there
  are no real sockets, processes, or plugin loading beyond what the JavaScript
  host provides.
- The `reflect` override is a subset; remaining parity gaps are tracked in
  `gs/reflect/parity.json`.
- `goscript test` supports a GoScript-compatible subset of `testing`, not the
  complete `go test` flag surface (`cmd/goscript/cmd-test_test.go`).
- Concurrency lowers to async/await and 64-bit arithmetic uses `bigint`; both
  cost more than plain synchronous JavaScript with `number`. Benchmarks live
  under [tests/bench](./tests/bench).

## Getting Started

Install Bun for TypeScript tests, examples, and website builds:

```bash
curl -fsSL https://bun.sh/install | bash
```

Install the CLI:

```bash
go install github.com/s4wave/goscript/cmd/goscript@latest
```

Compile a Go package from a module directory:

```bash
goscript compile --package . --output ./output
```

The output tree looks like this:

```text
output/
└── @goscript/
    ├── builtin/
    └── example.com/my/module/
        ├── index.ts
        └── main.gs.ts
```

For a generated `package main`, GoScript emits a main-script guard so the module
can run directly in Bun or a bundler that resolves `@goscript/*` imports. See
[example/simple](./example/simple) for the smallest compile-and-run workflow.

## TypeScript Projects

Generated package indexes re-export generated files such as `./main.gs.ts`, and
some package-local imports also use explicit `.ts` specifiers. Your TypeScript
project needs to allow those imports and map `@goscript/*` to the generated
output root.

Use this shape as the starting point:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "esnext.disposable", "DOM"],
    "baseUrl": ".",
    "paths": {
      "@goscript/*": ["./output/@goscript/*"]
    },
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  }
}
```

The important settings are:

- `moduleResolution: "bundler"` so `@goscript/*` package imports resolve like a modern app build.
- `allowImportingTsExtensions: true` because generated indexes and same-package imports can reference `.ts` files directly.
- `rewriteRelativeImportExtensions: true` if TypeScript is emitting JavaScript instead of only typechecking.
- `paths` pointing at the generated `@goscript/` tree.

If your bundler owns JavaScript emission and TypeScript only typechecks, adding
`"noEmit": true` is also a good fit.

## Command Line

```bash
goscript compile \
  --package ./my-go-package \
  --output ./output
```

Common options:

- `--package <pattern>`: Go package pattern to compile. Repeat for multiple packages.
- `--output <dir>`: output directory for the generated TypeScript tree.
- `--dir <dir>`: working directory for module/package loading.
- `--build-flags <flag>`: Go build flag, repeatable.
- `--all-dependencies`: compile dependency packages instead of only requested packages.
- `--gs-path <dir>`: additional GoScript override root containing package-path directories.
- `--package-blocklist <paths>`: comma-separated Go import paths to reject from the compiled package graph.
- `--compiler-cache-root <dir>`: explicit compiler package artifact cache root.
- `--protobuf-ts-binding`: bind `.pb.go` files to sibling `.pb.ts` files instead of emitting `.pb.gs.ts`.
- `--disable-emit-builtin`: skip copying handwritten `gs/` runtime packages.

Run Go package tests through GoScript:

```bash
goscript test --tags goscript ./...
```

`goscript test` loads package test variants, compiles each selected package
through the normal GoScript pipeline, writes a TypeScript test runner, typechecks
the generated workspace, and runs it with Bun. Useful options:

- `--tags <tags>`: comma-separated Go build tags.
- `--run <regexp>`: run only matching Go test names.
- `--count <n>`: run selected tests multiple times.
- `--short`: report true from `testing.Short`.
- `--timeout <duration>`: maximum package-test runtime.
- `--workdir <dir>`: generated test workspace directory.
- `--output <dir>`: generated TypeScript output root.
- `-p <n>`: maximum package typecheck/runtime commands to run concurrently.
- `--browser`: run package runtimes in a Chromium browser instead of Bun.
- `--runtime-groups`: run package runtimes in grouped Bun worker processes.
- `--incremental-typecheck`: reuse TypeScript build-info files in the test workdir.

The output is shaped like `go test` where possible and classifies failures that
occur before the generated tests run.

## APIs

Go API:

```go
package main

import (
	"context"

	"github.com/s4wave/goscript/compiler"
)

func main() {
	comp, err := compiler.NewCompiler(&compiler.Config{
		Dir:        ".",
		OutputPath: "./output",
	}, nil, nil)
	if err != nil {
		panic(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		panic(err)
	}
}
```

Node/Bun API:

```ts
import { compile } from 'goscript'

await compile({
  pkg: '.',
  output: './output',
  dir: process.cwd(),
})
```

WASM adapter package:

```go
package main

import "github.com/s4wave/goscript/compiler/wasm"

func main() {
	ts, err := wasm.CompileSource(`
package main

func main() {
	println("hello from GoScript")
}
`, "main")
	if err != nil {
		panic(err)
	}
	_ = ts
}
```

The website compiles this package into the browser build. Browser source
compilation accepts import-free single-file demos. Package imports return a
structured diagnostic; compile imported code with the package workflow.

## Architecture

GoScript uses a linear compiler pipeline:

```text
public adapter
  -> compile request
  -> package graph
  -> semantic model
  -> lowered program
  -> TypeScript emitter
  -> runtime/override package copy
```

Each stage has a small, testable job:

- Request validation normalizes CLI, Go API, Node/Bun API, and WASM inputs.
- Package loading records Go package identities, dependency edges, build tags, and diagnostics.
- Semantic modeling computes type, value, import, addressability, interface, and async facts.
- Lowering turns Go syntax plus semantic facts into a compiler IR.
- TypeScript emission renders deterministic, semicolon-free TypeScript from that IR.
- Runtime contracts keep generated helper names and `@goscript/builtin` imports stable.
- Override discovery copies handwritten runtime and standard-library packages when direct transpilation is not the right runtime shape.

This separation keeps type and runtime decisions out of string rendering, so
generated output changes are easier to explain, test, and debug.

## Running from Source

Install dependencies:

```bash
bun install
```

Run the core checks:

```bash
bun run test
bun run lint
bun run build
```

Run the simple package example:

```bash
bun run example
```

Build the static website and browser demo assets:

```bash
bun run website:build
```

The website playground can compile and run import-free single-file demos in the
browser. Compliance examples and imported-package examples are precompiled by the
website build.

## Examples

- [example/simple](./example/simple): smallest package compile-and-run workflow.
- [example/app](./example/app): full-stack application example using generated TypeScript.
- [tests/tests](./tests/tests): inherited compliance fixtures and generated output snapshots.

## Contributing

GoScript is experimental. Small compatibility shims are usually the wrong fix;
prefer adding focused compiler or compliance tests that name the missing Go
behavior, then implement the behavior in the compiler or runtime stage that
actually owns it.

Use the repo scripts rather than direct package-manager commands:

```bash
bun run test
bun run lint
bun run build
```

Please open issues for unsupported Go shapes, runtime gaps, and standard-library
override gaps.

## License

MIT
