// Generated file based on for_post_multi_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class frame {
	public declare name: string

	public _fields: {
		name: string
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: init?.name ?? ("" as string)
		}
	}

	public clone(): frame {
		return $.markAsStructValue(new frame(this))
	}

	static {
		$.bindStructFields(this.prototype, ["name"])
	}

	static __typeInfo = $.registerStructType(
		"main.frame",
		() => new frame(),
		() => [],
		frame,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class iterator {
	public declare idx: number

	public _fields: {
		idx: number
	}

	constructor(init?: Partial<{idx?: number}>) {
		this._fields = {
			idx: init?.idx ?? (0 as number)
		}
	}

	public clone(): iterator {
		return $.markAsStructValue(new iterator(this))
	}

	public Next(): [frame, boolean] {
		let it: iterator | $.VarRef<iterator> | null = this;
		$.pointerValue<iterator>(it).idx++
		switch ($.pointerValue<iterator>(it).idx) {
			case 1:
			{
				return [$.markAsStructValue(new frame({name: "first"})), true]
				break
			}
			case 2:
			{
				return [$.markAsStructValue(new frame({name: "second"})), true]
				break
			}
			default:
			{
				return [$.markAsStructValue(new frame()), false]
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	static {
		$.bindStructFields(this.prototype, ["idx"])
	}

	static __typeInfo = $.registerStructType(
		"main.iterator",
		() => new iterator(),
		() => [{ name: "Next", args: [], returns: [{ type: "main.frame" }, { type: /* @__PURE__ */ $.basicType("bool") }] }],
		iterator,
		() => [{ name: "idx", key: "idx", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function findFrame(): frame | $.VarRef<frame> | null {
	let it: iterator | $.VarRef<iterator> | null = new iterator()
	for (let __goscriptTuple0 = iterator.prototype.Next.call(it), f = $.varRef(__goscriptTuple0[0]), again = __goscriptTuple0[1]; again; [f.value, again] = iterator.prototype.Next.call(it)) {
		if ($.stringEqual(f.value.name, "second")) {
			return f
		}
	}
	return null
}

export async function main(): globalThis.Promise<void> {
	for (let i = 0, j = 5; i < j; [i, j] = [i + 1, j - 1]) {
		await $.println(i, j)
	}
	let found: frame | $.VarRef<frame> | null = findFrame()
	if (found != null) {
		await $.println("frame:", $.pointerValue<frame>(found).name)
	}
	await $.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
