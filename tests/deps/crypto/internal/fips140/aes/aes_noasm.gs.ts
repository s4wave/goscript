// Generated file based on aes_noasm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_aes from "./aes.gs.ts"

import * as __goscript_aes_generic from "./aes_generic.gs.ts"
import "./aes.gs.ts"
import "./aes_generic.gs.ts"

export class block {
	public get blockExpanded(): __goscript_aes.blockExpanded {
		return this._fields.blockExpanded.value
	}
	public set blockExpanded(value: __goscript_aes.blockExpanded) {
		this._fields.blockExpanded.value = value
	}

	public _fields: {
		blockExpanded: $.VarRef<__goscript_aes.blockExpanded>
	}

	constructor(init?: Partial<{blockExpanded?: __goscript_aes.blockExpanded}>) {
		this._fields = {
			blockExpanded: $.varRef(init?.blockExpanded ? $.markAsStructValue($.cloneStructValue(init.blockExpanded)) : $.markAsStructValue(new __goscript_aes.blockExpanded()))
		}
	}

	public clone(): block {
		const cloned = new block()
		cloned._fields = {
			blockExpanded: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.blockExpanded.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public roundKeysSize(): any {
		return $.pointerValue<__goscript_aes.blockExpanded>(this.blockExpanded).roundKeysSize()
	}

	static __typeInfo = $.registerStructType(
		"aes.block",
		() => new block(),
		[{ name: "roundKeysSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		block,
		[{ name: "blockExpanded", key: "blockExpanded", type: "aes.blockExpanded", pkgPath: "crypto/internal/fips140/aes", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export function newBlock(c: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, key: $.Slice<number>): __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null {
	__goscript_aes.newBlockExpanded($.pointerValue<__goscript_aes.Block>(c).block._fields.blockExpanded, key)
	return c
}

export function encryptBlock(c: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, dst: $.Slice<number>, src: $.Slice<number>): void {
	__goscript_aes_generic.encryptBlockGeneric($.pointerValue<__goscript_aes.Block>(c).block._fields.blockExpanded, dst, src)
}

export function decryptBlock(c: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, dst: $.Slice<number>, src: $.Slice<number>): void {
	__goscript_aes_generic.decryptBlockGeneric($.pointerValue<__goscript_aes.Block>(c).block._fields.blockExpanded, dst, src)
}

export function checkGenericIsExpected(): void {
}
