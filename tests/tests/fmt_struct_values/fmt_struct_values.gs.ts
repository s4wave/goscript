// Generated file based on fmt_struct_values.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as strings from "@goscript/strings/index.js"
import * as logrus from "@goscript/github.com/sirupsen/logrus/index.js"
import type * as io from "@goscript/io/index.js"

export class Inner {
	// Ready is included even when it is false.
	public declare Ready: boolean

	constructor(__goscriptValue?: boolean, Ready$?: boolean) {
		this.Ready = Ready$ ?? false
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Inner {
		return new Inner(true, this.Ready)
	}

	public __goscriptAssign(source: Inner): this {
		this.Ready = source.Ready
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Inner",
		() => new Inner(),
		() => [],
		Inner,
		() => [/* @__PURE__ */ $.structField("Ready", /* @__PURE__ */ $.basicType("bool"), [0], 0, true)]
	)
}

export class Record {
	// Count is the numeric field.
	public declare Count: number

	// name is visible to formatting despite being unexported.
	public declare name: string

	// Inner is a nested value.
	public declare Inner: Inner

	constructor(__goscriptValue?: boolean, Count$?: number, name$?: string, Inner$?: Inner) {
		this.Count = Count$ ?? 0
		this.name = name$ ?? ""
		this.Inner = Inner$ ?? new Inner(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Record {
		return new Record(true, this.Count, this.name, this.Inner.clone())
	}

	public __goscriptAssign(source: Record): this {
		this.Count = source.Count
		this.name = source.name
		this.Inner.__goscriptAssign(source.Inner)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Record",
		() => new Record(),
		() => [],
		Record,
		() => [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("name", /* @__PURE__ */ $.basicType("string"), [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/fmt_struct_values" }), /* @__PURE__ */ $.structField("Inner", "main.Inner", [2], 24, true)]
	)
}

export class Pointers {
	// Value points to a scalar, which formats as an address.
	public declare Value: $.VarRef<number> | null

	// Next can point back to this record.
	public declare Next: Pointers | $.VarRef<Pointers> | null

	// Dynamic holds a pointer behind an interface.
	public declare Dynamic: any

	constructor(__goscriptValue?: boolean, Value$?: $.VarRef<number> | null, Next$?: Pointers | $.VarRef<Pointers> | null, Dynamic$?: any) {
		this.Value = Value$ ?? (null! as $.VarRef<number> | null)
		this.Next = Next$ ?? (null! as Pointers | $.VarRef<Pointers> | null)
		this.Dynamic = Dynamic$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Pointers {
		return new Pointers(true, this.Value, this.Next, this.Dynamic)
	}

	public __goscriptAssign(source: Pointers): this {
		this.Value = source.Value
		this.Next = source.Next
		this.Dynamic = $.assignFieldValue(this.Dynamic, source.Dynamic)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Pointers",
		() => new Pointers(),
		() => [],
		Pointers,
		() => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")), [0], 0, true), /* @__PURE__ */ $.structField("Next", /* @__PURE__ */ $.pointerType("main.Pointers"), [1], 8, true), /* @__PURE__ */ $.structField("Dynamic", { kind: $.TypeKind.Interface, methods: [] }, [2], 16, true)]
	)
}

export class Node {
	public declare Name: string

	public declare Parent: Node | $.VarRef<Node> | null

	public declare Kids: $.Slice<Node | $.VarRef<Node> | null>

	constructor(__goscriptValue?: boolean, Name$?: string, Parent$?: Node | $.VarRef<Node> | null, Kids$?: $.Slice<Node | $.VarRef<Node> | null>) {
		this.Name = Name$ ?? ""
		this.Parent = Parent$ ?? (null! as Node | $.VarRef<Node> | null)
		this.Kids = Kids$ ?? (null! as $.Slice<Node | $.VarRef<Node> | null>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Node {
		return new Node(true, this.Name, this.Parent, this.Kids)
	}

	public __goscriptAssign(source: Node): this {
		this.Name = source.Name
		this.Parent = source.Parent
		this.Kids = source.Kids
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Node",
		() => new Node(),
		() => [],
		Node,
		() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("Parent", /* @__PURE__ */ $.pointerType("main.Node"), [1], 16, true), /* @__PURE__ */ $.structField("Kids", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Node")), [2], 24, true)]
	)
}

export class Base {
	public declare Windows: $.Slice<any>

	public declare Active: any

	constructor(__goscriptValue?: boolean, Windows$?: $.Slice<any>, Active$?: any) {
		this.Windows = Windows$ ?? (null! as $.Slice<any>)
		this.Active = Active$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Base {
		return $.copyGenericInstance(this, new Base(true, this.Windows, $.copyElement(this.Active)))
	}

	public __goscriptAssign(source: Base): this {
		this.Windows = source.Windows
		this.Active = $.assignFieldValue(this.Active, source.Active)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Base",
		() => new Base(),
		() => [],
		Base,
		() => [/* @__PURE__ */ $.structField("Windows", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }), [0], 0, true), /* @__PURE__ */ $.structField("Active", { kind: $.TypeKind.Interface, methods: [] }, [1], 0, true)]
	)
}

export class App {
	public declare Base: Base

	public declare Name: string

	constructor(__goscriptValue?: boolean, Base$?: Base, Name$?: string) {
		this.Base = Base$ ?? new Base(true, undefined, null! as Win | $.VarRef<Win> | null)
		this.Name = Name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): App {
		return new App(true, this.Base.clone(), this.Name)
	}

	public __goscriptAssign(source: App): this {
		this.Base.__goscriptAssign(source.Base)
		this.Name = source.Name
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.App",
		() => new App(),
		() => [],
		App,
		() => [/* @__PURE__ */ $.structField("Base", /* @__PURE__ */ $.genericStructType("main.Base", "main.Base[*main.Win]", () => [/* @__PURE__ */ $.structField("Windows", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Win")), [0], 0, true), /* @__PURE__ */ $.structField("Active", /* @__PURE__ */ $.pointerType("main.Win"), [1], 24, true)]), [0], 0, true, { anonymous: true }), /* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [1], 32, true)]
	)
}

export class Win {
	public declare App: App | $.VarRef<App> | null

	public declare Title: string

	constructor(__goscriptValue?: boolean, App$?: App | $.VarRef<App> | null, Title$?: string) {
		this.App = App$ ?? (null! as App | $.VarRef<App> | null)
		this.Title = Title$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Win {
		return new Win(true, this.App, this.Title)
	}

	public __goscriptAssign(source: Win): this {
		this.App = source.App
		this.Title = source.Title
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Win",
		() => new Win(),
		() => [],
		Win,
		() => [/* @__PURE__ */ $.structField("App", /* @__PURE__ */ $.pointerType("main.App"), [0], 0, true), /* @__PURE__ */ $.structField("Title", /* @__PURE__ */ $.basicType("string"), [1], 8, true)]
	)
}

export async function main(): globalThis.Promise<void> {
	let value = $.varRef(new Record(true, 3, "hello", new Inner(true, true)))
	await $.println((fmt.Sprintf("%v", $.structInterfaceValue((value.value).clone(), "main.Record", "main.Record")) as string))
	await $.println((fmt.Sprintf("%+v", $.structInterfaceValue((value.value).clone(), "main.Record", "main.Record")) as string))
	await $.println((fmt.Sprintf("%v", $.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))) as string))
	await $.println((fmt.Sprintf("%+v", $.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))) as string))
	await $.println((fmt.Sprint($.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))) as string))
	await $.println((fmt.Sprintf("%#v", $.structInterfaceValue((value.value).clone(), "main.Record", "main.Record")) as string))
	await $.println((fmt.Sprintf("%#v", $.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))) as string))

	let anonymous = $.varRef($.anonymousStructValue({Count: 4}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true)] }))
	await $.println((fmt.Sprintf("%v", $.interfaceValue($.markAsStructValue($.cloneStructValue(anonymous.value)), "struct{Count int}", { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true)] })) as string))
	await $.println((fmt.Sprintf("%+v", $.interfaceValue($.markAsStructValue($.cloneStructValue(anonymous.value)), "struct{Count int}", { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true)] })) as string))
	await $.println((fmt.Sprintf("%v", $.interfaceValue(anonymous, "*struct{Count int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true)] }))) as string))
	await $.println((fmt.Sprintf("%+v", $.interfaceValue(anonymous, "*struct{Count int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true)] }))) as string))

	// Addresses differ across runtimes; their identity and surrounding text agree.
	let count = $.varRef(7)
	let pointers = $.varRef(new Pointers(true, count))
	pointers.value.Next = pointers
	pointers.value.Dynamic = $.interfaceValue(pointers, "*main.Pointers", /* @__PURE__ */ $.pointerType("main.Pointers"))
	let text = await fmt.Sprintf("%+v", $.interfaceValue(pointers, "*main.Pointers", /* @__PURE__ */ $.pointerType("main.Pointers")))
	text = strings.ReplaceAll(text, (fmt.Sprintf("%p", $.interfaceValue(count, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))) as string), "<scalar>")
	text = strings.ReplaceAll(text, await fmt.Sprintf("%p", $.interfaceValue(pointers, "*main.Pointers", /* @__PURE__ */ $.pointerType("main.Pointers"))), "<self>")
	await $.println(text)

	// Pointers nested in slices and struct cycles print as addresses.
	let root = new Node(false, "root")
	let root$: Node = root == null ? $.pointerTarget<Node>(root) : (root as any).__isVarRef === true ? (root as any).value : (root as any).__goValue === undefined ? (root as any) : $.pointerTarget<Node>(root)
	let kid = new Node(false, "kid", root);
	;(root$ as Node).Kids = $.appendOne((root$ as Node).Kids, kid, $.appendZeros.nil)
	let app = new App(false, undefined, "app")
	let app$: App = app == null ? $.pointerTarget<App>(app) : (app as any).__isVarRef === true ? (app as any).value : (app as any).__goValue === undefined ? (app as any) : $.pointerTarget<App>(app)
	let win = new Win(false, app, "main");
	;(app$ as App).Base.Windows = $.appendOne((app$ as App).Base.Windows, win, $.appendZeros.nil);
	;(app$ as App).Base.Active = win
	let names = strings.NewReplacer((fmt.Sprintf("%p", $.interfaceValue(root, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))) as string), "<root>", (fmt.Sprintf("%p", $.interfaceValue(kid, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))) as string), "<kid>", (fmt.Sprintf("%p", $.interfaceValue(app, "*main.App", /* @__PURE__ */ $.pointerType("main.App"))) as string), "<app>", (fmt.Sprintf("%p", $.interfaceValue(win, "*main.Win", /* @__PURE__ */ $.pointerType("main.Win"))) as string), "<win>")
	await $.println((names !== null && (names as any).__isVarRef !== true && (names as any).__goValue === undefined ? ((names as any) as strings.Replacer).Replace((fmt.Sprint($.interfaceValue(root, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))) as string)) : strings.Replacer.prototype.Replace.call($.pointerValue<strings.Replacer>(names), (fmt.Sprint($.interfaceValue(root, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))) as string))))
	await $.println((names !== null && (names as any).__isVarRef !== true && (names as any).__goValue === undefined ? ((names as any) as strings.Replacer).Replace((fmt.Sprintf("%+v", $.interfaceValue(kid, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))) as string)) : strings.Replacer.prototype.Replace.call($.pointerValue<strings.Replacer>(names), (fmt.Sprintf("%+v", $.interfaceValue(kid, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))) as string))))
	await $.println((names !== null && (names as any).__isVarRef !== true && (names as any).__goValue === undefined ? ((names as any) as strings.Replacer).Replace((fmt.Sprint($.interfaceValue(win, "*main.Win", /* @__PURE__ */ $.pointerType("main.Win"))) as string)) : strings.Replacer.prototype.Replace.call($.pointerValue<strings.Replacer>(names), (fmt.Sprint($.interfaceValue(win, "*main.Win", /* @__PURE__ */ $.pointerType("main.Win"))) as string))))
	await $.println((names !== null && (names as any).__isVarRef !== true && (names as any).__goValue === undefined ? ((names as any) as strings.Replacer).Replace((fmt.Sprint($.interfaceValue(app, "*main.App", /* @__PURE__ */ $.pointerType("main.App"))) as string)) : strings.Replacer.prototype.Replace.call($.pointerValue<strings.Replacer>(names), (fmt.Sprint($.interfaceValue(app, "*main.App", /* @__PURE__ */ $.pointerType("main.App"))) as string))))

	// Exercise the same log field formatting used by controller shutdown warnings.
	let output = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let logger = logrus.New()
	await (logger !== null && (logger as any).__isVarRef !== true && (logger as any).__goValue === undefined ? ((logger as any) as logrus.Logger).SetOutput($.interfaceValue<io.Writer | null>(output, "*bytes.Buffer", __goscriptStatic0())) : logrus.Logger.prototype.SetOutput.call(logger, $.interfaceValue<io.Writer | null>(output, "*bytes.Buffer", __goscriptStatic0())))
	await logrus.Logger.prototype.SetFormatter.call(logger, $.interfaceValue<logrus.Formatter | null>(new logrus.TextFormatter(false, undefined, true, undefined, undefined, undefined, true), "*logrus.TextFormatter", /* @__PURE__ */ $.pointerType("logrus.TextFormatter")))
	await logrus.Entry.prototype.Warn.call((logger !== null && (logger as any).__isVarRef !== true && (logger as any).__goValue === undefined ? ((logger as any) as logrus.Logger).WithField("controller", $.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))) : logrus.Logger.prototype.WithField.call(logger, "controller", $.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record")))), $.arrayToSlice<any>(["waiting for controller Execute to return"]))
	await $.println(strings.TrimSpace(output.value.String()))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Buffer"), "bytes.Buffer", () => [$.methodSignature("Available", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("AvailableBuffer", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Next", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Peek", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadBytes", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]], true), $.methodSignature("ReadFrom", [["r", "io.Reader"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true), $.methodSignature("ReadRune", [], [["r", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadString", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.basicType("string")], ["err", "error"]], true), $.methodSignature("Reset", [], [], true), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Truncate", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("Write", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteByte", [["c", /* @__PURE__ */ $.basicType("uint8")]], ["error"], true), $.methodSignature("WriteRune", [["r", /* @__PURE__ */ $.basicType("int32")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteString", [["s", /* @__PURE__ */ $.basicType("string")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

if ($.isMainScript(import.meta)) {
	await main()
}
