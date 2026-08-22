// Generated file based on pkix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import * as hex from "@goscript/encoding/hex/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as big from "@goscript/math/big/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/encoding/hex/index.js"
import "@goscript/fmt/index.js"
import "@goscript/math/big/index.js"
import "@goscript/time/index.js"

export type RDNSequence = $.Slice<RelativeDistinguishedNameSET>

export type RelativeDistinguishedNameSET = $.Slice<AttributeTypeAndValue>

export class AlgorithmIdentifier {
	public get Algorithm(): asn1.ObjectIdentifier {
		return this._fields.Algorithm.value
	}
	public set Algorithm(value: asn1.ObjectIdentifier) {
		this._fields.Algorithm.value = value
	}

	public get Parameters(): asn1.RawValue {
		return this._fields.Parameters.value
	}
	public set Parameters(value: asn1.RawValue) {
		this._fields.Parameters.value = value
	}

	public _fields: {
		Algorithm: $.VarRef<asn1.ObjectIdentifier>
		Parameters: $.VarRef<asn1.RawValue>
	}

	constructor(init?: Partial<{Algorithm?: asn1.ObjectIdentifier, Parameters?: asn1.RawValue}>) {
		this._fields = {
			Algorithm: $.varRef(init?.Algorithm ?? (null! as asn1.ObjectIdentifier)),
			Parameters: $.varRef(init?.Parameters ? $.markAsStructValue($.cloneStructValue(init.Parameters)) : $.markAsStructValue(new asn1.RawValue()))
		}
	}

	public clone(): AlgorithmIdentifier {
		const cloned = new AlgorithmIdentifier()
		cloned._fields = {
			Algorithm: $.varRef(this._fields.Algorithm.value),
			Parameters: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Parameters.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"pkix.AlgorithmIdentifier",
		() => new AlgorithmIdentifier(),
		[],
		AlgorithmIdentifier,
		[{ name: "Algorithm", key: "Algorithm", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, index: [0], offset: 0, exported: true }, { name: "Parameters", key: "Parameters", type: "asn1.RawValue", tag: "asn1:\"optional\"", index: [1], offset: 24, exported: true }]
	)
}

export class AttributeTypeAndValue {
	public get Type(): asn1.ObjectIdentifier {
		return this._fields.Type.value
	}
	public set Type(value: asn1.ObjectIdentifier) {
		this._fields.Type.value = value
	}

	public get Value(): any {
		return this._fields.Value.value
	}
	public set Value(value: any) {
		this._fields.Value.value = value
	}

	public _fields: {
		Type: $.VarRef<asn1.ObjectIdentifier>
		Value: $.VarRef<any>
	}

	constructor(init?: Partial<{Type?: asn1.ObjectIdentifier, Value?: any}>) {
		this._fields = {
			Type: $.varRef(init?.Type ?? (null! as asn1.ObjectIdentifier)),
			Value: $.varRef(init?.Value ?? (null! as any))
		}
	}

	public clone(): AttributeTypeAndValue {
		const cloned = new AttributeTypeAndValue()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value),
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"pkix.AttributeTypeAndValue",
		() => new AttributeTypeAndValue(),
		[],
		AttributeTypeAndValue,
		[{ name: "Type", key: "Type", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, index: [0], offset: 0, exported: true }, { name: "Value", key: "Value", type: { kind: $.TypeKind.Interface, methods: [] }, index: [1], offset: 24, exported: true }]
	)
}

export class AttributeTypeAndValueSET {
	public get Type(): asn1.ObjectIdentifier {
		return this._fields.Type.value
	}
	public set Type(value: asn1.ObjectIdentifier) {
		this._fields.Type.value = value
	}

	public get Value(): $.Slice<$.Slice<AttributeTypeAndValue>> {
		return this._fields.Value.value
	}
	public set Value(value: $.Slice<$.Slice<AttributeTypeAndValue>>) {
		this._fields.Value.value = value
	}

	public _fields: {
		Type: $.VarRef<asn1.ObjectIdentifier>
		Value: $.VarRef<$.Slice<$.Slice<AttributeTypeAndValue>>>
	}

	constructor(init?: Partial<{Type?: asn1.ObjectIdentifier, Value?: $.Slice<$.Slice<AttributeTypeAndValue>>}>) {
		this._fields = {
			Type: $.varRef(init?.Type ?? (null! as asn1.ObjectIdentifier)),
			Value: $.varRef(init?.Value ?? (null! as $.Slice<$.Slice<AttributeTypeAndValue>>))
		}
	}

