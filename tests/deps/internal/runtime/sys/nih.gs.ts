// Generated file based on nih.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class nih {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): nih {
		const cloned = new nih()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"sys.nih",
		() => new nih(),
		[],
		nih,
		[]
	)
}

export class NotInHeap {
	public get _blank0(): nih {
		return this._fields._blank0.value
	}
	public set _blank0(value: nih) {
		this._fields._blank0.value = value
	}

	public _fields: {
		_blank0: $.VarRef<nih>
	}

	constructor(init?: Partial<{_blank0?: nih}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 ? $.markAsStructValue($.cloneStructValue(init._blank0)) : $.markAsStructValue(new nih()))
		}
	}

	public clone(): NotInHeap {
		const cloned = new NotInHeap()
		cloned._fields = {
			_blank0: $.varRef($.markAsStructValue($.cloneStructValue(this._fields._blank0.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"sys.NotInHeap",
		() => new NotInHeap(),
		[],
		NotInHeap,
		[{ name: "_", key: "_blank0", type: "sys.nih", pkgPath: "internal/runtime/sys", index: [0], offset: 0, exported: false }]
	)
}
