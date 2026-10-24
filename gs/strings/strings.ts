import * as $ from '@goscript/builtin/index.js'
import * as unicode from '@goscript/unicode/index.js'

// A Go string is a JavaScript string with one character per UTF-8 byte (see
// the builtin package), so byte searches use the JavaScript string methods
// and rune operations decode the bytes.

// runeAt decodes the rune at byte offset i of s, returning it and its size.
function runeAt(s: string, i: number): [number, number] {
  const c = s.charCodeAt(i)
  return c < 0x80 ? [c, 1] : $.decodeRuneInString(s, i)
}

// lastRuneBefore decodes the rune that ends at byte offset end of s, as
// utf8.DecodeLastRuneInString does, returning it and its size.
function lastRuneBefore(s: string, end: number): [number, number] {
  // An ASCII byte is its own rune.
  const c = s.charCodeAt(end - 1)
  if (c < 0x80) {
    return [c, 1]
  }

  // The rune starts at most four bytes back, after its continuation bytes,
  // and is invalid unless it ends at end.
  const limit = Math.max(0, end - 4)
  let start = end - 1
  while (start > limit && (s.charCodeAt(start) & 0xc0) === 0x80) {
    start--
  }
  const [r, size] = $.decodeRuneInString(s, start)
  if (start + size !== end) {
    return [0xfffd, 1]
  }
  return [r, size]
}

// runeCount returns the number of runes in s.
function runeCount(s: string): number {
  let n = 0
  for (let i = 0; i < s.length; n++) {
    i += runeAt(s, i)[1]
  }
  return n
}

// runeStrings returns the runes of s as strings, each invalid byte alone.
function runeStrings(s: string): string[] {
  const out: string[] = []
  for (let i = 0; i < s.length; ) {
    const size = runeAt(s, i)[1]
    out.push(s.substring(i, i + size))
    i += size
  }
  return out
}

// runeSetContains reports whether the runes of chars include r.
function runeSetContains(chars: string, r: number): boolean {
  for (let i = 0; i < chars.length; ) {
    const [c, size] = runeAt(chars, i)
    if (c === r) {
      return true
    }
    i += size
  }
  return false
}

// Count counts the number of non-overlapping instances of substr in s.
// If substr is an empty string, Count returns 1 + the number of Unicode code points in s.
export function Count(s: string, substr: string): number {
  // The empty string matches before each rune and at the end.
  if (substr === '') {
    return runeCount(s) + 1
  }

  // Other matches are counted without overlap.
  let count = 0
  let pos = 0
  while (true) {
    const index = s.indexOf(substr, pos)
    if (index === -1) break
    count++
    pos = index + substr.length
  }
  return count
}

// Contains reports whether substr is within s.
export function Contains(s: string, substr: string): boolean {
  return s.includes(substr)
}

// ContainsAny reports whether any Unicode code points in chars are within s.
export function ContainsAny(s: string, chars: string): boolean {
  return IndexAny(s, chars) >= 0
}

// ContainsRune reports whether the Unicode code point r is within s.
export function ContainsRune(s: string, r: number): boolean {
  return IndexRune(s, r) >= 0
}

// ContainsFunc reports whether any Unicode code points r within s satisfy f(r).
export function ContainsFunc(
  s: string,
  f: ((r: number) => boolean) | null,
): boolean {
  return IndexFunc(s, f) >= 0
}

// Index returns the index of the first instance of substr in s, or -1 if substr is not present in s.
export function Index(s: string, substr: string): number {
  return s.indexOf(substr)
}

// LastIndex returns the index of the last instance of substr in s, or -1 if substr is not present in s.
export function LastIndex(s: string, substr: string): number {
  return s.lastIndexOf(substr)
}

// IndexByte returns the index of the first instance of c in s, or -1 if c is not present in s.
export function IndexByte(s: string, c: number): number {
  return s.indexOf(String.fromCharCode(c & 0xff))
}

