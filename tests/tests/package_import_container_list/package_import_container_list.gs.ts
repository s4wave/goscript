// Generated file based on package_import_container_list.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as list from "@goscript/container/list/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/container/list/index.js"
import "@goscript/fmt/index.js"
import "@goscript/sync/index.js"

export class pooledElement {
	public get Value(): any {
		return this._fields.Value.value
	}
	public set Value(value: any) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<any>
	}

	constructor(init?: Partial<{Value?: any}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? (null! as any))
		}
	}

	public clone(): pooledElement {
		const cloned = new pooledElement()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.pooledElement",
		() => new pooledElement(),
		[],
		pooledElement,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export function printList(name: string, values: list.List | $.VarRef<list.List> | null): void {
	fmt.Print(name)
	for (let element: list.Element | $.VarRef<list.Element> | null = list.List.prototype.Front.call(values); element != null; element = list.Element.prototype.Next.call(element)) {
		fmt.Print(" ", $.pointerValue<list.Element>(element).Value)
	}
	fmt.Println()
}

export function newElementPool(__typeArgs: $.GenericTypeArgs | undefined): sync.Pool | $.VarRef<sync.Pool> | null {
	return new sync.Pool({New: $.functionValue((): any => {
		return $.interfaceValue<any>(new pooledElement({Value: $.genericZero(__typeArgs, "T", null)}), "*main.pooledElement", { kind: $.TypeKind.Pointer, elemType: "main.pooledElement" })
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})
}

export async function pushPooled(__typeArgs: $.GenericTypeArgs | undefined, pool: sync.Pool | $.VarRef<sync.Pool> | null, value: any): globalThis.Promise<pooledElement | $.VarRef<pooledElement> | null> {
	let element: pooledElement | $.VarRef<pooledElement> | null = $.mustTypeAssert<pooledElement | $.VarRef<pooledElement> | null>(await sync.Pool.prototype.Get.call($.pointerValue<sync.Pool>(pool)), { kind: $.TypeKind.Pointer, elemType: "main.pooledElement" })
	$.pointerValue<pooledElement>(element).Value = value
	return element
}

export async function main(): globalThis.Promise<void> {
	let values: list.List | $.VarRef<list.List> | null = list.New()
	let middle: list.Element | $.VarRef<list.Element> | null = list.List.prototype.PushFront.call(values, "middle")
	let back: list.Element | $.VarRef<list.Element> | null = list.List.prototype.PushBack.call(values, "back")
	list.List.prototype.PushFront.call(values, "front")
	printList("seed", values)

	let boxed: any = $.interfaceValue<any>(back, "*list.Element", { kind: $.TypeKind.Pointer, elemType: "list.Element" })
	list.List.prototype.MoveToFront.call(values, $.mustTypeAssert<list.Element | $.VarRef<list.Element> | null>(boxed, { kind: $.TypeKind.Pointer, elemType: "list.Element" }))
	printList("moved", values)

	fmt.Println("removed", list.List.prototype.Remove.call(values, middle))
	printList("final", values)
	let pool: sync.Pool | $.VarRef<sync.Pool> | null = newElementPool({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})
	let pooled: pooledElement | $.VarRef<pooledElement> | null = (await pushPooled({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, pool, "pooled") as pooledElement | $.VarRef<pooledElement> | null)
	fmt.Println("pool", $.pointerValue<pooledElement>(pooled).Value)
	sync.Pool.prototype.Put.call($.pointerValue<sync.Pool>(pool), $.interfaceValue<any>(pooled, "*main.pooledElement", { kind: $.TypeKind.Pointer, elemType: "main.pooledElement" }))
	fmt.Println("pool-reused", $.pointerValue<pooledElement>(await pushPooled({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, pool, "reused")).Value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
