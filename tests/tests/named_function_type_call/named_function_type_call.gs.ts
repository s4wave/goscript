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

	public _fields: {
		name: string
		size: bigint
		isDir: boolean
	}

	constructor(init?: Partial<{name?: string, size?: bigint, isDir?: boolean}>) {
		this._fields = {
			name: init?.name ?? ("" as string),
			size: init?.size ?? (0n as bigint),
			isDir: init?.isDir ?? (false as boolean)
		}
	}

	public clone(): MockFileInfo {
		return $.markAsStructValue(new MockFileInfo(this))
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

	static {
		$.bindStructFields(this.prototype, ["name", "size", "isDir"])
	}

	static __typeInfo = $.registerStructType(
		"main.MockFileInfo",
		() => new MockFileInfo(),
		() => [{ name: "IsDir", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "Size", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int64") }] }],
		MockFileInfo,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }, { name: "size", key: "size", type: /* @__PURE__ */ $.basicType("int64") }, { name: "isDir", key: "isDir", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export class MockFilesystem {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MockFilesystem {
		return $.markAsStructValue(new MockFilesystem(this))
	}

	public ReadDir(path: string): [$.Slice<FileInfo | null>, $.GoError] {
		const m: MockFilesystem | $.VarRef<MockFilesystem> | null = this;
		return [$.arrayToSlice<FileInfo | null>([$.interfaceValue<FileInfo | null>(new MockFileInfo({name: "file1.txt", size: 100n, isDir: false}), "*main.MockFileInfo", /* @__PURE__ */ $.pointerType("main.MockFileInfo")), $.interfaceValue<FileInfo | null>(new MockFileInfo({name: "subdir", size: 0n, isDir: true}), "*main.MockFileInfo", /* @__PURE__ */ $.pointerType("main.MockFileInfo"))]), null]
	}

	static __typeInfo = $.registerStructType(
		"main.MockFilesystem",
		() => new MockFilesystem(),
		() => [{ name: "ReadDir", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType("main.FileInfo") }, { type: "error" }] }],
		MockFilesystem,
		() => []
	)
}

export class shapeNode {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): shapeNode {
		return $.markAsStructValue(new shapeNode(this))
	}

	public Stats(): number {
		const s: shapeNode | $.VarRef<shapeNode> | null = this;
		return $.pointerValue<shapeNode>(s).value
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.shapeNode",
		() => new shapeNode(),
		() => [{ name: "Stats", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		shapeNode,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class MorphismHolder {
	public declare morphism: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null

	public _fields: {
		morphism: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null
	}

	constructor(init?: Partial<{morphism?: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null}>) {
		this._fields = {
			morphism: init?.morphism ?? (null! as ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null)
		}
	}

	public clone(): MorphismHolder {
		return $.markAsStructValue(new MorphismHolder(this))
	}

	public async apply(s: Shape | null): globalThis.Promise<number> {
		const h: MorphismHolder | $.VarRef<MorphismHolder> | null = this;
		return $.pointerValue<Exclude<Shape, null>>((await $.pointerValue<MorphismHolder>(h).morphism!(s))).Stats()
	}

	public async cloneApply(s: Shape | null): globalThis.Promise<number> {
		const h: MorphismHolder | $.VarRef<MorphismHolder> | null = this;
		return $.pointerValue<Exclude<Shape, null>>((await $.pointerValue<MorphismHolder>(cloneMorphism($.pointerValue<MorphismHolder>(h).morphism)).morphism!(s))).Stats()
	}

	static {
		$.bindStructFields(this.prototype, ["morphism"])
	}

	static __typeInfo = $.registerStructType(
		"main.MorphismHolder",
		() => new MorphismHolder(),
		() => [{ name: "apply", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "cloneApply", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		MorphismHolder,
		() => [{ name: "morphism", key: "morphism", type: ({ kind: $.TypeKind.Function, name: "main.Morphism", params: ["main.Shape"], results: ["main.Shape"] } as $.FunctionTypeInfo) }]
	)
}

export class morphismWorker {
	public declare ready: $.Channel<boolean> | null

	public _fields: {
		ready: $.Channel<boolean> | null
	}

	constructor(init?: Partial<{ready?: $.Channel<boolean> | null}>) {
		this._fields = {
			ready: init?.ready ?? (null! as $.Channel<boolean> | null)
		}
	}

	public clone(): morphismWorker {
		return $.markAsStructValue(new morphismWorker(this))
	}

	public async lookup(s: Shape | null): globalThis.Promise<Shape | null> {
		const w: morphismWorker | $.VarRef<morphismWorker> | null = this;
		await $.chanSend($.pointerValue<morphismWorker>(w).ready, true)
		await $.chanRecv($.pointerValue<morphismWorker>(w).ready)
		return s
	}

	static {
		$.bindStructFields(this.prototype, ["ready"])
	}

	static __typeInfo = $.registerStructType(
		"main.morphismWorker",
		() => new morphismWorker(),
		() => [{ name: "lookup", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "main.Shape" }] }],
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
		let err = await walkFn!(path, info, null)
		if ((err != null) && (!$.comparableEqual(err, filepath.SkipDir))) {
			return err
		}
	}

	// Test case 2: Call with variable error
	let walkErr: $.GoError = null
	// This should also generate: walkFn!(path, info, walkErr)
	{
		let err = await walkFn!(path, info, walkErr)
		if ((err != null) && (!$.comparableEqual(err, filepath.SkipDir))) {
			return err
		}
	}

	// Test case 3: Call in if statement condition
	// This should generate: walkFn!(path, info, nil)
	if (await walkFn!(path, info, null) != null) {
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
		let err = await walkFn!("test", null, null)
		if (err != null) {
			return err
		}
	}
	return processFn!("test")
}

export async function indexedCallback(cbs: $.Slice<((_p0: string) => boolean | globalThis.Promise<boolean>) | null>, value: string): globalThis.Promise<boolean> {
	return $.arrayIndex(cbs!, 0)!(value)
}

export async function useMorphism(m: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null, s: Shape | null): globalThis.Promise<number> {
	return $.pointerValue<Exclude<Shape, null>>((await m!(s))).Stats()
}

export async function newMorphismHolder(m: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null): globalThis.Promise<MorphismHolder | $.VarRef<MorphismHolder> | null> {
	return new MorphismHolder({morphism: m})
}

export function cloneMorphism(m: Morphism | null): MorphismHolder | $.VarRef<MorphismHolder> | null {
	return new MorphismHolder({morphism: m})
}

export async function main(): globalThis.Promise<void> {
	let fs: MockFilesystem | $.VarRef<MockFilesystem> | null = new MockFilesystem()
	let fileInfo: MockFileInfo | $.VarRef<MockFileInfo> | null = new MockFileInfo({name: "test.txt", size: 50n, isDir: false})

	// Test the walk function with custom WalkFunc
	let walkFunc: ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue(async (path: string, info: FileInfo | null, err: $.GoError): globalThis.Promise<$.GoError> => {
		if (info != null) {
			await $.println("Walking:", path, "size:", await $.pointerValue<Exclude<FileInfo, null>>(info).Size())
		}
		if (err != null) {
			await $.println("Error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string"), "main.FileInfo", "error"], results: ["error"] } as $.FunctionTypeInfo))

	let err = await walkWithCustomFunc($.interfaceValue<Filesystem | null>(fs, "*main.MockFilesystem", /* @__PURE__ */ $.pointerType("main.MockFilesystem")), "/test", $.interfaceValue<FileInfo | null>(fileInfo, "*main.MockFileInfo", /* @__PURE__ */ $.pointerType("main.MockFileInfo")), walkFunc)
	if (err != null) {
		await $.println("Walk error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}

	// Test with processFiles
	let processFunc: ((pattern: string) => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue(async (pattern: string): globalThis.Promise<$.GoError> => {
		await $.println("Processing pattern:", pattern)
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: ["error"] } as $.FunctionTypeInfo))

	let err2 = await processFiles("*.go", processFunc)
	if (err2 != null) {
		await $.println("Process error:", await $.pointerValue<Exclude<$.GoError, null>>(err2).Error())
	}

	// Test with multiCallback
	let err3 = await multiCallback(walkFunc, processFunc)
	if (err3 != null) {
		await $.println("Multi callback error:", await $.pointerValue<Exclude<$.GoError, null>>(err3).Error())
	}

	await indexedCallback($.arrayToSlice<((_p0: string) => boolean | globalThis.Promise<boolean>) | null>([$.functionValue(async (value: string): globalThis.Promise<boolean> => {
		await $.println("Indexed callback:", value)
		return true
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))]), "slice")

	let worker: morphismWorker | $.VarRef<morphismWorker> | null = new morphismWorker({ready: $.makeChannel<boolean>(1, false, "both")})
	let shape: shapeNode | $.VarRef<shapeNode> | null = new shapeNode({value: 7})
	await $.println("Named morphism:", await useMorphism($.functionValue(((__receiver) => (s: Shape | null) => __receiver.lookup(s))($.pointerValue<morphismWorker>(worker)), ({ kind: $.TypeKind.Function, params: ["main.Shape"], results: ["main.Shape"] } as $.FunctionTypeInfo)), $.interfaceValue<Shape | null>(shape, "*main.shapeNode", /* @__PURE__ */ $.pointerType("main.shapeNode"))))
	let holder: MorphismHolder | $.VarRef<MorphismHolder> | null = await newMorphismHolder($.functionValue(((__receiver) => (s: Shape | null) => __receiver.lookup(s))($.pointerValue<morphismWorker>(worker)), ({ kind: $.TypeKind.Function, params: ["main.Shape"], results: ["main.Shape"] } as $.FunctionTypeInfo)))
	await $.println("Field morphism:", await MorphismHolder.prototype.apply.call(holder, $.interfaceValue<Shape | null>(shape, "*main.shapeNode", /* @__PURE__ */ $.pointerType("main.shapeNode"))))
	await $.println("Cloned field morphism:", await MorphismHolder.prototype.cloneApply.call(holder, $.interfaceValue<Shape | null>(shape, "*main.shapeNode", /* @__PURE__ */ $.pointerType("main.shapeNode"))))
	$.pointerValue<morphismWorker>(worker).ready!.close()
}

if ($.isMainScript(import.meta)) {
	await main()
}
