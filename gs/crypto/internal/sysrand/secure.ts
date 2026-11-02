import * as $ from '@goscript/builtin/index.js'

const maxGetRandomValuesBytes = 65536

// fillSecureBytes fills every byte from host entropy, in Web Crypto quota-sized calls.
export function fillSecureBytes(dst: $.Bytes): string | null {
  // Empty buffers need no host entropy source.
  const length = $.len(dst)
  if (length === 0) {
    return null
  }

  // Reject an unavailable secure source without substituting deterministic data.
  const crypto = secureCrypto()
  if (crypto == null) {
    return 'crypto/rand: Web Crypto getRandomValues is unavailable'
  }

  // Fill native byte views directly, preserving the caller's slice bounds.
  if (dst instanceof Uint8Array) {
    fillUint8Array(crypto, dst)
    return null
  }

  // Copy back for Go slices represented by another array view.
  const tmp = new Uint8Array(length)
  fillUint8Array(crypto, tmp)
  $.copy(dst, tmp)
  return null
}

function fillUint8Array(crypto: Crypto, dst: Uint8Array): void {
  for (let offset = 0; offset < dst.length; offset += maxGetRandomValuesBytes) {
    const chunk = dst.subarray(
      offset,
      Math.min(offset + maxGetRandomValuesBytes, dst.length),
    ) as Uint8Array<ArrayBuffer>
    crypto.getRandomValues(chunk)
  }
}

function secureCrypto(): Crypto | null {
  const crypto = globalThis.crypto
  if (crypto && typeof crypto.getRandomValues === 'function') {
    return crypto
  }
  return null
}
