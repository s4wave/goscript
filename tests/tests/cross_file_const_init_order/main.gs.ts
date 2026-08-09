// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_consts from "./consts.gs.js"

import * as __goscript_register from "./register.gs.js"
import "./consts.gs.js"
import "./register.gs.js"

export async function main(): globalThis.Promise<void> {
	__goscript_consts.__goscript_get_Default()
	$.println("seen:", __goscript_register.Seen)
}

if ($.isMainScript(import.meta)) {
	await main()
}
