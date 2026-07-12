// Generated file based on common.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as __goscript_asn1 from "./asn1.gs.ts"
import "@goscript/reflect/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "./asn1.gs.ts"

export class tagAndLength {
	public get _class(): number {
		return this._fields._class.value
	}
	public set _class(value: number) {
		this._fields._class.value = value
	}

	public get tag(): number {
		return this._fields.tag.value
	}
	public set tag(value: number) {
		this._fields.tag.value = value
	}

	public get length(): number {
		return this._fields.length.value
	}
	public set length(value: number) {
		this._fields.length.value = value
	}

	public get isCompound(): boolean {
		return this._fields.isCompound.value
	}
	public set isCompound(value: boolean) {
		this._fields.isCompound.value = value
	}

	public _fields: {
		_class: $.VarRef<number>
		tag: $.VarRef<number>
		length: $.VarRef<number>
		isCompound: $.VarRef<boolean>
	}

	constructor(init?: Partial<{_class?: number, tag?: number, length?: number, isCompound?: boolean}>) {
		this._fields = {
			_class: $.varRef(init?._class ?? (0 as number)),
			tag: $.varRef(init?.tag ?? (0 as number)),
			length: $.varRef(init?.length ?? (0 as number)),
			isCompound: $.varRef(init?.isCompound ?? (false as boolean))
		}
	}

