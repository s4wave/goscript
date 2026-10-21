// Generated file based on package_import_container_list.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as list from "@goscript/container/list/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as sync from "@goscript/sync/index.js"

export class pooledElement {
	public declare Value: any

	constructor(__goscriptValue?: boolean, Value$?: any) {
		this.Value = Value$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): pooledElement {
		return $.copyGenericInstance(this, new pooledElement(true, $.copyElement(this.Value)))
	}

	public __goscriptAssign(source: pooledElement): this {
		this.Value = $.assignFieldValue(this.Value, source.Value)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pooledElement",
		() => new pooledElement(),
		() => [],
		pooledElement,
		() => [{ name: "Value", key: "Value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export function printList(name: string, values: list.List | $.VarRef<list.List> | null): void {
	fmt.Print(name)
	for (let element: list.Element | $.VarRef<list.Element> | null = (values !== null && (values as any).__isVarRef !== true && (values as any).__goValue === undefined ? ((values as any) as list.List).Front() : list.List.prototype.Front.call(values)); element != null; element = (element !== null && (element as any).__isVarRef !== true && (element as any).__goValue === undefined ? ((element as any) as list.Element).Next() : list.Element.prototype.Next.call(element))) {
		fmt.Print(" ", $.pointerValue<list.Element>(element).Value)
	}
	fmt.Println()
}

export function newElementPool(__typeArgs: $.GenericTypeArgs | undefined): sync.Pool | $.VarRef<sync.Pool> | null {
	return new sync.Pool({New: $.functionValue((): any => {
		return $.genericInterfaceValue(new pooledElement(false, $.genericZero(__typeArgs, "T", null)), "*main.pooledElement", /* @__PURE__ */ $.pointerType("main.pooledElement"))
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})
}

export function pushPooled(__typeArgs: $.GenericTypeArgs | undefined, pool: sync.Pool | $.VarRef<sync.Pool> | null, value: any): pooledElement | $.VarRef<pooledElement> | null {
	let element = $.mustTypeAssert<pooledElement | $.VarRef<pooledElement> | null>((pool !== null && (pool as any).__isVarRef !== true && (pool as any).__goValue === undefined ? ((pool as any) as sync.Pool).Get() : sync.Pool.prototype.Get.call($.pointerValue<sync.Pool>(pool))), /* @__PURE__ */ $.pointerType("main.pooledElement"))
	$.pointerValue<pooledElement>(element).Value = $.copyElement(value)
	return element
}

export async function main(): globalThis.Promise<void> {
	let values = list.New()
	let middle = (values !== null && (values as any).__isVarRef !== true && (values as any).__goValue === undefined ? ((values as any) as list.List).PushFront("middle") : list.List.prototype.PushFront.call(values, "middle"))
	let back = (values !== null && (values as any).__isVarRef !== true && (values as any).__goValue === undefined ? ((values as any) as list.List).PushBack("back") : list.List.prototype.PushBack.call(values, "back"))
	void (values !== null && (values as any).__isVarRef !== true && (values as any).__goValue === undefined ? ((values as any) as list.List).PushFront("front") : list.List.prototype.PushFront.call(values, "front"))
	printList("seed", values)

	let boxed: any = $.interfaceValue(back, "*list.Element", /* @__PURE__ */ $.pointerType("list.Element"))
	list.List.prototype.MoveToFront.call(values, ((boxed as any)?.__goType === "*list.Element" && (boxed as any).__goValue === undefined && (boxed as any).__isTypedNil !== true ? ((boxed as any) as list.Element | $.VarRef<list.Element> | null) : $.mustTypeAssert<list.Element | $.VarRef<list.Element> | null>(boxed, /* @__PURE__ */ $.pointerType("list.Element"))))
	printList("moved", values)

	fmt.Println("removed", (values !== null && (values as any).__isVarRef !== true && (values as any).__goValue === undefined ? ((values as any) as list.List).Remove(middle) : list.List.prototype.Remove.call(values, middle)))
	printList("final", values)
	let pool = newElementPool(__goscriptStatic0())
	let pooled = (pushPooled(__goscriptStatic0(), pool, "pooled") as pooledElement | $.VarRef<pooledElement> | null)
	fmt.Println("pool", $.pointerValue<pooledElement>(pooled).Value)
	void (pool !== null && (pool as any).__isVarRef !== true && (pool as any).__goValue === undefined ? ((pool as any) as sync.Pool).Put($.interfaceValue(pooled, "*main.pooledElement", /* @__PURE__ */ $.pointerType("main.pooledElement"))) : sync.Pool.prototype.Put.call($.pointerValue<sync.Pool>(pool), $.interfaceValue(pooled, "*main.pooledElement", /* @__PURE__ */ $.pointerType("main.pooledElement"))))
	fmt.Println("pool-reused", $.pointerValue<pooledElement>(pushPooled(__goscriptStatic0(), pool, "reused")).Value)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

if ($.isMainScript(import.meta)) {
	await main()
}
