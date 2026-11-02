import * as $ from '@goscript/builtin/index.js'

import { fillSecureBytes } from './secure.js'

// Read fills b with host entropy independently of crypto/rand.Reader.
// Missing secure entropy fails rather than allowing key generation with zeros.
export function Read(b: $.Bytes): void {
  const err = fillSecureBytes(b)
  if (err != null) {
    $.panic(err)
  }
}
