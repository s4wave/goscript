// Generated file based on goto_state_machine.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class scanner {
	public declare data: string

	public declare pos: number

	public declare done: boolean

	constructor(__goscriptValue?: boolean, data$?: string, pos$?: number, done$?: boolean) {
		this.data = data$ ?? ""
		this.pos = pos$ ?? 0
		this.done = done$ ?? false
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): scanner {
		return new scanner(true, this.data, this.pos, this.done)
	}

	public __goscriptAssign(source: scanner): this {
		this.data = source.data
		this.pos = source.pos
		this.done = source.done
		return this
	}

	public readByte(): number {
		const s: scanner | $.VarRef<scanner> | null = this;
		const s$: scanner = s == null ? $.pointerTarget<scanner>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<scanner>(s)
		if ((s$ as scanner).pos >= $.stringLen((s$ as scanner).data)) {
			;(s$ as scanner).done = true
			return 0
		}
		let c = $.indexString((s$ as scanner).data, (s$ as scanner).pos);
		;(s$ as scanner).pos++
		return c
	}

	public readScript(): number {
		const s: scanner | $.VarRef<scanner> | null = this;
		const s$: scanner = s == null ? $.pointerTarget<scanner>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<scanner>(s)
		let c = 0
		let __goscriptGotoState0 = 0
		__goscriptGotoLoop0: for (;;) {
			switch (__goscriptGotoState0) {
				case 0:
				{
					c = (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as scanner).readByte() : scanner.prototype.readByte.call(s))
					if ((s$ as scanner).done) {
						return (s$ as scanner).pos
					}
					if (c == 60) {
						__goscriptGotoState0 = 1
						continue __goscriptGotoLoop0
					}
					__goscriptGotoState0 = 0
					continue __goscriptGotoLoop0
				}
				case 1:
				{
					c = (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as scanner).readByte() : scanner.prototype.readByte.call(s))
					if ((s$ as scanner).done) {
						return (s$ as scanner).pos
					}
					switch (c) {
						case 47:
						{
							__goscriptGotoState0 = 2
							continue __goscriptGotoLoop0
							break
						}
						case 33:
						{
							__goscriptGotoState0 = 3
							continue __goscriptGotoLoop0
							break
						}
					}
					__goscriptGotoState0 = 0
					continue __goscriptGotoLoop0
				}
				case 2:
				{
					return (s$ as scanner).pos - 2
				}
				case 3:
				{
					for (let i = 0; i < 2; i++) {
						c = (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as scanner).readByte() : scanner.prototype.readByte.call(s))
						if ((s$ as scanner).done) {
							return (s$ as scanner).pos
						}
						if (c != 45) {
							__goscriptGotoState0 = 0
							continue __goscriptGotoLoop0
						}
					}
					__goscriptGotoState0 = 4
					continue __goscriptGotoLoop0
				}
				case 4:
				{
					c = (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as scanner).readByte() : scanner.prototype.readByte.call(s))
					if ((s$ as scanner).done) {
						return (s$ as scanner).pos
					}
					switch (c) {
						case 45:
						{
							__goscriptGotoState0 = 5
							continue __goscriptGotoLoop0
							break
						}
					}
					__goscriptGotoState0 = 4
					continue __goscriptGotoLoop0
				}
				case 5:
				{
					c = (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as scanner).readByte() : scanner.prototype.readByte.call(s))
					if ((s$ as scanner).done) {
						return (s$ as scanner).pos
					}
					if (c == 45) {
						c = (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as scanner).readByte() : scanner.prototype.readByte.call(s))
						if (c == 62) {
							__goscriptGotoState0 = 0
							continue __goscriptGotoLoop0
						}
					}
					__goscriptGotoState0 = 4
					continue __goscriptGotoLoop0
					break
				}
			}
			break
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"main.scanner",
		() => new scanner(),
		() => [{ name: "readByte", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("uint8") }], pointerReceiver: true }, { name: "readScript", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		scanner,
		() => [{ name: "data", key: "data", type: /* @__PURE__ */ $.basicType("string") }, { name: "pos", key: "pos", type: /* @__PURE__ */ $.basicType("int") }, { name: "done", key: "done", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export async function main(): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = $.arrayToSlice<string>(["a < b</script>", "x<!-- </script> -->y</script>", "<!x</script>", "no end"]), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let src = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as string)
		let s = new scanner(false, src)
		let end = (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as scanner).readScript() : scanner.prototype.readScript.call(s))
		await $.println($.sliceStringOrBytes(src, undefined, end))
	}
	await $.println(encode(($.typedSliceOf(Int32Array, [97, 0xa5, 0x85, 0x300, 98]) as $.Slice<number>)))
}

export function encode(rs: $.Slice<number>): string {
	let out = ""
	__goscriptLoop0: for (let __goscriptRangeTarget1 = rs, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let r = $.int((__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as number), 32)
		if (r < 0x80) {
			out += $.runeToString(r)
			continue __goscriptLoop0
		}
		let __goscriptGotoState1 = 0
		__goscriptGotoLoop1: for (;;) {
			switch (__goscriptGotoState1) {
				case 0:
				{
					if (r < 0x100) {
						__goscriptGotoState1 = 2
						continue __goscriptGotoLoop1
					}
				}
				case 1:
				{
					out += "?"
					continue __goscriptLoop0
				}
				case 2:
				{
					let c0 = $.uint((($.uint(r, 8) - 0x80) & 0xff), 8)
					if (c0 < 0x21) {
						__goscriptGotoState1 = 1
						continue __goscriptGotoLoop1
					}
					out += "[" + $.runeToString(($.uint(((65 + (c0 % 26)) & 0xff), 8))) + "]"
					break
				}
			}
			break
		}
	}
	return out
}

if ($.isMainScript(import.meta)) {
	await main()
}
