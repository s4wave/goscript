// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as inner from "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/inner/index.js"

import * as tx from "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/inner/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"

export type Tx = tx.Tx

export type Store = {
	NewTransaction(write: boolean): tx.Tx | $.VarRef<tx.Tx> | null
}

$.registerInterfaceType(
	"dep.Store",
	null,
	[{ name: "NewTransaction", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("tx.Tx") }] }]
);

export class BaseStore {
	public declare CoreStore: inner.CoreStore | $.VarRef<inner.CoreStore> | null

	public _fields: {
		CoreStore: inner.CoreStore | $.VarRef<inner.CoreStore> | null
	}

	constructor(init?: Partial<{CoreStore?: inner.CoreStore | $.VarRef<inner.CoreStore> | null}>) {
		this._fields = {
			CoreStore: init?.CoreStore ?? (null! as inner.CoreStore | $.VarRef<inner.CoreStore> | null)
		}
	}

	public clone(): BaseStore {
		return $.markAsStructValue(new BaseStore(this))
	}

	public NewTransaction(write: any): any {
		return $.pointerValue<inner.CoreStore>(this.CoreStore).NewTransaction(write)
	}

	static {
		$.bindStructFields(this.prototype, ["CoreStore"])
	}

	static __typeInfo = $.registerStructType(
		"dep.BaseStore",
		() => new BaseStore(),
		() => [{ name: "NewTransaction", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("tx.Tx") }] }],
		BaseStore,
		() => [{ name: "CoreStore", key: "CoreStore", type: /* @__PURE__ */ $.pointerType("inner.CoreStore"), anonymous: true }]
	)
}

export function NewBaseStore(prefix: string): BaseStore | $.VarRef<BaseStore> | null {
	return (() => { const __goscriptLiteralField0 = inner.NewCoreStore(prefix); return new BaseStore({CoreStore: __goscriptLiteralField0}) })()
}
