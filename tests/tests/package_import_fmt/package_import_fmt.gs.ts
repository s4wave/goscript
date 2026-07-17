// Generated file based on package_import_fmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fmt from "@goscript/fmt/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/fmt/index.js"

export class byteFormatter {
	public get prefix(): $.Slice<number> {
		return this._fields.prefix.value
	}
	public set prefix(value: $.Slice<number>) {
		this._fields.prefix.value = value
	}

	public _fields: {
		prefix: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{prefix?: $.Slice<number>}>) {
		this._fields = {
			prefix: $.varRef(init?.prefix ?? (null! as $.Slice<number>))
		}
	}

	public clone(): byteFormatter {
		const cloned = new byteFormatter()
		cloned._fields = {
			prefix: $.varRef(this._fields.prefix.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Format(state: fmt.State | null, verb: number): globalThis.Promise<void> {
		const b = this
		let buf: $.Slice<number> = $.appendSlice(new Uint8Array([]) as $.Slice<number>, b.prefix, $.byteSliceHint)
		buf = $.append(buf, $.uint($.uint(verb, 8), 8), $.byteSliceHint)
		await $.pointerValue<Exclude<fmt.State, null>>(state).Write(buf)
	}

	static __typeInfo = $.registerStructType(
		"main.byteFormatter",
		() => new byteFormatter(),
		[{ name: "Format", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		byteFormatter,
		[{ name: "prefix", key: "prefix", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Test basic Print functions
	fmt.Print("Hello")
	fmt.Print(" ")
	fmt.Print("World")
	fmt.Println()

	// Test Printf with basic formatting
	let name = "Go"
	let version = 1.21
	fmt.Printf("Welcome to %s %.2f\n", name, $.basicInterfaceValue(version, "float64"))

	// Test Println
	fmt.Println("This is println")

	// Test Sprint functions
	let result = fmt.Sprint("Sprint", " ", "result")
	fmt.Println("Sprint result:", result)
	let parts: $.Slice<any> = $.arrayToSlice<any>(["Spread", " ", "result"])
	let spreadResult = fmt.Sprint(...(parts ?? []))
	fmt.Println("Sprint spread result:", spreadResult)

	// Test Sprintf
	let formatted = await fmt.Sprintf("Number: %d, String: %s", $.basicInterfaceValue(42, "int"), "test")
	fmt.Println("Sprintf result:", formatted)
	let formatArgs: $.Slice<any> = $.arrayToSlice<any>([$.basicInterfaceValue(7, "int"), "spread"])
	let formattedSpread = await fmt.Sprintf("Spread Number: %d, String: %s", ...(formatArgs ?? []))
	fmt.Println("Sprintf spread result:", formattedSpread)

	// Test Sprintln
	let sprintln_result = fmt.Sprintln("Sprintln", "result")
	fmt.Print("Sprintln result:", sprintln_result)

	// Test Errorf
	let err = fmt.Errorf("error code: %d", $.basicInterfaceValue(404, "int"))
	fmt.Println("Error:", (err as any))

	// Test various format verbs
	fmt.Printf("Boolean: %t\n", true)
	fmt.Printf("Integer: %d\n", $.basicInterfaceValue(123, "int"))
	fmt.Printf("Float: %f\n", $.basicInterfaceValue(3.14159, "float64"))
	fmt.Printf("String: %s\n", "hello")
	fmt.Printf("Type: %T\n", $.basicInterfaceValue(42, "int"))
	fmt.Printf("Value: %v\n", $.interfaceValue<any>($.arrayToSlice<number>([1, 2, 3]), "[]int", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }))

	// Test width and precision
	fmt.Printf("Width: '%5s'\n", "hi")
	fmt.Printf("Precision: '%.2f'\n", $.basicInterfaceValue(3.14159, "float64"))
	fmt.Printf("Both: '%5.2f'\n", $.basicInterfaceValue(3.14159, "float64"))
	fmt.Printf("Formatter: %v\n", $.interfaceValue<any>($.markAsStructValue(new byteFormatter({prefix: new Uint8Array([98, 121, 116, 101, 45])})), "main.byteFormatter", "main.byteFormatter"))
	let appended: $.Slice<number> = fmt.Append(new Uint8Array([98, 97, 115, 101, 45]), "tail")
	fmt.Println("Append bytes:", $.bytesToString(appended))
	let buf: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	await fmt.Fprintln($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer", { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" }))!, "Buffered writer")
	fmt.Print(buf.value.String())

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
