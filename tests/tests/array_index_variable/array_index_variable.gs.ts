// Generated file based on array_index_variable.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class point {
	public declare x: number

	public declare y: number

	constructor(__goscriptValue?: boolean, x$?: number, y$?: number) {
		this.x = x$ ?? 0
		this.y = y$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): point {
		return new point(true, this.x, this.y)
	}

	public __goscriptAssign(source: point): this {
		this.x = source.x
		this.y = source.y
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		() => [],
		point,
		() => [{ name: "x", key: "x", type: /* @__PURE__ */ $.basicType("int") }, { name: "y", key: "y", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class holder {
	public declare points: point[]

	public declare names: string[]

	constructor(__goscriptValue?: boolean, points$?: point[], names$?: string[]) {
		this.points = points$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => new point(true)), /* @__PURE__ */ $.arrayType("main.point", 2))
		this.names = names$ ?? $.arrayValue(globalThis.Array.from({ length: 3 }, () => ""))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): holder {
		return new holder(true, $.cloneArrayValue(this.points, __goscriptStatic2()), $.cloneArrayValue(this.names, __goscriptStatic3()))
	}

	public __goscriptAssign(source: holder): this {
		this.points = $.assignFieldValue(this.points, source.points, __goscriptStatic2())
		this.names = $.assignFieldValue(this.names, source.names, __goscriptStatic3())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [],
		holder,
		() => [{ name: "points", key: "points", type: /* @__PURE__ */ $.arrayType("main.point", 2) }, { name: "names", key: "names", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("string"), 3) }]
	)
}

export let table: Uint8Array = $.arrayValue(new Uint8Array([10, 11, 12, 13, 14, 15, 16, 17]))

export function __goscript_set_table(__goscriptValue: Uint8Array): void {
	table = $.assignFieldValue(table, __goscriptValue, __goscriptStatic0())
}

export let grid: number[][] = $.arrayValue([$.arrayValue([1, 2, 3]), $.arrayValue([4, 5, 6])], __goscriptStatic1())

export function __goscript_set_grid(__goscriptValue: number[][]): void {
	grid = $.assignFieldValue(grid, __goscriptValue, __goscriptStatic1())
}

export function lookup(i: number): number {
	return table[$.checkArrayIndex(i, 8)]
}

export async function recoverMsg(label: string, fn: (() => void) | null): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		__defer.defer(async () => { await (async () => {
			{
				let r = $.recover()
				if (r != null) {
					{
						let [err, ok] = $.typeAssertTuple<$.GoError>(r, "error")
						if (ok) {
							await $.println(label, (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
						} else {
							await $.println(label, "non-error panic")
						}
					}
				}
			}
		})() })
		void (__goscriptAwait = fn!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function main(): globalThis.Promise<void> {
	// Variable indexes of package, local, nested and field arrays.
	let sum = 0
	for (let i = 0; i < 8; i++) {
		sum += lookup(i)
	}
	await $.println("sum", sum)
	let local = $.arrayValue([0.5, 1.5, 2.5, 3.5], __goscriptStatic4())
	let j = 2
	await $.println("local", local[$.checkArrayIndex(j, 4)], local[$.checkArrayIndex(j + 1, 4)])
	await $.println("grid", (grid[1])[$.checkArrayIndex(j, 3)], (grid[$.checkArrayIndex(j - 1, 2)])[0])
	let h = new holder(true, $.arrayValue([new point(true, 1, 2), new point(true, 3, 4)], __goscriptStatic2()), $.arrayValue(["a", "b", "c"]))
	let k = 1
	let p = (h.points[$.checkArrayIndex(k, 2)]).clone()
	p.x = 100
	await $.println("field", h.points[$.checkArrayIndex(k, 2)].x, p.x, h.names[$.checkArrayIndex(k + 1, 3)])

	// An array seen through a pointer converted from a slice.
	let s = $.arrayToSlice<number>([7, 8, 9, 10])
	let ap = $.sliceToArrayPointer<number>($.goSlice(s, 1, undefined), 3)
	let arr = $.cloneArrayValue($.pointerValue<number[]>(ap), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3))
	await $.println("view", arr[$.checkArrayIndex(k, 3)], (($.pointerValue<number[]>(ap)))[$.checkArrayIndex(k + 1, 3)])

	// Out of range variable indexes panic with the Go message.
	await recoverMsg("high:", $.functionValue(async () => {
		await $.println(lookup(j + 6))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("negative:", $.functionValue(async () => {
		await $.println(local[$.checkArrayIndex(j - 3, 4)])
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await $.println("done")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 8))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3), 2))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.arrayType("main.point", 2))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("string"), 3))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float64"), 4))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
