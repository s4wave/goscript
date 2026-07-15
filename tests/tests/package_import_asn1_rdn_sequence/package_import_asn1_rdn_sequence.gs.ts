// Generated file based on package_import_asn1_rdn_sequence.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/encoding/asn1/index.js"

export async function main(): globalThis.Promise<void> {
	let input: pkix.RDNSequence = ($.arrayToSlice<pkix.RelativeDistinguishedNameSET>([($.arrayToSlice<pkix.AttributeTypeAndValue>([$.markAsStructValue(new pkix.AttributeTypeAndValue({Type: ($.arrayToSlice<number>([2, 5, 4, 3]) as asn1.ObjectIdentifier), Value: "goscript"}))]) as pkix.RelativeDistinguishedNameSET)]) as pkix.RDNSequence)
	let __goscriptTuple0: any = await asn1.Marshal($.namedValueInterfaceValue<any>(input, "pkix.RDNSequence", {String: (receiver: any, ...args: any[]) => (pkix.RDNSequence_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
	let der: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	$.println("marshal err nil", err == null)
	$.println("der len", $.len(der))

	let output: $.VarRef<pkix.RDNSequence> = $.varRef(null as pkix.RDNSequence)
	let __goscriptTuple1: any = await asn1.Unmarshal(der, $.namedValueInterfaceValue<any>(output, "*pkix.RDNSequence", {String: (receiver: any, ...args: any[]) => (pkix.RDNSequence_String as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } } }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
	let rest: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	$.println("unmarshal err nil", err == null)
	$.println("rest len", $.len(rest))
	$.println("rdn count", $.len((output.value as pkix.RDNSequence)))
	$.println("set count", $.len(($.arrayIndex(output.value!, 0) as pkix.RelativeDistinguishedNameSET)))
	$.println("oid", asn1.ObjectIdentifier_String($.arrayIndex($.arrayIndex(output.value!, 0)!, 0).Type))
	$.println("value", $.mustTypeAssert<string>($.arrayIndex($.arrayIndex(output.value!, 0)!, 0).Value, { kind: $.TypeKind.Basic, name: "string" }))
}

if ($.isMainScript(import.meta)) {
	await main()
}
