import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'
import { ed25519 as pureEd25519 } from '@noble/curves/ed25519.js'

export type PublicKey = $.Bytes
export type PrivateKey = $.Bytes
type Hash = number
type PublicKeyInterface = unknown
type PrivateKeyInterface = unknown
type SignerOpts = { HashFunc(): Hash }

export const PublicKeySize = 32
export const PrivateKeySize = 64
export const SignatureSize = 64
export const SeedSize = 32

const pkcs8Prefix = new Uint8Array([
  0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04,
  0x22, 0x04, 0x20,
])

export class Options {
  public Hash: Hash = 0
  public Context = ''

  constructor(init?: Partial<{ Hash: Hash; Context: string }>) {
    this.Hash = init?.Hash ?? 0
    this.Context = init?.Context ?? ''
  }

  public HashFunc(): Hash {
    return this.Hash
  }
}

export function PublicKey_Equal(
  pub: PublicKey,
  x: PublicKeyInterface | null,
): boolean {
  const [xx, ok] = $.typeAssertTuple<PublicKey>(x, 'ed25519.PublicKey')
  return ok && bytesEqual(pub, xx)
}

export function PrivateKey_Public(priv: PrivateKey): PublicKeyInterface | null {
  const publicKey = new Uint8Array(PublicKeySize)
  publicKey.set($.bytesToUint8Array(priv).subarray(SeedSize, PrivateKeySize))
  return $.namedValueInterfaceValue<PublicKeyInterface | null>(
    publicKey,
    'ed25519.PublicKey',
    { Equal: PublicKey_Equal },
    {
      kind: $.TypeKind.Slice,
      typeName: 'ed25519.PublicKey',
      elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
    },
    [
      {
        name: 'Equal',
        args: [{ name: 'x', type: 'crypto.PublicKey' }],
        returns: [
          { name: '_r0', type: { kind: $.TypeKind.Basic, name: 'bool' } },
        ],
      },
    ],
  )
}

export function PrivateKey_Equal(
  priv: PrivateKey,
  x: PrivateKeyInterface | null,
): boolean {
  const [xx, ok] = $.typeAssertTuple<PrivateKey>(x, 'ed25519.PrivateKey')
  return ok && bytesEqual(priv, xx)
}

export function PrivateKey_Seed(priv: PrivateKey): $.Bytes {
  return new Uint8Array($.bytesToUint8Array(priv).subarray(0, SeedSize))
}

export async function PrivateKey_Sign(
  priv: PrivateKey,
  _rand: io.Reader | null,
  message: $.Bytes,
  opts: SignerOpts | $.VarRef<SignerOpts> | null,
): Promise<[$.Bytes, $.GoError]> {
  const options = $.pointerValueOrNil(opts)
  if (options != null && options.HashFunc() !== 0) {
    return [null, new Ed25519Error('ed25519: expected opts.HashFunc() zero')]
  }
  // An interface box may expose HashFunc without exposing the concrete fields.
  const boxed = options as
    | (SignerOpts & {
        __goType?: string
        __goValue?: Options | $.VarRef<Options>
      })
    | null
  const concrete =
    boxed?.__goType === '*ed25519.Options' ?
      $.pointerValueOrNil(boxed.__goValue)
    : options
  if (concrete instanceof Options && concrete.Context !== '') {
    // The WebCrypto backend only implements pure Ed25519. Silently signing
    // without Context would remove the caller's requested domain separation.
    return [null, new Ed25519Error('ed25519: only pure Ed25519 is supported')]
  }
  return [await Sign(priv, message), null]
}

export async function GenerateKey(
  random: io.Reader | null,
): Promise<[PublicKey, PrivateKey, $.GoError]> {
  const seed = new Uint8Array(SeedSize)
  if (random == null) {
    const subtle = subtleCrypto()
    if (subtle == null) {
      return [
        null as PublicKey,
        null as PrivateKey,
        new Ed25519Error('crypto/ed25519: WebCrypto is unavailable'),
      ]
    }
    globalThis.crypto.getRandomValues(seed)
  } else {
    const [, err] = await io.ReadFull(random, seed)
    if (err != null) {
      return [null as PublicKey, null as PrivateKey, err]
    }
  }

  let privateKey: PrivateKey
  try {
    privateKey = await NewKeyFromSeed(seed)
  } catch (err) {
    // Go's GenerateKey reports failure through its error result. A WebCrypto
    // rejection thrown from here would escape the caller's error handling.
    return [
      null as PublicKey,
      null as PrivateKey,
      new Ed25519Error(errorText(err)),
    ]
  }
  return [
    $.mustTypeAssert<PublicKey>(
      PrivateKey_Public(privateKey),
      'ed25519.PublicKey',
    ),
    privateKey,
    null,
  ]
}

export async function NewKeyFromSeed(seed: $.Bytes): Promise<PrivateKey> {
  const seedBytes = $.bytesToUint8Array(seed)
  if (seedBytes.length !== SeedSize) {
    throw new Error(`ed25519: bad seed length: ${seedBytes.length}`)
  }

  const subtle = requireSubtle()
  const key = await importSigningKey(subtle, seedBytes, true)
  let publicKey: Uint8Array
  if (key == null) {
    publicKey = pureEd25519.getPublicKey(seedBytes)
  } else {
    const jwk = await named('exportKey jwk', 0, () =>
      subtle.exportKey('jwk', key),
    )
    if (typeof jwk.x !== 'string') {
      throw new Error('crypto/ed25519: imported key did not expose public key')
    }
    publicKey = base64URLDecode(jwk.x)
  }

  const privateKey = new Uint8Array(PrivateKeySize)
  privateKey.set(seedBytes, 0)
  privateKey.set(publicKey, SeedSize)
  return privateKey
}