	public clone(): AttributeTypeAndValueSET {
		const cloned = new AttributeTypeAndValueSET()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value),
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"pkix.AttributeTypeAndValueSET",
		() => new AttributeTypeAndValueSET(),
		[],
		AttributeTypeAndValueSET,
		[{ name: "Type", key: "Type", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, index: [0], offset: 0, exported: true }, { name: "Value", key: "Value", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: "pkix.AttributeTypeAndValue" } }, tag: "asn1:\"set\"", index: [1], offset: 24, exported: true }]
	)
}

export class Extension {
	public get Id(): asn1.ObjectIdentifier {
		return this._fields.Id.value
	}
	public set Id(value: asn1.ObjectIdentifier) {
		this._fields.Id.value = value
	}

	public get Critical(): boolean {
		return this._fields.Critical.value
	}
	public set Critical(value: boolean) {
		this._fields.Critical.value = value
	}

	public get Value(): $.Slice<number> {
		return this._fields.Value.value
	}
	public set Value(value: $.Slice<number>) {
		this._fields.Value.value = value
	}

	public _fields: {
		Id: $.VarRef<asn1.ObjectIdentifier>
		Critical: $.VarRef<boolean>
		Value: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Id?: asn1.ObjectIdentifier, Critical?: boolean, Value?: $.Slice<number>}>) {
		this._fields = {
			Id: $.varRef(init?.Id ?? (null! as asn1.ObjectIdentifier)),
			Critical: $.varRef(init?.Critical ?? (false as boolean)),
			Value: $.varRef(init?.Value ?? (null! as $.Slice<number>))
		}
	}

	public clone(): Extension {
		const cloned = new Extension()
		cloned._fields = {
			Id: $.varRef(this._fields.Id.value),
			Critical: $.varRef(this._fields.Critical.value),
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"pkix.Extension",
		() => new Extension(),
		[],
		Extension,
		[{ name: "Id", key: "Id", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, index: [0], offset: 0, exported: true }, { name: "Critical", key: "Critical", type: { kind: $.TypeKind.Basic, name: "bool" }, tag: "asn1:\"optional\"", index: [1], offset: 24, exported: true }, { name: "Value", key: "Value", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [2], offset: 32, exported: true }]
	)
}

export class Name {
	public get Country(): $.Slice<string> {
		return this._fields.Country.value
	}
	public set Country(value: $.Slice<string>) {
		this._fields.Country.value = value
	}

	public get Organization(): $.Slice<string> {
		return this._fields.Organization.value
	}
	public set Organization(value: $.Slice<string>) {
		this._fields.Organization.value = value
	}

	public get OrganizationalUnit(): $.Slice<string> {
		return this._fields.OrganizationalUnit.value
	}
	public set OrganizationalUnit(value: $.Slice<string>) {
		this._fields.OrganizationalUnit.value = value
	}

	public get Locality(): $.Slice<string> {
		return this._fields.Locality.value
	}
	public set Locality(value: $.Slice<string>) {
		this._fields.Locality.value = value
	}

	public get Province(): $.Slice<string> {
		return this._fields.Province.value
	}
	public set Province(value: $.Slice<string>) {
		this._fields.Province.value = value
	}

	public get StreetAddress(): $.Slice<string> {
		return this._fields.StreetAddress.value
	}
	public set StreetAddress(value: $.Slice<string>) {
		this._fields.StreetAddress.value = value
	}

	public get PostalCode(): $.Slice<string> {
		return this._fields.PostalCode.value
	}
	public set PostalCode(value: $.Slice<string>) {
		this._fields.PostalCode.value = value
	}

	public get SerialNumber(): string {
		return this._fields.SerialNumber.value
	}
	public set SerialNumber(value: string) {
		this._fields.SerialNumber.value = value
	}

	public get CommonName(): string {
		return this._fields.CommonName.value
	}
	public set CommonName(value: string) {
		this._fields.CommonName.value = value
	}

	// Names contains all parsed attributes. When parsing distinguished names,
	// this can be used to extract non-standard attributes that are not parsed
	// by this package. When marshaling to RDNSequences, the Names field is
	// ignored, see ExtraNames.
	public get Names(): $.Slice<AttributeTypeAndValue> {
		return this._fields.Names.value
	}
	public set Names(value: $.Slice<AttributeTypeAndValue>) {
		this._fields.Names.value = value
	}

	// ExtraNames contains attributes to be copied, raw, into any marshaled
	// distinguished names. Values override any attributes with the same OID.
	// The ExtraNames field is not populated when parsing, see Names.
	public get ExtraNames(): $.Slice<AttributeTypeAndValue> {
		return this._fields.ExtraNames.value
	}
	public set ExtraNames(value: $.Slice<AttributeTypeAndValue>) {
		this._fields.ExtraNames.value = value
	}

