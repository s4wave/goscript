// Generated file based on __goscript_package_init.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import "@goscript/sync/index.js"
import * as __goscript_file0 from "./a.gs.ts"
import * as __goscript_file1 from "./b.gs.ts"

let initialized = false

export async function __goscript_package_init(): globalThis.Promise<void> {
	if (initialized) {
		return
	}
	initialized = true
	__goscript_file0.__goscript_init_seed()
	__goscript_file1.__goscript_init_first()
}
