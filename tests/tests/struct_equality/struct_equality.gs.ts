// Generated file based on struct_equality.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Hash = ObjectID

export class ObjectID {
	public declare hash: Uint8Array

	public declare format: number

	public _fields: {
		hash: Uint8Array
		format: number
	}

	constructor(init?: Partial<{hash?: Uint8Array, format?: number}>) {
		this._fields = {
			hash: init?.hash !== undefined ? $.cloneArrayValue(init.hash, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4)) : new Uint8Array(4),
			format: init?.format ?? (0 as number)
		}
	}

	public clone(): ObjectID {
		return $.markAsStructValue(new ObjectID(this))
	}

	public IsZero(): boolean {
		const s = this;
		return $.comparableEqual(s, $.markAsStructValue(new ObjectID()))
	}

	public Valid(): boolean {
		const s = this;
		return !$.comparableEqual(s, $.markAsStructValue(new ObjectID()))
	}

	static {
		$.bindStructFields(this.prototype, ["hash", "format"])
	}

	static __typeInfo = $.registerStructType(
		"main.ObjectID",
		() => new ObjectID(),
		() => [{ name: "IsZero", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Valid", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }],
		ObjectID,
		() => [{ name: "hash", key: "hash", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4) }, { name: "format", key: "format", type: /* @__PURE__ */ $.basicType("uint8") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let zero: Hash = $.markAsStructValue(new ObjectID())
	let otherZero = $.markAsStructValue(new ObjectID())
	let one = $.markAsStructValue(new ObjectID({hash: new Uint8Array([0, 7, 0, 0])}))
	let otherOne = $.markAsStructValue(new ObjectID({hash: new Uint8Array([0, 7, 0, 0])}))
	let different = $.markAsStructValue(new ObjectID({hash: new Uint8Array([0, 0, 7, 0])}))

	await $.println("zero is zero:", $.markAsStructValue($.cloneStructValue(zero)).IsZero())
	await $.println("zero valid:", $.markAsStructValue($.cloneStructValue(zero)).Valid())
	await $.println("zero equals zero:", $.comparableEqual(zero, otherZero))
	await $.println("one valid:", $.markAsStructValue($.cloneStructValue(one)).Valid())
	await $.println("one equals other one:", $.comparableEqual(one, otherOne))
	await $.println("one differs:", !$.comparableEqual(one, different))
}

if ($.isMainScript(import.meta)) {
	await main()
}
