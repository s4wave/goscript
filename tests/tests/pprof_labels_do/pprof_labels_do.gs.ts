// Generated file based on pprof_labels_do.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as context from "@goscript/context/index.js"
import * as pprof from "@goscript/runtime/pprof/index.js"

export async function main(): globalThis.Promise<void> {
	let labels = $.markAsStructValue($.cloneStructValue(pprof.Labels("rpc", "svc/Method", "client", "a")))
	let ctx = pprof.WithLabels($.pointerValueOrNil(context.Background())!, $.markAsStructValue($.cloneStructValue(pprof.Labels("client", "b", "pid", "7"))))

	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 17)
	let value = 0
	await pprof.Do($.pointerValueOrNil(ctx)!, labels, $.functionValue(async (ctx: context.Context | null) => {
		value = await $.chanRecv(ch)
		let [rpc, ok] = pprof.Label($.pointerValueOrNil(ctx)!, "rpc")
		await $.println("rpc", rpc, ok)
		await pprof.ForLabels($.pointerValueOrNil(ctx)!, $.functionValue(async (key: string, value: string): globalThis.Promise<boolean> => {
			await $.println("label", key, value)
			return !$.stringEqual(key, "pid")
		}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	}, ({ kind: $.TypeKind.Function, params: ["context.Context"], results: [] } as $.FunctionTypeInfo)))
	await $.println("value", value)

	let [, ok] = pprof.Label($.pointerValueOrNil(ctx)!, "rpc")
	await $.println("outer rpc", ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}
