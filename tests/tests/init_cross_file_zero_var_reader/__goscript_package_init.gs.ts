// Generated file based on __goscript_package_init.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import "@goscript/reflect/index.js"
import * as __goscript_file0 from "./a.gs.ts"
import * as __goscript_file1 from "./b.gs.ts"
import * as __goscript_file2 from "./c.gs.ts"

let initialized = false

export async function __goscript_package_init(): globalThis.Promise<void> {
	if (initialized) {
		return
	}
	initialized = true
	__goscript_file0.__goscript_init_table()
	__goscript_file0.__goscript_init_remoteCounter()
	__goscript_file1.__goscript_init_counter()
	__goscript_file1.__goscript_init_shared()
	__goscript_file0.__goscript_init_stringType()
	__goscript_file1.__goscript_init_registry()
	__goscript_file2.__goscript_init_marker()
	await __goscript_file2.__goscriptInit0()
}
