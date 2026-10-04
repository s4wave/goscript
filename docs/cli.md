# Command Line

`goscript` has two commands: `compile` turns Go packages into TypeScript, and
`test` compiles and runs Go package tests. Every option also reads the
environment variable shown by `goscript <command> --help`.

## goscript compile

```bash
goscript compile --package ./my-go-package --output ./output
```

| Option | Effect |
|--------|--------|
| `--package <pattern>`, `-p` | Go package pattern to compile. Repeat for more packages. |
| `--output <dir>` | Root of the generated TypeScript tree. Default `./output`. |
| `--dir <dir>` | Directory to load the Go module from. Default: the current directory. |
| `--skip-dependencies`, `--no-deps` | Compile only the requested packages and `@goscript/builtin`, not the packages they import. |
| `--build-flags <flag>`, `-b` | Go build flag, such as `-tags=goscript`. Repeatable. |
| `--gs-path <dir>` | Extra override root laid out like [gs/](../gs/README.md). Repeatable. |
| `--package-blocklist <paths>` | Comma-separated import paths that fail the build if they appear in the package graph. |
| `--compiler-cache-root <dir>` | Directory for cached compiled packages. |
| `--disable-emit-builtin` | Skip copying the handwritten `gs/` runtime packages. |
| `--protobuf-ts-binding` | Bind `.pb.go` files to sibling `.pb.ts` files instead of compiling them to `.pb.gs.ts`. |
| `--binding-root <dir>` | Extra root that holds protobuf TypeScript bindings. Repeatable. |
| `--deferred-function <package/path.Function>` | Load an exported, non-generic function on its first call. Repeatable. |

### Deferred functions

`--deferred-function` splits a large program so a package loads only when one
of its functions is first called. The function's package then initializes late,
so code that runs eagerly must get shared concrete types and values from a
separate package. Calls to a deferred function become asynchronous, and a
function value referring to it stays unloaded until it is invoked. The
TypeScript API takes the same list as `deferredFunctions`.

## goscript test

```bash
goscript test --tags goscript ./...
```

`goscript test` loads each package's test variants, compiles them through the
normal pipeline, writes a TypeScript test runner, typechecks the generated
workspace, and runs it. Output follows `go test`. A failure before the tests
run reports the compiler stage that failed.

| Option | Effect |
|--------|--------|
| `--tags <tags>` | Comma-separated Go build tags. |
| `--run <regexp>` | Run only tests whose names match. |
| `--count <n>` | Run each selected test `n` times. |
| `--short` | Make `testing.Short` report true. |
| `--timeout <duration>` | Limit for the whole run. Default `30s`. |
| `-v`, `--verbose` | Verbose test output. |
| `--dir <dir>` | Go module directory. |
| `--workdir <dir>` | Directory for the generated test workspace. |
| `--output <dir>` | Root of the generated TypeScript tree. |
| `--gs-path <dir>` | Extra override root. Repeatable. |
| `-p <n>` | Packages to typecheck and run at once. Default 8. |
| `--browser` | Run tests in Chromium instead of Bun. |
| `--runtime-groups` | Run packages in shared Bun worker processes. |
| `--incremental-typecheck` | Reuse TypeScript build-info files in the workdir. |
| `--protobuf-ts-binding` | Bind `.pb.go` files to sibling `.pb.ts` files. |
| `--cpuprofile <file>`, `--memprofile <file>` | Write Go CPU or heap profiles of the `goscript test` process. |