export async function Sign(
  privateKey: PrivateKey,
  message: $.Bytes,
): Promise<$.Bytes> {
  const priv = $.bytesToUint8Array(privateKey)
  if (priv.length !== PrivateKeySize) {
    throw new Error(`ed25519: bad private key length: ${priv.length}`)
  }

  const subtle = requireSubtle()
  const seed = priv.subarray(0, SeedSize)
  const msg = $.bytesToUint8Array(message)
  const key = await importSigningKey(subtle, seed, false)
  if (key == null) {
    return pureEd25519.sign(msg, seed)
  }
  const sig = await named('sign', msg.length, () =>
    subtle.sign('Ed25519', key, msg as BufferSource),
  )
  return new Uint8Array(sig)
}

export async function Verify(
  publicKey: PublicKey,
  message: $.Bytes,
  sig: $.Bytes,
): Promise<boolean> {
  return (
    (await VerifyWithOptions(publicKey, message, sig, new Options())) == null
  )
}

export async function VerifyWithOptions(
  publicKey: PublicKey,
  message: $.Bytes,
  sig: $.Bytes,
  opts: Options | $.VarRef<Options> | null,
): Promise<$.GoError> {
  if ($.len(publicKey) !== PublicKeySize) {
    throw new Error(`ed25519: bad public key length: ${$.len(publicKey)}`)
  }
  if ($.len(sig) !== SignatureSize) {
    return new Ed25519Error('ed25519: bad signature length')
  }

  const options = $.pointerValueOrNil(opts)
  if (options != null && (options.Hash !== 0 || options.Context !== '')) {
    return new Ed25519Error('ed25519: only pure Ed25519 is supported')
  }

  // Go reports an unusable public key as an invalid signature, so a WebCrypto
  // rejection here is a verification failure rather than a panic.
  const subtle = requireSubtle()
  const pub = $.bytesToUint8Array(publicKey)
  const msg = $.bytesToUint8Array(message)
  let ok: boolean
  try {
    const key = await named('importKey raw', pub.length, () =>
      subtle.importKey('raw', pub as BufferSource, { name: 'Ed25519' }, false, [
        'verify',
      ]),
    )
    ok = await named('verify', msg.length, () =>
      subtle.verify(
        'Ed25519',
        key,
        $.bytesToUint8Array(sig) as BufferSource,
        msg as BufferSource,
      ),
    )
  } catch (err) {
    return new Ed25519Error(`ed25519: invalid signature: ${errorText(err)}`)
  }
  return ok ? null : new Ed25519Error('ed25519: invalid signature')
}

class Ed25519Error {
  constructor(private readonly message: string) {}

  Error(): string {
    return this.message
  }
}

// importSigningKey imports seed as a WebCrypto Ed25519 signing key, or returns
// null when the engine refuses it. Every 32-byte seed is a valid Ed25519
// private key, but WebKit's libgcrypt backend rejects a pkcs8 seed whose first
// byte is zero, one key in 256, with DataError. Callers then use the pure
// implementation, which gives the same keys and signatures.
async function importSigningKey(
  subtle: SubtleCrypto,
  seed: Uint8Array,
  extractable: boolean,
): Promise<CryptoKey | null> {
  try {
    return await subtle.importKey(
      'pkcs8',
      pkcs8FromSeed(seed) as BufferSource,
      { name: 'Ed25519' },
      extractable,
      ['sign'],
    )
  } catch {
    return null
  }
}

// named runs one WebCrypto call and, on rejection, throws an error naming the
// call and its input length. The message never carries key or input bytes.
async function named<T>(
  call: string,
  inputLen: number,
  run: () => Promise<T>,
): Promise<T> {
  try {
    return await run()
  } catch (err) {
    throw new Error(
      `crypto/ed25519: WebCrypto ${call} (${inputLen} bytes): ${errorText(err)}`,
      { cause: err },
    )
  }
}

function errorText(err: unknown): string {
  if (err instanceof Error) {
    return err.name === 'Error' ? err.message : `${err.name}: ${err.message}`
  }
  return String(err)
}

function requireSubtle(): SubtleCrypto {
  const subtle = subtleCrypto()
  if (subtle == null) {
    throw new Error('crypto/ed25519: WebCrypto Ed25519 is unavailable')
  }
  return subtle
}

function subtleCrypto(): SubtleCrypto | null {
  const crypto = globalThis.crypto
  if (crypto?.subtle && typeof crypto.subtle.importKey === 'function') {
    return crypto.subtle
  }
  return null
}

function pkcs8FromSeed(seed: Uint8Array): Uint8Array {
  const out = new Uint8Array(pkcs8Prefix.length + SeedSize)
  out.set(pkcs8Prefix)
  out.set(seed, pkcs8Prefix.length)
  return out
}

function bytesEqual(a: $.Bytes, b: $.Bytes): boolean {
  const aa = $.bytesToUint8Array(a)
  const bb = $.bytesToUint8Array(b)
  if (aa.length !== bb.length) {
    return false
  }
  let diff = 0
  for (let i = 0; i < aa.length; i++) {
    diff |= aa[i] ^ bb[i]
  }
  return diff === 0
}

function base64URLDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
}
