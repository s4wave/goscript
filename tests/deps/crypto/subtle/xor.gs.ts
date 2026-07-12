// Generated file based on xor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/crypto/internal/fips140/subtle/index.js"

export function XORBytes(dst: $.Slice<number>, x: $.Slice<number>, y: $.Slice<number>): number {
	return subtle.XORBytes(dst, x, y)
}