	public _fields: {
		Country: $.VarRef<$.Slice<string>>
		Organization: $.VarRef<$.Slice<string>>
		OrganizationalUnit: $.VarRef<$.Slice<string>>
		Locality: $.VarRef<$.Slice<string>>
		Province: $.VarRef<$.Slice<string>>
		StreetAddress: $.VarRef<$.Slice<string>>
		PostalCode: $.VarRef<$.Slice<string>>
		SerialNumber: $.VarRef<string>
		CommonName: $.VarRef<string>
		Names: $.VarRef<$.Slice<AttributeTypeAndValue>>
		ExtraNames: $.VarRef<$.Slice<AttributeTypeAndValue>>
	}

	constructor(init?: Partial<{Country?: $.Slice<string>, Organization?: $.Slice<string>, OrganizationalUnit?: $.Slice<string>, Locality?: $.Slice<string>, Province?: $.Slice<string>, StreetAddress?: $.Slice<string>, PostalCode?: $.Slice<string>, SerialNumber?: string, CommonName?: string, Names?: $.Slice<AttributeTypeAndValue>, ExtraNames?: $.Slice<AttributeTypeAndValue>}>) {
		this._fields = {
			Country: $.varRef(init?.Country ?? (null! as $.Slice<string>)),
			Organization: $.varRef(init?.Organization ?? (null! as $.Slice<string>)),
			OrganizationalUnit: $.varRef(init?.OrganizationalUnit ?? (null! as $.Slice<string>)),
			Locality: $.varRef(init?.Locality ?? (null! as $.Slice<string>)),
			Province: $.varRef(init?.Province ?? (null! as $.Slice<string>)),
			StreetAddress: $.varRef(init?.StreetAddress ?? (null! as $.Slice<string>)),
			PostalCode: $.varRef(init?.PostalCode ?? (null! as $.Slice<string>)),
			SerialNumber: $.varRef(init?.SerialNumber ?? ("" as string)),
			CommonName: $.varRef(init?.CommonName ?? ("" as string)),
			Names: $.varRef(init?.Names ?? (null! as $.Slice<AttributeTypeAndValue>)),
			ExtraNames: $.varRef(init?.ExtraNames ?? (null! as $.Slice<AttributeTypeAndValue>))
		}
	}

	public clone(): Name {
		const cloned = new Name()
		cloned._fields = {
			Country: $.varRef(this._fields.Country.value),
			Organization: $.varRef(this._fields.Organization.value),
			OrganizationalUnit: $.varRef(this._fields.OrganizationalUnit.value),
			Locality: $.varRef(this._fields.Locality.value),
			Province: $.varRef(this._fields.Province.value),
			StreetAddress: $.varRef(this._fields.StreetAddress.value),
			PostalCode: $.varRef(this._fields.PostalCode.value),
			SerialNumber: $.varRef(this._fields.SerialNumber.value),
			CommonName: $.varRef(this._fields.CommonName.value),
			Names: $.varRef(this._fields.Names.value),
			ExtraNames: $.varRef(this._fields.ExtraNames.value)
		}
		return $.markAsStructValue(cloned)
	}

	public FillFromRDNSequence(rdns: $.VarRef<RDNSequence> | null): void {
		let n: Name | $.VarRef<Name> | null = this
		for (let __goscriptRangeTarget2 = $.pointerValue<RDNSequence>(rdns), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let rdn = __goscriptRangeTarget2![__rangeIndex]
			if ($.len((rdn as RelativeDistinguishedNameSET)) == 0) {
				continue
			}

			for (let __goscriptRangeTarget1 = rdn, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
				let atv = __goscriptRangeTarget1![__rangeIndex]
				$.pointerValue<Name>(n).Names = $.append($.pointerValue<Name>(n).Names, atv)
				let [value, ok] = $.typeAssertTuple<string>(atv.Value, { kind: $.TypeKind.Basic, name: "string" })
				if (!ok) {
					continue
				}

				let t: asn1.ObjectIdentifier = (atv.Type as asn1.ObjectIdentifier)
				if (((($.len((t as asn1.ObjectIdentifier)) == 4) && ($.arrayIndex(t!, 0) == 2)) && ($.arrayIndex(t!, 1) == 5)) && ($.arrayIndex(t!, 2) == 4)) {
					switch ($.arrayIndex(t!, 3)) {
						case 3:
						{
							$.pointerValue<Name>(n).CommonName = value
							break
						}
						case 5:
						{
							$.pointerValue<Name>(n).SerialNumber = value
							break
						}
						case 6:
						{
							$.pointerValue<Name>(n).Country = $.append($.pointerValue<Name>(n).Country, value)
							break
						}
						case 7:
						{
							$.pointerValue<Name>(n).Locality = $.append($.pointerValue<Name>(n).Locality, value)
							break
						}
						case 8:
						{
							$.pointerValue<Name>(n).Province = $.append($.pointerValue<Name>(n).Province, value)
							break
						}
						case 9:
						{
							$.pointerValue<Name>(n).StreetAddress = $.append($.pointerValue<Name>(n).StreetAddress, value)
							break
						}
						case 10:
						{
							$.pointerValue<Name>(n).Organization = $.append($.pointerValue<Name>(n).Organization, value)
							break
						}
						case 11:
						{
							$.pointerValue<Name>(n).OrganizationalUnit = $.append($.pointerValue<Name>(n).OrganizationalUnit, value)
							break
						}
						case 17:
						{
							$.pointerValue<Name>(n).PostalCode = $.append($.pointerValue<Name>(n).PostalCode, value)
							break
						}
					}
				}
			}
		}
	}

