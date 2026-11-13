import { afterEach, describe, expect, test, vi } from 'vitest'
import * as $ from '@goscript/builtin/index.js'

import {
  GenerateKey,
  NewKeyFromSeed,
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

  test('signs with the pure implementation when WebCrypto refuses a seed', async () => {
    // WebKit's libgcrypt backend refuses pkcs8 seeds whose first byte is zero.
    const seed = new Uint8Array(32).fill(7)
    seed[0] = 0
    const message = $.stringToBytes('goscript')
    const want = await NewKeyFromSeed(seed)
    const wantSig = await Sign(want, message)

    const importKey = globalThis.crypto.subtle.importKey.bind(
      globalThis.crypto.subtle,
    )
    vi.spyOn(globalThis.crypto.subtle, 'importKey').mockImplementation(
      (format, ...rest) =>
        format === 'pkcs8' ?
          Promise.reject(new DOMException('rejected', 'DataError'))
        : importKey(
            format as 'raw',
            ...(rest as [
              BufferSource,
              AlgorithmIdentifier,
              boolean,
              KeyUsage[],
            ]),
          ),
    )
    const got = await NewKeyFromSeed(seed)
    expect(Array.from(got)).toEqual(Array.from(want))
    const sig = await Sign(got, message)
    expect(Array.from(sig)).toEqual(Array.from(wantSig))
    expect(await Verify(want.subarray(32), message, sig)).toBe(true)
  })

  test('reports a refused public key as an invalid signature', async () => {
    const [pub, priv, err] = await GenerateKey(null)
    expect(err).toBeNull()
    const message = $.stringToBytes('goscript')
    const sig = await Sign(priv, message)

    vi.spyOn(globalThis.crypto.subtle, 'importKey').mockRejectedValue(
      new DOMException('rejected', 'DataError'),
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
