// Generated file based on __goscript_package_init.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import "@goscript/github.com/s4wave/goscript/tests/tests/import_package_var_assign/dep/index.js"
import * as __goscript_file0 from "./main.gs.ts"
import * as __goscript_file1 from "./vars.gs.ts"

let initialized = false

export async function __goscript_package_init(): globalThis.Promise<void> {
	if (initialized) {
		return
	}
	initialized = true
	__goscript_file0.__goscript_init_userPtr()
	__goscript_file1.__goscript_init_level()
	__goscript_file0.__goscript_init_levelPtr()
}
