import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import * as strings from '@goscript/strings/index.js'
import * as json from '@goscript/encoding/json/index.js'
import * as http from '@goscript/net/http/index.js'
import * as io from './io.js'

function collector(async: boolean) {
  const chunks: string[] = []
  return {
    chunks,
    Write(p: $.Bytes): io.Awaitable<io.IOResult> {
      const result: io.IOResult = [$.len(p), null]
      if (!async) { chunks.push($.bytesToString(p)); return result }
      return Promise.resolve().then(() => { chunks.push($.bytesToString(p)); return result })
    },
  }
}

describe('consumers of promise-aware I/O interfaces', () => {
  for (const async of [false, true]) {
    it.each([
      [['a', 'b'], 'abba', 'bbbb'],
      [['ab', 'cd'], 'abba', 'cdba'],
      [['a', 'longer', 'b', 'also'], 'abba', 'longeralsoalsolonger'],
      [['alpha', 'one', 'beta', 'two'], 'alpha beta', 'one two'],
    ] as const)(`Replacer serializes writes (async=${async}) %s`, async (pairs, input, expected) => {
      const replacer = strings.NewReplacer(...pairs)
      const output = collector(async)
      const result = replacer.WriteString(output, input)
      expect(io.isAsync(result)).toBe(async)
      const [n, err] = await result
      expect(err).toBeNull()
      expect(output.chunks.join('')).toBe(expected)
      expect(n).toBe(new TextEncoder().encode(output.chunks.join('')).length)
    })
    it(`JSON Encoder and HTTP Header await writes (async=${async})`, async () => {
      const output = collector(async)
      expect(await new json.Encoder(output).Encode('hello')).toBeNull()
      expect(output.chunks.join('')).toBe('"hello"\n')
      const headers = new Map([['X-Test', ['one', 'two']]])
      output.chunks.length = 0
      expect(await http.Header_Write(headers, output)).toBeNull()
      expect(output.chunks.join('')).toBe('X-Test: one\r\nX-Test: two\r\n')
    })
  }
  it('preserves writer rejections through generator cleanup', async () => {
    const failure = new Error('write rejected')
    const output = { Write: (_p: $.Bytes) => Promise.reject<io.IOResult>(failure) }
    await expect(Promise.resolve(strings.NewReplacer('a', 'b').WriteString(output, 'a'))).rejects.toBe(failure)
    await expect(Promise.resolve(new json.Encoder(output).Encode(1))).rejects.toBe(failure)
  })
})
