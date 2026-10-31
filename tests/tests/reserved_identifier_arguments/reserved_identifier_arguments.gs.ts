// Generated file based on reserved_identifier_arguments.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type _enum = number

export class Parser {
	constructor(__goscriptValue?: boolean) {
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Parser {
		return new Parser(true)
	}

	public __goscriptAssign(source: Parser): this {
		return this
	}

	public Parse(_arguments: $.Slice<string>): number {
		return $.sliceLen(_arguments)
	}

	static __typeInfo = $.registerStructType(
		"main.Parser",
		() => new Parser(),
		() => [{ name: "Parse", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		Parser,
		() => []
	)
}

export function collect(_arguments: string): string {
	return _arguments + "!"
}

export function double(e: _enum): _enum {
	return e * 2
}

export async function main(): globalThis.Promise<void> {
	await $.println(new Parser(true).Parse($.arrayToSlice<string>(["a", "b"])))
	await $.println(collect("ok"))
	await $.println(double(21))
}

if ($.isMainScript(import.meta)) {
	await main()
}