// IndexRune returns the index of the first instance of the Unicode code point r, or -1 if rune is not present in s.
export function IndexRune(s: string, r: number): number {
  // An ASCII rune is a byte.
  if (r >= 0 && r < 0x80) {
    return s.indexOf(String.fromCharCode(r))
  }

  // RuneError matches both its encoding and any invalid byte, as in Go.
  if (r === 0xfffd) {
    for (let i = 0; i < s.length; ) {
      const [c, size] = runeAt(s, i)
      if (c === 0xfffd) {
        return i
      }
      i += size
    }
    return -1
  }

  // Another valid rune is found by its UTF-8 bytes.
  if (r < 0 || r > 0x10ffff || (r >= 0xd800 && r <= 0xdfff)) {
    return -1
  }
  return s.indexOf($.runeToString(r))
}

// IndexAny returns the index of the first instance of any Unicode code point from chars in s, or -1 if no Unicode code point from chars is present in s.
export function IndexAny(s: string, chars: string): number {
  // Each rune of s is looked up among the runes of chars.
  if (chars === '') {
    return -1
  }
  for (let i = 0; i < s.length; ) {
    const [r, size] = runeAt(s, i)
    if (runeSetContains(chars, r)) {
      return i
    }
    i += size
  }
  return -1
}

// LastIndexAny returns the index of the last instance of any Unicode code point from chars in s, or -1 if no Unicode code point from chars is present in s.
export function LastIndexAny(s: string, chars: string): number {
  // Each rune of s, from the end, is looked up among the runes of chars.
  if (chars === '') {
    return -1
  }
  for (let end = s.length; end > 0; ) {
    const [r, size] = lastRuneBefore(s, end)
    end -= size
    if (runeSetContains(chars, r)) {
      return end
    }
  }
  return -1
}

// LastIndexByte returns the index of the last instance of c in s, or -1 if c is not present in s.
export function LastIndexByte(s: string, c: number): number {
  return s.lastIndexOf(String.fromCharCode(c & 0xff))
}

// IndexFunc returns the index into s of the first Unicode code point satisfying f(c), or -1 if none do.
export function IndexFunc(
  s: string,
  f: ((r: number) => boolean) | null,
): number {
  // Each rune is tested in turn, from the start.
  if (!f) return -1
  for (let i = 0; i < s.length; ) {
    const [r, size] = runeAt(s, i)
    if (f(r)) {
      return i
    }
    i += size
  }
  return -1
}

// LastIndexFunc returns the index into s of the last Unicode code point satisfying f(c), or -1 if none do.
export function LastIndexFunc(
  s: string,
  f: ((r: number) => boolean) | null,
): number {
  // Each rune is tested in turn, from the end.
  if (!f) return -1
  for (let end = s.length; end > 0; ) {
    const [r, size] = lastRuneBefore(s, end)
    end -= size
    if (f(r)) {
      return end
    }
  }
  return -1
}

// Split slices s into all substrings separated by sep and returns a slice of the substrings between those separators.
export function Split(s: string, sep: string): $.Slice<string> {
  return SplitN(s, sep, -1)
}

// SplitN slices s into substrings separated by sep and returns a slice of the substrings between those separators.
export function SplitN(s: string, sep: string, n: number): $.Slice<string> {
  if (n === 0) {
    return $.arrayToSlice([])
  }
  if (n === 1) {
    return $.arrayToSlice([s])
  }
  if (sep === '') {
    return $.arrayToSlice(explode(s, n))
  }

  const parts = s.split(sep)
  if (n < 0 || parts.length <= n) {
    return $.arrayToSlice(parts)
  }

  const result = parts.slice(0, n - 1)
  result.push(parts.slice(n - 1).join(sep))
  return $.arrayToSlice(result)
}

// SplitAfter slices s into all substrings after each instance of sep and returns a slice of those substrings.
export function SplitAfter(s: string, sep: string): $.Slice<string> {
  return SplitAfterN(s, sep, -1)
}

// SplitAfterN slices s into substrings after each instance of sep and returns a slice of those substrings.
export function SplitAfterN(
  s: string,
  sep: string,
  n: number,
): $.Slice<string> {
  if (n === 0) {
    return $.arrayToSlice([])
  }
  if (sep === '') {
    return $.arrayToSlice(explode(s, n))
  }

  const parts: string[] = []
  let start = 0
  let count = 0

  while (n < 0 || count < n - 1) {
    const index = s.indexOf(sep, start)
    if (index === -1) break
    parts.push(s.slice(start, index + sep.length))
    start = index + sep.length
    count++
  }

  // The rest of s is always the last substring, even when it is empty
  // because s ends with sep.
  parts.push(s.slice(start))

  return $.arrayToSlice(parts)
}

