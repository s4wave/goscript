import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetHostRuntimeForTests } from '@goscript/builtin/hostio.js'
import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as os from '@goscript/os/index.js'
import * as fmt from './fmt.js'

const originalDeno = (globalThis as any).Deno
const originalProcess = (globalThis as any).process

afterEach(() => {
  if (originalDeno === undefined) {
    delete (globalThis as any).Deno
  } else {
    ;(globalThis as any).Deno = originalDeno
  }

  if (originalProcess === undefined) {
    delete (globalThis as any).process
  } else {
    ;(globalThis as any).process = originalProcess
  }

  resetHostRuntimeForTests()
})

// Helper to capture stdout via the hostio text output path. Print functions
// resolve async Error/String operands on the microtask queue, so the runner
// may be async and is awaited before the captured text is read.
async function captureStdout(run: () => void | Promise<void>): Promise<string> {
  let buf = ''
  delete (globalThis as any).Deno
  ;(globalThis as any).process = {
    getBuiltinModule: vi.fn(() => ({
      readSync: vi.fn(),
      writeSync: vi.fn(
        (
          _fd: number,
          chunk: Uint8Array,
          _offset?: number,
          length?: number,
          _position?: number | null,
        ) => {
          buf += new TextDecoder().decode(
            chunk.subarray(0, length ?? chunk.length),
          )
          return length ?? chunk.length
        },
      ),
    })),
  }
  resetHostRuntimeForTests()
  await run()

  return buf
}

