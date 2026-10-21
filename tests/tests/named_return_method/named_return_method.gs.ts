// Generated file based on named_return_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class content {
	public declare bytes: $.Slice<number>

	constructor(__goscriptValue?: boolean, bytes$?: $.Slice<number>) {
		this.bytes = bytes$ ?? (null! as $.Slice<number>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): content {
		return new content(true, this.bytes)
	}

	public __goscriptAssign(source: content): this {
		this.bytes = source.bytes
		return this
	}

	public ProcessData(input: number): [number, string, boolean] {
		const c: content | $.VarRef<content> | null = this;
		let result = 0
		let status = ""
		let valid = false
		result = input * 2
		if (input > 10) {
			status = "high"
			valid = true
		} else {
			if (input > 0) {
				status = "low"
				valid = true
			} else {
				// status and valid will be zero values
				status = "invalid"
			}
		}
		return [result, status, valid]
	}

	public ReadAt(b: $.Slice<number>, off: bigint): [number, $.GoError] {
		const c: content | $.VarRef<content> | null = this;
		let n = 0
		let err: $.GoError = null! as $.GoError
		const c$: content = c == null ? $.pointerTarget<content>(c) : (c as any).__isVarRef === true ? (c as any).value : (c as any).__goValue === undefined ? (c as any) : $.pointerTarget<content>(c)
		if ((off < 0n) || (off >= $.int64($.sliceLen((c$ as content).bytes)))) {
			err = null
			return [n, err]
		}

		let l = $.int64($.sliceLen(b))
		if (($.int64Add(off, l)) > $.int64($.sliceLen((c$ as content).bytes))) {
			l = $.int64Sub($.int64($.sliceLen((c$ as content).bytes)), off)
		}

		let btr = $.goSlice((c$ as content).bytes, $.int64ToNumber(off), $.int64ToNumber($.int64Add(off, l)))
		n = $.copy(b, btr)
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"main.content",
		() => new content(),
		() => [{ name: "ProcessData", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: /* @__PURE__ */ $.basicType("string") }, { type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "ReadAt", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }],
		content,
		() => [{ name: "bytes", key: "bytes", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }]
	)
}

export async function main(): globalThis.Promise<void> {
	let c = new content(false, new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33]))

	// Test ReadAt method
	let buf = $.makeSlice<number>(5, undefined, "byte")
	let [n1, err1] = (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as content).ReadAt(buf, 0n) : content.prototype.ReadAt.call(c, buf, 0n))
	await $.println(n1)
	if (err1 == null) {
		await $.println("nil")
	} else {
		await $.println("error")
	}
	await $.println($.bytesToString(buf))

	// Test ReadAt with different offset
	let buf2 = $.makeSlice<number>(6, undefined, "byte")
	let [n2, err2] = (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as content).ReadAt(buf2, 7n) : content.prototype.ReadAt.call(c, buf2, 7n))
	await $.println(n2)
	if (err2 == null) {
		await $.println("nil")
	} else {
		await $.println("error")
	}
	await $.println($.bytesToString(buf2))

	// Test ProcessData method
	let [r1, s1, v1] = (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as content).ProcessData(15) : content.prototype.ProcessData.call(c, 15))
	await $.println(r1)
	await $.println(s1)
	await $.println(v1)

	let [r2, s2, v2] = (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as content).ProcessData(5) : content.prototype.ProcessData.call(c, 5))
	await $.println(r2)
	await $.println(s2)
	await $.println(v2)

	let [r3, s3, v3] = (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as content).ProcessData(-1) : content.prototype.ProcessData.call(c, -1))
	await $.println(r3)
	await $.println(s3)
	await $.println(v3)
}

if ($.isMainScript(import.meta)) {
	await main()
}
