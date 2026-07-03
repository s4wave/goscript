import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'

import {
  Compact,
  HTMLEscape,
  Indent,
  InvalidUTF8Error,
  InvalidUnmarshalError,
  MarshalerError,
  Marshal,
  MarshalIndent,
  NewDecoder,
  NewEncoder,
  Number_Float64,
  Number_Int64,
  Number_String,
  RawMessage_MarshalJSON,
  RawMessage_UnmarshalJSON,
  SyntaxError as JSONSyntaxError,
  UnmarshalFieldError,
  Unmarshal,
  UnmarshalTypeError,
  UnsupportedTypeError,
  UnsupportedValueError,
  Valid,
  type Marshaler,
  type Unmarshaler,
} from './index.js'

class Person {
  public _fields = {
    Name: $.varRef(''),
    Age: $.varRef(0),
    Active: $.varRef(false),
  }

  static __typeInfo = $.registerStructType(
    'test.Person',
    new Person(),
    [],
    Person,
    [
      {
        name: 'Name',
        key: 'Name',
        type: { kind: $.TypeKind.Basic, name: 'string' },
        tag: 'json:"name"',
      },
      {
        name: 'Age',
        key: 'Age',
        type: { kind: $.TypeKind.Basic, name: 'int' },
        tag: 'json:"age"',
      },
      {
        name: 'Active',
        key: 'Active',
        type: { kind: $.TypeKind.Basic, name: 'bool' },
        tag: 'json:"active"',
      },
    ],
  )
}

class FieldAlias {
  public _fields = {
    Name: $.varRef(''),
  }

  static __typeInfo = $.registerStructType(
    'test.FieldAlias',
    new FieldAlias(),
    [],
    FieldAlias,
    [
      {
        name: 'FullName',
        key: 'Name',
        type: { kind: $.TypeKind.Basic, name: 'string' },
      },
    ],
  )
}

class Ref {
  public _fields = {
    Name: $.varRef(''),
  }

  static __typeInfo = $.registerStructType(
    'test.Ref',
    new Ref(),
    [],
    Ref,
    [
      {
        name: 'Name',
        key: 'Name',
        type: { kind: $.TypeKind.Basic, name: 'string' },
        tag: 'json:"name"',
      },
    ],
  )
}

class Container {
  public _fields = {
    Contexts: $.varRef<Map<string, Ref[]> | null>(null),
  }

  static __typeInfo = $.registerStructType(
    'test.Container',
    new Container(),
    [],
    Container,
    [
      {
        name: 'Contexts',
        key: 'Contexts',
        type: {
          kind: $.TypeKind.Map,
          elemType: { kind: $.TypeKind.Slice, elemType: 'test.Ref' },
        },
        tag: 'json:"contexts"',
      },
    ],
  )
}

class Property {
  public _fields = {
    Type: $.varRef(''),
  }

  static __typeInfo = $.registerStructType(
    'test.Property',
    new Property(),
    [],
    Property,
    [
      {
        name: 'Type',
        key: 'Type',
        type: { kind: $.TypeKind.Basic, name: 'string' },
        tag: 'json:"type"',
      },
    ],
  )
}

class Schema {
  public _fields = {
    Properties: $.varRef<Map<string, Property | null> | null>(null),
    Items: $.varRef<Property | null>(null),
  }

  static __typeInfo = $.registerStructType(
    'test.Schema',
    new Schema(),
    [],
    Schema,
    [
      {
        name: 'Properties',
        key: 'Properties',
        type: {
          kind: $.TypeKind.Map,
          elemType: { kind: $.TypeKind.Pointer, elemType: 'test.Property' },
        },
        tag: 'json:"properties"',
      },
      {
        name: 'Items',
        key: 'Items',
        type: { kind: $.TypeKind.Pointer, elemType: 'test.Property' },
        tag: 'json:"items"',
      },
    ],
  )
}

class HookPointee {
  public _fields = {}
  public Text = ''
  public Marker = ''

  UnmarshalJSON(data: $.Slice<number>): $.GoError {
    this.Text = $.bytesToString(data)
    return null
  }

  static __typeInfo = $.registerStructType(
    'test.HookPointee',
    new HookPointee(),
    [],
    HookPointee,
    [],
  )
}

