// Generated file based on package_import_context.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as context from "@goscript/context/index.js"
import * as errors from "@goscript/errors/index.js"
import * as time from "@goscript/time/index.js"

export async function run(ctx: context.Context | null): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let [sctx, sctxCancel] = context.WithCancel($.pointerValueOrNil(ctx)!)
	const __goscriptDeferCallee0 = sctxCancel
	__defer.defer(() => { __goscriptDeferCallee0!() })

	let myCh = $.makeChannel<{}>(0, {}, "both")

	$.go(async () => {
		await $.chanRecv(((__goscriptAwait = (sctx !== null && (sctx as any).__isVarRef !== true && ((sctx as any).__goValue === undefined || (sctx as any).__goType?.charCodeAt(0) !== 42) ? (sctx as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(sctx)).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null))
		await $.chanSend(myCh, {})
	})

	// Check that myCh is not readable yet
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: myCh,
			onSelected: async (__goscriptSelect0Result) => {
				await $.println("myCh should not be readable yet")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
				await $.println("myCh is not be readable yet")
			}
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}

	// Cancel context which should trigger the goroutine
	sctxCancel!()

	// Now myCh should become readable
	await $.chanRecv(myCh)

	await $.println("read successfully")
}

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let ctx = context.Background()
	await run(ctx)

	let [deadlineCtx, cancel] = context.WithDeadline($.pointerValueOrNil(ctx)!, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(3600000000000n))))
	const __goscriptDeferCallee1 = cancel
	__defer.defer(() => { __goscriptDeferCallee1!() })
	let [deadline, ok] = await (deadlineCtx !== null && (deadlineCtx as any).__isVarRef !== true && ((deadlineCtx as any).__goValue === undefined || (deadlineCtx as any).__goType?.charCodeAt(0) !== 42) ? (deadlineCtx as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(deadlineCtx)).Deadline()
	await $.println("deadline ok:", ok)
	await $.println("deadline zero:", $.markAsStructValue($.cloneStructValue(deadline)).IsZero())

	// A deadline is an absolute lower bound, including fractional milliseconds.
	let cause = errors.New("deadline cause")
	for (let __rangeIndex = 0; __rangeIndex < 8; __rangeIndex++) {
		let end = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(10250000n)))
		let [child, stop] = context.WithDeadlineCause($.pointerValueOrNil(ctx)!, $.markAsStructValue($.cloneStructValue(end)), $.pointerValueOrNil(cause)!)
		await $.chanRecv(((__goscriptAwait = (child !== null && (child as any).__isVarRef !== true && ((child as any).__goValue === undefined || (child as any).__goType?.charCodeAt(0) !== 42) ? (child as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(child)).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null))
		if (($.markAsStructValue($.cloneStructValue(time.Now())).Before($.markAsStructValue($.cloneStructValue(end))) || (!$.comparableEqual((__goscriptAwait = (child !== null && (child as any).__isVarRef !== true && ((child as any).__goValue === undefined || (child as any).__goType?.charCodeAt(0) !== 42) ? (child as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(child)).Err(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), context.DeadlineExceeded))) || (!$.comparableEqual(context.Cause($.pointerValueOrNil(child)!), cause))) {
			$.panic("deadline fired early or lost its cause")
		}
		stop!()
	}
	await $.println("deadline timing and cause: true")

	// Manual cancellation keeps its own cause and stops the pending timer.
	let [manual, stop] = context.WithDeadlineCause($.pointerValueOrNil(ctx)!, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(3600000000000n))), $.pointerValueOrNil(cause)!)
	stop!()
	if ((!$.comparableEqual((__goscriptAwait = (manual !== null && (manual as any).__isVarRef !== true && ((manual as any).__goValue === undefined || (manual as any).__goType?.charCodeAt(0) !== 42) ? (manual as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(manual)).Err(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), context.Canceled)) || (!$.comparableEqual(context.Cause($.pointerValueOrNil(manual)!), context.Canceled))) {
		$.panic("manual cancellation used the deadline cause")
	}
	let __goscriptTuple0: any = context.WithDeadlineCause($.pointerValueOrNil(manual)!, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(3600000000000n))), $.pointerValueOrNil(cause)!)
	let child: context.Context | null = __goscriptTuple0[0]
	stop = __goscriptTuple0[1]
	const __goscriptDeferCallee2 = stop
	__defer.defer(() => { __goscriptDeferCallee2!() })
	if ((!$.comparableEqual((__goscriptAwait = (child !== null && (child as any).__isVarRef !== true && ((child as any).__goValue === undefined || (child as any).__goType?.charCodeAt(0) !== 42) ? (child as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(child)).Err(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), context.Canceled)) || (!$.comparableEqual(context.Cause($.pointerValueOrNil(child)!), context.Canceled))) {
		$.panic("canceled parent did not cancel its deadline child")
	}
	await $.println("deadline cancellation: true")

	await $.println("test finished")
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
