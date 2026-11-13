import { afterEach, describe, expect, test, vi } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import {
  GenerateKey,
  PrivateKeySize,
  PrivateKey_Public,
  PublicKeySize,
  SignatureSize,
  Sign,
  Verify,
  VerifyWithOptions,
} from './index.js'

describe('crypto/ed25519 override', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('returns WebCrypto rejections as errors naming the call', async () => {
    const [pub, priv, genErr] = await GenerateKey(null)
    expect(genErr).toBeNull()
    const message = $.stringToBytes('goscript')
    const sig = await Sign(priv, message)

    vi.spyOn(globalThis.crypto.subtle, 'importKey').mockRejectedValue(
      new DOMException('rejected', 'DataError'),
    )
    const [, , err] = await GenerateKey(null)
    expect(err?.Error()).toBe(
      'crypto/ed25519: WebCrypto importKey pkcs8 (48 bytes): DataError: rejected',
    )
    expect((await VerifyWithOptions(pub, message, sig, null))?.Error()).toBe(
      'ed25519: invalid signature: crypto/ed25519: WebCrypto importKey raw (32 bytes): DataError: rejected',
    )
    expect(await Verify(pub, message, sig)).toBe(false)
  })

  test('generates keys and verifies signatures', async () => {
    const [pub, priv, err] = await GenerateKey(null)
    expect(err).toBeNull()
    expect($.len(pub)).toBe(PublicKeySize)
    expect($.len(priv)).toBe(PrivateKeySize)

    const message = $.stringToBytes('goscript')
    const sig = await Sign(priv, message)
    expect($.len(sig)).toBe(SignatureSize)
    expect(await Verify(pub, message, sig)).toBe(true)
    expect(await Verify(pub, $.stringToBytes('wrong'), sig)).toBe(false)
  })

  test('boxes public keys as crypto public keys', async () => {
    const [pub, priv, err] = await GenerateKey(null)
    expect(err).toBeNull()

    const boxed = PrivateKey_Public(priv)
    const [unboxed, ok] = $.typeAssertTuple<Uint8Array>(
      boxed,
      'ed25519.PublicKey',
    )
    expect(ok).toBe(true)
    expect(Array.from(unboxed)).toEqual(Array.from(pub))
    const [equaler, equalerOK] = $.typeAssertTuple<{
      Equal(x: unknown): boolean
    }>(boxed, {
      kind: $.TypeKind.Interface,
      methods: [
        {
          name: 'Equal',
          args: [{ name: 'x', type: 'crypto.PublicKey' }],
          returns: [
            { name: '_r0', type: { kind: $.TypeKind.Basic, name: 'bool' } },
          ],
        },
      ],
    })
    expect(equalerOK).toBe(true)
    expect(equaler.Equal(boxed)).toBe(true)
  })
})
