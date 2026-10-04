<div align="center">
  <h3>GoScript: a Go to TypeScript compiler</h3>

  <p>
    Your Go code runs anywhere TypeScript runs: Node, Bun, and the browser.
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

**GoScript** compiles Go packages to TypeScript. It loads packages from a Go
module, type-checks them with the Go toolchain, and emits deterministic
TypeScript packages under `@goscript/<go-package>/`.

It handles package graphs, generics, interfaces, pointers and value copies,
goroutines, channels, `select`, `defer`, async call propagation, and package
tests. Handwritten TypeScript overrides cover the standard-library packages that
do not transpile directly. You can read, bundle, and debug the output like code
you wrote.

GoScript is developed and tuned against
[Spacewave](https://github.com/s4wave/spacewave), a large Go and TypeScript app
framework. Spacewave compiles its browser core plugin through GoScript,
including its go-git storage backend and the go-mysql-server SQL engine, and
runs its core package tests through `goscript test` in CI, so every change to
build speed or runtime compatibility is measured on a large application.

GoScript and GopherJS share a goal: run ordinary Go programs in JavaScript
environments. They differ in runtime strategy. GopherJS models a Go runtime
with its own goroutine scheduler. GoScript emits readable TypeScript modules and
maps goroutines onto JavaScript async functions and runtime channel helpers.

### Why GoScript?

Use GoScript when Go is the source of truth and part of the product must run
in a TypeScript runtime. It compiles real application code: database engines,
git implementations, cryptography, and concurrent framework code.

Good fits today include:

- Sharing validation, formatting, parsing, and business rules between Go services and TypeScript applications
- Publishing TypeScript packages from Go data structures and algorithms
- Running Go application and framework code in Bun, browsers, and modern bundlers
- Running Go framework code in browser plugins without rewriting it in TypeScript
- Testing the generated TypeScript with the package's own Go tests

Code that depends on `unsafe` memory operations, cgo, or a standard-library
package that has no override and does not transpile cleanly is unsupported.
[Limitations](#limitations) has the full list.

Useful docs:

- [Architecture explainer](./docs/explainer.md)
- [Compiler design](./design/DESIGN.md)
- [Compliance tests](./tests/README.md)
- [Runtime packages](./gs/README.md)

## Current Surface

### Works Today

The compiler handles large real-world package graphs. Each item cites its
evidence: a compliance fixture under [tests/tests](./tests/tests) (500+ Go
programs, each compiled, typechecked, and run against expected output), a
runtime test under [gs/](./gs), or a consuming project.

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
  with Go overflow behavior (`wide_uint64_exact_arithmetic`,
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
- Standard-library support comes from `gs/` overrides and covers part of the
  standard library. A package without an override must transpile cleanly or it
  is unsupported. Sockets, processes, and plugin loading work only as far as
  the JavaScript host provides them.
- The `reflect` override is a subset; remaining parity gaps are tracked in
  `gs/reflect/parity.json`.
- `goscript test` supports a subset of `testing` and of the `go test` flags
  (`cmd/goscript/cmd-test_test.go`).
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
some package-local imports use explicit `.ts` specifiers. Your TypeScript
project must allow those imports and map `@goscript/*` to the generated output
root. Start from this configuration:

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

The settings GoScript output depends on:

- `moduleResolution: "bundler"` resolves `@goscript/*` package imports the way a bundler does.
- `allowImportingTsExtensions: true` lets generated indexes and same-package imports reference `.ts` files directly.
- `rewriteRelativeImportExtensions: true` rewrites those specifiers when TypeScript emits JavaScript.
- `paths` maps `@goscript/*` to the generated tree.

When your bundler emits JavaScript and TypeScript only typechecks, add
`"noEmit": true`.

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
- `--deferred-function <package/path.Function>`: load an exported, non-generic function on first call. Repeatable. The function's package initializes late, so eager callers must move shared concrete types and values into a separate package. Calls become asynchronous, and function values stay lazy until invoked. The TypeScript API takes the same list as `deferredFunctions`.
- `--disable-emit-builtin`: skip copying handwritten `gs/` runtime packages.

Run Go package tests through GoScript:

```bash
goscript test --tags goscript ./...
```

`goscript test` loads package test variants, compiles each selected package
through the normal GoScript pipeline, writes a TypeScript test runner, typechecks
the generated workspace, and runs it with Bun. Options:

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

The output follows `go test` where it can. Failures that occur before the
generated tests run report the compiler stage that failed.

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

The website playground builds this package into its browser bundle. It
compiles import-free single files only; see [Limitations](#limitations).

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

Each stage has one testable job:

- Request validation normalizes CLI, Go API, Node/Bun API, and WASM inputs.
- Package loading records Go package identities, dependency edges, build tags, and diagnostics.
- Semantic modeling computes type, value, import, addressability, interface, and async facts.
- Lowering turns Go syntax plus semantic facts into a compiler IR.
- TypeScript emission renders deterministic, semicolon-free TypeScript from that IR.
- Runtime contracts keep generated helper names and `@goscript/builtin` imports stable.
- Override discovery copies handwritten runtime and standard-library packages when direct transpilation is not the right runtime shape.

Type and runtime decisions happen before emission, so the emitter only renders
text. A change in generated output traces back to one stage, where a test can
reproduce it.

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

The playground compiles and runs import-free single files in the browser. The
website build precompiles the compliance and imported-package examples.

## Examples

- [example/simple](./example/simple): smallest package compile-and-run workflow.
- [example/app](./example/app): full-stack application example using generated TypeScript.
- [tests/tests](./tests/tests): compliance fixtures and their generated output snapshots.
- [tests/deps](./tests/deps): checked-in compiled dependencies that fixture typechecks fall back to. Test runs read this tree and never write it.

## Contributing

GoScript is experimental. To fix a missing Go behavior, add a focused compiler
or compliance test that reproduces it, then implement the behavior in the
compiler or runtime stage responsible for it. Run the checks from
[Running from Source](#running-from-source) before sending a change.

Open an issue for Go code GoScript cannot compile, runtime gaps, and missing
standard-library overrides.

## License

MIT
