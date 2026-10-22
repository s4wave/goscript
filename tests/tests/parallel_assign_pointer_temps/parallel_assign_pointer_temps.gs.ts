// Generated file based on parallel_assign_pointer_temps.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class node {
	public declare next: number

	constructor(__goscriptValue?: boolean, next$?: number) {
		this.next = next$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): node {
		return new node(true, this.next)
	}

	public __goscriptAssign(source: node): this {
		this.next = source.next
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		() => new node(),
		() => [],
		node,
		() => [{ name: "next", key: "next", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class queue {
	public declare value: number

	constructor(__goscriptValue?: boolean, value$?: number) {
		this.value = value$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): queue {
		return new queue(true, this.value)
	}

	public __goscriptAssign(source: queue): this {
		this.value = source.value
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.queue",
		() => new queue(),
		() => [],
		queue,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let left: queue | $.VarRef<queue> | null = new queue(false, 1)
	let right: queue | $.VarRef<queue> | null = new queue(false, 2)
	let __goscriptAssign0_0: queue | $.VarRef<queue> | null = right
	let __goscriptAssign0_1: queue | $.VarRef<queue> | null = left
	left = __goscriptAssign0_0
	right = __goscriptAssign0_1
	await $.println($.pointerValue<queue>(left).value, $.pointerValue<queue>(right).value)

	let nodes = $.arrayValue([new node(true, 1), new node(true, 0)], __goscriptStatic0())
	let pc = 0
	let inst: node | $.VarRef<node> | null = $.indexRef(nodes, pc)
	let __goscriptAssign1_0: number = $.pointerValue<node>(inst).next
	let __goscriptAssign1_1: node | $.VarRef<node> | null = $.indexRef(nodes, $.pointerValue<node>(inst).next)
	pc = __goscriptAssign1_0
	inst = __goscriptAssign1_1
	await $.println(pc, $.pointerValue<node>(inst).next)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType("main.node", 2))
}

if ($.isMainScript(import.meta)) {
	await main()
}
