// Generated file based on blocks.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reg from "@goscript/github.com/s4wave/goscript/tests/tests/package_var_effects_other_file/reg/index.js"

let __goscriptBlank0: boolean = await reg.Add("blank")

export let unexported: boolean = await reg.Add("unexported")

export function __goscript_set_unexported(__goscriptValue: boolean): void {
	unexported = __goscriptValue
}
