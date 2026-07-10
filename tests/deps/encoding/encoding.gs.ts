// Generated file based on encoding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type BinaryMarshaler = {
	MarshalBinary(): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
}

$.registerInterfaceType(
	"encoding.BinaryMarshaler",
	null,
	[{ name: "MarshalBinary", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }]
);

export type BinaryUnmarshaler = {
	UnmarshalBinary(data: $.Slice<number>): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"encoding.BinaryUnmarshaler",
	null,
	[{ name: "UnmarshalBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }]
);

export type BinaryAppender = {
	AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
}

$.registerInterfaceType(
	"encoding.BinaryAppender",
	null,
	[{ name: "AppendBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }]
);

export type TextMarshaler = {
	MarshalText(): [$.Slice<number>, $.GoError]
}

$.registerInterfaceType(
	"encoding.TextMarshaler",
	null,
	[{ name: "MarshalText", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }]
);

export type TextUnmarshaler = {
	UnmarshalText(text: $.Slice<number>): $.GoError
}

$.registerInterfaceType(
	"encoding.TextUnmarshaler",
	null,
	[{ name: "UnmarshalText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }]
);

export type TextAppender = {
	AppendText(b: $.Slice<number>): [$.Slice<number>, $.GoError]
}

$.registerInterfaceType(
	"encoding.TextAppender",
	null,
	[{ name: "AppendText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }]
);
