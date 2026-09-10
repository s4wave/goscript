// Generated file based on varref_composite_lit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MockInode {
	public declare Value: number

	public _fields: {
		Value: number
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: init?.Value ?? (0 as number)
		}
	}

	public clone(): MockInode {
		return $.markAsStructValue(new MockInode(this))
	}

	public getValue(): number {
		const m: MockInode | $.VarRef<MockInode> | null = this;
		return $.pointerValue<MockInode>(m).Value
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"main.MockInode",
		() => new MockInode(),
		() => [{ name: "getValue", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		MockInode,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	// This should generate: let childInode: MockInode | null = new MockInode({Value: 42})
	// Not: let childInode: MockInode | null = $.varRef(new MockInode({Value: 42}))
	// Because we're taking the address of a composite literal, not a variable
	let childInode: MockInode | $.VarRef<MockInode> | null = new MockInode({Value: 42})

	// Use the pointer
	await $.println("childInode.Value:", $.pointerValue<MockInode>(childInode).Value)
	await $.println("childInode.getValue():", MockInode.prototype.getValue.call(childInode))
}

if ($.isMainScript(import.meta)) {
	await main()
}