	public async String(): globalThis.Promise<string> {
		const n = this
		let rdns: RDNSequence = null! as RDNSequence
		// If there are no ExtraNames, surface the parsed value (all entries in
		// Names) instead.
		if (n.ExtraNames == null) {
			for (let __goscriptRangeTarget3 = n.Names, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
				let atv = __goscriptRangeTarget3![__rangeIndex]
				let t: asn1.ObjectIdentifier = (atv.Type as asn1.ObjectIdentifier)
				if (((($.len((t as asn1.ObjectIdentifier)) == 4) && ($.arrayIndex(t!, 0) == 2)) && ($.arrayIndex(t!, 1) == 5)) && ($.arrayIndex(t!, 2) == 4)) {
					switch ($.arrayIndex(t!, 3)) {
						case 3:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
						case 17:
						{
							continue
							break
						}
					}
				}
				// Place non-standard parsed values at the beginning of the sequence
				// so they will be at the end of the string. See Issue 39924.
				rdns = ($.append((rdns as RDNSequence), ($.arrayToSlice<AttributeTypeAndValue>([$.markAsStructValue($.cloneStructValue(atv))]) as RelativeDistinguishedNameSET), $.appendZeros.nil) as RDNSequence)
			}
		}
		rdns = ($.appendSlice((rdns as RDNSequence), $.markAsStructValue($.cloneStructValue(n)).ToRDNSequence(), $.appendZeros.nil) as RDNSequence)
		return RDNSequence_String(rdns)
	}

	public ToRDNSequence(): RDNSequence {
		const n = this
		let ret: RDNSequence = null! as RDNSequence
		ret = ($.markAsStructValue($.cloneStructValue(n)).appendRDNs((ret as RDNSequence), n.Country, (oidCountry as asn1.ObjectIdentifier)) as RDNSequence)
		ret = ($.markAsStructValue($.cloneStructValue(n)).appendRDNs((ret as RDNSequence), n.Province, (oidProvince as asn1.ObjectIdentifier)) as RDNSequence)
		ret = ($.markAsStructValue($.cloneStructValue(n)).appendRDNs((ret as RDNSequence), n.Locality, (oidLocality as asn1.ObjectIdentifier)) as RDNSequence)
		ret = ($.markAsStructValue($.cloneStructValue(n)).appendRDNs((ret as RDNSequence), n.StreetAddress, (oidStreetAddress as asn1.ObjectIdentifier)) as RDNSequence)
		ret = ($.markAsStructValue($.cloneStructValue(n)).appendRDNs((ret as RDNSequence), n.PostalCode, (oidPostalCode as asn1.ObjectIdentifier)) as RDNSequence)
		ret = ($.markAsStructValue($.cloneStructValue(n)).appendRDNs((ret as RDNSequence), n.Organization, (oidOrganization as asn1.ObjectIdentifier)) as RDNSequence)
		ret = ($.markAsStructValue($.cloneStructValue(n)).appendRDNs((ret as RDNSequence), n.OrganizationalUnit, (oidOrganizationalUnit as asn1.ObjectIdentifier)) as RDNSequence)
		if ($.len(n.CommonName) > 0) {
			ret = ($.markAsStructValue($.cloneStructValue(n)).appendRDNs((ret as RDNSequence), $.arrayToSlice<string>([n.CommonName]), (oidCommonName as asn1.ObjectIdentifier)) as RDNSequence)
		}
		if ($.len(n.SerialNumber) > 0) {
			ret = ($.markAsStructValue($.cloneStructValue(n)).appendRDNs((ret as RDNSequence), $.arrayToSlice<string>([n.SerialNumber]), (oidSerialNumber as asn1.ObjectIdentifier)) as RDNSequence)
		}
		for (let __goscriptRangeTarget4 = n.ExtraNames, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
			let atv = __goscriptRangeTarget4![__rangeIndex]
			ret = ($.append((ret as RDNSequence), ($.arrayToSlice<AttributeTypeAndValue>([$.markAsStructValue($.cloneStructValue(atv))]) as RelativeDistinguishedNameSET), $.appendZeros.nil) as RDNSequence)
		}

		return (ret as RDNSequence)
	}