class HookHolder {
  public _fields = {
    Hook: $.varRef<HookPointee | null>(null),
  }

  static __typeInfo = $.registerStructType(
    'test.HookHolder',
    new HookHolder(),
    [],
    HookHolder,
    [
      {
        name: 'Hook',
        key: 'Hook',
        type: { kind: $.TypeKind.Pointer, elemType: 'test.HookPointee' },
        tag: 'json:"hook"',
      },
    ],
  )
}

class Holder {
  public _fields = {
    Value: $.varRef<unknown>(null),
  }

  static __typeInfo = $.registerStructType(
    'test.Holder',
    new Holder(),
    [],
    Holder,
    [
      {
        name: 'Value',
        key: 'Value',
        type: { kind: $.TypeKind.Interface, methods: [] },
        tag: 'json:"value"',
      },
    ],
  )
}

describe('encoding/json override', () => {
  it('registers the Unmarshaler interface shape', () => {
    class CustomMarshaler implements Marshaler {
      MarshalJSON(): [$.Slice<number>, $.GoError] {
        return [$.stringToBytes('{"ok":true}'), null]
      }
    }

    class CustomUnmarshaler implements Unmarshaler {
      UnmarshalJSON(_data: $.Slice<number>): $.GoError {
        return null
      }
    }

    const [, marshalOK] = $.typeAssertTuple<Marshaler>(
      new CustomMarshaler(),
      'json.Marshaler',
    )
    const [value, ok] = $.typeAssertTuple<Unmarshaler>(
      new CustomUnmarshaler(),
      'json.Unmarshaler',
    )

    expect(marshalOK).toBe(true)
    expect(ok).toBe(true)
    expect(value.UnmarshalJSON($.stringToBytes('{}'))).toBeNull()
  })

  it('exposes JSON error structs as Go errors', () => {
    for (const err of [
      new JSONSyntaxError(),
      new InvalidUTF8Error({ S: 'bad' }),
      new InvalidUnmarshalError(),
      new MarshalerError({ Err: $.newError('bad marshal') }),
      new UnmarshalFieldError({ Key: 'field' }),
      new UnmarshalTypeError({ Value: 'string' }),
      new UnsupportedTypeError(),
      new UnsupportedValueError({ Str: 'NaN' }),
    ]) {
      expect(err.Error()).toBe(err.message)
    }
  })

  it('marshals struct fields through json tags', () => {
    const person = new Person()
    person._fields.Name.value = 'Alice'
    person._fields.Age.value = 30
    person._fields.Active.value = true

    const [data, err] = Marshal(person)

    expect(err).toBeNull()
    expect($.bytesToString(data)).toBe(
      '{"name":"Alice","age":30,"active":true}',
    )
  })

  it('uses descriptor names separately from storage keys', () => {
    const alias = new FieldAlias()
    alias._fields.Name.value = 'Ada'

    const [data, err] = Marshal(alias)
    expect(err).toBeNull()
    expect($.bytesToString(data)).toBe('{"FullName":"Ada"}')

    const target = $.varRef(new FieldAlias())
    expect(
      Unmarshal($.stringToBytes('{"FullName":"Grace"}'), target),
    ).toBeNull()
    expect(target.value._fields.Name.value).toBe('Grace')
  })

  it('rejects unsupported values and invalid unmarshal targets', () => {
    const [nanData, nanErr] = Marshal(Number.NaN)
    expect(nanData).toBeNull()
    expect(nanErr).toBeInstanceOf(UnsupportedValueError)

    const [htmlData, htmlErr] = Marshal(new Map([['text', '<tag>&']]))
    expect(htmlErr).toBeNull()
    expect($.bytesToString(htmlData)).toBe(
      '{"text":"\\u003ctag\\u003e\\u0026"}',
    )

    expect(Unmarshal($.stringToBytes('{}'), null)).toBeInstanceOf(
      InvalidUnmarshalError,
    )
    expect(Unmarshal($.stringToBytes('{}'), 1)).toBeInstanceOf(
      InvalidUnmarshalError,
    )
  })

  it('uses custom marshal and unmarshal hooks', () => {
    class CustomJSON implements Marshaler, Unmarshaler {
      public Text = ''

      MarshalJSON(): [$.Slice<number>, $.GoError] {
        return [$.stringToBytes('{"hook":true}'), null]
      }

      UnmarshalJSON(data: $.Slice<number>): $.GoError {
        this.Text = $.bytesToString(data)
        return null
      }
    }

    class RawEnvelope {
      public _fields = {
        Raw: $.varRef($.stringToBytes('{"embedded":true}')),
      }

      static __typeInfo = $.registerStructType(
        'test.RawEnvelope',
        new RawEnvelope(),
        [],
        RawEnvelope,
        [
          {
            name: 'Raw',
            key: 'Raw',
            type: 'json.RawMessage',
            tag: 'json:"raw"',
          },
        ],
      )
    }

    class Envelope {
      public _fields = {
        Person: $.varRef(new Person()),
        Data: $.varRef(new Uint8Array(0)),
        Raw: $.varRef(new Uint8Array(0)),
        Hook: $.varRef(new CustomJSON()),
      }

      static __typeInfo = $.registerStructType(
        'test.Envelope',
        new Envelope(),
        [],
        Envelope,
        [
          {
            name: 'Person',
            key: 'Person',
            type: { kind: $.TypeKind.Struct, name: 'test.Person' },
            tag: 'json:"person"',
          },
          {
            name: 'Data',
            key: 'Data',
            type: {
              kind: $.TypeKind.Slice,
              elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
            },
            tag: 'json:"data"',
          },
          {
            name: 'Raw',
            key: 'Raw',
            type: {
              kind: $.TypeKind.Slice,
              elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
              typeName: 'json.RawMessage',
            },
            tag: 'json:"raw"',
          },
          {
            name: 'Hook',
            key: 'Hook',
            type: { kind: $.TypeKind.Struct, name: 'test.CustomJSON' },
            tag: 'json:"hook"',
          },
        ],
      )
    }

    const [data, err] = Marshal(new CustomJSON())
    expect(err).toBeNull()
    expect($.bytesToString(data)).toBe('{"hook":true}')

    const [indented, indentErr] = MarshalIndent(new CustomJSON(), '', '  ')
    expect(indentErr).toBeNull()
    expect($.bytesToString(indented)).toBe('{\n  "hook": true\n}')

    const target = $.varRef(new CustomJSON())
    expect(Unmarshal($.stringToBytes('{"input":1}'), target)).toBeNull()
    expect(target.value.Text).toBe('{"input":1}')

    const raw = $.namedValueInterfaceValue<unknown>(
      $.stringToBytes('{"raw":true}'),
      'json.RawMessage',
      { MarshalJSON: RawMessage_MarshalJSON },
    )
    const [rawData, rawErr] = Marshal(raw)
    expect(rawErr).toBeNull()
    expect($.bytesToString(rawData)).toBe('{"raw":true}')

    const [byteData, byteErr] = Marshal($.stringToBytes('x'))
    expect(byteErr).toBeNull()
    expect($.bytesToString(byteData)).toBe('"eA=="')

    const [rawEnvelopeData, rawEnvelopeErr] = Marshal(new RawEnvelope())
    expect(rawEnvelopeErr).toBeNull()
    expect($.bytesToString(rawEnvelopeData)).toBe('{"raw":{"embedded":true}}')

    const rawEnvelopeTarget = $.varRef(new RawEnvelope())
    expect(
      Unmarshal($.stringToBytes('{"raw":{"next":1}}'), rawEnvelopeTarget),
    ).toBeNull()
    expect($.bytesToString(rawEnvelopeTarget.value._fields.Raw.value)).toBe(
      '{"next":1}',
    )

    const byteTarget = $.varRef(new Uint8Array(0))
    expect(Unmarshal($.stringToBytes('"eA=="'), byteTarget)).toBeNull()
    expect($.bytesToString(byteTarget.value)).toBe('x')

    const envelope = $.varRef(new Envelope())
    expect(
      Unmarshal(
        $.stringToBytes(
          '{"person":{"name":"Eve","age":31},"data":"eA==","raw":{"keep":true},"hook":{"nested":true}}',
        ),
        envelope,
      ),
    ).toBeNull()
    expect(envelope.value._fields.Person.value._fields.Name.value).toBe('Eve')
    expect(envelope.value._fields.Person.value._fields.Age.value).toBe(31)
    expect($.bytesToString(envelope.value._fields.Data.value)).toBe('x')
    expect($.bytesToString(envelope.value._fields.Raw.value)).toBe(
      '{"keep":true}',
    )
    expect(envelope.value._fields.Hook.value.Text).toBe('{"nested":true}')

    const [envelopeData, envelopeErr] = Marshal(envelope.value)
    expect(envelopeErr).toBeNull()
    expect($.bytesToString(envelopeData)).toContain('"raw":{"keep":true}')
  })

  it('marshals indented JSON with a line prefix', () => {
    const person = new Person()
    person._fields.Name.value = 'Alice'
    person._fields.Age.value = 30
    person._fields.Active.value = true

    const [data, err] = MarshalIndent(person, '> ', '  ')

    expect(err).toBeNull()
    expect($.bytesToString(data)).toBe(
      '{\n>   "name": "Alice",\n>   "age": 30,\n>   "active": true\n> }',
    )
  })

  it('unmarshals into struct and map pointers', () => {
    const person = $.varRef(new Person())
    const personErr = Unmarshal(
      $.stringToBytes('{"name":"Bob","age":25,"active":false}'),
      person,
    )

    expect(personErr).toBeNull()
    expect(person.value._fields.Name.value).toBe('Bob')
    expect(person.value._fields.Age.value).toBe(25)
    expect(person.value._fields.Active.value).toBe(false)

    const mapRef: $.VarRef<Map<string, unknown> | null> = $.varRef(null)
    const mapErr = Unmarshal(
      $.stringToBytes('{"name":"Carol","age":22,"active":true}'),
      mapRef,
    )

    expect(mapErr).toBeNull()
    expect(mapRef.value?.get('name')).toBe('Carol')
    expect(mapRef.value?.get('age')).toBe(22)
    expect(mapRef.value?.get('active')).toBe(true)
  })

  it('decodes a map[string][]Struct field into real struct instances, not plain objects/arrays', () => {
    const target = $.varRef(new Container())
    const err = Unmarshal(
      $.stringToBytes('{"contexts":{"a":[{"name":"x"},{"name":"y"}]}}'),
      target,
    )

    expect(err).toBeNull()
    const contexts = target.value._fields.Contexts.value
    expect(contexts).toBeInstanceOf(Map)
    const refs = contexts?.get('a')
    expect(refs).toHaveLength(2)
    expect(refs?.[0]._fields.Name.value).toBe('x')
    expect(refs?.[1]._fields.Name.value).toBe('y')
  })

  it('decodes array elements inside an interface{}-typed field into Maps, not plain objects', () => {
    const target = $.varRef(new Holder())
    const err = Unmarshal(
      $.stringToBytes('{"value":[{"x":1},{"y":2}]}'),
      target,
    )

    expect(err).toBeNull()
    const value = target.value._fields.Value.value as unknown[]
    expect(Array.isArray(value)).toBe(true)
    expect(value[0]).toBeInstanceOf(Map)
    expect((value[0] as Map<string, unknown>).get('x')).toBe(1)
    expect((value[1] as Map<string, unknown>).get('y')).toBe(2)
  })

  it('decodes pointer-to-struct map values and fields into real struct instances', () => {
    const target = $.varRef(new Schema())
    const err = Unmarshal(
      $.stringToBytes(
        '{"properties":{"width":{"type":"number"}},"items":{"type":"string"}}',
      ),
      target,
    )

    expect(err).toBeNull()
    const properties = target.value._fields.Properties.value
    expect(properties?.get('width')?._fields.Type.value).toBe('number')
    expect(target.value._fields.Items.value?._fields.Type.value).toBe(
      'string',
    )
  })

  it('allocates a nil pointer-to-struct field and invokes UnmarshalJSON on it, instead of decoding it field-by-field', () => {
    const target = $.varRef(new HookHolder())
    const err = Unmarshal($.stringToBytes('{"hook":{"nested":true}}'), target)

    expect(err).toBeNull()
    expect(target.value._fields.Hook.value).toBeInstanceOf(HookPointee)
    expect(target.value._fields.Hook.value?.Text).toBe('{"nested":true}')
  })

  it('invokes UnmarshalJSON on a non-nil pointer-to-struct field in place, instead of replacing it with a freshly decoded instance', () => {
    const holder = new HookHolder()
    const existing = new HookPointee()
    existing.Marker = 'orig'
    holder._fields.Hook.value = existing

    const target = $.varRef(holder)
    const err = Unmarshal($.stringToBytes('{"hook":{"nested":true}}'), target)

    expect(err).toBeNull()
    // Go's encoding/json decodes into the existing pointee via its
    // UnmarshalJSON hook, it never discards it for a fresh replacement.
    expect(target.value._fields.Hook.value).toBe(existing)
    expect(target.value._fields.Hook.value?.Marker).toBe('orig')
    expect(target.value._fields.Hook.value?.Text).toBe('{"nested":true}')
  })

  it('decodes pointer-to-struct values as unmarked pointees, matching *Struct not Struct by value', () => {
    const target = $.varRef(new Schema())
    const err = Unmarshal(
      $.stringToBytes(
        '{"properties":{"width":{"type":"number"}},"items":{"type":"string"}}',
      ),
      target,
    )
    expect(err).toBeNull()

    const propertyType = $.getTypeByName('test.Property') as $.TypeInfo
    const propertyPointerType: $.TypeInfo = {
      kind: $.TypeKind.Pointer,
      elemType: propertyType,
    }

    // A *Property field/map-value must match *Property (pointer), not
    // Property (value): the runtime distinguishes pointer vs. value structs
    // with a marker, and getting this wrong breaks Go type
    // assertions/switches and pointer-receiver method-set checks on
    // JSON-decoded values.
    const items = target.value._fields.Items.value
    expect($.is(items, propertyPointerType)).toBe(true)
    expect($.is(items, propertyType)).toBe(false)

    const width = target.value._fields.Properties.value?.get('width')
    expect($.is(width, propertyPointerType)).toBe(true)
    expect($.is(width, propertyType)).toBe(false)
  })

  it('preserves pointer element types when parsing a top-level __goType spelling', () => {
    // Regression: parsing a __goType spelling used to strip every leading
    // '*' while recursing into nested element types, collapsing
    // map[string]*test.Property's element type down to test.Property and
    // losing pointer-vs-value semantics for the decoded elements.
    const target = $.varRef<Map<string, Property | null> | null>(new Map())
    target.__goType = '*map[string]*test.Property'
    expect(
      Unmarshal($.stringToBytes('{"width":{"type":"number"}}'), target),
    ).toBeNull()

    const propertyType = $.getTypeByName('test.Property') as $.TypeInfo
    const propertyPointerType: $.TypeInfo = {
      kind: $.TypeKind.Pointer,
      elemType: propertyType,
    }
    const width = target.value?.get('width')
    expect(width?._fields.Type.value).toBe('number')
    expect($.is(width, propertyPointerType)).toBe(true)
    expect($.is(width, propertyType)).toBe(false)
  })

  it('decodes json.RawMessage as a map and slice element type', () => {
    // The runtime boxes Unmarshal's `any` target with its Go type spelling
    // (__goType) at the call site; simulate that here the way $.interfaceValue
    // would for `var m map[string]json.RawMessage; json.Unmarshal(data, &m)`.
    const mapTarget = $.varRef<Map<string, Uint8Array> | null>(new Map())
    mapTarget.__goType = '*map[string]json.RawMessage'
    expect(
      Unmarshal($.stringToBytes('{"a":{"x":1},"b":[1,2,3]}'), mapTarget),
    ).toBeNull()
    expect($.bytesToString(mapTarget.value!.get('a')!)).toBe('{"x":1}')
    expect($.bytesToString(mapTarget.value!.get('b')!)).toBe('[1,2,3]')

    const sliceTarget = $.varRef<Uint8Array[]>([])
    sliceTarget.__goType = '*[]json.RawMessage'
    expect(
      Unmarshal($.stringToBytes('[{"x":1},"raw"]'), sliceTarget),
    ).toBeNull()
    expect($.bytesToString(sliceTarget.value[0])).toBe('{"x":1}')
    expect($.bytesToString(sliceTarget.value[1])).toBe('"raw"')
  })

  it('encodes JSON to an io.Writer with newline, indentation, and HTML escaping', () => {
    const chunks: string[] = []
    const writer = {
      Write(p: $.Bytes): [number, $.GoError] {
        chunks.push($.bytesToString(p))
        return [$.len(p), null]
      },
    }

    const encoder = NewEncoder(writer)
    expect(encoder.Encode(new Map([['text', '<tag>&']]))).toBeNull()
    encoder.SetEscapeHTML(false)
    encoder.SetIndent('', '  ')
    expect(encoder.Encode(new Map([['text', '<tag>&']]))).toBeNull()

    expect(chunks).toEqual([
      '{"text":"\\u003ctag\\u003e\\u0026"}\n',
      '{\n  "text": "<tag>&"\n}\n',
    ])
  })

  it('validates, compacts, indents, and escapes JSON bytes', () => {
    expect(Valid($.stringToBytes('{"ok":true}'))).toBe(true)
    expect(Valid($.stringToBytes('{'))).toBe(false)

    const compact = new bytes.Buffer()
    expect(Compact(compact, $.stringToBytes('{ "ok" : true }'))).toBeNull()
    expect(compact.String()).toBe('{"ok":true}')

    const indented = new bytes.Buffer()
    expect(
      Indent(indented, $.stringToBytes('{"ok":true}'), '> ', '  '),
    ).toBeNull()
    expect(indented.String()).toBe('{\n>   "ok": true\n> }')

    const escaped = new bytes.Buffer()
    HTMLEscape(escaped, $.stringToBytes('"<tag>&"'))
    expect(escaped.String()).toBe('"\\u003ctag\\u003e\\u0026"')
  })

  it('preserves number and string literal spelling through Compact and Indent', () => {
    const compact = new bytes.Buffer()
    expect(
      Compact(
        compact,
        $.stringToBytes('{"n": 1e+00, "big": 9007199254740993, "s": "abc"}'),
      ),
    ).toBeNull()
    expect(compact.String()).toBe(
      '{"n":1e+00,"big":9007199254740993,"s":"abc"}',
    )

    const compact2 = new bytes.Buffer()
    expect(Compact(compact2, $.stringToBytes('{"n":1e+00}'))).toBeNull()
    expect(compact2.String()).toBe('{"n":1e+00}')

    const indented = new bytes.Buffer()
    expect(
      Indent(indented, $.stringToBytes('{"a":1,"b":[2,3],"e":{}}'), '', '  '),
    ).toBeNull()
    expect(indented.String()).toBe(
      '{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ],\n  "e": {}\n}',
    )

    // Go's Indent copies trailing whitespace after the value verbatim.
    const trailing = new bytes.Buffer()
    expect(Indent(trailing, $.stringToBytes('{"a":1}\n'), '', '  ')).toBeNull()
    expect(trailing.String()).toBe('{\n  "a": 1\n}\n')
  })

  it('keeps exact source literals for UseNumber beyond float64 precision', () => {
    const reader = bytes.NewBufferString('{"big":9007199254740993,"f":1e+00}')!
    const decoder = NewDecoder(reader)
    decoder.UseNumber()
    const target = $.varRef<Map<string, unknown> | null>(null)

    expect(decoder.Decode(target)).toBeNull()
    expect(target.value?.get('big')).toBe('9007199254740993')
    expect(target.value?.get('f')).toBe('1e+00')
  })

  it('returns a SyntaxError with the Go byte offset for malformed input', () => {
    const cases: Array<[string, number]> = [
      ['[1,]', 4],
      ['{"a":}', 6],
      ['[1 2]', 4],
      ['truex', 5],
      ['123abc', 4],
    ]
    for (const [input, offset] of cases) {
      const target = $.varRef<unknown>(null)
      const err = Unmarshal($.stringToBytes(input), target)
      expect(err).toBeInstanceOf(JSONSyntaxError)
      expect((err as InstanceType<typeof JSONSyntaxError>).Offset).toBe(offset)
    }
  })

  it('decodes one value per Decode and buffers the rest of the stream', () => {
    const decoder = NewDecoder(bytes.NewBufferString('1 2')!)
    const first = $.varRef<unknown>(null)
    const second = $.varRef<unknown>(null)

    expect(decoder.Decode(first)).toBeNull()
    expect(first.value).toBe(1)
    expect(decoder.Decode(second)).toBeNull()
    expect(second.value).toBe(2)
    expect(decoder.Decode($.varRef<unknown>(null))?.Error()).toBe('EOF')
  })

  it('streams delimiters and values through Token and reports More', () => {
    const tokens = NewDecoder(bytes.NewBufferString('[1]')!)
    expect(tokens.Token()).toEqual(['['.charCodeAt(0), null])
    expect(tokens.Token()).toEqual([1, null])
    expect(tokens.Token()).toEqual([']'.charCodeAt(0), null])
    expect(tokens.Token()[1]?.Error()).toBe('EOF')

    const more = NewDecoder(bytes.NewBufferString('[1,2]')!)
    more.Token() // consume [
    expect(more.More()).toBe(true)
    more.Token() // 1
    expect(more.More()).toBe(true)
    more.Token() // 2
    expect(more.More()).toBe(false)
  })

  it('marshals a RawMessage field without normalizing its token spelling', () => {
    class RawHolder {
      public _fields = {
        R: $.varRef($.stringToBytes('1e+00')),
      }

      static __typeInfo = $.registerStructType(
        'test.RawHolder',
        new RawHolder(),
        [],
        RawHolder,
        [{ name: 'R', key: 'R', type: 'json.RawMessage', tag: 'json:"r"' }],
      )
    }

    const [data, err] = Marshal(new RawHolder())
    expect(err).toBeNull()
    expect($.bytesToString(data)).toBe('{"r":1e+00}')
  })

  it('decodes from readers and exposes raw message and number helpers', () => {
    const reader = bytes.NewBufferString('{"name":"Dana","age":28}')!
    const decoder = NewDecoder(reader)
    const target = $.varRef(new Person())

    expect(decoder.Decode(target)).toBeNull()
    expect(target.value._fields.Name.value).toBe('Dana')
    expect(target.value._fields.Age.value).toBe(28)
    expect(decoder.InputOffset()).toBeGreaterThan(0)

    const raw = $.stringToBytes('{"raw":true}')
    const [marshaled, marshalErr] = RawMessage_MarshalJSON(raw)
    expect(marshalErr).toBeNull()
    expect($.bytesToString(marshaled)).toBe('{"raw":true}')

    const rawRef = $.varRef<$.Bytes>(null)
    expect(
      RawMessage_UnmarshalJSON(rawRef, $.stringToBytes('[1,2]')),
    ).toBeNull()
    expect($.bytesToString(rawRef.value)).toBe('[1,2]')

    expect(Number_String('42')).toBe('42')
    expect(Number_Int64('42')).toEqual([42n, null])
    expect(Number_Int64('9007199254740993')).toEqual([9007199254740993n, null])
    expect(Number_Float64('3.5')).toEqual([3.5, null])
    expect(Number.isNaN(Number_Float64('NaN')[0])).toBe(true)
    expect(Number_Float64('-Inf')).toEqual([-Infinity, null])
    expect(Number_Float64('1x')[1]?.Error()).toContain('invalid syntax')
    expect(Number_Float64('1e999')[1]?.Error()).toContain('value out of range')
    expect(Number_Int64('9223372036854775808')).toEqual([
      9223372036854775807n,
      expect.objectContaining({
        Error: expect.any(Function),
      }),
    ])
    expect(Number_Int64('9223372036854775808')[1]?.Error()).toContain(
      'value out of range',
    )
  })

  it('applies decoder UseNumber and DisallowUnknownFields options', () => {
    const numberReader = bytes.NewBufferString('{"n":12}')!
    const numberDecoder = NewDecoder(numberReader)
    numberDecoder.UseNumber()
    const numberTarget = $.varRef<Map<string, unknown> | null>(null)

    expect(numberDecoder.Decode(numberTarget)).toBeNull()
    expect(numberTarget.value?.get('n')).toBe('12')

    const strictReader = bytes.NewBufferString('{"name":"Ada","extra":true}')!
    const strictDecoder = NewDecoder(strictReader)
    strictDecoder.DisallowUnknownFields()
    const strictTarget = $.varRef(new Person())

    expect(strictDecoder.Decode(strictTarget)?.Error()).toBe(
      'json: unknown field "extra"',
    )
  })
})
