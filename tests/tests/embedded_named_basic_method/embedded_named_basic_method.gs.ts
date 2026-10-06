// Generated file based on embedded_named_basic_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Level = number

export type Ranker = {
	Rank(prefix: string): string
}

$.registerInterfaceType(
	"main.Ranker",
	null,
	[{ name: "Rank", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class Engineer {
	public declare Level: Level

	public declare Name: string

	public _fields: {
		Level: Level
		Name: string
	}

	constructor(init?: Partial<{Level?: Level, Name?: string}>) {
		this._fields = {
			Level: init?.Level ?? (0 as Level),
			Name: init?.Name ?? ("" as string)
		}
	}

	public clone(): Engineer {
		return $.markAsStructValue(new Engineer(this))
	}

	public Rank(prefix: any): any {
		return Level_Rank(this.Level, prefix)
	}

	static {
		$.bindStructFields(this.prototype, ["Level", "Name"])
	}

	static __typeInfo = $.registerStructType(
		"main.Engineer",
		() => new Engineer(),
		() => [{ name: "Rank", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		Engineer,
		() => [{ name: "Level", key: "Level", type: /* @__PURE__ */ $.basicType("int", "main.Level"), anonymous: true }, { name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export function Level_Rank(l: Level, prefix: string): string {
	if (l > 2) {
		return prefix + "senior"
	}
	return prefix + "junior"
}

export async function main(): globalThis.Promise<void> {
	let eng = $.markAsStructValue(new Engineer({Level: 3, Name: "Grace"}))
	await $.println("direct:", Level_Rank(eng.Level, "rank: "))

	let r: Ranker | null = $.interfaceValue<Ranker | null>($.markAsStructValue($.cloneStructValue(eng)), "main.Engineer", "main.Engineer")
	await $.println("interface:", await $.pointerValue<Exclude<Ranker, null>>(r).Rank("value: "))

	r = $.interfaceValue<Ranker | null>(new Engineer({Level: 1, Name: "Ada"}), "*main.Engineer", /* @__PURE__ */ $.pointerType("main.Engineer"))
	await $.println("pointer:", await $.pointerValue<Exclude<Ranker, null>>(r).Rank("pointer: "))
}

if ($.isMainScript(import.meta)) {
	await main()
}
