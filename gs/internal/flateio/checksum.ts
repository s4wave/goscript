const crcTable = makeCrcTable()

function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
}

/**
 * crc32 continues the IEEE CRC-32 checksum crc over length bytes of data
 * starting at offset. The checksum of no bytes is 0.
 */
export function crc32(crc: number, data: Uint8Array, length: number, offset: number): number {
  let c = ~crc
  for (let i = offset; i < offset + length; i++) c = crcTable[(c ^ data[i]) & 255] ^ (c >>> 8)
  return ~c >>> 0
}

/**
 * adler32 continues the Adler-32 checksum adler over length bytes of data
 * starting at offset. The checksum of no bytes is 1.
 */
export function adler32(adler: number, data: Uint8Array, length: number, offset: number): number {
  let a = adler & 0xffff
  let b = (adler >>> 16) & 0xffff
  let i = offset
  const end = offset + length
  while (i < end) {
    // Reduce the sums once per block instead of once per byte.
    const block = Math.min(end, i + 5552)
    for (; i < block; i++) {
      a += data[i]
      b += a
    }
    a %= 65521
    b %= 65521
  }
  return ((b << 16) | a) >>> 0
}