	public clone(): tagAndLength {
		const cloned = new tagAndLength()
		cloned._fields = {
			_class: $.varRef(this._fields._class.value),
			tag: $.varRef(this._fields.tag.value),
			length: $.varRef(this._fields.length.value),
			isCompound: $.varRef(this._fields.isCompound.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"asn1.tagAndLength",
		() => new tagAndLength(),
		[],
		tagAndLength,
		[{ name: "class", key: "_class", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "encoding/asn1", index: [0], offset: 0, exported: false }, { name: "tag", key: "tag", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "encoding/asn1", index: [1], offset: 8, exported: false }, { name: "length", key: "length", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "encoding/asn1", index: [2], offset: 16, exported: false }, { name: "isCompound", key: "isCompound", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "encoding/asn1", index: [3], offset: 24, exported: false }]
	)
}

export class fieldParameters {
	public get optional(): boolean {
		return this._fields.optional.value
	}
	public set optional(value: boolean) {
		this._fields.optional.value = value
	}

	public get explicit(): boolean {
		return this._fields.explicit.value
	}
	public set explicit(value: boolean) {
		this._fields.explicit.value = value
	}

	public get application(): boolean {
		return this._fields.application.value
	}
	public set application(value: boolean) {
		this._fields.application.value = value
	}

	public get _private(): boolean {
		return this._fields._private.value
	}
	public set _private(value: boolean) {
		this._fields._private.value = value
	}

	public get defaultValue(): $.VarRef<bigint> | null {
		return this._fields.defaultValue.value
	}
	public set defaultValue(value: $.VarRef<bigint> | null) {
		this._fields.defaultValue.value = value
	}

	public get tag(): $.VarRef<number> | null {
		return this._fields.tag.value
	}
	public set tag(value: $.VarRef<number> | null) {
		this._fields.tag.value = value
	}

	public get stringType(): number {
		return this._fields.stringType.value
	}
	public set stringType(value: number) {
		this._fields.stringType.value = value
	}

	public get timeType(): number {
		return this._fields.timeType.value
	}
	public set timeType(value: number) {
		this._fields.timeType.value = value
	}

	public get _set(): boolean {
		return this._fields._set.value
	}
	public set _set(value: boolean) {
		this._fields._set.value = value
	}

	public get omitEmpty(): boolean {
		return this._fields.omitEmpty.value
	}
	public set omitEmpty(value: boolean) {
		this._fields.omitEmpty.value = value
	}

	public _fields: {
		optional: $.VarRef<boolean>
		explicit: $.VarRef<boolean>
		application: $.VarRef<boolean>
		_private: $.VarRef<boolean>
		defaultValue: $.VarRef<$.VarRef<bigint> | null>
		tag: $.VarRef<$.VarRef<number> | null>
		stringType: $.VarRef<number>
		timeType: $.VarRef<number>
		_set: $.VarRef<boolean>
		omitEmpty: $.VarRef<boolean>
	}

	constructor(init?: Partial<{optional?: boolean, explicit?: boolean, application?: boolean, _private?: boolean, defaultValue?: $.VarRef<bigint> | null, tag?: $.VarRef<number> | null, stringType?: number, timeType?: number, _set?: boolean, omitEmpty?: boolean}>) {
		this._fields = {
			optional: $.varRef(init?.optional ?? (false as boolean)),
			explicit: $.varRef(init?.explicit ?? (false as boolean)),
			application: $.varRef(init?.application ?? (false as boolean)),
			_private: $.varRef(init?._private ?? (false as boolean)),
			defaultValue: $.varRef(init?.defaultValue ?? (null as $.VarRef<bigint> | null)),
			tag: $.varRef(init?.tag ?? (null as $.VarRef<number> | null)),
			stringType: $.varRef(init?.stringType ?? (0 as number)),
			timeType: $.varRef(init?.timeType ?? (0 as number)),
			_set: $.varRef(init?._set ?? (false as boolean)),
			omitEmpty: $.varRef(init?.omitEmpty ?? (false as boolean))
		}
	}

	public clone(): fieldParameters {
		const cloned = new fieldParameters()
		cloned._fields = {
			optional: $.varRef(this._fields.optional.value),
			explicit: $.varRef(this._fields.explicit.value),
			application: $.varRef(this._fields.application.value),
			_private: $.varRef(this._fields._private.value),
			defaultValue: $.varRef(this._fields.defaultValue.value),
			tag: $.varRef(this._fields.tag.value),
			stringType: $.varRef(this._fields.stringType.value),
			timeType: $.varRef(this._fields.timeType.value),
			_set: $.varRef(this._fields._set.value),
			omitEmpty: $.varRef(this._fields.omitEmpty.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"asn1.fieldParameters",
		() => new fieldParameters(),
		[],
		fieldParameters,
		[{ name: "optional", key: "optional", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "encoding/asn1", index: [0], offset: 0, exported: false }, { name: "explicit", key: "explicit", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "encoding/asn1", index: [1], offset: 1, exported: false }, { name: "application", key: "application", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "encoding/asn1", index: [2], offset: 2, exported: false }, { name: "private", key: "_private", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "encoding/asn1", index: [3], offset: 3, exported: false }, { name: "defaultValue", key: "defaultValue", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } }, pkgPath: "encoding/asn1", index: [4], offset: 8, exported: false }, { name: "tag", key: "tag", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }, pkgPath: "encoding/asn1", index: [5], offset: 16, exported: false }, { name: "stringType", key: "stringType", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "encoding/asn1", index: [6], offset: 24, exported: false }, { name: "timeType", key: "timeType", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "encoding/asn1", index: [7], offset: 32, exported: false }, { name: "set", key: "_set", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "encoding/asn1", index: [8], offset: 40, exported: false }, { name: "omitEmpty", key: "omitEmpty", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "encoding/asn1", index: [9], offset: 41, exported: false }]
	)
}

export const TagBoolean: number = 1

export const TagInteger: number = 2

export const TagBitString: number = 3

export const TagOctetString: number = 4

export const TagNull: number = 5

export const TagOID: number = 6

export const TagEnum: number = 10

export const TagUTF8String: number = 12

export const TagSequence: number = 16

export const TagSet: number = 17

export const TagNumericString: number = 18

export const TagPrintableString: number = 19

export const TagT61String: number = 20

export const TagIA5String: number = 22

export const TagUTCTime: number = 23

export const TagGeneralizedTime: number = 24

export const TagGeneralString: number = 27

export const TagBMPString: number = 30

export const ClassUniversal: number = 0

export const ClassApplication: number = 1

export const ClassContextSpecific: number = 2

export const ClassPrivate: number = 3

export function parseFieldParameters(str: string): fieldParameters {
	let ret: fieldParameters = $.markAsStructValue(new fieldParameters())
	let part: string = ""
	while ($.len(str) > 0) {
		let __goscriptTuple0: any = strings.Cut(str, ",")
		part = __goscriptTuple0[0]
		str = __goscriptTuple0[1]
		switch (true) {
			case $.stringEqual(part, "optional"):
			{
				ret.optional = true
				break
			}
			case $.stringEqual(part, "explicit"):
			{
				ret.explicit = true
				if (ret.tag == null) {
					ret.tag = $.varRef<number>(0)
				}
				break
			}
			case $.stringEqual(part, "generalized"):
			{
				ret.timeType = 24
				break
			}
			case $.stringEqual(part, "utc"):
			{
				ret.timeType = 23
				break
			}
			case $.stringEqual(part, "ia5"):
			{
				ret.stringType = 22
				break
			}
			case $.stringEqual(part, "printable"):
			{
				ret.stringType = 19
				break
			}
			case $.stringEqual(part, "numeric"):
			{
				ret.stringType = 18
				break
			}
			case $.stringEqual(part, "utf8"):
			{
				ret.stringType = 12
				break
			}
			case strings.HasPrefix(part, "default:"):
			{
				let [i, err] = strconv.ParseInt($.sliceStringOrBytes(part, 8, undefined), 10, 64)
				if (err == null) {
					ret.defaultValue = $.varRef<bigint>(0n)
					ret.defaultValue!.value = i
				}
				break
			}
			case strings.HasPrefix(part, "tag:"):
			{
				let [i, err] = strconv.Atoi($.sliceStringOrBytes(part, 4, undefined))
				if (err == null) {
					ret.tag = $.varRef<number>(0)
					ret.tag!.value = i
				}
				break
			}
			case $.stringEqual(part, "set"):
			{
				ret._set = true
				break
			}
			case $.stringEqual(part, "application"):
			{
				ret.application = true
				if (ret.tag == null) {
					ret.tag = $.varRef<number>(0)
				}
				break
			}
			case $.stringEqual(part, "private"):
			{
				ret._private = true
				if (ret.tag == null) {
					ret.tag = $.varRef<number>(0)
				}
				break
			}
			case $.stringEqual(part, "omitempty"):
			{
				ret.omitEmpty = true
				break
			}
		}
	}
	return ret
}

export async function getUniversalType(t: reflect.Type | null): globalThis.Promise<[boolean, number, boolean, boolean]> {
	let matchAny: boolean = false
	let tagNumber: number = 0
	let isCompound: boolean = false
	let ok: boolean = false
	{
		let __goscriptSwitch0 = t
		switch (true) {
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.rawValueType):
			{
				return [true, -1, false, true]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.objectIdentifierType):
			{
				return [false, 6, false, true]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.bitStringType):
			{
				return [false, 3, false, true]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.timeType):
			{
				return [false, 23, false, true]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.enumeratedType):
			{
				return [false, 10, false, true]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.bigIntType):
			{
				return [false, 2, false, true]
				break
			}
		}
	}
	switch (await $.pointerValue<Exclude<reflect.Type, null>>(t).Kind()) {
		case reflect.Bool:
		{
			return [false, 1, false, true]
			break
		}
		case reflect.Int:
		case reflect.Int8:
		case reflect.Int16:
		case reflect.Int32:
		case reflect.Int64:
		{
			return [false, 2, false, true]
			break
		}
		case reflect.Struct:
		{
			return [false, 16, true, true]
			break
		}
		case reflect.Slice:
		{
			if (await $.pointerValue<Exclude<reflect.Type, null>>((await $.pointerValue<Exclude<reflect.Type, null>>(t).Elem())).Kind() == reflect.Uint8) {
				return [false, 4, false, true]
			}
			if (strings.HasSuffix(await $.pointerValue<Exclude<reflect.Type, null>>(t).Name(), "SET")) {
				return [false, 17, true, true]
			}
			return [false, 16, true, true]
			break
		}
		case reflect.String:
		{
			return [false, 19, false, true]
			break
		}
	}
	return [false, 0, false, false]
}
