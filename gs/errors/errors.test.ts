import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  AsType,
  ErrUnsupported,
  Errorf,
  Is,
  Join,
  New,
  Wrap,
  Wrapf,
} from './errors.js'

class DNSError {
  public readonly IsNotFound = true

  public Error(): string {
    return 'dns'
  }
}

class Wrapper {
  constructor(private readonly err: $.GoError) {}

  public Error(): string {
    return 'wrapped'
  }

  public Unwrap(): $.GoError {
    return this.err
  }
}

const dnsTypeArgs: $.GenericTypeArgs = {
  E: {
    type: { kind: $.TypeKind.Pointer, elemType: 'net.DNSError' },
    zero: () => null,
  },
}

describe('errors.AsType', () => {
  it('returns a directly matching error', () => {
    const dns = $.interfaceValue<$.GoError>(new DNSError(), '*net.DNSError')

    const [matched, ok] = AsType(dnsTypeArgs, dns)

    expect(ok).toBe(true)
    expect(matched).toBe(dns)
  })

  it('walks wrapped errors depth first', () => {
    const dns = $.interfaceValue<$.GoError>(new DNSError(), '*net.DNSError')
    const wrapped = $.interfaceValue<$.GoError>(
      new Wrapper(dns),
      '*main.Wrapper',
    )

    const [matched, ok] = AsType(dnsTypeArgs, Join(null, wrapped))

    expect(ok).toBe(true)
    expect(matched).toBe(dns)
  })

  it('returns zero when no error matches', () => {
    const [matched, ok] = AsType(dnsTypeArgs, $.newError('plain'))

    expect(ok).toBe(false)
    expect(matched).toBe(null)
  })
})

describe('errors github.com/pkg/errors compatibility helpers', () => {
  it('formats new errors', () => {
    expect(Errorf('bad %s: %d', 'value', 42)?.Error()).toBe('bad value: 42')
  })

  it('wraps and unwraps errors', () => {
    const base = $.newError('root')
    const wrapped = Wrap(base, 'context')

    expect(wrapped?.Error()).toBe('context: root')
    expect(Is(wrapped, base)).toBe(true)
  })

  it('wraps formatted context and preserves nil', () => {
    const base = $.newError('root')

    expect(Wrapf(base, 'context %d', 7)?.Error()).toBe('context 7: root')
    expect(Wrap(null, 'context')).toBe(null)
    expect(Wrapf(null, 'context %d', 7)).toBe(null)
  })
})

describe('errors.Is identity semantics', () => {
  it('does not match distinct errors with equal text', () => {
    expect(Is(New('boom'), New('boom'))).toBe(false)
  })

  it('does not match ErrUnsupported by message text', () => {
    expect(Is(New('unsupported operation'), ErrUnsupported)).toBe(false)
  })

  it('matches the same error value', () => {
    const e = New('boom')
    expect(Is(e, e)).toBe(true)
  })

  it('finds a target in any Join position depth-first', () => {
    const a = New('a')
    const b = New('b')
    expect(Is(Join(a, b), b)).toBe(true)
    expect(Is(Join(a, b), a)).toBe(true)
    expect(Is(Join(a, b), New('b'))).toBe(false)
  })

  it('matches a wrapped sentinel through Wrap', () => {
    expect(Is(Wrap(ErrUnsupported, 'ctx'), ErrUnsupported)).toBe(true)
  })

  it('finds a typed error in a later Join position via AsType', () => {
    const dns = $.interfaceValue<$.GoError>(new DNSError(), '*net.DNSError')
    const [matched, ok] = AsType(dnsTypeArgs, Join(New('first'), dns))
    expect(ok).toBe(true)
    expect(matched).toBe(dns)
  })
})

// pairingError models a comparable named string error such as Spacewave's
// `type ConfirmPairingError string`. The compiler boxes each conversion of a
// named value to the error interface separately, so a returned error and its
// sentinel constant are distinct JS objects that carry the same dynamic type
// name and underlying value.
function pairingError(value: string): $.GoError {
  return $.namedValueInterfaceValue<$.GoError>(
    value,
    'provider_local.ConfirmPairingError',
    { Error: (recv: string) => recv },
    { kind: $.TypeKind.Basic, name: 'string' },
  )
}

// sliceError models a comparable-looking box over an uncomparable dynamic type
// such as `type SliceError []int`: Go never compares it with == in errors.Is.
function sliceError(value: number[]): $.GoError {
  return $.namedValueInterfaceValue<$.GoError>(
    value,
    'main.SliceError',
    { Error: () => 'slice error' },
    { kind: $.TypeKind.Slice, elemType: 'int' },
  )
}
function mapError(
  value: Map<string, number>,
  typeInfo?: $.TypeInfo | string,
): $.GoError {
  return $.namedValueInterfaceValue<$.GoError>(
    value,
    'main.MapError',
    { Error: () => 'map error' },
    typeInfo,
  )
}

class PairingWrapper {
  constructor(private readonly err: $.GoError) {}

  public Error(): string {
    return 'confirm pairing failed'
  }

  public Unwrap(): $.GoError {
    return this.err
  }
}

describe('errors.Is comparable named values', () => {
  it('matches separately boxed named values with equal dynamic type and value', () => {
    expect(Is(pairingError('consumed'), pairingError('consumed'))).toBe(true)
  })

  it('does not match named values with different underlying value', () => {
    expect(Is(pairingError('consumed'), pairingError('missing'))).toBe(false)
  })

  it('does not match named values of different dynamic type', () => {
    const other = $.namedValueInterfaceValue<$.GoError>(
      'consumed',
      'provider_local.OtherError',
      { Error: (recv: string) => recv },
      { kind: $.TypeKind.Basic, name: 'string' },
    )
    expect(Is(pairingError('consumed'), other)).toBe(false)
  })

  it('keeps errors.New identity semantics for equal text', () => {
    expect(Is(New('consumed'), New('consumed'))).toBe(false)
    expect(Is(New('consumed'), pairingError('consumed'))).toBe(false)
  })

  it('never compares an uncomparable target and never throws', () => {
    expect(() => Is(sliceError([1, 2, 3]), sliceError([1, 2, 3]))).not.toThrow()
    expect(Is(sliceError([1, 2, 3]), sliceError([1, 2, 3]))).toBe(false)
  })

  it('does not compare an uncomparable named map without known metadata', () => {
    const values = new Map([['same', 1]])
    expect(Is(mapError(values), mapError(values))).toBe(false)
    expect(
      Is(mapError(values, 'main.MapError'), mapError(values, 'main.MapError')),
    ).toBe(false)
  })

  it('finds a comparable named target through a custom Unwrap chain', () => {
    const target = pairingError('mismatch')
    const wrapped = new PairingWrapper(pairingError('mismatch'))
    expect(Is(wrapped, target)).toBe(true)
  })
})
