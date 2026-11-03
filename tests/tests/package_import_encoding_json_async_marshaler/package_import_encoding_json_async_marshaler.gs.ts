// Generated file based on package_import_encoding_json_async_marshaler.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as json from "@goscript/encoding/json/index.js"
import * as errors from "@goscript/errors/index.js"
import * as strings from "@goscript/strings/index.js"
import * as sync from "@goscript/sync/index.js"

export class Image {
	public declare Name: string

	constructor(__goscriptValue?: boolean, Name$?: string) {
		this.Name = Name$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Image {
		return new Image(true, this.Name)
	}

	public __goscriptAssign(source: Image): this {
		this.Name = source.Name
		return this
	}

	public MarshalJSON(): [$.Slice<number>, $.GoError] {
		const im: Image | $.VarRef<Image> | null = this;
		using __defer = new $.DisposableStack()
		const im$: Image = im == null ? $.pointerTarget<Image>(im) : (im as any).__isVarRef === true ? (im as any).value : (im as any).__goValue === undefined ? (im as any) : $.pointerTarget<Image>(im)
		mu.value.Lock()
		const __goscriptDeferCallee0 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))(mu), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
		__defer.defer(() => { __goscriptDeferCallee0() })
		if ($.stringEqual((im$ as Image).Name, "bad")) {
			return [null, errors.New("cannot marshal bad image")]
		}
		return (json.Marshal($.interfaceValue($.makeMap<string, string>([["encoded", strings.ToUpper((im$ as Image).Name)]]), "map[string]string", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string")))) as [$.Slice<number>, $.GoError])
	}

	public UnmarshalJSON(b: $.Slice<number>): $.GoError {
		const im: Image | $.VarRef<Image> | null = this;
		using __defer = new $.DisposableStack()
		mu.value.Lock()
		const __goscriptDeferCallee1 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))(mu), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
		__defer.defer(() => { __goscriptDeferCallee1() })
		let m: $.VarRef<globalThis.Map<string, string> | null> = $.varRef(null! as globalThis.Map<string, string> | null)
		{
			let err = (json.Unmarshal(b, $.interfaceValue(m, "*map[string]string", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string"))))) as $.GoError)
			if (err != null) {
				return err
			}
		}
		if ($.stringEqual($.mapGet<string, string, string>(m.value, "encoded", "")[0], "")) {
			return errors.New("missing encoded image")
		}
		$.pointerValue<Image>(im).Name = strings.ToLower($.mapGet<string, string, string>(m.value, "encoded", "")[0])
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.Image",
		() => new Image(),
		() => [{ name: "MarshalJSON", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }], pointerReceiver: true }, { name: "UnmarshalJSON", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }], pointerReceiver: true }],
		Image,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Doc {
	public declare Title: string

	public declare Image: Image | $.VarRef<Image> | null

	public declare Note: string

	constructor(__goscriptValue?: boolean, Title$?: string, Image$?: Image | $.VarRef<Image> | null, Note$?: string) {
		this.Title = Title$ ?? ""
		this.Image = Image$ ?? (null! as Image | $.VarRef<Image> | null)
		this.Note = Note$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Doc {
		return new Doc(true, this.Title, this.Image, this.Note)
	}

	public __goscriptAssign(source: Doc): this {
		this.Title = source.Title
		this.Image = source.Image
		this.Note = source.Note
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Doc",
		() => new Doc(),
		() => [],
		Doc,
		() => [{ name: "Title", key: "Title", type: /* @__PURE__ */ $.basicType("string") }, { name: "Image", key: "Image", type: /* @__PURE__ */ $.pointerType("main.Image") }, { name: "Note", key: "Note", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export let mu = $.varRef($.markAsStructValue(new sync.Mutex()))

export function __goscript_set_mu(__goscriptValue: sync.Mutex): void {
	$.assignStruct(mu.value, __goscriptValue)
}

export async function main(): globalThis.Promise<void> {
	let __goscriptTuple0: any = (json.Marshal($.interfaceValue(new Image(false, "top"), "*main.Image", /* @__PURE__ */ $.pointerType("main.Image"))) as [$.Slice<number>, $.GoError])
	let b: $.Slice<number> = __goscriptTuple0[0]
	let err: $.GoError = __goscriptTuple0[1]
	await $.println("top:", $.bytesToString(b), err == null)

	let im = new Image()
	err = (json.Unmarshal(b, $.interfaceValue(im, "*main.Image", /* @__PURE__ */ $.pointerType("main.Image"))) as $.GoError)
	await $.println("top back:", $.pointerValue<Image>(im).Name, err == null)

	let doc = new Doc(false, "t", new Image(false, "nested"), "n")
	let __goscriptTuple1: any = (json.Marshal($.interfaceValue(doc, "*main.Doc", /* @__PURE__ */ $.pointerType("main.Doc"))) as [$.Slice<number>, $.GoError])
	b = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println("doc:", $.bytesToString(b), err == null)

	let __goscriptTuple2: any = (json.MarshalIndent($.interfaceValue(doc, "*main.Doc", /* @__PURE__ */ $.pointerType("main.Doc")), "", " ") as [$.Slice<number>, $.GoError])
	let b2: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("indent:", $.bytesToString(b2), err == null)

	let back = new Doc()
	let back$: Doc = back == null ? $.pointerTarget<Doc>(back) : (back as any).__isVarRef === true ? (back as any).value : (back as any).__goValue === undefined ? (back as any) : $.pointerTarget<Doc>(back)
	err = (json.Unmarshal(b, $.interfaceValue(back, "*main.Doc", /* @__PURE__ */ $.pointerType("main.Doc"))) as $.GoError)
	await $.println("doc back:", (back$ as Doc).Title, $.pointerValue<Image>((back$ as Doc).Image).Name, (back$ as Doc).Note, err == null)

	let __goscriptTuple3: any = (json.Marshal($.interfaceValue(new Doc(false, undefined, new Image(false, "bad")), "*main.Doc", /* @__PURE__ */ $.pointerType("main.Doc"))) as [$.Slice<number>, $.GoError])
	err = __goscriptTuple3[1]
	await $.println("marshal error:", strings.HasSuffix((__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), ": cannot marshal bad image"))

	err = (json.Unmarshal(new Uint8Array([123, 34, 73, 109, 97, 103, 101, 34, 58, 123, 34, 111, 116, 104, 101, 114, 34, 58, 34, 120, 34, 125, 125]), $.interfaceValue(new Doc(), "*main.Doc", /* @__PURE__ */ $.pointerType("main.Doc"))) as $.GoError)
	await $.println("unmarshal error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
