// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

$.registerTypePackagePath("github.com/s4wave/goscript/tests/tests/reflect_pkgpath_full/dep", ["dep.Node", "dep.Level", "dep.Namer", "dep.Box", "dep.local"])

export type Level = number

export type Namer = {
	Name(): string
}

$.registerInterfaceType(
	"dep.Namer",
	null,
	[$.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")])]
);

export class Node {
	public declare Name: string

	constructor(__goscriptValue?: boolean, Name$?: string) {
		this.Name = Name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Node {
		return new Node(true, this.Name)
	}

	public __goscriptAssign(source: Node): this {
		this.Name = source.Name
		return this
	}

	static __typeInfo = $.registerStructType(
		"dep.Node",
		() => new Node(),
		() => [],
		Node,
		() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true)]
	)
}

export class Box {
	public declare Value: any

	constructor(__goscriptValue?: boolean, Value$?: any) {
		this.Value = Value$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Box {
		return $.copyGenericInstance(this, new Box(true, $.copyElement(this.Value)))
	}

	public __goscriptAssign(source: Box): this {
		this.Value = $.assignFieldValue(this.Value, source.Value)
		return this
	}

	static __typeInfo = $.registerStructType(
		"dep.Box",
		() => new Box(),
		() => [],
		Box,
		() => [/* @__PURE__ */ $.structField("Value", { kind: $.TypeKind.Interface, methods: [] }, [0], 0, true)]
	)
}

export function LocalType(): reflect.Type | null {
	class local {
		public declare A: number

		constructor(init?: Partial<{A?: number}>, __goscriptValue?: boolean) {
			this.A = init?.A ?? (0 as number)
			;(this as any)[$.structValueMarker] = __goscriptValue === true
		}

		public clone(): local {
			return new local(this, true)
		}

		public __goscriptAssign(source: local): this {
			this.A = source.A
			return this
		}

		static __typeInfo = $.registerStructType(
			"dep.local",
			() => new local(),
			() => [],
			local,
			() => [/* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.basicType("int"), [0], 0, true)]
		)
	}
	return reflect.TypeOf($.structInterfaceValue($.markAsStructValue(new local()), "dep.local", "dep.local"))
}
