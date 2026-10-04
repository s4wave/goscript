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

GoScript compiles Go packages into readable TypeScript modules. Goroutines,
channels, `select`, `defer`, pointers, and struct copies behave as they do in
Go, and the output is ordinary TypeScript you can import, bundle, and step
through in a debugger.

```bash
go install github.com/s4wave/goscript/cmd/goscript@latest
goscript compile --package . --output ./output --all-dependencies
```

## Install

GoScript needs the Go toolchain. Install the CLI with Go:

```bash
go install github.com/s4wave/goscript/cmd/goscript@latest
```

Or add it to a JavaScript project. The npm package runs the same compiler
through your local Go toolchain and adds the TypeScript API:

```bash
bun add -d goscript
```

[Bun](https://bun.sh) runs generated code directly. For Node and browsers,
bundle it with a bundler that resolves `tsconfig.json` paths, such as Bun,
Vite, or esbuild.

## Quick Start

Write a Go program:

```go
// main.go
package main

import "fmt"

type Greeter struct{ Name string }

func (g Greeter) Greet() string { return "Hello, " + g.Name + "!" }

func main() {
	ch := make(chan string)
	go func() { ch <- Greeter{Name: "GoScript"}.Greet() }()
	fmt.Println(<-ch)
}
```

Compile it from the module directory. `--all-dependencies` also emits the
packages it imports, here `fmt`, so the output runs on its own:

```bash
goscript compile --package . --output ./output --all-dependencies
```

Point `@goscript/*` imports at the output in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": { "@goscript/*": ["./output/@goscript/*"] }
  }
}
```

Run it:

```bash
$ bun run output/@goscript/example.com/hello/main.gs.ts
Hello, GoScript!
```

Each Go package becomes a directory under `output/@goscript/`, named by its
import path, with one `.gs.ts` file per Go file and an `index.ts` that exports
the package. A `package main` runs directly; any other package is a module you
import:

```ts
import { NewUser } from '@goscript/example.com/my/module/index.js'
```

[docs/typescript.md](./docs/typescript.md) has the full `tsconfig.json` for
typechecking and bundling generated code.

## Usage

### Compile packages

```bash
goscript compile --package ./pkg/... --output ./output --all-dependencies
```

`--package` takes any Go package pattern and repeats. Without
`--all-dependencies`, GoScript emits only the requested packages and the
runtime, which suits builds that compile dependencies separately.
[docs/cli.md](./docs/cli.md) lists every option.

### Run Go tests

`goscript test` compiles a package's Go tests to TypeScript and runs them with
Bun, or in Chromium with `--browser`. The output follows `go test`:

```bash
goscript test --tags goscript ./...
```

### Compile from TypeScript

```ts
import { compile } from 'goscript'

await compile({
  pkg: '.',
  output: './output',
  dir: process.cwd(),
})
```

### Compile from Go

```go
comp, err := compiler.NewCompiler(&compiler.Config{
	Dir:        ".",
	OutputPath: "./output",
}, nil, nil)
if err != nil {
	return err
}
_, err = comp.CompilePackages(ctx, ".")
```

### Compile in the browser

`github.com/s4wave/goscript/compiler/wasm` builds to WebAssembly and compiles a
single Go source file to TypeScript in the page. It accepts files without
imports; the [website playground](./website) uses it.

```go
ts, err := wasm.CompileSource(src, "main")
```

## Features

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

## How It Works

```text
Go packages -> type check -> semantic model -> lowered IR -> TypeScript
                                                         + runtime + overrides
```

GoScript loads packages with the Go toolchain and type-checks them. It then
decides which variables need a pointer box, which functions must become
`async`, and how each type maps to TypeScript, before it writes any text. The
emitter renders the result, and the compiler copies the
[`@goscript/builtin`](./gs/builtin) runtime and any handwritten
[overrides](./gs/README.md) for packages such as `sync`, `os`, and `reflect`.

A function that can block on a channel, `select`, or a lock becomes `async`,
and so does every function that calls it. Goroutines run as async tasks on the
JavaScript event loop, and no WebAssembly runtime ships with your code.

[docs/explainer.md](./docs/explainer.md) walks through each stage with
generated output for structs, pointers, channels, and `defer`.

## Limitations

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

## Why GoScript

Use GoScript when Go is the source of truth and part of your product runs in a
TypeScript runtime: shared validation and business rules, TypeScript packages
published from Go code, or Go framework code running in the browser without a
rewrite.

GoScript is built against [Spacewave](https://github.com/s4wave/spacewave), a
large Go and TypeScript application framework. Spacewave compiles its browser
core plugin through GoScript, including go-git and the go-mysql-server SQL
engine, and runs its core package tests through `goscript test` in CI.

[GopherJS](https://github.com/gopherjs/gopherjs) shares the goal of running Go
in JavaScript and ships its own goroutine scheduler. GoScript emits readable
TypeScript modules and maps goroutines onto JavaScript async functions.

## Development

```bash
bun install
bun run test
bun run lint
bun run build
```

`bun run example` compiles and runs [example/simple](./example/simple).
`bun run website:build` builds the website and playground.
[example/app](./example/app) is a full-stack application built on generated
TypeScript.

The [compliance tests](./tests/README.md) under [tests/tests](./tests/tests)
are Go programs compiled, typechecked, and run against expected output.

## Contributing

GoScript is experimental. To fix a missing Go behavior, add a focused compiler
or compliance test that reproduces it, then implement the behavior in the
compiler or runtime stage responsible for it.

Open an issue for Go code GoScript cannot compile, runtime gaps, and missing
standard-library overrides.

## License

MIT
