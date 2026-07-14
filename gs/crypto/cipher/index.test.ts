import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import { NewCipher } from '@goscript/crypto/aes/index.js'

import { NewGCMWithRandomNonce } from './index.js'

describe('crypto/cipher override', () => {
  it('seals and opens GCM payloads with a prepended random nonce', async () => {
    const [block, blockErr] = NewCipher(new Uint8Array(16))
    expect(blockErr).toBeNull()
    const [aead, aeadErr] = NewGCMWithRandomNonce(block)
    expect(aeadErr).toBeNull()
    expect(aead?.NonceSize()).toBe(0)
    expect(aead?.Overhead()).toBe(28)

    const plaintext = $.stringToBytes('goscript')
    const additionalData = $.stringToBytes('quic token')
    const sealed = await aead!.Seal(null, null, plaintext, additionalData)
    expect($.len(sealed)).toBe($.len(plaintext) + 28)

    const [opened, openErr] = await aead!.Open(
      null,
      null,
      sealed,
      additionalData,
    )
    expect(openErr).toBeNull()
    expect($.bytesToUint8Array(opened)).toEqual(
      $.bytesToUint8Array(plaintext),
    )
  })

  it('rejects non-empty explicit nonces', async () => {
    const [block] = NewCipher(new Uint8Array(16))
    const [aead] = NewGCMWithRandomNonce(block)

    await expect(
      aead!.Seal(null, new Uint8Array([1]), null, null),
    ).rejects.toThrow(
      'crypto/cipher: non-empty nonce passed to GCMWithRandomNonce',
    )
  })
})
