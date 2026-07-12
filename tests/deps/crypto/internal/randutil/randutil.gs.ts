// Generated file based on randutil.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as rand from "@goscript/math/rand/v2/index.js"
import "@goscript/io/index.js"
import "@goscript/math/rand/v2/index.js"

export async function MaybeReadByte(r: io.Reader | null): globalThis.Promise<void> {
	if (($.uint64And(await rand.Uint64(), 1n)) == 1n) {
		return
	}
	let buf: Uint8Array = new Uint8Array(1)
	await $.pointerValue<Exclude<io.Reader, null>>(r).Read($.goSlice(buf, undefined, undefined))
}
