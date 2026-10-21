// Generated file based on os_args_program_name.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as os from "@goscript/os/index.js"
import "@goscript/os/index.js"

export async function main(): globalThis.Promise<void> {
	// The program name comes first on every platform, so programs may index
	// os.Args[0] and slice the arguments after it.
	await $.println("has name:", ($.sliceLen(os.Args) > 0) && (!$.stringEqual($.arrayIndex(os.Args!, 0), "")))
	await $.println("args:", $.sliceLen($.goSlice(os.Args, 1, undefined)))
}

if ($.isMainScript(import.meta)) {
	await main()
}
