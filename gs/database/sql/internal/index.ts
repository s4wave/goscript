import * as $ from '@goscript/builtin/index.js'

// ScanContext carries state related to the current query from
// database/sql through driver.RowsColumnScanner.ScanColumn into
// database/sql.ConvertAssign. It mirrors internal.ScanContext: the
// wrapped value stays opaque behind the two accessors below.
export class ScanContext {
  public get v(): any {
    return this._fields.v
  }
  public set v(value: any) {
    this._fields.v = value
  }

  public _fields: {
    v: any
  }

  constructor(init?: Partial<{ v?: any }>) {
    this._fields = {
      v: init?.v ?? null,
    }
  }

  public clone(): ScanContext {
    const cloned = new ScanContext()
    cloned._fields = {
      v: this._fields.v,
    }
    return cloned
  }

  // Register this type with the runtime type system
  static __typeInfo = $.registerStructType(
    'internal.ScanContext',
    new ScanContext(),
    [],
    ScanContext,
    [
      {
        name: 'v',
        key: 'v',
        type: { kind: $.TypeKind.Interface, methods: [] },
        index: [0],
        offset: 0,
        exported: false,
        pkgPath: 'database/sql/internal',
      },
    ],
  )
}

// NewScanContext wraps a value into an opaque ScanContext.
export function NewScanContext(v: any): ScanContext {
  return new ScanContext({ v })
}

// ScanContextValue unwraps the value carried by a ScanContext.
export function ScanContextValue(c: ScanContext): any {
  return c._fields.v
}
