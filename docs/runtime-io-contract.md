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
