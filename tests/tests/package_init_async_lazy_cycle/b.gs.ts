// Generated file based on b.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as sync from "@goscript/sync/index.js"
import * as __goscript_a from "./a.gs.ts"

export let lock = $.varRef($.markAsStructValue(new sync.Mutex()))

export function __goscript_set_lock(__goscriptValue: sync.Mutex): void {
	$.assignStruct(lock.value, __goscriptValue)
}

export var first: __goscript_a.holder

export function __goscript_init_first(): void {
	if (((first) as any) === undefined) {
		first = makeFirst()
	}
}

export function __goscript_get_first(): __goscript_a.holder {
	if (((first) as any) === undefined) {
		__goscript_init_first()
	}
	return first
}

export function __goscript_set_first(__goscriptValue: __goscript_a.holder): void {
	$.assignStruct(first, __goscriptValue)
}

export function makeFirst(): __goscript_a.holder {
	using __defer = new $.DisposableStack()
	lock.value.Lock()
	const __goscriptDeferCallee0 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))(lock), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
	__defer.defer(() => { __goscriptDeferCallee0() })
	return new __goscript_a.holder(true, __goscript_a.__goscript_get_seed())
}
