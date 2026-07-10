# Protobuf Lite TS

This directory contains a protobuf message with scalar fields and a `oneof`. We
generate two bindings from `protobuf_lite_ts.proto`:

- `protobuf_lite_ts.pb.go` with protobuf-go-lite
- `protobuf_lite_ts.pb.ts` with protobuf-es-lite

Native Go uses the Go binding. GoScript uses the TypeScript binding through the
`protobuf-ts-binding` fixture marker.

GoScript detects the sibling `.pb.ts` file when binding is enabled, emits a Go
adapter around the protobuf-es-lite message, and preserves generated oneof branch
wrappers needed by the Go interface representation.

The fixture exercises clone, equality, encoded size, marshal, and unmarshal
behavior for the `oneof` bytes branch. Its generated source snapshot is excluded
from the fixture-local typecheck because the adapter and sibling TypeScript
binding intentionally share the `protobuf_lite_ts.pb.ts` output name. Runtime
execution compiles the adapter into the isolated fixture output tree.