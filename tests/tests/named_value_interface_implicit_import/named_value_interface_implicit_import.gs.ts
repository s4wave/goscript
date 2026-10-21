// Generated file based on named_value_interface_implicit_import.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/named_value_interface_implicit_import/dep/index.js"
import * as errno from "@goscript/github.com/s4wave/goscript/tests/tests/named_value_interface_implicit_import/errno/index.js"
import * as __goscript_local_lookup from "./local_lookup.gs.ts"
import * as __goscript_multi_assign from "./multi_assign.gs.ts"
import * as __goscript_multi_return from "./multi_return.gs.ts"
import "./layers.gs.ts"
import "@goscript/github.com/s4wave/goscript/tests/tests/named_value_interface_implicit_import/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/named_value_interface_implicit_import/errno/index.js"

export function notDir(): $.GoError {
	return $.namedValueInterfaceValue<$.GoError>(dep.ErrNotDir, "errno.Errno", {"Error": errno.Errno_Error}, /* @__PURE__ */ $.basicType("uintptr", "errno.Errno"))
}

export async function main(): globalThis.Promise<void> {
	let err = notDir()
	await $.println("error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let assigned: $.GoError = null! as $.GoError
	assigned = $.namedValueInterfaceValue<$.GoError>(dep.ErrNotDir, "errno.Errno", {"Error": errno.Errno_Error}, /* @__PURE__ */ $.basicType("uintptr", "errno.Errno"))
	await $.println("assigned:", (__goscriptAwait = (assigned !== null && (assigned as any).__isVarRef !== true && ((assigned as any).__goValue === undefined || (assigned as any).__goType?.charCodeAt(0) !== 42) ? (assigned as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(assigned)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let declared: $.GoError = $.namedValueInterfaceValue<$.GoError>(dep.ErrNotDir, "errno.Errno", {"Error": errno.Errno_Error}, /* @__PURE__ */ $.basicType("uintptr", "errno.Errno"))
	await $.println("declared:", (__goscriptAwait = (declared !== null && (declared as any).__isVarRef !== true && ((declared as any).__goValue === undefined || (declared as any).__goType?.charCodeAt(0) !== 42) ? (declared as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(declared)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let ch = $.makeChannel<$.GoError>(1, null! as $.GoError, "both")
	await $.chanSend(ch, $.namedValueInterfaceValue<$.GoError>(dep.ErrNotDir, "errno.Errno", {"Error": errno.Errno_Error}, /* @__PURE__ */ $.basicType("uintptr", "errno.Errno")))
	await $.println("sent:", (__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>((await $.chanRecv(ch))).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	await $.println("converted:", (__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>($.namedValueInterfaceValue<$.GoError>(dep.ErrNotDir, "errno.Errno", {"Error": errno.Errno_Error}, /* @__PURE__ */ $.basicType("uintptr", "errno.Errno"))).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let lit = $.functionValue((): $.GoError => {
		return $.namedValueInterfaceValue<$.GoError>(dep.ErrNotDir, "errno.Errno", {"Error": errno.Errno_Error}, /* @__PURE__ */ $.basicType("uintptr", "errno.Errno"))
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo))
	await $.println("func literal:", (__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>(lit()).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let [looked, ok] = __goscript_multi_return.lookup()
	await $.println("multi-value return:", (__goscriptAwait = (looked !== null && (looked as any).__isVarRef !== true && ((looked as any).__goValue === undefined || (looked as any).__goType?.charCodeAt(0) !== 42) ? (looked as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(looked)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), ok)

	let __goscriptTuple0: any = __goscript_multi_assign.assignLookup()
	let multi: $.GoError = __goscriptTuple0[0]
	ok = __goscriptTuple0[1]
	await $.println("multi-value assign:", (__goscriptAwait = (multi !== null && (multi as any).__isVarRef !== true && ((multi as any).__goValue === undefined || (multi as any).__goType?.charCodeAt(0) !== 42) ? (multi as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(multi)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), ok)

	let __goscriptTuple1: any = __goscript_local_lookup.localLookup()
	let local: $.GoError = __goscriptTuple1[0]
	ok = __goscriptTuple1[1]
	await $.println("local multi-value return:", (__goscriptAwait = (local !== null && (local as any).__isVarRef !== true && ((local as any).__goValue === undefined || (local as any).__goType?.charCodeAt(0) !== 42) ? (local as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(local)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), ok)
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
