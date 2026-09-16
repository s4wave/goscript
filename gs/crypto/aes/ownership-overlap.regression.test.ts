import { Buffer } from 'node:buffer'
import { createCipheriv } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import { AESBlock, NewCipher } from './index.js'

function reference(key: Uint8Array, input: Uint8Array): Uint8Array {
  const c = createCipheriv(`aes-${key.length * 8}-ecb`, key, null)
  c.setAutoPadding(false)
  return new Uint8Array(Buffer.concat([c.update(input), c.final()]))
}
const plain = Uint8Array.from({ length: 16 }, (_, i) => i)
const values = (b: $.Bytes) => Array.from($.bytesToUint8Array(b))

describe('AES key ownership and block overlap', () => {
  for (const keySize of [16, 24, 32]) {
    for (const view of [false, true]) {
      it(`owns a ${keySize}-byte Buffer key (subarray=${view})`, async () => {
        const storage = Buffer.alloc(keySize + 8, 0x5a)
        const key = view ? storage.subarray(3, 3 + keySize) : Buffer.alloc(keySize, 0x5a)
        const saved = new Uint8Array(key)
        const [block, err] = NewCipher(key)
        expect(err).toBeNull()
        const cached = await (block as AESBlock).webCryptoKey()
        key.fill(0)
        const output = new Uint8Array(20).fill(0xa5)
        block!.Encrypt(output, plain)
        expect(values(output.subarray(0, 16))).toEqual(values(reference(saved, plain)))
        expect(values(output.subarray(16))).toEqual([0xa5, 0xa5, 0xa5, 0xa5])
        expect(await (block as AESBlock).webCryptoKey()).toBe(cached)
        const recovered = new Uint8Array(16)
        block!.Decrypt(recovered, output)
        expect(values(recovered)).toEqual(values(plain))
      })
    }
  }
  it('owns directly constructed AESBlock keys before lazy import', async () => {
    const key = Buffer.alloc(16, 7)
    const original = new Uint8Array(key)
    const block = new AESBlock(key)
    key.fill(0)
    const output = new Uint8Array(16)
    block.Encrypt(output, plain)
    expect(values(output)).toEqual(values(reference(original, plain)))
    const iv = new Uint8Array(12)
    const expectedKey = await crypto.subtle.importKey('raw', original, 'AES-GCM', false, ['encrypt'])
    const actual = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await block.webCryptoKey(), plain)
    const expected = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, expectedKey, plain)
    expect(values(new Uint8Array(actual))).toEqual(values(new Uint8Array(expected)))
  })
  for (const kind of ['uint8', 'buffer', 'array'] as const) {
    for (const direction of [-1, 1]) {
      for (const operation of ['Encrypt', 'Decrypt'] as const) {
        it(`rejects ${kind} ${operation} overlap ${direction} without mutation`, () => {
          const storage: $.Bytes = kind === 'buffer' ? Buffer.alloc(40, 9)
            : kind === 'array' ? Array<number>(40).fill(9) : new Uint8Array(40).fill(9)
          const before = values(storage)
          const [block] = NewCipher(new Uint8Array(16))
          const src = $.goSlice(storage, direction > 0 ? 0 : 1, direction > 0 ? 16 : 17)
          const dst = $.goSlice(storage, direction > 0 ? 1 : 0, direction > 0 ? 17 : 16)
          expect(() => block![operation](dst, src)).toThrow('invalid buffer overlap')
          expect(values(storage)).toEqual(before)
        })
      }
    }
    it(`supports ${kind} exact aliasing and disjoint views`, () => {
      const storage: $.Bytes = kind === 'buffer' ? Buffer.alloc(48)
        : kind === 'array' ? Array<number>(48).fill(0) : new Uint8Array(48)
      $.copy(storage, plain)
      const [block] = NewCipher(new Uint8Array(16))
      const src = $.goSlice(storage, 0, 16)
      const dst = $.goSlice(storage, 0, 48)
      block!.Encrypt(dst, src)
      expect(values($.goSlice(storage, 0, 16))).toEqual(values(reference(new Uint8Array(16), plain)))
      block!.Decrypt($.goSlice(storage, 16, 48), src)
      expect(values($.goSlice(storage, 16, 32))).toEqual(values(plain))
      expect(values($.goSlice(storage, 32))).toEqual(Array<number>(16).fill(0))
    })
  }
})
