// Generated file based on parallel_assign_pointer_temps.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class node {
	public declare next: number

	constructor(__goscriptValue?: boolean, next$?: number) {
		this.next = next$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
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
		;(this as any).__goStructValue = __goscriptValue === true
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

export class link {
	public declare next: link | $.VarRef<link> | null

	public declare id: number

	constructor(__goscriptValue?: boolean, next$?: link | $.VarRef<link> | null, id$?: number) {
		this.next = next$ ?? (null! as link | $.VarRef<link> | null)
		this.id = id$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): link {
		return new link(true, this.next, this.id)
	}

	public __goscriptAssign(source: link): this {
		this.next = source.next
		this.id = source.id
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.link",
		() => new link(),
		() => [],
		link,
		() => [{ name: "next", key: "next", type: /* @__PURE__ */ $.pointerType("main.link") }, { name: "id", key: "id", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export let order = ""

export function __goscript_set_order(__goscriptValue: string): void {
	order = __goscriptValue
}

export function idx(n: number): number {
	order += "i"
	return n
}

export function val(n: number): number {
	order += "v"
	return n
}

export function pair(): [number, number] {
	order += "p"
	return [2, 9]
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

	// The operands of every target are evaluated before any is assigned.
	let s = $.arrayToSlice<number>([0, 0, 0])
	let i = $.varRef(0)
	const __goscriptOperand0 = i.value
	let __goscriptAssign2_0: number = 2
	let __goscriptAssign2_1: number = 9
	i.value = __goscriptAssign2_0
	$.sliceElems(s!)[$.sliceSlot(s!, __goscriptOperand0)] = __goscriptAssign2_1
	await $.println("index:", $.plainSliceIndex(s!, 0), $.plainSliceIndex(s!, 1), $.plainSliceIndex(s!, 2))

	let prev: link | $.VarRef<link> | null = null! as link | $.VarRef<link> | null
	let cur: link | $.VarRef<link> | null = new link(false, new link(false, undefined, 2), 1)
	const __goscriptOperand1 = cur
	let __goscriptAssign3_0: link | $.VarRef<link> | null = $.pointerValue<link>(cur).next
	let __goscriptAssign3_1: link | $.VarRef<link> | null = prev
	let __goscriptAssign3_2: link | $.VarRef<link> | null = cur
	cur = __goscriptAssign3_0
	$.pointerValue<link>(__goscriptOperand1).next = __goscriptAssign3_1
	prev = __goscriptAssign3_2
	await $.println("deref:", $.pointerValue<link>(cur).id, $.pointerValue<link>(prev).id, $.pointerValue<link>(prev).next == null)

	let p = i
	const __goscriptOperand2 = $.pointerValue<number>(p)
	let __goscriptAssign4_0: number = 1
	let __goscriptAssign4_1: number = 7
	i.value = __goscriptAssign4_0
	$.sliceElems(s!)[$.sliceSlot(s!, __goscriptOperand2)] = __goscriptAssign4_1
	await $.println("pointer:", $.plainSliceIndex(s!, 1), $.plainSliceIndex(s!, 2))

	let t = $.arrayToSlice<number>([1, 0, 0])
	const __goscriptOperand3 = $.plainSliceIndex(t!, 0)
	let __goscriptAssign5_0: number = 2
	let __goscriptAssign5_1: number = 5
	$.sliceElems(t!)[$.sliceSlot(t!, 0)] = __goscriptAssign5_0
	$.sliceElems(t!)[$.sliceSlot(t!, __goscriptOperand3)] = __goscriptAssign5_1
	await $.println("element:", $.plainSliceIndex(t!, 0), $.plainSliceIndex(t!, 1), $.plainSliceIndex(t!, 2))

	// Target operands that call are evaluated before the values.
	order = ""
	const __goscriptOperand4 = idx(0)
	const __goscriptOperand5 = idx(1)
	let __goscriptAssign6_0: number = val(3)
	let __goscriptAssign6_1: number = val(4)
	$.sliceElems(s!)[$.sliceSlot(s!, __goscriptOperand4)] = __goscriptAssign6_0
	$.sliceElems(s!)[$.sliceSlot(s!, __goscriptOperand5)] = __goscriptAssign6_1
	await $.println("order:", order, $.plainSliceIndex(s!, 0), $.plainSliceIndex(s!, 1))

	// A tuple call evaluates the target operands first, too.
	order = ""
	i.value = 0
	const __goscriptOperand6 = idx(i.value)
	let __goscriptTuple0: any = pair()
	$.sliceElems(s!)[$.sliceSlot(s!, __goscriptOperand6)] = __goscriptTuple0[0]
	i.value = __goscriptTuple0[1]
	await $.println("tuple:", order, $.plainSliceIndex(s!, 0), i.value)
	i.value = 0
	const __goscriptOperand7 = i.value
	let __goscriptTuple1: any = pair()
	i.value = __goscriptTuple1[0]
	$.sliceElems(s!)[$.sliceSlot(s!, __goscriptOperand7)] = __goscriptTuple1[1]
	await $.println("tuple index:", $.plainSliceIndex(s!, 0), $.plainSliceIndex(s!, 1), $.plainSliceIndex(s!, 2), i.value)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType("main.node", 2))
}

if ($.isMainScript(import.meta)) {
	await main()
}
