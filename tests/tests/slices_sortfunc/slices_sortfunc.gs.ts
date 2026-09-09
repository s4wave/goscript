// Generated file based on slices_sortfunc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"
import "@goscript/slices/index.js"

export class Person {
	public declare Name: string

	public declare Age: number

	public _fields: {
		Name: string
		Age: number
	}

	constructor(init?: Partial<{Name?: string, Age?: number}>) {
		this._fields = {
			Name: init?.Name ?? ("" as string),
			Age: init?.Age ?? (0 as number)
		}
	}

	public clone(): Person {
		return $.markAsStructValue(new Person(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Name", "Age"])
	}

	static __typeInfo = $.registerStructType(
		"main.Person",
		() => new Person(),
		() => [],
		Person,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "Age", key: "Age", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let people: $.Slice<Person> = $.arrayToSlice<Person>([$.markAsStructValue(new Person({Name: "Charlie", Age: 30})), $.markAsStructValue(new Person({Name: "Alice", Age: 25})), $.markAsStructValue(new Person({Name: "Bob", Age: 35}))])

	await slices.SortFunc(people, $.functionValue((a: Person, b: Person): number => {
		if (a.Age < b.Age) {
			return -1
		}
		if (a.Age > b.Age) {
			return 1
		}
		return 0
	}, ({ kind: $.TypeKind.Function, params: ["main.Person", "main.Person"], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)))

	for (let __goscriptRangeTarget0 = people, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let p = __goscriptRangeTarget0![__rangeIndex]
		await $.println(p.Name, p.Age)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
