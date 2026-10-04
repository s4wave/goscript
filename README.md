<div align="center">
  <h3>GoScript: a Go to TypeScript compiler</h3>

  <p>
    Your Go code runs anywhere TypeScript runs: Node, Bun, and the browser.
  </p>

  <div align="center">
    <img src="./docs/assets/readme-transpile-demo.svg?cachebuster=4" alt="GoScript side-by-side Go source and generated TypeScript output showing a channel send, goroutine scheduling, and awaited channel receive." />
  </div>

  <p>
    <a href="https://pkg.go.dev/github.com/s4wave/goscript"><img src="https://pkg.go.dev/badge/github.com/s4wave/goscript.svg" alt="Go Reference" /></a>
    <a href="https://deepwiki.com/s4wave/goscript"><img src="https://img.shields.io/badge/DeepWiki-Ask-blue" alt="Ask DeepWiki" /></a>
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

- **The Go language:** structs, methods, interfaces, type assertions,
  generics, closures, arrays, slices, maps, strings, and complex numbers, with
  Go's value-copy behavior for structs and arrays.
- **Pointers:** `&x`, pointers to pointers, and pointer-receiver methods behave
  as in Go.
- **Concurrency:** goroutines, buffered and unbuffered channels, `select`,
  `sync` primitives, and `defer`, `panic`, and `recover`. Functions that can
  block become `async`, and their callers `await` them.
- **Exact integers:** `int64` and `uint64` compile to `bigint` and wrap on
  overflow like Go. 32-bit math and `float32` rounding match Go.
- **Control flow:** `goto`, labels, `switch`, type switches, and `range` over
  slices, maps, strings, channels, integers, and iterator functions.
- **Standard library:** `fmt`, `strings`, `strconv`, `bytes`, `sort`,
  `slices`, `maps`, `errors`, `time`, `sync`, `context`, `io`, `os`,
  `encoding/json`, `encoding/binary`, `crypto` (AES, Ed25519, ECDH, SHA-1,
  SHA-2), `compress/gzip`, `compress/zlib`, `net/http`, `database/sql/driver`,
  `reflect`, `testing`, and more.
- **Third-party packages:** go-git and go-billy, klauspost/compress,
  zeebo/blake3, mr-tron/base58, pkg/errors, and protobuf-go-lite.
- **Go tests:** `goscript test` runs a package's own Go tests against the
  generated TypeScript, in Bun or in Chromium.
- **Large programs:** GoScript compiles Spacewave's browser core, including
  go-git and the go-mysql-server SQL engine.
- **In the browser:** the compiler itself runs in the page through
  WebAssembly, for single files without imports.

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

- The CLI and APIs take package patterns, not individual `.go` files.
- Browser compilation accepts single files without imports. Compile code with
  imports through the CLI or API.
- `unsafe` type-checks, but `Sizeof`, `Alignof`, `Offsetof`, and pointer
  conversions throw at runtime. Pointer arithmetic and cgo are unsupported.
- `int`, `uint`, and integers narrower than 64 bits are JavaScript numbers.
  `uint` and `uintptr` keep full 64-bit width, but `int` does not wrap on
  64-bit overflow.
- A standard-library package works when GoScript ships an override for it or
  it compiles cleanly from Go. Sockets, processes, and plugin loading work only
  as far as the JavaScript host supports them.
- `reflect` covers types, values, struct fields, maps, `MakeFunc`, `FuncOf`,
  and `DeepEqual`, but not all of the package.
- `goscript test` supports a subset of `testing` and of the `go test` flags.
- Async calls and `bigint` arithmetic cost more than synchronous JavaScript on
  plain numbers.

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

To fix a missing Go behavior, add a focused compiler or compliance test that
reproduces it, then implement the behavior in the compiler or runtime stage
responsible for it.

Open an issue for Go code GoScript cannot compile, runtime gaps, and missing
standard-library overrides.

## License

MIT