// explode splits s into its characters, at most n of them (n < 0 means no
// limit), with the rest of s in the last substring, as Go's strings.explode.
// n must not be 0.
function explode(s: string, n: number): string[] {
  const chars = runeStrings(s)
  if (n < 0 || n >= chars.length) {
    return chars
  }
  return [...chars.slice(0, n - 1), chars.slice(n - 1).join('')]
}

// Fields splits the string s around each instance of one or more consecutive white space characters.
export function Fields(s: string): $.Slice<string> {
  return FieldsFunc(s, unicode.IsSpace)
}

// FieldsFunc splits the string s at each run of Unicode code points c satisfying f(c) and returns an array of slices of s.
export function FieldsFunc(
  s: string,
  f: ((r: number) => boolean) | null,
): $.Slice<string> {
  if (!f) return $.arrayToSlice([s])

  // A field starts at a rune not satisfying f and ends at one that does.
  const parts: string[] = []
  let start = -1
  for (let i = 0; i < s.length; ) {
    const [r, size] = runeAt(s, i)
    if (f(r)) {
      if (start >= 0) {
        parts.push(s.substring(start, i))
        start = -1
      }
    } else if (start < 0) {
      start = i
    }
    i += size
  }

  // A field may run to the end of s.
  if (start >= 0) {
    parts.push(s.substring(start))
  }
  return $.arrayToSlice(parts)
}

// Join concatenates the elements of elems to create a single string. The separator string sep is placed between elements in the resulting string.
export function Join(elems: $.Slice<string>, sep: string): string {
  const arr = $.asArray(elems)
  if (!$.isArrayOrGoSlice(arr)) {
    return ''
  }
  return arr.join(sep)
}

// HasPrefix tests whether the string s begins with prefix.
export function HasPrefix(s: string, prefix: string): boolean {
  return s.startsWith(prefix)
}

// HasSuffix tests whether the string s ends with suffix.
export function HasSuffix(s: string, suffix: string): boolean {
  return s.endsWith(suffix)
}

// Map returns a copy of the string s with all its characters modified according to the mapping function.
export function Map(
  mapping: ((r: number) => number) | null,
  s: string,
): string {
  if (!mapping) return s

  // As in Go, invalid UTF-8 bytes are mapped as RuneError, and a negative
  // mapping drops the rune.
  let result = ''
  for (const [, r] of $.rangeString(s)) {
    const mapped = mapping(r)
    if (mapped >= 0) {
      result += $.runeToString(mapped)
    }
  }
  return result
}

// Repeat returns a new string consisting of count copies of the string s.
export function Repeat(s: string, count: number): string {
  if (count < 0) {
    $.panic('strings: negative Repeat count')
  }
  return s.repeat(count)
}

// ToUpper returns s with all Unicode letters mapped to their upper case.
export function ToUpper(s: string): string {
  return Map(unicode.ToUpper, s)
}

// ToUpperSpecial returns s with all Unicode letters mapped to their upper case using the case mapping specified by c.
export function ToUpperSpecial(c: unicode.SpecialCase, s: string): string {
  return Map((r) => c.ToUpper(r), s)
}

// ToLower returns s with all Unicode letters mapped to their lower case.
export function ToLower(s: string): string {
  return Map(unicode.ToLower, s)
}

// ToLowerSpecial returns s with all Unicode letters mapped to their lower case using the case mapping specified by c.
export function ToLowerSpecial(c: unicode.SpecialCase, s: string): string {
  return Map((r) => c.ToLower(r), s)
}

// ToTitle returns a copy of the string s with all Unicode letters mapped to their Unicode title case.
export function ToTitle(s: string): string {
  return Map(unicode.ToTitle, s)
}

// ToTitleSpecial returns a copy of s with all Unicode letters mapped to their Unicode title case using the case mapping specified by c.
export function ToTitleSpecial(c: unicode.SpecialCase, s: string): string {
  return Map((r) => c.ToTitle(r), s)
}

