import * as $ from "@goscript/builtin/index.js";
import { getDeno } from "./types_js.gs.js";

// runtime_args returns the program arguments as Go reports them: the program
// name first, then the arguments it was started with.
export function runtime_args(): $.Slice<string> {
	const denoObj = getDeno()
	if ($.isArrayOrGoSlice(denoObj?.args)) {
		return $.arrayToSlice<string>([denoObj.mainModule ?? "deno", ...denoObj.args])
	}
	// argv holds the interpreter path, then the script path and its arguments.
	const processObj = (globalThis as any).process
	if ($.isArrayOrGoSlice(processObj?.argv)) {
		return $.arrayToSlice<string>(processObj.argv.slice(1))
	}
	// A browser has no command line: Go's js/wasm runtime names the program
	// "js" there, and programs index os.Args[0] and slice os.Args[1:].
	return $.arrayToSlice<string>(["js"])
}

export function runtime_beforeExit(exitCode: number): void {
	// No-op in JavaScript.
}
