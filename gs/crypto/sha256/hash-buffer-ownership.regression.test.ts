import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import { getHostRuntime, type NodeCryptoHash } from '@goscript/builtin/hostio.js'
import * as sha1 from '../sha1/index.js'
import * as sha256 from './index.js'
import * as sha512 from '../sha512/index.js'

type Digest = { Write(p: $.Bytes): [number, $.GoError]; Sum(p: $.Bytes): Promise<$.Bytes>; Reset(): void }
const algorithms: [string, () => Digest][] = [
  ['sha1', sha1.New], ['sha224', sha256.New224], ['sha256', sha256.New],
  ['sha384', sha512.New384], ['sha512', sha512.New],
  ['sha512-224', sha512.New512_224], ['sha512-256', sha512.New512_256],
]
const hex = (b: $.Bytes) => Buffer.from($.bytesToUint8Array(b)).toString('hex')

describe('hash fallback input ownership', () => {
  for (const [algorithm, make] of algorithms) {
    for (const mode of ['copy', 'no-copy', 'webcrypto'] as const) {
      if (mode === 'webcrypto' && algorithm.startsWith('sha512-')) continue
      it(`${algorithm} owns reused Buffer writes in ${mode} mode`, async () => {
        const host = getHostRuntime()
        const saved = host.nodeCrypto
        try {
          host.nodeCrypto = mode === 'webcrypto' ? null : {
            createHash(name: string): NodeCryptoHash {
              const native = createHash(name)
              if (mode === 'copy') return native
              const wrapped: NodeCryptoHash = {
                update(bytes) { native.update(bytes); return wrapped },
                digest() { return native.digest() },
              }
              return wrapped
            },
          }
          const digest = make()
          const storage = Buffer.from('..abc..')
          const input = storage.subarray(2, 5)
          expect(digest.Write(input)).toEqual([3, null])
          input.set(Buffer.from('def'))
          expect(digest.Write(input)).toEqual([3, null])
          input.fill(0)
          const expected = createHash(algorithm).update('abcdef').digest('hex')
          expect(hex(await digest.Sum(null))).toBe(expected)
          expect(hex(await digest.Sum(null))).toBe(expected)
          digest.Write(Buffer.from('!'))
          expect(hex(await digest.Sum(null))).toBe(createHash(algorithm).update('abcdef!').digest('hex'))
          digest.Reset()
          expect(hex(await digest.Sum(null))).toBe(createHash(algorithm).digest('hex'))
        } finally {
          host.nodeCrypto = saved
        }
      })
    }
  }
})
