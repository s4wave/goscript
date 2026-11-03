// Generated file based on named_function_type_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as filepath from "@goscript/path/filepath/index.js"
import "@goscript/path/filepath/index.js"

export type FileInfo = {
	IsDir(): boolean
	Name(): string
	Size(): bigint
}

$.registerInterfaceType(
	"main.FileInfo",
	null,
	[{ name: "IsDir", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "Size", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int64") }] }]
);

export type Filesystem = {
	ReadDir(path: string): [$.Slice<FileInfo | null>, $.GoError]
}

$.registerInterfaceType(
	"main.Filesystem",
	null,
	[{ name: "ReadDir", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType("main.FileInfo") }, { type: "error" }] }]
);

export type WalkFunc = ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null

export type Shape = {
	Stats(): number
}

$.registerInterfaceType(
	"main.Shape",
	null,
	[{ name: "Stats", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export type Morphism = ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null

export class MockFileInfo {
	public declare name: string

	public declare size: bigint

	public declare isDir: boolean

	constructor(__goscriptValue?: boolean, name$?: string, size$?: bigint, isDir$?: boolean) {
		this.name = name$ ?? ""
		this.size = size$ ?? 0n
		this.isDir = isDir$ ?? false
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): MockFileInfo {
		return new MockFileInfo(true, this.name, this.size, this.isDir)
	}

	public __goscriptAssign(source: MockFileInfo): this {
		this.name = source.name
		this.size = source.size
		this.isDir = source.isDir
		return this
	}

	public IsDir(): boolean {
		const m: MockFileInfo | $.VarRef<MockFileInfo> | null = this;
		return $.pointerValue<MockFileInfo>(m).isDir
	}

	public Name(): string {
		const m: MockFileInfo | $.VarRef<MockFileInfo> | null = this;
		return $.pointerValue<MockFileInfo>(m).name
	}

	public Size(): bigint {
		const m: MockFileInfo | $.VarRef<MockFileInfo> | null = this;
		return $.pointerValue<MockFileInfo>(m).size
	}

	static __typeInfo = $.registerStructType(
		"main.MockFileInfo",
		() => new MockFileInfo(),
		() => [{ name: "IsDir", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "Size", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int64") }], pointerReceiver: true }],
		MockFileInfo,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }, { name: "size", key: "size", type: /* @__PURE__ */ $.basicType("int64") }, { name: "isDir", key: "isDir", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export class MockFilesystem {
	constructor(__goscriptValue?: boolean) {
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): MockFilesystem {
		return new MockFilesystem(true)
	}

	public __goscriptAssign(source: MockFilesystem): this {
		return this
	}

	public ReadDir(path: string): [$.Slice<FileInfo | null>, $.GoError] {
		const m: MockFilesystem | $.VarRef<MockFilesystem> | null = this;
		return [$.arrayToSlice<FileInfo | null>([$.interfaceValue<FileInfo | null>(new MockFileInfo(false, "file1.txt", 100n, false), "*main.MockFileInfo", /* @__PURE__ */ $.pointerType("main.MockFileInfo")), $.interfaceValue<FileInfo | null>(new MockFileInfo(false, "subdir", 0n, true), "*main.MockFileInfo", /* @__PURE__ */ $.pointerType("main.MockFileInfo"))]), null]
	}

	static __typeInfo = $.registerStructType(
		"main.MockFilesystem",
		() => new MockFilesystem(),
		() => [{ name: "ReadDir", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType("main.FileInfo") }, { type: "error" }], pointerReceiver: true }],
		MockFilesystem,
		() => []
	)
}

export class shapeNode {
	public declare value: number

	constructor(__goscriptValue?: boolean, value$?: number) {
		this.value = value$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): shapeNode {
		return new shapeNode(true, this.value)
	}

	public __goscriptAssign(source: shapeNode): this {
		this.value = source.value
		return this
	}

	public Stats(): number {
		const s: shapeNode | $.VarRef<shapeNode> | null = this;
		return $.pointerValue<shapeNode>(s).value
	}

	static __typeInfo = $.registerStructType(
		"main.shapeNode",
		() => new shapeNode(),
		() => [{ name: "Stats", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		shapeNode,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class MorphismHolder {
	public declare morphism: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null

	constructor(__goscriptValue?: boolean, morphism$?: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null) {
		this.morphism = morphism$ ?? (null! as ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): MorphismHolder {
		return new MorphismHolder(true, this.morphism)
	}

	public __goscriptAssign(source: MorphismHolder): this {
		this.morphism = source.morphism
		return this
	}

	public async apply(s: Shape | null): globalThis.Promise<number> {
		const h: MorphismHolder | $.VarRef<MorphismHolder> | null = this;
		return (__goscriptAwait = $.pointerValue<Exclude<Shape, null>>((__goscriptAwait = $.pointerValue<MorphismHolder>(h).morphism!(s), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).Stats(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	}

	public async cloneApply(s: Shape | null): globalThis.Promise<number> {
		const h: MorphismHolder | $.VarRef<MorphismHolder> | null = this;
		return (__goscriptAwait = $.pointerValue<Exclude<Shape, null>>((__goscriptAwait = $.pointerValue<MorphismHolder>(await cloneMorphism($.pointerValue<MorphismHolder>(h).morphism)).morphism!(s), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).Stats(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	}

	static __typeInfo = $.registerStructType(
		"main.MorphismHolder",
		() => new MorphismHolder(),
		() => [{ name: "apply", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "cloneApply", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		MorphismHolder,
		() => [{ name: "morphism", key: "morphism", type: ({ kind: $.TypeKind.Function, name: "main.Morphism", params: ["main.Shape"], results: ["main.Shape"] } as $.FunctionTypeInfo) }]
	)
}

export class morphismWorker {
	public declare ready: $.Channel<boolean> | null

	constructor(__goscriptValue?: boolean, ready$?: $.Channel<boolean> | null) {
		this.ready = ready$ ?? (null! as $.Channel<boolean> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): morphismWorker {
		return new morphismWorker(true, this.ready)
	}

	public __goscriptAssign(source: morphismWorker): this {
		this.ready = source.ready
		return this
	}

	public async lookup(s: Shape | null): globalThis.Promise<Shape | null> {
		const w: morphismWorker | $.VarRef<morphismWorker> | null = this;
		const w$: morphismWorker = w == null ? $.pointerTarget<morphismWorker>(w) : (w as any).__isVarRef === true ? (w as any).value : (w as any).__goValue === undefined ? (w as any) : $.pointerTarget<morphismWorker>(w)
		await $.chanSend((w$ as morphismWorker).ready, true)
		await $.chanRecv((w$ as morphismWorker).ready)
		return s
	}

	static __typeInfo = $.registerStructType(
		"main.morphismWorker",
		() => new morphismWorker(),
		() => [{ name: "lookup", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "main.Shape" }], pointerReceiver: true }],
		morphismWorker,
		() => [{ name: "ready", key: "ready", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("bool"), "both") }]
	)
}

export async function walk(fs: Filesystem | null, path: string, info: FileInfo | null, walkFn: ((path: string, info: any, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	// Test case 1: Direct call to named function type parameter
	// This should generate: walkFn!(path, info, nil)
	// But currently generates: walkFn(path, info, nil) - missing !

	// We need to convert our FileInfo to os.FileInfo for filepath.WalkFunc
	// For this test, we'll use a simpler approach with our own WalkFunc
	return walkWithCustomFunc(fs, path, info, $.functionValue((p: string, i: FileInfo | null, e: $.GoError): $.GoError => {
		// This simulates the issue by calling filepath.WalkFunc indirectly
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string"), "main.FileInfo", "error"], results: ["error"] } as $.FunctionTypeInfo)))
}

export async function walkWithCustomFunc(fs: Filesystem | null, path: string, info: FileInfo | null, walkFn: ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	// Test case 1: Direct call to named function type parameter
	// This should generate: walkFn!(path, info, nil)
	// But currently generates: walkFn(path, info, nil) - missing !
	{
		let err = (__goscriptAwait = walkFn!(path, info, null), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if ((err != null) && (!$.comparableEqual(err, filepath.SkipDir))) {
			return err
		}
	}

	// Test case 2: Call with variable error
	let walkErr: $.GoError = null
	// This should also generate: walkFn!(path, info, walkErr)
	{
		let err = (__goscriptAwait = walkFn!(path, info, walkErr), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if ((err != null) && (!$.comparableEqual(err, filepath.SkipDir))) {
			return err
		}
	}

	// Test case 3: Call in if statement condition
	// This should generate: walkFn!(path, info, nil)
	if ((__goscriptAwait = walkFn!(path, info, null), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) != null) {
		return filepath.SkipDir
	}

	return null
}

export async function processFiles(pattern: string, fn: ((_p0: string) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	// Test case 4: Anonymous function type parameter (for comparison)
	// This should also have ! operator when called
	return fn!(pattern)
}

export async function multiCallback(walkFn: ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null, processFn: ((_p0: string) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	// Test case 5: Multiple function parameters
	// Both should generate ! operators
	{
		let err = (__goscriptAwait = walkFn!("test", null, null), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (err != null) {
			return err
		}
	}
	return processFn!("test")
}

export async function indexedCallback(cbs: $.Slice<((_p0: string) => boolean | globalThis.Promise<boolean>) | null>, value: string): globalThis.Promise<boolean> {
	return $.plainSliceIndex(cbs!, 0)!(value)
}

export async function useMorphism(m: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null, s: Shape | null): globalThis.Promise<number> {
	return (__goscriptAwait = $.pointerValue<Exclude<Shape, null>>((__goscriptAwait = m!(s), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).Stats(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
}

export async function newMorphismHolder(m: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null): globalThis.Promise<MorphismHolder | $.VarRef<MorphismHolder> | null> {
	return new MorphismHolder(false, m)
}

export async function cloneMorphism(m: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null): globalThis.Promise<MorphismHolder | $.VarRef<MorphismHolder> | null> {
	return new MorphismHolder(false, m)
}

export async function main(): globalThis.Promise<void> {
	let fs = new MockFilesystem()
	let fileInfo = new MockFileInfo(false, "test.txt", 50n, false)

	// Test the walk function with custom WalkFunc
	let walkFunc = $.functionValue(async (path: string, info: FileInfo | null, err: $.GoError): globalThis.Promise<$.GoError> => {
		if (info != null) {
			await $.println("Walking:", path, "size:", (__goscriptAwait = (info !== null && (info as any).__isVarRef !== true && ((info as any).__goValue === undefined || (info as any).__goType?.charCodeAt(0) !== 42) ? (info as Exclude<FileInfo, null>) : $.pointerValue<Exclude<FileInfo, null>>(info)).Size(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		}
		if (err != null) {
			await $.println("Error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string"), "main.FileInfo", "error"], results: ["error"] } as $.FunctionTypeInfo))

	let err = await walkWithCustomFunc($.interfaceValue<Filesystem | null>(fs, "*main.MockFilesystem", /* @__PURE__ */ $.pointerType("main.MockFilesystem")), "/test", $.interfaceValue<FileInfo | null>(fileInfo, "*main.MockFileInfo", /* @__PURE__ */ $.pointerType("main.MockFileInfo")), walkFunc)
	if (err != null) {
		await $.println("Walk error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	}

	// Test with processFiles
	let processFunc = $.functionValue(async (pattern: string): globalThis.Promise<$.GoError> => {
		await $.println("Processing pattern:", pattern)
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: ["error"] } as $.FunctionTypeInfo))

	let err2 = await processFiles("*.go", processFunc)
	if (err2 != null) {
		await $.println("Process error:", (__goscriptAwait = (err2 !== null && (err2 as any).__isVarRef !== true && ((err2 as any).__goValue === undefined || (err2 as any).__goType?.charCodeAt(0) !== 42) ? (err2 as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err2)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	}

	// Test with multiCallback
	let err3 = await multiCallback(walkFunc, processFunc)
	if (err3 != null) {
		await $.println("Multi callback error:", (__goscriptAwait = (err3 !== null && (err3 as any).__isVarRef !== true && ((err3 as any).__goValue === undefined || (err3 as any).__goType?.charCodeAt(0) !== 42) ? (err3 as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err3)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	}

	await indexedCallback($.arrayToSlice<((_p0: string) => boolean | globalThis.Promise<boolean>) | null>([$.functionValue(async (value: string): globalThis.Promise<boolean> => {
		await $.println("Indexed callback:", value)
		return true
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))]), "slice")

	let worker = new morphismWorker(false, $.makeChannel<boolean>(1, false, "both"))
	let shape = new shapeNode(false, 7)
	await $.println("Named morphism:", await useMorphism($.functionValue(((__receiver) => (s: Shape | null) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as morphismWorker).lookup(s) : morphismWorker.prototype.lookup.call(__receiver, s)))(worker), ({ kind: $.TypeKind.Function, params: ["main.Shape"], results: ["main.Shape"] } as $.FunctionTypeInfo), "main.(*morphismWorker).lookup-fm"), $.interfaceValue<Shape | null>(shape, "*main.shapeNode", /* @__PURE__ */ $.pointerType("main.shapeNode"))))
	let holder = await newMorphismHolder($.functionValue(((__receiver) => (s: Shape | null) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as morphismWorker).lookup(s) : morphismWorker.prototype.lookup.call(__receiver, s)))(worker), ({ kind: $.TypeKind.Function, params: ["main.Shape"], results: ["main.Shape"] } as $.FunctionTypeInfo), "main.(*morphismWorker).lookup-fm"))
	await $.println("Field morphism:", await (holder !== null && (holder as any).__isVarRef !== true && (holder as any).__goValue === undefined ? ((holder as any) as MorphismHolder).apply($.interfaceValue<Shape | null>(shape, "*main.shapeNode", /* @__PURE__ */ $.pointerType("main.shapeNode"))) : MorphismHolder.prototype.apply.call(holder, $.interfaceValue<Shape | null>(shape, "*main.shapeNode", /* @__PURE__ */ $.pointerType("main.shapeNode")))))
	await $.println("Cloned field morphism:", await (holder !== null && (holder as any).__isVarRef !== true && (holder as any).__goValue === undefined ? ((holder as any) as MorphismHolder).cloneApply($.interfaceValue<Shape | null>(shape, "*main.shapeNode", /* @__PURE__ */ $.pointerType("main.shapeNode"))) : MorphismHolder.prototype.cloneApply.call(holder, $.interfaceValue<Shape | null>(shape, "*main.shapeNode", /* @__PURE__ */ $.pointerType("main.shapeNode")))))
	$.pointerValue<morphismWorker>(worker).ready!.close()
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
