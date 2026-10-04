# Handwritten Packages

This directory holds TypeScript implementations of Go packages that do not
transpile to working code: standard-library packages such as `sync`, `os`, and
`reflect`, and third-party packages under `github.com/` and `golang.org/`.
`builtin/` is the runtime that every generated file imports as
`@goscript/builtin`.

Each directory mirrors a Go import path. When a compiled package imports a path
that has a directory here, the compiler copies the handwritten package into the
output instead of transpiling the Go source. `--gs-path` adds more directories
with the same layout.

A package directory contains:

- `index.ts`, which exports the package API, and the `.ts` files behind it.
- `meta.json`, when the compiler needs facts it cannot read from TypeScript:
  `dependencies` lists other overrides the package imports, and
  `asyncFunctions` and `asyncMethods` mark calls that suspend, such as
  `Mutex.Lock`. The compiler awaits those calls and colors their callers async.
- `godoc.txt`, where present, the upstream `go doc` output kept for reference.
- `parity.json`, where present, which records each upstream symbol as `real`,
  `deferred`, or `blocked` with a reason.
