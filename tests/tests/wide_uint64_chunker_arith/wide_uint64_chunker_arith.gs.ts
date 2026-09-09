// Generated file based on wide_uint64_chunker_arith.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/io/index.js"

export class chunker {
	public declare pos: bigint

	public _fields: {
		pos: bigint
	}

	constructor(init?: Partial<{pos?: bigint}>) {
		this._fields = {
			pos: init?.pos ?? (0n as bigint)
		}
	}

	public clone(): chunker {
		return $.markAsStructValue(new chunker(this))
	}

	public advance(chunkSize: number): void {
		let c: chunker | $.VarRef<chunker> | null = this
		$.pointerValue<chunker>(c).pos = $.uint64Add($.pointerValue<chunker>(c).pos, $.uint64(chunkSize))
	}

	static {
		$.bindStructFields(this.prototype, ["pos"])
	}

	static __typeInfo = $.registerStructType(
		"main.chunker",
		() => new chunker(),
		() => [{ name: "advance", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		chunker,
		() => [{ name: "pos", key: "pos", type: /* @__PURE__ */ $.basicType("uint64") }]
	)
}

export class repeatReader {
	public declare remaining: number

	public _fields: {
		remaining: number
	}

	constructor(init?: Partial<{remaining?: number}>) {
		this._fields = {
			remaining: init?.remaining ?? (0 as number)
		}
	}

	public clone(): repeatReader {
		return $.markAsStructValue(new repeatReader(this))
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let r: repeatReader | $.VarRef<repeatReader> | null = this
		if ($.pointerValue<repeatReader>(r).remaining == 0) {
			return [0, io.EOF]
		}
		let n = $.min($.len(p), $.pointerValue<repeatReader>(r).remaining)
		for (let i = 0; i < n; i++) {
			p![i] = $.uint($.uint(i, 8), 8)
		}
		$.pointerValue<repeatReader>(r).remaining = $.pointerValue<repeatReader>(r).remaining - (n)
		return [n, null]
	}

	static {
		$.bindStructFields(this.prototype, ["remaining"])
	}

	static __typeInfo = $.registerStructType(
		"main.repeatReader",
		() => new repeatReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		repeatReader,
		() => [{ name: "remaining", key: "remaining", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function algorithm(data: $.Slice<number>, n: number, g: $.Slice<bigint>, maskC: bigint, maskJ: bigint, minSize: number, jumpLength: number): number {
	let fp = 0n
	let i = minSize
	while (i < n) {
		fp = $.uint64Add(($.uint64Shl(fp, 1n)), $.arrayIndex(g!, $.arrayIndex(data!, i) % uint64Len(g)))
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
	return $.uint($.uint($.len(g), 8), 8)
}

export async function main(): globalThis.Promise<void> {
	let g: $.Slice<bigint> = $.arrayToSlice<bigint>([7n, 11n, 22n, 33n])
	let data: $.Slice<number> = new Uint8Array([1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]) as $.Slice<number>
	await $.println("algo", algorithm(data, $.len(data), g, 3n, 1n, 0, 3))

	let c: chunker | $.VarRef<chunker> | null = new chunker()
	let totalSize: bigint = 0n
	let chkStart: bigint = 0n

	let src = io.LimitReader($.pointerValueOrNil($.interfaceValue<io.Reader | null>(newRepeatReader(40), "*main.repeatReader", /* @__PURE__ */ $.pointerType("main.repeatReader")))!, 25n)
	let buf: $.Slice<number> = $.makeSlice<number>(8, undefined, "byte")
	while (true) {
		let [nr, err] = await $.pointerValue<Exclude<io.Reader, null>>(src).Read(buf)
		if (nr > 0) {
			chunker.prototype.advance.call(c, nr)
			totalSize = $.uint64Add(totalSize, $.uint64(nr))
			chkStart = $.uint64Add(chkStart, $.uint64(nr))
		}
		if ($.comparableEqual(err, io.EOF)) {
			break
		}
		if (err != null) {
			await $.println("err", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	await $.println("pos", $.pointerValue<chunker>(c).pos)
	await $.println("total", totalSize)
	await $.println("chkStart", chkStart)
}

export function newRepeatReader(n: number): repeatReader | $.VarRef<repeatReader> | null {
	return new repeatReader({remaining: n})
}

if ($.isMainScript(import.meta)) {
	await main()
}
