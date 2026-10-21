// Generated file based on wide_uint64_chunker_arith.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as io from "@goscript/io/index.js"

export class chunker {
	public declare pos: bigint

	constructor(__goscriptValue?: boolean, pos$?: bigint) {
		this.pos = pos$ ?? 0n
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): chunker {
		return new chunker(true, this.pos)
	}

	public __goscriptAssign(source: chunker): this {
		this.pos = source.pos
		return this
	}

	public advance(chunkSize: number): void {
		const c: chunker | $.VarRef<chunker> | null = this;
		const c$: chunker = c == null ? $.pointerTarget<chunker>(c) : (c as any).__isVarRef === true ? (c as any).value : (c as any).__goValue === undefined ? (c as any) : $.pointerTarget<chunker>(c);
		;(c$ as chunker).pos = $.uint64Add((c$ as chunker).pos, $.uint64(chunkSize))
	}

	static __typeInfo = $.registerStructType(
		"main.chunker",
		() => new chunker(),
		() => [{ name: "advance", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		chunker,
		() => [{ name: "pos", key: "pos", type: /* @__PURE__ */ $.basicType("uint64") }]
	)
}

export class repeatReader {
	public declare remaining: number

	constructor(__goscriptValue?: boolean, remaining$?: number) {
		this.remaining = remaining$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): repeatReader {
		return new repeatReader(true, this.remaining)
	}

	public __goscriptAssign(source: repeatReader): this {
		this.remaining = source.remaining
		return this
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		const r: repeatReader | $.VarRef<repeatReader> | null = this;
		const r$: repeatReader = r == null ? $.pointerTarget<repeatReader>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<repeatReader>(r)
		if ((r$ as repeatReader).remaining == 0) {
			return [0, io.EOF]
		}
		let n = $.min($.sliceLen(p), (r$ as repeatReader).remaining)
		for (let __goscriptSliceWindow2 = $.sliceRange(p), __goscriptRangeCount0 = n, i = 0; i < __goscriptRangeCount0; i++) {
			;(__goscriptSliceWindow2.backing as any[])[$.windowSlot(__goscriptSliceWindow2, i)] = $.uint(i, 8)
		}
		;(r$ as repeatReader).remaining -= n
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.repeatReader",
		() => new repeatReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }],
		repeatReader,
		() => [{ name: "remaining", key: "remaining", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function algorithm(data: $.Slice<number>, n: number, g: $.Slice<bigint>, maskC: bigint, maskJ: bigint, minSize: number, jumpLength: number): number {
	let fp = 0n
	let i = minSize
	for (let __goscriptSliceWindow0 = $.sliceRange(g), __goscriptSliceWindow1 = $.sliceRange(data); i < n; ) {
		fp = $.uint64Add(($.uint64Shl(fp, 1)), ((__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, ((__goscriptSliceWindow1.backing as any[])[$.windowSlot(__goscriptSliceWindow1, i)] as number) % uint64Len(g))] as bigint))
		if (($.uint64And(fp, maskJ)) == 0n) {
			if (($.uint64And(fp, maskC)) == 0n) {
				return i
			}
			fp = 0n
			i = i + jumpLength
		} else {
			i++
		}
	}
	return $.min(i, n)
}

export function uint64Len(g: $.Slice<bigint>): number {
	return $.uint($.sliceLen(g), 8)
}

export async function main(): globalThis.Promise<void> {
	let g = $.arrayToSlice<bigint>([7n, 11n, 22n, 33n])
	let data = new Uint8Array([1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]) as $.Slice<number>
	await $.println("algo", algorithm(data, $.sliceLen(data), g, 3n, 1n, 0, 3))

	let c = new chunker()
	let totalSize = 0n
	let chkStart = 0n

	let src = io.LimitReader($.pointerValueOrNil($.interfaceValue<io.Reader | null>(newRepeatReader(40), "*main.repeatReader", /* @__PURE__ */ $.pointerType("main.repeatReader")))!, 25n)
	let buf = $.makeSlice<number>(8, undefined, "byte")
	while (true) {
		let [nr, err] = await (src !== null && (src as any).__isVarRef !== true && ((src as any).__goValue === undefined || (src as any).__goType?.charCodeAt(0) !== 42) ? (src as Exclude<io.Reader, null>) : $.pointerValue<Exclude<io.Reader, null>>(src)).Read(buf)
		if (nr > 0) {
			void (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as chunker).advance(nr) : chunker.prototype.advance.call(c, nr))
			totalSize = $.uint64Add(totalSize, $.uint64(nr))
			chkStart = $.uint64Add(chkStart, $.uint64(nr))
		}
		if ($.comparableEqual(err, io.EOF)) {
			break
		}
		if (err != null) {
			await $.println("err", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return
		}
	}
	await $.println("pos", $.pointerValue<chunker>(c).pos)
	await $.println("total", totalSize)
	await $.println("chkStart", chkStart)
}

export function newRepeatReader(n: number): repeatReader | $.VarRef<repeatReader> | null {
	return new repeatReader(false, n)
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