describe('fmt basic value formatting', () => {
  it('%T approximations for primitives', async () => {
    // routed through Sprintf which uses format parsing
    expect(await fmt.Sprintf('Type: %T', 123)).toBe('Type: int')
    expect(await fmt.Sprintf('Type: %T', 3.14)).toBe('Type: float64')
    expect(await fmt.Sprintf('Type: %T', 'hello')).toBe('Type: string')
    expect(await fmt.Sprintf('Type: %T', true)).toBe('Type: bool')
    expect(
      await fmt.Sprintf(
        'Type: %T',
        $.namedValueInterfaceValue(
          123,
          'int',
          {},
          {
            kind: $.TypeKind.Basic,
            name: 'int',
          },
        ),
      ),
    ).toBe('Type: int')
  })

  it('%d truncation behavior including negatives', async () => {
    expect(await fmt.Sprintf('%d', 42.9)).toBe('42')
    expect(await fmt.Sprintf('%d', -42.9)).toBe('-42')
  })

  it('formats full-width bigint integer values exactly', async () => {
    const value = 7165182398461461145n
    const exact = '7165182398461461145'

    expect(await fmt.Sprintf('%d', value)).toBe(exact)
    expect(await fmt.Sprintf('%v', value)).toBe(exact)
  })

  it('formats interface-boxed named uint64 bigint values exactly', async () => {
    const value = 7165182398461461145n
    const exact = '7165182398461461145'
    const boxed = $.namedValueInterfaceValue<unknown>(
      value,
      'uint64',
      {},
      { kind: $.TypeKind.Basic, name: 'uint64' },
    )

    expect(await fmt.Sprintf('%d', boxed)).toBe(exact)
    expect(await fmt.Sprintf('%v', boxed)).toBe(exact)
  })

  it('%q quoted string and rune', async () => {
    expect(await fmt.Sprintf('%q', 'hello')).toBe(JSON.stringify('hello'))
    // rune-like number
    expect(await fmt.Sprintf('%q', 97)).toBe(JSON.stringify('a'))
  })

  it('%c encodes runes including astral planes and invalid code points', async () => {
    expect(await fmt.Sprintf('%c', 0x597d)).toBe('好')
    // U+1F600 is above U+FFFF; fromCharCode would have truncated it.
    expect(await fmt.Sprintf('%c', 0x1f600)).toBe('😀')
    expect((await fmt.Sprintf('%c', 0x1f600)).codePointAt(0)).toBe(0x1f600)
    // Invalid code points map to U+FFFD instead of throwing.
    expect(await fmt.Sprintf('%c', 0x110000)).toBe('�')
    expect(await fmt.Sprintf('%c', -1)).toBe('�')
  })

  it('%q on an astral rune does not throw and round-trips the code point', async () => {
    expect(await fmt.Sprintf('%q', 0x1f600)).toBe(JSON.stringify('😀'))
    expect(await fmt.Sprintf('%q', 0x110000)).toBe(JSON.stringify('�'))
  })

  it('%p pointer-ish formatting fallback', async () => {
    expect(await fmt.Sprintf('%p', {})).toBe('0x0')
    expect(await fmt.Sprintf('%p', { __address: 255 })).toBe('0xff')
  })

  it('%v default formats for arrays/maps/sets', async () => {
    expect(await fmt.Sprintf('%v', [1, 2, 3])).toBe('[1 2 3]')
    const m = new Map<any, any>()
    m.set('a', 1)
    m.set('b', 2)
    const out = await fmt.Sprintf('%v', m)
    // Order in Map iteration is insertion order; verify shape
    expect(out.startsWith('{')).toBe(true)
    expect(out.includes('a:1')).toBe(true)
    expect(out.includes('b:2')).toBe(true)
    expect(out.endsWith('}')).toBe(true)

    const s = new Set<any>([1, 2, 3])
    expect(await fmt.Sprintf('%v', s)).toBe('[1 2 3]')
  })

  it('error and stringer precedence', async () => {
    const err = {
      Error() {
        return 'some error'
      },
    }
    expect(await fmt.Sprintf('%v', err)).toBe('some error')

    const stringer = {
      String() {
        return 'I am stringer'
      },
    }
    expect(await fmt.Sprintf('%v', stringer)).toBe('I am stringer')

    const goStringer = {
      GoString() {
        return '<go stringer>'
      },
    }
    // Go consults GoString only for %#v, never plain %v / Sprint.
    expect(await fmt.Sprintf('%#v', goStringer)).toBe('<go stringer>')
    expect(await fmt.Sprintf('%v', goStringer)).not.toBe('<go stringer>')
    expect(await fmt.Sprint(goStringer)).not.toBe('<go stringer>')
  })

  it('applies # base prefixes and +/space sign flags (Go parity)', async () => {
    expect(await fmt.Sprintf('%#x', 15)).toBe('0xf')
    expect(await fmt.Sprintf('%#X', 15)).toBe('0XF')
    expect(await fmt.Sprintf('%#o', 15)).toBe('017')
    expect(await fmt.Sprintf('%#x', 0)).toBe('0x0')
    expect(await fmt.Sprintf('%+d', 15)).toBe('+15')
    expect(await fmt.Sprintf('% d', 15)).toBe(' 15')
    expect(await fmt.Sprintf('%+d', -15)).toBe('-15')
  })

  it('%v prefers Stringer while %#v prefers GoStringer', async () => {
    const g = {
      String() {
        return 'G(7)'
      },
      GoString() {
        return 'main.G{n:7}'
      },
    }
    expect(await fmt.Sprintf('%v|%#v', g, g)).toBe('G(7)|main.G{n:7}')
    expect(await fmt.Sprint(g)).toBe('G(7)')
  })

  it('%w formats errors by Error method', async () => {
    const err = $.newError('root')
    expect((await fmt.Errorf('wrap: %w', err))?.Error()).toBe('wrap: root')
  })

  it('%w wraps so Unwrap and errors.Is reach the operand', async () => {
    const base = $.newError('root')
    const wrapped = await fmt.Errorf('ctx: %w', base)
    expect((wrapped as any).Unwrap()).toBe(base)
    expect(errors.Is(wrapped, base)).toBe(true)
  })

  it('multiple %w unwrap to every operand', async () => {
    const a = $.newError('a')
    const b = $.newError('b')
    const wrapped = await fmt.Errorf('%w and %w', a, b)
    expect(errors.Is(wrapped, a)).toBe(true)
    expect(errors.Is(wrapped, b)).toBe(true)
  })

  it('%s formats stringers by String method', async () => {
    const stringer = {
      String() {
        return 'string-value'
      },
    }
    expect(await fmt.Sprintf('value=%s', stringer)).toBe('value=string-value')
  })

  it('uses only fmt.Formatter-shaped Format methods', async () => {
    const formatter = {
      Format(state: fmt.State, verb: number) {
        state.Write($.stringToBytes(`${String.fromCharCode(verb)}:ok`))
      },
    }
    expect(await fmt.Sprintf('%s', formatter)).toBe('s:ok')

    const nodeLike = {
      Format(_buf: unknown) {
        throw new Error('domain Format should not be called by fmt')
      },
      String() {
        return 'node-string'
      },
    }
    expect(await fmt.Sprintf('%s', nodeLike)).toBe('node-string')
  })

  it('allows Sprintf callers to await async stringers', async () => {
    const stringer = {
      async String() {
        return 'async-string'
      },
    }
    expect(await fmt.Sprintf('value=%s', stringer)).toBe('value=async-string')
  })
})

