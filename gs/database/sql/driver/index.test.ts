import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as time from '@goscript/time/index.js'
import { cloneStructValue } from '@goscript/builtin/index.js'

import {
  Bool,
  DefaultParameterConverter,
  ErrBadConn,
  ErrSkip,
  Int32,
  IsScanValue,
  IsValue,
  RowsAffected_LastInsertId,
  RowsAffected_RowsAffected,
  RowsColumnScanner,
  String,
} from './index.js'
import { NewScanContext, ScanContextValue } from '@goscript/database/sql/internal/index.js'
import { ScanContext } from './index.js'

function expectGoErrorThrow(fn: () => unknown, message: string): void {
  try {
    fn()
  } catch (err) {
    expect((err as $.GoError)?.Error()).toBe(message)
    return
  }
  throw new Error('expected Go error throw')
}

describe('database/sql/driver override', () => {
  it('recognizes reflect-free Value-compatible inputs', () => {
    expect(IsValue(null)).toBe(true)
    expect(IsValue(new Uint8Array([1, 2]))).toBe(true)
    expect(IsValue('query')).toBe(true)
    expect(IsValue(true)).toBe(true)
    expect(IsValue($.int(7, 64))).toBe(true)
    expect(IsValue($.uint(8, 64))).toBe(true)
    expect(IsValue(1.5)).toBe(true)
    expect(IsValue(9n)).toBe(true)
    expect(IsValue(new time.Time())).toBe(true)
    expect(IsScanValue('scan')).toBe(true)
    expect(IsValue({ unsupported: true })).toBe(false)
  })

  it('converts supported Bool, String, and Int32 inputs', () => {
    expect(Bool.ConvertValue(true)).toEqual([true, null])
    expect(Bool.ConvertValue('true')).toEqual([true, null])
    expect(Bool.ConvertValue(new Uint8Array([0x30]))).toEqual([false, null])
    expect(String.ConvertValue('already')).toEqual(['already', null])
    expect(Int32.ConvertValue(123)).toEqual([123, null])
  })

  it('guards reflect-dependent named and pointer converter arms', () => {
    const namedBool = $.namedValueInterfaceValue<unknown>(
      true,
      'main.NamedBool',
      {},
    )

    expectGoErrorThrow(
      () => Bool.ConvertValue(namedBool),
      'database/sql/driver: Bool.ConvertValue of named type is not supported in the GoScript browser build',
    )
    expectGoErrorThrow(
      () => Int32.ConvertValue($.varRef(1)),
      'database/sql/driver: Int32.ConvertValue of pointer is not supported in the GoScript browser build',
    )
    expectGoErrorThrow(
      () => DefaultParameterConverter.ConvertValue($.varRef(1)),
      'database/sql/driver: DefaultParameterConverter.ConvertValue of pointer is not supported in the GoScript browser build',
    )
  })

  it('round trips RowsAffected result methods', () => {
    expect(RowsAffected_RowsAffected(42n)).toEqual([42n, null])
    expect(RowsAffected_RowsAffected(9007199254740993n)).toEqual([
      9007199254740993n,
      null,
    ])
    const [id, err] = RowsAffected_LastInsertId(42n)
    expect(id).toBe(0n)
    expect(err?.Error()).toBe('LastInsertId is not supported by this driver')
  })

  it('preserves the opaque value identity through ScanContext', () => {
    const token = { cursor: 7 }
    const scanCtx = NewScanContext(token)

    expect(ScanContextValue(scanCtx)).toBe(token)
    expect(scanCtx.clone().v).toBe(token)
  })

  it('constructs driver.ScanContext and transports internal values', () => {
    const zero = new ScanContext()
    expect(zero.v).toBe(null)
    expect(zero.clone().v).toBe(null)

    const token = { cursor: 42 }
    const wrapped = new ScanContext({ v: token })
    expect(wrapped.v).toBe(token)
    expect(wrapped.clone().v).toBe(token)
    expect(ScanContextValue(wrapped)).toBe(token)
  })

  it('asserts RowsColumnScanner structurally at runtime', () => {
    class scannerRows {
      Columns(): string[] {
        return []
      }
      Close(): $.GoError {
        return null
      }
      Next(_dest: unknown[]): $.GoError {
        return null
      }
      NextRow(): $.GoError {
        return null
      }
      ScanColumn(_scanCtx: unknown, _index: number, _dest: unknown): $.GoError {
        return null
      }
    }

    const info = $.getTypeByName('driver.RowsColumnScanner')
    expect(info).toBeDefined()
    expect($.is(new scannerRows(), info!)).toBe(true)

    const scanner: RowsColumnScanner = new scannerRows()
    expect(scanner.NextRow()).toBe(null)
  })

  it('clones DefaultParameterConverter and converts through the clone', () => {
    const cloned = cloneStructValue(DefaultParameterConverter)
    expect(cloned).not.toBe(DefaultParameterConverter)

    expect(cloned.ConvertValue(123n)).toEqual([123n, null])
    expect(cloned.ConvertValue('already')).toEqual(['already', null])
    expect(cloned.ConvertValue(true)).toEqual([true, null])
    expect(cloned.ConvertValue(new Uint8Array([7]))).toEqual([
      new Uint8Array([7]),
      null,
    ])
  })

  it('clones Bool, Int32, and String converters', () => {
    expect(cloneStructValue(Bool).ConvertValue('true')).toEqual([true, null])
    expect(cloneStructValue(Int32).ConvertValue(123)).toEqual([123, null])
    expect(cloneStructValue(String).ConvertValue('x')).toEqual(['x', null])
  })

  it('keeps sentinel error identity stable', () => {
    const skip = ErrSkip
    const bad = ErrBadConn

    expect(ErrSkip).toBe(skip)
    expect(ErrBadConn).toBe(bad)
    expect(ErrSkip).not.toBe(ErrBadConn)
  })
})