// ToValidUTF8 returns a copy of the string s with each run of invalid UTF-8
// byte sequences replaced by the replacement string, which may be empty.
export function ToValidUTF8(s: string, replacement: string): string {
  // Valid runes are copied, and each run of invalid bytes is replaced once.
  let out = ''
  let start = 0 // start of the valid bytes not yet copied
  let invalid = false // previous byte was from an invalid UTF-8 sequence
  for (let i = 0; i < s.length; ) {
    const [r, size] = runeAt(s, i)
    if (r === 0xfffd && size === 1) {
      out += s.substring(start, i) + (invalid ? '' : replacement)
      invalid = true
      start = ++i
      continue
    }
    invalid = false
    i += size
  }
  return out + s.substring(start)
}

// isSeparator reports whether the rune could mark a word boundary.
function isSeparator(r: number): boolean {
  if (r <= 0x7f) {
    if (r >= 0x30 && r <= 0x39) return false
    if (r >= 0x61 && r <= 0x7a) return false
    if (r >= 0x41 && r <= 0x5a) return false
    if (r === 0x5f) return false
    return true
  }
  if (unicode.IsLetter(r) || unicode.IsDigit(r)) return false
  return unicode.IsSpace(r)
}

// Title returns a copy of the string s with all Unicode letters that begin words mapped to their Unicode title case.
export function Title(s: string): string {
  let prev = 0x20
  return Map((r) => {
    if (isSeparator(prev)) {
      prev = r
      return unicode.ToTitle(r)
    }
    prev = r
    return r
  }, s)
}

// TrimSpace returns a slice of the string s, with all leading and trailing white space removed.
export function TrimSpace(s: string): string {
  // ASCII white space is trimmed by its bytes.
  let start = 0
  let end = s.length
  while (start < end && isASCIISpace(s.charCodeAt(start))) {
    start++
  }
  while (end > start && isASCIISpace(s.charCodeAt(end - 1))) {
    end--
  }

  // Unicode white space may remain where a non-ASCII rune is at either end.
  const trimmed = s.substring(start, end)
  if (
    trimmed.length > 0 &&
    (trimmed.charCodeAt(0) >= 0x80 ||
      trimmed.charCodeAt(trimmed.length - 1) >= 0x80)
  ) {
    return TrimFunc(trimmed, unicode.IsSpace)
  }
  return trimmed
}

// isASCIISpace reports whether the byte c is ASCII white space.
function isASCIISpace(c: number): boolean {
  return c === 0x20 || (c >= 0x09 && c <= 0x0d)
}

// Trim returns a slice of the string s with all leading and trailing Unicode code points contained in cutset removed.
export function Trim(s: string, cutset: string): string {
  return TrimFunc(s, (r: number) => runeSetContains(cutset, r))
}

// TrimLeft returns a slice of the string s with all leading Unicode code points contained in cutset removed.
export function TrimLeft(s: string, cutset: string): string {
  return TrimLeftFunc(s, (r: number) => runeSetContains(cutset, r))
}

// TrimRight returns a slice of the string s with all trailing Unicode code points contained in cutset removed.
export function TrimRight(s: string, cutset: string): string {
  return TrimRightFunc(s, (r: number) => runeSetContains(cutset, r))
}

// TrimFunc returns a slice of the string s with all leading and trailing Unicode code points c satisfying f(c) removed.
export function TrimFunc(
  s: string,
  f: ((r: number) => boolean) | null,
): string {
  if (!f) return s
  return TrimRightFunc(TrimLeftFunc(s, f), f)
}

// TrimLeftFunc returns a slice of the string s with all leading Unicode code points c satisfying f(c) removed.
export function TrimLeftFunc(
  s: string,
  f: ((r: number) => boolean) | null,
): string {
  if (!f) return s

  // Leading runes satisfying f are skipped.
  let start = 0
  while (start < s.length) {
    const [r, size] = runeAt(s, start)
    if (!f(r)) {
      break
    }
    start += size
  }
  return s.substring(start)
}

// TrimRightFunc returns a slice of the string s with all trailing Unicode code points c satisfying f(c) removed.
export function TrimRightFunc(
  s: string,
  f: ((r: number) => boolean) | null,
): string {
  if (!f) return s

  // Trailing runes satisfying f are skipped.
  let end = s.length
  while (end > 0) {
    const [r, size] = lastRuneBefore(s, end)
    if (!f(r)) {
      break
    }
    end -= size
  }
  return s.substring(0, end)
}