	public appendRDNs(_in: RDNSequence, values: $.Slice<string>, oid: asn1.ObjectIdentifier): RDNSequence {
		const n = this
		if (($.len(values) == 0) || oidInAttributeTypeAndValue((oid as asn1.ObjectIdentifier), n.ExtraNames)) {
			return (_in as RDNSequence)
		}

		let s: $.Slice<AttributeTypeAndValue> = $.makeSlice<AttributeTypeAndValue>($.len(values), undefined, undefined, () => $.markAsStructValue(new AttributeTypeAndValue()))
		for (let __goscriptRangeTarget5 = values, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
			let value = __goscriptRangeTarget5![i]
			$.arrayIndex(s!, i).Type = (oid as asn1.ObjectIdentifier)
			$.arrayIndex(s!, i).Value = value
		}

		return ($.append((_in as RDNSequence), (s as RelativeDistinguishedNameSET), $.appendZeros.nil) as RDNSequence)
	}

	static __typeInfo = $.registerStructType(
		"pkix.Name",
		() => new Name(),
		[{ name: "FillFromRDNSequence", args: [{ name: "rdns", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } } } }], returns: [] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "ToRDNSequence", args: [], returns: [{ name: "ret", type: { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } } }] }, { name: "appendRDNs", args: [{ name: "in", type: { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } } }, { name: "values", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "oid", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } } }] }],
		Name,
		[{ name: "Country", key: "Country", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [0], offset: 0, exported: true }, { name: "Organization", key: "Organization", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [1], offset: 24, exported: true }, { name: "OrganizationalUnit", key: "OrganizationalUnit", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [2], offset: 48, exported: true }, { name: "Locality", key: "Locality", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [3], offset: 72, exported: true }, { name: "Province", key: "Province", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [4], offset: 96, exported: true }, { name: "StreetAddress", key: "StreetAddress", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [5], offset: 120, exported: true }, { name: "PostalCode", key: "PostalCode", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [6], offset: 144, exported: true }, { name: "SerialNumber", key: "SerialNumber", type: { kind: $.TypeKind.Basic, name: "string" }, index: [7], offset: 168, exported: true }, { name: "CommonName", key: "CommonName", type: { kind: $.TypeKind.Basic, name: "string" }, index: [8], offset: 184, exported: true }, { name: "Names", key: "Names", type: { kind: $.TypeKind.Slice, elemType: "pkix.AttributeTypeAndValue" }, index: [9], offset: 200, exported: true }, { name: "ExtraNames", key: "ExtraNames", type: { kind: $.TypeKind.Slice, elemType: "pkix.AttributeTypeAndValue" }, index: [10], offset: 224, exported: true }]
	)
}

export class TBSCertificateList {
	public get Raw(): asn1.RawContent {
		return this._fields.Raw.value
	}
	public set Raw(value: asn1.RawContent) {
		this._fields.Raw.value = value
	}

	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get Signature(): AlgorithmIdentifier {
		return this._fields.Signature.value
	}
	public set Signature(value: AlgorithmIdentifier) {
		this._fields.Signature.value = value
	}

	public get Issuer(): RDNSequence {
		return this._fields.Issuer.value
	}
	public set Issuer(value: RDNSequence) {
		this._fields.Issuer.value = value
	}

	public get ThisUpdate(): time.Time {
		return this._fields.ThisUpdate.value
	}
	public set ThisUpdate(value: time.Time) {
		this._fields.ThisUpdate.value = value
	}

	public get NextUpdate(): time.Time {
		return this._fields.NextUpdate.value
	}
	public set NextUpdate(value: time.Time) {
		this._fields.NextUpdate.value = value
	}

	public get RevokedCertificates(): $.Slice<RevokedCertificate> {
		return this._fields.RevokedCertificates.value
	}
	public set RevokedCertificates(value: $.Slice<RevokedCertificate>) {
		this._fields.RevokedCertificates.value = value
	}

