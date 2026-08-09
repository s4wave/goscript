// Generated file based on entropy_wasm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_ctrdrbg from "./ctrdrbg.gs.js"
import "./ctrdrbg.gs.js"

export function getEntropy(): $.VarRef<Uint8Array> | null {
	$.panic("FIPS 140-3 entropy generation is not supported on Wasm")
	throw new globalThis.Error("goscript: unreachable return")
}
