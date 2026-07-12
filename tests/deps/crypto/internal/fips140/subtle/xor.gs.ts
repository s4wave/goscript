// Generated file based on xor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as alias from "@goscript/crypto/internal/fips140/alias/index.js"

import * as __goscript_xor_generic from "./xor_generic.gs.ts"
import "@goscript/crypto/internal/fips140/alias/index.js"
import "./xor_generic.gs.ts"

export function XORBytes(dst: $.Slice<number>, x: $.Slice<number>, y: $.Slice<number>): number {
	let n = $.min($.len(x), $.len(y))
	if (n == 0) {
		return 0
	}
	if (n > $.len(dst)) {
		$.panic("subtle.XORBytes: dst too short")
	}
	if (alias.InexactOverlap($.goSlice(dst, undefined, n), $.goSlice(x, undefined, n)) || alias.InexactOverlap($.goSlice(dst, undefined, n), $.goSlice(y, undefined, n))) {
		$.panic("subtle.XORBytes: invalid overlap")
	}
	__goscript_xor_generic.xorBytes($.indexRef(dst!, 0), $.indexRef(x!, 0), $.indexRef(y!, 0), n)
	return n
}
