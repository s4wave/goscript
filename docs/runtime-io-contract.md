# Runtime I/O contract

The TypeScript `io.Reader`, `Writer`, `Closer`, positional I/O, byte reader,
and string writer interfaces return either their Go result or a promise-like
result. Concrete synchronous implementations may narrow this return type.
Generated Go callers must await operations marked in each override's
`meta.json`; TypeScript callers with only an interface reference must do the
same. Never cast a promise to a tuple to satisfy an interface.

`mapResult` preserves an immediate result when a delegate is synchronous.
`runIO` drives a sequence of dependent operations without making a synchronous
path asynchronous. Promise rejection is thrown back into the generator, so
its `catch` and `finally` blocks execute. Neither helper permits concurrent
use of stateful readers or writers unless that implementation supports it.

Byte conversion is not ownership. `bytesToUint8Array` may return a shared
view or a copy, depending on its input representation. Retained input requires
an explicit `new Uint8Array(...)` snapshot. Writes to a caller's logical Go
slice must use the slice itself or a slice-aware copy helper.

This document describes the runtime overrides, not the historical async
contracts in `design/`. The implementation and metadata are authoritative.

## Incremental compression

`compress/gzip` and `compress/zlib` share `internal/flateio`. It uses the
low-level pako 1.0.11 codec, pinned in package.json and bun.lock. The pin is
intentional: the low-level API, decoder state transitions, and declarations
are version-specific. Upgrade it with the regression suite, not a silent
substitution of a newer high-level wrapper. Native Node compression is an
independent test oracle, not a required runtime dependency.

A writer snapshots each accepted input and serializes outstanding operations.
It emits compressed chunks as they become available. Flush emits a sync-flush
boundary without ending the stream; Close emits the final block and trailer.
Both wait for asynchronous destinations. Destination errors remain sticky
until Reset, and repeated Close calls share the original result. Reset during
pending operations is a caller error. There is no whole-stream accumulation.

A reader parses only its header during construction, then incrementally
produces bounded output. Body and trailer errors are reported by Read, not
precomputed at construction. Read and Reset can suspend when the source does.
Consumers must fully read to EOF to validate a checksum. gzip Close reports
DEFLATE errors; zlib Close also returns a stored wrapper error, like Go.

Reader-only inputs use a 32 KiB buffer and may be read ahead. Inputs that also
implement ByteReader are consumed byte-exactly, preserving protocol data after
a zlib stream or a gzip member with Multistream(false). No byte-at-a-time
Reader.Read collection is used. gzip's default concatenated-member support
starts a new decoder for every member and preserves first-member metadata.
