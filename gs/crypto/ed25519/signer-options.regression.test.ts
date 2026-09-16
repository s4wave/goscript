import { describe, expect, it } from 'vitest'
import * as $ from '@goscript/builtin/index.js'
import {
  NewKeyFromSeed, Options, PrivateKey_Sign, Sign, Verify,
} from './index.js'

const message = new TextEncoder().encode('context must not be silently discarded')
async function privateKey(): Promise<$.Bytes> {
  return NewKeyFromSeed(new Uint8Array(32).fill(7))
}

describe('Ed25519 signer option enforcement', () => {
  it('rejects a nonempty Context instead of producing a pure Ed25519 signature', async () => {
    const [sig, err] = await PrivateKey_Sign(
      await privateKey(), null, message, new Options({ Context: 'protocol A' }),
    )
    expect(sig).toBeNull()
    expect(err?.Error()).toBe('ed25519: only pure Ed25519 is supported')
  })

  it('rejects unsupported context before invoking the signing backend', async () => {
    const [sig, err] = await PrivateKey_Sign(
      null, null, message, new Options({ Context: 'protocol A' }),
    )
    expect(sig).toBeNull()
    expect(err?.Error()).toBe('ed25519: only pure Ed25519 is supported')
  })

  it('checks Options behind a Go variable reference or interface method box', async () => {
    const options = new Options({ Context: 'protocol B' })
    for (const opts of [
      $.varRef(options),
      { __goType: '*ed25519.Options', __goValue: $.varRef(options), HashFunc: () => 0 },
    ]) {
      const [sig, err] = await PrivateKey_Sign(await privateKey(), null, message, opts)
      expect(sig).toBeNull()
      expect(err?.Error()).toBe('ed25519: only pure Ed25519 is supported')
    }
  })

  it('preserves pure signing for nil, plain, reference, and custom hash-zero options', async () => {
    const key = await privateKey()
    const expected = Array.from($.bytesToUint8Array(await Sign(key, message)))
    for (const opts of [null, new Options(), $.varRef(new Options()), { HashFunc: () => 0 }]) {
      const [sig, err] = await PrivateKey_Sign(key, null, message, opts)
      expect(err).toBeNull()
      expect(Array.from($.bytesToUint8Array(sig))).toEqual(expected)
      expect(await Verify($.goSlice(key, 32), message, sig)).toBe(true)
    }
  })

  it('continues rejecting unsupported prehash options', async () => {
    const [sig, err] = await PrivateKey_Sign(
      await privateKey(), null, message, new Options({ Hash: 5 }),
    )
    expect(sig).toBeNull()
    expect(err?.Error()).toBe('ed25519: expected opts.HashFunc() zero')
  })
})
