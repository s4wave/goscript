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
	await fmt.Print("Hello")
	await fmt.Print(" ")
	await fmt.Print("World")
	await fmt.Println()

	// Test Printf with basic formatting
	let name = "Go"
	let version = 1.21
	await fmt.Printf("Welcome to %s %.2f\n", name, $.basicInterfaceValue(version, "float64"))

	// Test Println
	await fmt.Println("This is println")

	// Test Sprint functions
	let result = await fmt.Sprint("Sprint", " ", "result")
	await fmt.Println("Sprint result:", result)
	let parts: $.Slice<any> = $.arrayToSlice<any>(["Spread", " ", "result"])
	let spreadResult = await fmt.Sprint(...(parts ?? []))
	await fmt.Println("Sprint spread result:", spreadResult)

	// Test Sprintf
	let formatted = await fmt.Sprintf("Number: %d, String: %s", $.basicInterfaceValue(42, "int"), "test")
	await fmt.Println("Sprintf result:", formatted)
	let formatArgs: $.Slice<any> = $.arrayToSlice<any>([$.basicInterfaceValue(7, "int"), "spread"])
	let formattedSpread = await fmt.Sprintf("Spread Number: %d, String: %s", ...(formatArgs ?? []))
	await fmt.Println("Sprintf spread result:", formattedSpread)

	// Test Sprintln
	let sprintln_result = await fmt.Sprintln("Sprintln", "result")
	await fmt.Print("Sprintln result:", sprintln_result)

	// Test Errorf
	let err = fmt.Errorf("error code: %d", $.basicInterfaceValue(404, "int"))
	await fmt.Println("Error:", (err as any))

	// Test various format verbs
	await fmt.Printf("Boolean: %t\n", true)
	await fmt.Printf("Integer: %d\n", $.basicInterfaceValue(123, "int"))
	await fmt.Printf("Float: %f\n", $.basicInterfaceValue(3.14159, "float64"))
	await fmt.Printf("String: %s\n", "hello")
	await fmt.Printf("Type: %T\n", $.basicInterfaceValue(42, "int"))
	await fmt.Printf("Value: %v\n", $.interfaceValue($.arrayToSlice<number>([1, 2, 3]), "[]int", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }))

	// Test width and precision
	await fmt.Printf("Width: '%5s'\n", "hi")
	await fmt.Printf("Precision: '%.2f'\n", $.basicInterfaceValue(3.14159, "float64"))
	await fmt.Printf("Both: '%5.2f'\n", $.basicInterfaceValue(3.14159, "float64"))
	await fmt.Printf("Formatter: %v\n", $.interfaceValue($.markAsStructValue(new byteFormatter({prefix: new Uint8Array([98, 121, 116, 101, 45])})), "main.byteFormatter", "main.byteFormatter"))
	let appended: $.Slice<number> = await fmt.Append(new Uint8Array([98, 97, 115, 101, 45]), "tail")
	await fmt.Println("Append bytes:", $.bytesToString(appended))
	let buf: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	await fmt.Fprintln($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer", { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" }))!, "Buffered writer")
	await fmt.Print(buf.value.String())

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