// TrimPrefix returns s without the provided leading prefix string. If s doesn't start with prefix, s is returned unchanged.
export function TrimPrefix(s: string, prefix: string): string {
  if (s.startsWith(prefix)) {
    return s.slice(prefix.length)
  }
  return s
}

// TrimSuffix returns s without the provided ending suffix string. If s doesn't end with suffix, s is returned unchanged.
export function TrimSuffix(s: string, suffix: string): string {
  if (s.endsWith(suffix)) {
    return s.slice(0, s.length - suffix.length)
  }
  return s
}

// Replace returns a copy of the string s with the first n non-overlapping instances of old replaced by new.
export function Replace(
  s: string,
  old: string,
  newStr: string,
  n: number,
): string {
  if (n === 0 || old === newStr) {
    return s
  }

  if (old === '') {
    // Empty old matches at the start and after each rune (code point),
    // yielding up to runeCount+1 insertions; n < 0 means no limit.
    const runes = runeStrings(s)
    const limit = n < 0 ? runes.length + 1 : Math.min(n, runes.length + 1)
    let result = newStr
    let i = 0
    for (; i < limit - 1; i++) {
      result += runes[i] + newStr
    }
    return result + runes.slice(i).join('')
  }

  // Non-empty old: replace up to n occurrences; n < 0 means all.
  let result = ''
  let start = 0
  let count = 0
  while (n < 0 || count < n) {
    const index = s.indexOf(old, start)
    if (index === -1) break
    result += s.slice(start, index) + newStr
    start = index + old.length
    count++
  }
  return result + s.slice(start)
}

// ReplaceAll returns a copy of the string s with all non-overlapping instances of old replaced by new.
export function ReplaceAll(s: string, old: string, newStr: string): string {
  if (old === '') {
    return s
  }
  return s.split(old).join(newStr)
}

// EqualFold reports whether s and t, interpreted as UTF-8 strings, are equal under simple Unicode case-folding.
export function EqualFold(s: string, t: string): boolean {
  // The strings are compared a rune at a time.
  let i = 0
  let j = 0
  while (i < s.length && j < t.length) {
    // Equal runes match.
    let [a, as] = runeAt(s, i)
    let [b, bs] = runeAt(t, j)
    i += as
    j += bs
    if (a === b) continue

    // Otherwise a is the smaller rune.
    if (b < a) {
      const tmp = a
      a = b
      b = tmp
    }

    // ASCII runes match only as the same letter in opposite case.
    if (b < 0x80) {
      if (a >= 0x41 && a <= 0x5a && b === a + 0x20) continue
      return false
    }

    // Walk the simple-fold orbit of the smaller rune toward the larger.
    let r = unicode.SimpleFold(a)
    while (r !== a && r < b) {
      r = unicode.SimpleFold(r)
    }
    if (r === b) continue
    return false
  }

  // The strings match if both are used up.
  return i === s.length && j === t.length
}

// Compare returns an integer comparing two strings lexicographically.
export function Compare(a: string, b: string): number {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

// Cut slices s around the first instance of sep, returning the text before and after sep.
export function Cut(s: string, sep: string): [string, string, boolean] {
  const index = s.indexOf(sep)
  if (index === -1) {
    return [s, '', false]
  }
  return [s.slice(0, index), s.slice(index + sep.length), true]
}

// CutLast slices s around the last instance of sep, returning the text before and after sep.
export function CutLast(s: string, sep: string): [string, string, boolean] {
  const index = s.lastIndexOf(sep)
  if (index === -1) {
    return [s, '', false]
  }
  return [s.slice(0, index), s.slice(index + sep.length), true]
}

// CutPrefix returns s without the provided leading prefix string and reports whether it found the prefix.
export function CutPrefix(s: string, prefix: string): [string, boolean] {
  if (s.startsWith(prefix)) {
    return [s.slice(prefix.length), true]
  }
  return [s, false]
}

// CutSuffix returns s without the provided ending suffix string and reports whether it found the suffix.
export function CutSuffix(s: string, suffix: string): [string, boolean] {
  if (s.endsWith(suffix)) {
    return [s.slice(0, s.length - suffix.length), true]
  }
  return [s, false]
}

// Clone returns a fresh copy of s.
export function Clone(s: string): string {
  // In JavaScript, strings are immutable, so we can just return the string
  // But to match Go semantics, we'll create a new string
  return String(s)
}
