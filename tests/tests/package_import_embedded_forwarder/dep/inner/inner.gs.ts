// Generated file based on inner.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as tx from "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"

export class CoreStore {
	public declare Prefix: string

	public _fields: {
		Prefix: string
	}

	constructor(init?: Partial<{Prefix?: string}>) {
		this._fields = {
			Prefix: init?.Prefix ?? ("" as string)
		}
	}

	public clone(): CoreStore {
		return $.markAsStructValue(new CoreStore(this))
	}

	public NewTransaction(write: boolean): tx.Tx | $.VarRef<tx.Tx> | null {
		const s: CoreStore | $.VarRef<CoreStore> | null = this;
		if (write) {
			return new tx.Tx({Name: $.pointerValue<CoreStore>(s).Prefix + ":write"})
		}
		return new tx.Tx({Name: $.pointerValue<CoreStore>(s).Prefix + ":read"})
	}

	static {
		$.bindStructFields(this.prototype, ["Prefix"])
	}

	static __typeInfo = $.registerStructType(
		"inner.CoreStore",
		() => new CoreStore(),
		() => [{ name: "NewTransaction", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("tx.Tx") }] }],
		CoreStore,
		() => [{ name: "Prefix", key: "Prefix", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export function NewCoreStore(prefix: string): CoreStore | $.VarRef<CoreStore> | null {
	return new CoreStore({Prefix: prefix})
}
