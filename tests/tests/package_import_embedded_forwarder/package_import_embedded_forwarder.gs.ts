// Generated file based on package_import_embedded_forwarder.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/index.js"

import * as inner from "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/inner/index.js"

import * as tx from "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/inner/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"

export type Store = {
	Execute(): string
	NewTransaction(write: boolean): tx.Tx | $.VarRef<tx.Tx> | null
}

$.registerInterfaceType(
	"main.Store",
	null,
	[{ name: "Execute", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "NewTransaction", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("tx.Tx") }] }]
);

export class VerboseStore {
	public declare BaseStore: dep.BaseStore | $.VarRef<dep.BaseStore> | null

	public declare name: string

	public _fields: {
		BaseStore: dep.BaseStore | $.VarRef<dep.BaseStore> | null
		name: string
	}

	constructor(init?: Partial<{BaseStore?: dep.BaseStore | $.VarRef<dep.BaseStore> | null, name?: string}>) {
		this._fields = {
			BaseStore: init?.BaseStore ?? (null! as dep.BaseStore | $.VarRef<dep.BaseStore> | null),
			name: init?.name ?? ("" as string)
		}
	}

	public clone(): VerboseStore {
		return $.markAsStructValue(new VerboseStore(this))
	}

	public Execute(): string {
		const s: VerboseStore | $.VarRef<VerboseStore> | null = this;
		return "execute:" + $.pointerValue<VerboseStore>(s).name
	}

	public NewTransaction(write: any): any {
		return $.pointerValue<any>($.pointerValue<dep.BaseStore>(this.BaseStore).CoreStore).NewTransaction(write)
	}

	static {
		$.bindStructFields(this.prototype, ["BaseStore", "name"])
	}

	static __typeInfo = $.registerStructType(
		"main.VerboseStore",
		() => new VerboseStore(),
		() => [{ name: "Execute", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "NewTransaction", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("tx.Tx") }] }],
		VerboseStore,
		() => [{ name: "BaseStore", key: "BaseStore", type: /* @__PURE__ */ $.pointerType("dep.BaseStore"), anonymous: true }, { name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export function NewVerboseStore(name: string): VerboseStore | $.VarRef<VerboseStore> | null {
	return (() => { const __goscriptLiteralField0 = dep.NewBaseStore(name); return new VerboseStore({BaseStore: __goscriptLiteralField0, name: name}) })()
}

export async function useStore(store: Store | null): globalThis.Promise<void> {
	let read: tx.Tx | $.VarRef<tx.Tx> | null = await $.pointerValue<Exclude<Store, null>>(store).NewTransaction(false)
	let write: tx.Tx | $.VarRef<tx.Tx> | null = await $.pointerValue<Exclude<Store, null>>(store).NewTransaction(true)
	await $.println(await $.pointerValue<Exclude<Store, null>>(store).Execute())
	await $.println($.pointerValue<dep.Tx>(read).Name)
	await $.println($.pointerValue<dep.Tx>(write).Name)
}

export async function main(): globalThis.Promise<void> {
	await useStore($.interfaceValue<Store | null>(NewVerboseStore("outer"), "*main.VerboseStore", /* @__PURE__ */ $.pointerType("main.VerboseStore")))
}

if ($.isMainScript(import.meta)) {
	await main()
}