	public get Extensions(): $.Slice<Extension> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<Extension>) {
		this._fields.Extensions.value = value
	}

	public _fields: {
		Raw: $.VarRef<asn1.RawContent>
		Version: $.VarRef<number>
		Signature: $.VarRef<AlgorithmIdentifier>
		Issuer: $.VarRef<RDNSequence>
		ThisUpdate: $.VarRef<time.Time>
		NextUpdate: $.VarRef<time.Time>
		RevokedCertificates: $.VarRef<$.Slice<RevokedCertificate>>
		Extensions: $.VarRef<$.Slice<Extension>>
	}

	constructor(init?: Partial<{Raw?: asn1.RawContent, Version?: number, Signature?: AlgorithmIdentifier, Issuer?: RDNSequence, ThisUpdate?: time.Time, NextUpdate?: time.Time, RevokedCertificates?: $.Slice<RevokedCertificate>, Extensions?: $.Slice<Extension>}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null! as asn1.RawContent)),
			Version: $.varRef(init?.Version ?? (0 as number)),
			Signature: $.varRef(init?.Signature ? $.markAsStructValue($.cloneStructValue(init.Signature)) : $.markAsStructValue(new AlgorithmIdentifier())),
			Issuer: $.varRef(init?.Issuer ?? (null! as RDNSequence)),
			ThisUpdate: $.varRef(init?.ThisUpdate ? $.markAsStructValue($.cloneStructValue(init.ThisUpdate)) : $.markAsStructValue(new time.Time())),
			NextUpdate: $.varRef(init?.NextUpdate ? $.markAsStructValue($.cloneStructValue(init.NextUpdate)) : $.markAsStructValue(new time.Time())),
			RevokedCertificates: $.varRef(init?.RevokedCertificates ?? (null! as $.Slice<RevokedCertificate>)),
			Extensions: $.varRef(init?.Extensions ?? (null! as $.Slice<Extension>))
		}
	}

	public clone(): TBSCertificateList {
		const cloned = new TBSCertificateList()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			Version: $.varRef(this._fields.Version.value),
			Signature: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Signature.value))),
			Issuer: $.varRef(this._fields.Issuer.value),
			ThisUpdate: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ThisUpdate.value))),
			NextUpdate: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.NextUpdate.value))),
			RevokedCertificates: $.varRef(this._fields.RevokedCertificates.value),
			Extensions: $.varRef(this._fields.Extensions.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"pkix.TBSCertificateList",
		() => new TBSCertificateList(),
		[],
		TBSCertificateList,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, typeName: "asn1.RawContent", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "int" }, tag: "asn1:\"optional,default:0\"", index: [1], offset: 24, exported: true }, { name: "Signature", key: "Signature", type: "pkix.AlgorithmIdentifier", index: [2], offset: 32, exported: true }, { name: "Issuer", key: "Issuer", type: { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } }, index: [3], offset: 128, exported: true }, { name: "ThisUpdate", key: "ThisUpdate", type: "time.Time", index: [4], offset: 152, exported: true }, { name: "NextUpdate", key: "NextUpdate", type: "time.Time", tag: "asn1:\"optional\"", index: [5], offset: 176, exported: true }, { name: "RevokedCertificates", key: "RevokedCertificates", type: { kind: $.TypeKind.Slice, elemType: "pkix.RevokedCertificate" }, tag: "asn1:\"optional\"", index: [6], offset: 200, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, tag: "asn1:\"tag:0,optional,explicit\"", index: [7], offset: 224, exported: true }]
	)
}

export class CertificateList {
	public get TBSCertList(): TBSCertificateList {
		return this._fields.TBSCertList.value
	}
	public set TBSCertList(value: TBSCertificateList) {
		this._fields.TBSCertList.value = value
	}

	public get SignatureAlgorithm(): AlgorithmIdentifier {
		return this._fields.SignatureAlgorithm.value
	}
	public set SignatureAlgorithm(value: AlgorithmIdentifier) {
		this._fields.SignatureAlgorithm.value = value
	}

	public get SignatureValue(): asn1.BitString {
		return this._fields.SignatureValue.value
	}
	public set SignatureValue(value: asn1.BitString) {
		this._fields.SignatureValue.value = value
	}

	public _fields: {
		TBSCertList: $.VarRef<TBSCertificateList>
		SignatureAlgorithm: $.VarRef<AlgorithmIdentifier>
		SignatureValue: $.VarRef<asn1.BitString>
	}