describe('fmt spacing rules', () => {
  it('Sprint: space only between non-strings', async () => {
    // Two non-strings => one space
    expect(await fmt.Sprint(1, 2)).toBe('1 2')
    // If either is string => no automatic space
    expect(await fmt.Sprint('a', 'b')).toBe('ab')
    expect(await fmt.Sprint('a', 1)).toBe('a1')
    expect(await fmt.Sprint(1, 'b')).toBe('1b')
    // Mixed 3 args
    expect(await fmt.Sprint('a', 1, 'b')).toBe('a1b')
    // Go's Sprint inserts a space only when both adjacent operands are non-strings.
    // Between 'b' (string) and 2 (number) there is no automatic space.
    expect(await fmt.Sprint(1, 'b', 2)).toBe('1b2')
  })

  it('Print: same spacing as Sprint, outputs to stdout', async () => {
    const output = await captureStdout(async () => {
      await fmt.Print(1, 2, 'x', 3)
    })
    expect(output).toBe('1 2x3')
  })

  it('Println: always separates by spaces and appends newline', async () => {
    const output = await captureStdout(async () => {
      await fmt.Println('hi', 'there', 1, 2)
    })
    expect(output).toBe('hi there 1 2\n')
  })

  it('Fprint/Fprintln behave like Print/Println with writers', async () => {
    const chunks: Uint8Array[] = []
    const writer = {
      Write(b: Uint8Array): [number, any] {
        chunks.push(b)
        return [b.length, null]
      },
    }

    let [n, err] = await fmt.Fprint(writer, 1, 2, 'x', 3)
    expect(err).toBeNull()
    expect(n).toBe(5) // "1 2x3".length
    expect(new TextDecoder().decode(chunks[0])).toBe('1 2x3')
    ;[, err] = await fmt.Fprintln(writer, 'hi', 'there', 1, 2)
    expect(err).toBeNull()
    expect(new TextDecoder().decode(chunks[1])).toBe('hi there 1 2\n')
  })

  it('Fprintln writes Stderr through console.log in browser-like hosts', async () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    delete (globalThis as any).Deno
    delete (globalThis as any).process
    resetHostRuntimeForTests()

    try {
      const [n, err] = await fmt.Fprintln(os.Stderr!, 'err')
      expect(err).toBeNull()
      expect(n).toBe(4)
      expect(consoleLog).toHaveBeenCalledWith('err')
      expect(consoleError).not.toHaveBeenCalled()
    } finally {
      consoleLog.mockRestore()
      consoleError.mockRestore()
    }
  })

  it('Fprintf awaits async writers', async () => {
    const chunks: Uint8Array[] = []
    const writer = {
      async Write(b: Uint8Array): Promise<[number, any]> {
        chunks.push(b)
        return [b.length, null]
      },
    }

    const [n, err] = await fmt.Fprintf(writer, 'n=%d s=%s', 7, 'ok')
    expect(err).toBeNull()
    expect(n).toBe(8)
    expect(new TextDecoder().decode(chunks[0])).toBe('n=7 s=ok')
  })
})

describe('fmt parseFormat basic cases', () => {
  it('Printf with %d, %s, %f, width and precision', async () => {
    expect(await fmt.Sprintf('n=%d s=%s f=%f', 42, 'ok', 3.5)).toBe('n=42 s=ok f=3.5')
    expect(await fmt.Sprintf("'%5s'", 'hi')).toBe("'   hi'")
    expect(await fmt.Sprintf("'%-.3f'", 3.14159)).toBe("'3.142'") // JS rounds
    expect(await fmt.Sprintf("'%6.2f'", 3.14159)).toBe("'  3.14'")
  })

  it('Printf with %% and missing args', async () => {
    expect(await fmt.Sprintf('100%% done')).toBe('100% done')
    // When the first argument is present but the second is missing,
    // Go prints the formatted first arg followed by the missing marker for the second.
    expect(await fmt.Sprintf('%d %s', 1)).toBe('1 %!s(MISSING)')
  })

  it('Printf hex/octal/bin', async () => {
    expect(await fmt.Sprintf('%x %X %o %b', 255, 255, 8, 5)).toBe('ff FF 10 101')
  })

  it('Printf %c for code points', async () => {
    expect(await fmt.Sprintf('%c', 65)).toBe('A')
  })
})

describe('fmt scanning', () => {
  it('scans decimal fields separated by literals', async () => {
    const start = $.varRef(0)
    const end = $.varRef(0)

    const [n, err] = fmt.Sscanf(
      'bytes=12-34',
      'bytes=%d-%d',
      $.interfaceValue(start, '*int64'),
      $.interfaceValue(end, '*int64'),
    )

    expect(err).toBeNull()
    expect(n).toBe(2)
    expect(start.value).toBe(12)
    expect(end.value).toBe(34)
  })

  it('allows trailing input after the matched verbs (Go parity)', async () => {
    const v = $.varRef(0)
    const [n, err] = fmt.Sscanf(
      '123 trailing',
      '%d',
      $.interfaceValue(v, '*int64'),
    )
    expect(err).toBeNull()
    expect(n).toBe(1)
    expect(v.value).toBe(123)
  })
})
