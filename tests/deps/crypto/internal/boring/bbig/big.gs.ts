// Generated file based on big.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import * as big from "@goscript/math/big/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/math/big/index.js"
import "@goscript/unsafe/index.js"

export function Enc(b: big.Int | $.VarRef<big.Int> | null): boring.BigInt {
	if (b == null) {
		return (null as boring.BigInt)
	}
	let x: $.Slice<big.Word> = big.Int.prototype.Bits.call(b)
	if ($.len(x) == 0) {
		return ($.arrayToSlice<number>([]) as boring.BigInt)
	}
	return ((unsafe.Slice!($.indexRef(x!, 0), $.len(x)) as $.Slice<number>) as boring.BigInt)
}

export function Dec(b: boring.BigInt): big.Int | $.VarRef<big.Int> | null {
	if (b == null) {
		return null
	}
	if ($.len((b as boring.BigInt)) == 0) {
		return new big.Int()
	}
	let x: $.Slice<big.Word> = (unsafe.Slice!($.indexRef(b!, 0), $.len((b as boring.BigInt))) as $.Slice<big.Word>)
	return big.Int.prototype.SetBits.call(new big.Int(), x)
}
