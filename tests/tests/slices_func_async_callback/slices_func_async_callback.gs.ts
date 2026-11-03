// Generated file based on slices_func_async_callback.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as slices from "@goscript/slices/index.js"

export class Process {
	public declare pid: number

	public declare done: $.Channel<{}> | null

	constructor(__goscriptValue?: boolean, pid$?: number, done$?: $.Channel<{}> | null) {
		this.pid = pid$ ?? 0
		this.done = done$ ?? (null! as $.Channel<{}> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Process {
		return new Process(true, this.pid, this.done)
	}

	public __goscriptAssign(source: Process): this {
		this.pid = source.pid
		this.done = source.done
		return this
	}

	public async exited(): globalThis.Promise<boolean> {
		const p: Process | $.VarRef<Process> | null = this;
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, boolean>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<Process>(p).done,
				onSelected: async (__goscriptSelect0Result) => {
					return true
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect0Result) => {
					return false
				}
			}
		], true)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
		throw new globalThis.Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"main.Process",
		() => new Process(),
		() => [{ name: "exited", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }],
		Process,
		() => [{ name: "pid", key: "pid", type: /* @__PURE__ */ $.basicType("int") }, { name: "done", key: "done", type: /* @__PURE__ */ $.channelType({ kind: $.TypeKind.Struct, methods: [], fields: [] }, "both") }]
	)
}

export function isEven(v: number): boolean {
	return (v % 2) == 0
}

export function firstEven(values: $.Slice<number>): number {
	return slices.IndexFunc(values, isEven)
}

export async function anyExited(procs: $.Slice<Process | $.VarRef<Process> | null>): globalThis.Promise<boolean> {
	return slices.ContainsFunc(procs, $.functionValue(async (p: Process | $.VarRef<Process> | null): globalThis.Promise<boolean> => await (p !== null && (p as any).__isVarRef !== true && (p as any).__goValue === undefined ? ((p as any) as Process).exited() : Process.prototype.exited.call(p)), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Process")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
}

export async function main(): globalThis.Promise<void> {
	let done = $.makeChannel<{}>(0, {}, "both")
	done.close()
	let procs = $.arrayToSlice<Process | $.VarRef<Process> | null>([new Process(false, 1, $.makeChannel<{}>(0, {}, "both")), new Process(false, 2, done)])

	await $.println("first even:", firstEven($.arrayToSlice<number>([1, 3, 4, 6])))
	await $.println("any exited:", await anyExited(procs))
	await $.println("exited index:", await slices.IndexFunc(procs, $.functionValue(async (p: Process | $.VarRef<Process> | null): globalThis.Promise<boolean> => {
		return (p !== null && (p as any).__isVarRef !== true && (p as any).__goValue === undefined ? ((p as any) as Process).exited() : Process.prototype.exited.call(p))
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Process")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))))

	// Each comparison receives a zero, which makes cmp async.
	let ch = $.makeChannel<number>(8, 0, "both")
	for (let __goscriptRangeCount0 = $.cap(ch), __rangeIndex = 0; __rangeIndex < __goscriptRangeCount0; __rangeIndex++) {
		await $.chanSend(ch, 0)
	}
	let cmp = $.functionValue(async (a: number, b: number): globalThis.Promise<number> => {
		return (a - b) + (0 * await $.chanRecv(ch))
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	let values = $.arrayToSlice<number>([3, 1, 2])
	await slices.SortStableFunc(values, cmp)
	await $.println("sorted:", $.plainSliceIndex(values!, 0), $.plainSliceIndex(values!, 1), $.plainSliceIndex(values!, 2))

	let pred: ((v: number) => boolean | globalThis.Promise<boolean>) | null = isEven
	await $.println("max odd:", slices.MaxFunc($.arrayToSlice<number>([5, 9, 7]), $.functionValue((a: number, b: number): number => {
		return a - b
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))
	await $.println("contains even:", slices.ContainsFunc($.arrayToSlice<number>([1, 2]), $.syncFunction(pred)))
}

if ($.isMainScript(import.meta)) {
	await main()
}