	constructor(init?: Partial<{TBSCertList?: TBSCertificateList, SignatureAlgorithm?: AlgorithmIdentifier, SignatureValue?: asn1.BitString}>) {
		this._fields = {
			TBSCertList: $.varRef(init?.TBSCertList ? $.markAsStructValue($.cloneStructValue(init.TBSCertList)) : $.markAsStructValue(new TBSCertificateList())),
			SignatureAlgorithm: $.varRef(init?.SignatureAlgorithm ? $.markAsStructValue($.cloneStructValue(init.SignatureAlgorithm)) : $.markAsStructValue(new AlgorithmIdentifier())),
			SignatureValue: $.varRef(init?.SignatureValue ? $.markAsStructValue($.cloneStructValue(init.SignatureValue)) : $.markAsStructValue(new asn1.BitString()))
		}
	}

	public clone(): CertificateList {
		const cloned = new CertificateList()
		cloned._fields = {
			TBSCertList: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.TBSCertList.value))),
			SignatureAlgorithm: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SignatureAlgorithm.value))),
			SignatureValue: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SignatureValue.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public HasExpired(now: time.Time): boolean {
		const certList: CertificateList | $.VarRef<CertificateList> | null = this
		return !$.markAsStructValue($.cloneStructValue(now)).Before($.markAsStructValue($.cloneStructValue($.pointerValue<CertificateList>(certList).TBSCertList.NextUpdate)))
	}

	static __typeInfo = $.registerStructType(
		"pkix.CertificateList",
		() => new CertificateList(),
		[{ name: "HasExpired", args: [{ name: "now", type: "time.Time" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		CertificateList,
		[{ name: "TBSCertList", key: "TBSCertList", type: "pkix.TBSCertificateList", index: [0], offset: 0, exported: true }, { name: "SignatureAlgorithm", key: "SignatureAlgorithm", type: "pkix.AlgorithmIdentifier", index: [1], offset: 248, exported: true }, { name: "SignatureValue", key: "SignatureValue", type: "asn1.BitString", index: [2], offset: 344, exported: true }]
	)
}

export class RevokedCertificate {
	public get SerialNumber(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.SerialNumber.value
	}
	public set SerialNumber(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.SerialNumber.value = value
	}

	public get RevocationTime(): time.Time {
		return this._fields.RevocationTime.value
	}
	public set RevocationTime(value: time.Time) {
		this._fields.RevocationTime.value = value
	}

	public get Extensions(): $.Slice<Extension> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<Extension>) {
		this._fields.Extensions.value = value
	}

	public _fields: {
		SerialNumber: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		RevocationTime: $.VarRef<time.Time>
		Extensions: $.VarRef<$.Slice<Extension>>
	}

	constructor(init?: Partial<{SerialNumber?: big.Int | $.VarRef<big.Int> | null, RevocationTime?: time.Time, Extensions?: $.Slice<Extension>}>) {
		this._fields = {
			SerialNumber: $.varRef(init?.SerialNumber ?? (null! as big.Int | $.VarRef<big.Int> | null)),
			RevocationTime: $.varRef(init?.RevocationTime ? $.markAsStructValue($.cloneStructValue(init.RevocationTime)) : $.markAsStructValue(new time.Time())),
			Extensions: $.varRef(init?.Extensions ?? (null! as $.Slice<Extension>))
		}
	}

	public clone(): RevokedCertificate {
		const cloned = new RevokedCertificate()
		cloned._fields = {
			SerialNumber: $.varRef(this._fields.SerialNumber.value),
			RevocationTime: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.RevocationTime.value))),
			Extensions: $.varRef(this._fields.Extensions.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"pkix.RevokedCertificate",
		() => new RevokedCertificate(),
		[],
		RevokedCertificate,
		[{ name: "SerialNumber", key: "SerialNumber", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [0], offset: 0, exported: true }, { name: "RevocationTime", key: "RevocationTime", type: "time.Time", index: [1], offset: 8, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, tag: "asn1:\"optional\"", index: [2], offset: 32, exported: true }]
	)
}

export let attributeTypeNames: globalThis.Map<string, string> | null = new globalThis.Map<string, string>([["2.5.4.6", "C"], ["2.5.4.10", "O"], ["2.5.4.11", "OU"], ["2.5.4.3", "CN"], ["2.5.4.5", "SERIALNUMBER"], ["2.5.4.7", "L"], ["2.5.4.8", "ST"], ["2.5.4.9", "STREET"], ["2.5.4.17", "POSTALCODE"]])

export function __goscript_set_attributeTypeNames(__goscriptValue: globalThis.Map<string, string> | null): void {
	attributeTypeNames = __goscriptValue
}

export async function RDNSequence_String(r: RDNSequence): globalThis.Promise<string> {
	let s = ""
	for (let i = 0; i < $.len((r as RDNSequence)); i++) {
		let rdn: RelativeDistinguishedNameSET = ($.arrayIndex(r!, ($.len((r as RDNSequence)) - 1) - i) as RelativeDistinguishedNameSET)
		if (i > 0) {
			s = s + (",")
		}
		for (let __goscriptRangeTarget0 = rdn, j = 0; j < $.len(__goscriptRangeTarget0); j++) {
			let tv = __goscriptRangeTarget0![j]
			if (j > 0) {
				s = s + ("+")
			}

			let oidString = asn1.ObjectIdentifier_String(tv.Type)
			let [typeName, ok] = $.mapGet<string, string, string>(attributeTypeNames, oidString, "")
			if (!ok) {
				let __goscriptTuple0: any = await asn1.Marshal(tv.Value)
				let derBytes: $.Slice<number> = __goscriptTuple0[0]
				let err = __goscriptTuple0[1]
				if (err == null) {
					s = s + ((oidString + "=#") + hex.EncodeToString(derBytes))
					continue
				}

				typeName = oidString
			}

			let valueString = fmt.Sprint(tv.Value)
			let escaped: $.Slice<number> = $.makeSlice<number>(0, $.len(valueString), "number")

			for (const [k, c] of $.rangeString(valueString)) {
				let escape = false

				switch (c) {
					case 44:
					case 43:
					case 34:
					case 92:
					case 60:
					case 62:
					case 59:
					{
						escape = true
						break
					}
					case 32:
					{
						escape = (k == 0) || (k == ($.len(valueString) - 1))
						break
					}
					case 35:
					{
						escape = k == 0
						break
					}
				}

				if (escape) {
					escaped = $.append(escaped, $.int(92, 32), $.int(c, 32))
				} else {
					escaped = $.append(escaped, $.int(c, 32))
				}
			}

			s = s + ((typeName + "=") + $.runesToString(escaped))
		}
	}

	return s
}

export let oidCountry: $.Slice<number> = $.arrayToSlice<number>([2, 5, 4, 6])

export function __goscript_set_oidCountry(__goscriptValue: $.Slice<number>): void {
	oidCountry = __goscriptValue
}

export let oidOrganization: $.Slice<number> = $.arrayToSlice<number>([2, 5, 4, 10])

export function __goscript_set_oidOrganization(__goscriptValue: $.Slice<number>): void {
	oidOrganization = __goscriptValue
}

export let oidOrganizationalUnit: $.Slice<number> = $.arrayToSlice<number>([2, 5, 4, 11])

export function __goscript_set_oidOrganizationalUnit(__goscriptValue: $.Slice<number>): void {
	oidOrganizationalUnit = __goscriptValue
}

export let oidCommonName: $.Slice<number> = $.arrayToSlice<number>([2, 5, 4, 3])

export function __goscript_set_oidCommonName(__goscriptValue: $.Slice<number>): void {
	oidCommonName = __goscriptValue
}

export let oidSerialNumber: $.Slice<number> = $.arrayToSlice<number>([2, 5, 4, 5])

export function __goscript_set_oidSerialNumber(__goscriptValue: $.Slice<number>): void {
	oidSerialNumber = __goscriptValue
}

export let oidLocality: $.Slice<number> = $.arrayToSlice<number>([2, 5, 4, 7])

export function __goscript_set_oidLocality(__goscriptValue: $.Slice<number>): void {
	oidLocality = __goscriptValue
}

export let oidProvince: $.Slice<number> = $.arrayToSlice<number>([2, 5, 4, 8])

export function __goscript_set_oidProvince(__goscriptValue: $.Slice<number>): void {
	oidProvince = __goscriptValue
}

export let oidStreetAddress: $.Slice<number> = $.arrayToSlice<number>([2, 5, 4, 9])

export function __goscript_set_oidStreetAddress(__goscriptValue: $.Slice<number>): void {
	oidStreetAddress = __goscriptValue
}

export let oidPostalCode: $.Slice<number> = $.arrayToSlice<number>([2, 5, 4, 17])

export function __goscript_set_oidPostalCode(__goscriptValue: $.Slice<number>): void {
	oidPostalCode = __goscriptValue
}

export function oidInAttributeTypeAndValue(oid: asn1.ObjectIdentifier, atv: $.Slice<AttributeTypeAndValue>): boolean {
	for (let __goscriptRangeTarget6 = atv, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
		let a = __goscriptRangeTarget6![__rangeIndex]
		if (asn1.ObjectIdentifier_Equal(a.Type, (oid as asn1.ObjectIdentifier))) {
			return true
		}
	}
	return false
}
