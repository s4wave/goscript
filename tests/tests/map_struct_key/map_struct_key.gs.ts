// Generated file based on map_struct_key.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class requestKey {
	public declare soID: string

	public declare inviteID: string

	public declare peerID: string

	public _fields: {
		soID: string
		inviteID: string
		peerID: string
	}

	constructor(init?: Partial<{soID?: string, inviteID?: string, peerID?: string}>) {
		this._fields = {
			soID: init?.soID ?? ("" as string),
			inviteID: init?.inviteID ?? ("" as string),
			peerID: init?.peerID ?? ("" as string)
		}
	}

	public clone(): requestKey {
		return $.markAsStructValue(new requestKey(this))
	}

	static {
		$.bindStructFields(this.prototype, ["soID", "inviteID", "peerID"])
	}

	static __typeInfo = $.registerStructType(
		"main.requestKey",
		() => new requestKey(),
		() => [],
		requestKey,
		() => [{ name: "soID", key: "soID", type: /* @__PURE__ */ $.basicType("string") }, { name: "inviteID", key: "inviteID", type: /* @__PURE__ */ $.basicType("string") }, { name: "peerID", key: "peerID", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class node {
	public declare value: string

	public declare next: node | $.VarRef<node> | null

	public _fields: {
		value: string
		next: node | $.VarRef<node> | null
	}

	constructor(init?: Partial<{value?: string, next?: node | $.VarRef<node> | null}>) {
		this._fields = {
			value: init?.value ?? ("" as string),
			next: init?.next ?? (null! as node | $.VarRef<node> | null)
		}
	}

	public clone(): node {
		return $.markAsStructValue(new node(this))
	}

	static {
		$.bindStructFields(this.prototype, ["value", "next"])
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		() => new node(),
		() => [],
		node,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("string") }, { name: "next", key: "next", type: /* @__PURE__ */ $.pointerType("main.node") }]
	)
}

export function newMap(__typeArgs: $.GenericTypeArgs | undefined): globalThis.Map<any, any> | null {
	return $.makeMap<any, any>(undefined, __typeArgs?.["K"]?.type ?? { kind: $.TypeKind.Interface, methods: [] })
}

export async function main(): globalThis.Promise<void> {
	let status: globalThis.Map<requestKey, string> | null = $.makeMap<requestKey, string>()
	$.mapSet(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})), "pending")
	$.mapSet(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})), "accepted")

	let [got, ok] = $.mapGet<requestKey, string, string>(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})), "")
	await $.println("same struct key:", got, ok, $.len(status))

	let [, missing] = $.mapGet<requestKey, string, string>(status, $.markAsStructValue(new requestKey({soID: "so-2", inviteID: "inv-1", peerID: "peer-1"})), "")
	await $.println("different struct key:", missing)

	$.deleteMapEntry(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})))
	let [, deleted] = $.mapGet<requestKey, string, string>(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})), "")
	await $.println("deleted struct key:", deleted, $.len(status))

	let first: requestKey | $.VarRef<requestKey> | null = new requestKey({soID: "same"})
	let second: requestKey | $.VarRef<requestKey> | null = new requestKey({soID: "same"})
	let pointers: globalThis.Map<requestKey | $.VarRef<requestKey> | null, number> | null = $.makeMap<requestKey | $.VarRef<requestKey> | null, number>([[first, 1], [second, 2]], /* @__PURE__ */ $.pointerType("main.requestKey"))
	await $.println("distinct pointer keys:", $.len(pointers), $.mapGet<requestKey | $.VarRef<requestKey> | null, number, number>(pointers, first, 0)[0], $.mapGet<requestKey | $.VarRef<requestKey> | null, number, number>(pointers, second, 0)[0])
	$.deleteMapEntry(pointers, first)
	await $.println("delete one pointer:", $.len(pointers), $.mapGet<requestKey | $.VarRef<requestKey> | null, number, number>(pointers, second, 0)[0])

	let left: node | $.VarRef<node> | null = new node({value: "same"})
	let right: node | $.VarRef<node> | null = new node({value: "same"})
	let __goscriptAssign0_0: node | $.VarRef<node> | null = left
	let __goscriptAssign0_1: node | $.VarRef<node> | null = right
	$.pointerValue<node>(left).next = __goscriptAssign0_0
	$.pointerValue<node>(right).next = __goscriptAssign0_1
	let cyclic: globalThis.Map<node | $.VarRef<node> | null, number> | null = (newMap({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, K: { type: /* @__PURE__ */ $.pointerType("main.node"), zero: () => null }, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}) as globalThis.Map<node | $.VarRef<node> | null, number> | null)
	let __goscriptAssign1_0: number = 3
	let __goscriptAssign1_1: number = 4
	$.mapSet(cyclic, left, __goscriptAssign1_0)
	$.mapSet(cyclic, right, __goscriptAssign1_1)
	await $.println("cyclic pointer keys:", $.len(cyclic), $.mapGet<node | $.VarRef<node> | null, number, number>(cyclic, left, 0)[0], $.mapGet<node | $.VarRef<node> | null, number, number>(cyclic, right, 0)[0])
}

if ($.isMainScript(import.meta)) {
	await main()
}
