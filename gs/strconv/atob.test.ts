import { describe, expect, it } from 'vitest'

import { FormatBool, ParseBool } from './atob.gs.js'
import { ErrSyntax, NumError } from './atoi.gs.js'

describe('strconv.FormatBool', () => {
  it('formats booleans as Go lowercase literals', () => {
    expect(FormatBool(true)).toBe('true')
    expect(FormatBool(false)).toBe('false')
  })
})

describe('strconv.ParseBool', () => {
  it('accepts Go true and false spellings', () => {
    for (const input of ['1', 't', 'T', 'true', 'TRUE', 'True']) {
      expect(ParseBool(input)).toEqual([true, null])
    }

    for (const input of ['0', 'f', 'F', 'false', 'FALSE', 'False']) {
      expect(ParseBool(input)).toEqual([false, null])
    }
  })

  it('returns a NumError with ErrSyntax for invalid boolean text', () => {
    const [value, err] = ParseBool('yes')

    expect(value).toBe(false)
    expect((err as NumError).Func).toBe('ParseBool')
    expect((err as NumError).Num).toBe('yes')
    expect((err as NumError).Err).toBe(ErrSyntax)
  })
})
