// Generated file based on array_byte_element_pointer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class bitset {
	public declare bits: Uint8Array

	constructor(__goscriptValue?: boolean, bits$?: Uint8Array) {
		this.bits = bits$ ?? $.arrayValue(new Uint8Array(4))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): bitset {
		return new bitset(true, $.cloneArrayValue(this.bits, __goscriptStatic0()))
	}

	public __goscriptAssign(source: bitset): this {
		this.bits = $.assignFieldValue(this.bits, source.bits, __goscriptStatic0())
		return this
	}

	public has(bit: number): boolean {
		const b: bitset | $.VarRef<bitset> | null = this;
		let entry = $.indexRef($.pointerValue<bitset>(b).bits, globalThis.Math.trunc(bit / 8))
		let mask = $.uint(((1 << (bit % 8)) & 0xff), 8)
		return $.uint(($.pointerValue<number>(entry) & mask), 8) != 0
	}

	public ["set"](bit: number): void {
		const b: bitset | $.VarRef<bitset> | null = this;
		let entry = $.indexRef($.pointerValue<bitset>(b).bits, globalThis.Math.trunc(bit / 8))
		let mask = $.uint(((1 << (bit % 8)) & 0xff), 8)
		entry!.value |= mask
	}

	static __typeInfo = $.registerStructType(
		"main.bitset",
		() => new bitset(),
		() => [{ name: "has", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "set", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		bitset,
		() => [{ name: "bits", key: "bits", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4) }]
	)
}

export async function main(): globalThis.Promise<void> {
	let b: $.VarRef<bitset> = $.varRef(new bitset(true))
	b.value.set(3)
	b.value.set(30)
	await $.println(b.value.has(3), b.value.has(4), b.value.has(30), b.value.bits[0], b.value.bits[3])
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))
}

if ($.isMainScript(import.meta)) {
	await main()
}
