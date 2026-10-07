// Go 1.22 ServeMux patterns and the routing tree that matches requests to them.

import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as path from '@goscript/path/index.js'

/**
 * Relationship describes how the requests matched by one pattern compare with
 * the requests matched by another.
 */
type Relationship =
  | 'equivalent'
  | 'moreGeneral'
  | 'moreSpecific'
  | 'disjoint'
  | 'overlaps'

/**
 * Segment is one piece of a pattern path. A literal segment matches one path
 * segment, or a trailing slash when s is "/". A wild segment matches one path
 * segment and records it under the name s. A multi segment matches all the
 * remaining path segments. A path ending in "/" ends in an anonymous multi
 * segment, and a path ending in "{$}" ends in the literal segment "/".
 */
export interface Segment {
  s: string
  wild: boolean
  multi: boolean
}

/**
 * Pattern is a parsed ServeMux pattern: an optional method, an optional host,
 * and a path of segments.
 */
export class Pattern {
  constructor(
    public readonly str: string,
    public readonly method: string,
    public readonly host: string,
    public readonly segments: Segment[],
  ) {}

  /** lastSegment returns the final path segment of the pattern. */
  public lastSegment(): Segment {
    return this.segments[this.segments.length - 1]!
  }

  /**
   * wildcardIndex returns the position of name among the named wildcards, or
   * -1 when the pattern has no such wildcard.
   */
  public wildcardIndex(name: string): number {
    return this.segments
      .filter((seg) => seg.wild && seg.s !== '')
      .findIndex((seg) => seg.s === name)
  }

  /**
   * conflictsWith reports whether some request matches both patterns while
   * neither takes precedence. A pattern with a host always wins over one
   * without, so differing hosts never conflict.
   */
  public conflictsWith(other: Pattern): boolean {
    if (this.host !== other.host) {
      return false
    }
    const rel = this.comparePathsAndMethods(other)
    return rel === 'equivalent' || rel === 'overlaps'
  }

  /**
   * describeConflict explains why two conflicting patterns have no
   * precedence.
   */
  public describeConflict(other: Pattern): string {
    return this.comparePathsAndMethods(other) === 'equivalent' ?
        `${this.str} matches the same requests as ${other.str}`
      : `${this.str} and ${other.str} both match some requests, but neither is more specific`
  }

  private comparePathsAndMethods(other: Pattern): Relationship {
    const mrel = this.compareMethods(other)
    if (mrel === 'disjoint') {
      return mrel
    }
    return combineRelationships(mrel, this.comparePaths(other))
  }

  // compareMethods orders the method parts: the empty method matches any
  // method, GET matches GET and HEAD, and anything else matches only itself.
  private compareMethods(other: Pattern): Relationship {
    // The empty method is the most general, then GET over HEAD.
    if (this.method === other.method) {
      return 'equivalent'
    }
    if (this.method === '') {
      return 'moreGeneral'
    }
    if (other.method === '') {
      return 'moreSpecific'
    }
    if (this.method === 'GET' && other.method === 'HEAD') {
      return 'moreGeneral'
    }
    if (other.method === 'GET' && this.method === 'HEAD') {
      return 'moreSpecific'
    }
    return 'disjoint'
  }

  private comparePaths(other: Pattern): Relationship {
    // Without a multi segment a path matches only its own segment count.
    if (
      this.segments.length !== other.segments.length &&
      !this.lastSegment().multi &&
      !other.lastSegment().multi
    ) {
      return 'disjoint'
    }

    // Combine the relationships of the corresponding segments.
    const shared = Math.min(this.segments.length, other.segments.length)
    let rel: Relationship = 'equivalent'
    for (let i = 0; i < shared; i++) {
      rel = combineRelationships(
        rel,
        compareSegments(this.segments[i]!, other.segments[i]!),
      )
      if (rel === 'disjoint') {
        return rel
      }
    }
    if (this.segments.length === other.segments.length) {
      return rel
    }

    // The shorter pattern matches the rest of the longer only through a
    // trailing multi segment.
    if (this.segments.length < other.segments.length) {
      return this.lastSegment().multi ?
          combineRelationships(rel, 'moreGeneral')
        : 'disjoint'
    }
    return other.lastSegment().multi ?
        combineRelationships(rel, 'moreSpecific')
      : 'disjoint'
  }
}

function compareSegments(s1: Segment, s2: Segment): Relationship {
  // A multi segment is more general than any other segment.
  if (s1.multi && s2.multi) {
    return 'equivalent'
  }
  if (s1.multi) {
    return 'moreGeneral'
  }
  if (s2.multi) {
    return 'moreSpecific'
  }
  if (s1.wild && s2.wild) {
    return 'equivalent'
  }

  // A single wildcard never matches a trailing slash.
  if (s1.wild) {
    return s2.s === '/' ? 'disjoint' : 'moreGeneral'
  }
  if (s2.wild) {
    return s1.s === '/' ? 'disjoint' : 'moreSpecific'
  }
  return s1.s === s2.s ? 'equivalent' : 'disjoint'
}

// combineRelationships joins the relationships of two parts of a pattern pair
// into the relationship of the whole.
function combineRelationships(
  r1: Relationship,
  r2: Relationship,
): Relationship {
  switch (r1) {
    case 'equivalent':
      return r2
    case 'disjoint':
      return r1
    case 'overlaps':
      return r2 === 'disjoint' ? r2 : r1
    case 'moreGeneral':
    case 'moreSpecific':
      if (r2 === 'equivalent') {
        return r1
      }
      return r2 === inverseRelationship(r1) ? 'overlaps' : r2
  }
}

function inverseRelationship(r: Relationship): Relationship {
  switch (r) {
    case 'moreSpecific':
      return 'moreGeneral'
    case 'moreGeneral':
      return 'moreSpecific'
    default:
      return r
  }
}

/**
 * parsePattern parses "[METHOD] [HOST]/[PATH]", where each PATH segment is a
 * literal or one of the wildcards "{name}", "{name...}" and "{$}". It panics
 * with an error describing the first problem in an invalid pattern.
 */
export function parsePattern(s: string): Pattern {
  // Split off the method, which a space or tab separates from the rest.
  let off = 0
  const fail = (msg: string): never =>
    $.panic(errors.New(`parsing "${s}": at offset ${off}: ${msg}`))
  let method = ''
  let rest = s
  const space = s.search(/[ \t]/)
  if (space >= 0) {
    method = s.slice(0, space)
    rest = s.slice(space + 1).replace(/^[ \t]+/, '')
    off = method.length + 1
  }
  if (method !== '' && !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(method)) {
    fail(`invalid method "${method}"`)
  }

  // Split the host from the path, which starts at the first slash.
  const slash = rest.indexOf('/')
  if (slash < 0) {
    fail('host/path missing /')
  }
  const host = rest.slice(0, slash)
  rest = rest.slice(slash)
  const brace = host.indexOf('{')
  if (brace >= 0) {
    off += brace
    fail("host contains '{' (missing initial '/'?)")
  }
  off += slash

  // Paths are cleaned before matching, so only CONNECT can use an unclean one.
  if (method !== '' && method !== 'CONNECT' && rest !== cleanPath(rest)) {
    fail('non-CONNECT pattern with unclean path can never match')
  }

  // Parse the path one segment at a time.
  const segments: Segment[] = []
  const seenNames = new Set<string>()
  while (rest.length > 0) {
    rest = rest.slice(1)
    off = s.length - rest.length
    if (rest.length === 0) {
      segments.push({ s: '', wild: true, multi: true })
      break
    }
    const end = rest.indexOf('/')
    const seg = end < 0 ? rest : rest.slice(0, end)
    rest = end < 0 ? '' : rest.slice(end)

    const open = seg.indexOf('{')
    if (open < 0) {
      segments.push({ s: pathUnescape(seg), wild: false, multi: false })
      continue
    }
    if (open !== 0) {
      fail("bad wildcard segment (must start with '{')")
    }
    if (!seg.endsWith('}')) {
      fail("bad wildcard segment (must end with '}')")
    }

    let name = seg.slice(1, -1)
    if (name === '$') {
      if (rest.length !== 0) {
        fail('{$} not at end')
      }
      segments.push({ s: '/', wild: false, multi: false })
      break
    }
    const multi = name.endsWith('...')
    if (multi) {
      name = name.slice(0, -3)
      if (rest.length !== 0) {
        fail('{...} wildcard not at end')
      }
    }
    if (name === '') {
      fail('empty wildcard')
    }
    if (!/^[\p{L}_][\p{L}\p{Nd}_]*$/u.test(name)) {
      fail(`bad wildcard name "${name}"`)
    }
    if (seenNames.has(name)) {
      fail(`duplicate wildcard name "${name}"`)
    }
    seenNames.add(name)
    segments.push({ s: name, wild: true, multi })
  }

  return new Pattern(s, method, host, segments)
}

/**
 * pathUnescape decodes the percent escapes of a path segment, returning the
 * input unchanged when it is not validly escaped.
 */
export function pathUnescape(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

/**
 * cleanPath returns the canonical form of p: rooted, without "." or ".."
 * elements or repeated slashes, and keeping a trailing slash.
 */
export function cleanPath(p: string): string {
  if (p === '') {
    return '/'
  }
  if (!p.startsWith('/')) {
    p = '/' + p
  }
  const cleaned = path.Clean(p)
  return p.endsWith('/') && cleaned !== '/' ? cleaned + '/' : cleaned
}

/**
 * exactMatch reports whether the leaf's pattern matches the path without a
 * multi wildcard consuming a non-empty remainder. A nil leaf never matches.
 */
export function exactMatch<H>(leaf: Leaf<H> | null, p: string): boolean {
  if (leaf == null) {
    return false
  }
  if (!leaf.pattern.lastSegment().multi) {
    return true
  }

  // A multi wildcard matches the empty string only after a trailing slash,
  // when the pattern has as many segments as the path has slashes.
  if (!p.endsWith('/')) {
    return false
  }
  return leaf.pattern.segments.length === p.split('/').length - 1
}

/** Leaf is a registered pattern with its handler. */
export interface Leaf<H> {
  pattern: Pattern
  handler: H
}

// RoutingNode is one level of the routing tree. The tree is keyed by host,
// then method, then path segment. The empty key, held in emptyChild, stands
// for no host, any method, or a single wildcard segment.
class RoutingNode<H> {
  public leaf: Leaf<H> | null = null
  public multiChild: RoutingNode<H> | null = null
  public emptyChild: RoutingNode<H> | null = null
  public children = new Map<string, RoutingNode<H>>()

  public addChild(key: string): RoutingNode<H> {
    if (key === '') {
      return (this.emptyChild ??= new RoutingNode<H>())
    }
    let child = this.children.get(key)
    if (child == null) {
      child = new RoutingNode<H>()
      this.children.set(key, child)
    }
    return child
  }

  public findChild(key: string): RoutingNode<H> | null {
    return key === '' ? this.emptyChild : (this.children.get(key) ?? null)
  }

  // matchMethodAndPath matches the path under the pattern's method, which is
  // the request method, GET for a HEAD request, or else any method.
  public matchMethodAndPath(
    method: string,
    p: string,
  ): [Leaf<H> | null, string[]] {
    const exact = this.findChild(method)?.matchPath(p, [])
    if (exact?.[0] != null) {
      return exact
    }
    if (method === 'HEAD') {
      const get = this.findChild('GET')?.matchPath(p, [])
      if (get?.[0] != null) {
        return get
      }
    }
    return this.emptyChild?.matchPath(p, []) ?? [null, []]
  }

  // matchPath finds the leaf under this node that matches the path and
  // returns it with the values of the wildcards matched so far. At each
  // segment it prefers a literal child, then a single wildcard, then a multi
  // wildcard, which registration guarantees is the most specific order.
  public matchPath(p: string, matches: string[]): [Leaf<H> | null, string[]] {
    // An empty path matches only at a leaf.
    if (p === '') {
      return [this.leaf, matches]
    }

    // Try the literal child for the first segment.
    const [seg, rest] = firstSegment(p)
    const [literal, literalMatches] = this.findChild(seg)?.matchPath(
      rest,
      matches,
    ) ?? [null, matches]
    if (literal != null) {
      return [literal, literalMatches]
    }

    // Try the single wildcard, which does not match a trailing slash.
    if (seg !== '/') {
      const [single, singleMatches] = this.emptyChild?.matchPath(rest, [
        ...matches,
        seg,
      ]) ?? [null, matches]
      if (single != null) {
        return [single, singleMatches]
      }
    }

    // Take the rest of the path for a multi wildcard, which records no value
    // when it is anonymous.
    const multi = this.multiChild?.leaf
    if (multi != null) {
      const named = multi.pattern.lastSegment().s !== ''
      return [multi, named ? [...matches, pathUnescape(p.slice(1))] : matches]
    }
    return [null, matches]
  }

  // matchingMethods adds to set each method with a leaf matching the path.
  public matchingMethods(p: string, set: Set<string>): void {
    for (const [method, child] of this.children) {
      if (child.matchPath(p, [])[0] != null) {
        set.add(method)
      }
    }
  }
}

// firstSegment splits a path beginning with "/" into its first unescaped
// segment and the remainder. The path "/" yields the segment "/".
function firstSegment(p: string): [string, string] {
  if (p === '/') {
    return ['/', '']
  }
  const end = p.indexOf('/', 1)
  return end < 0 ?
      [pathUnescape(p.slice(1)), '']
    : [pathUnescape(p.slice(1, end)), p.slice(end)]
}

/**
 * RoutingTree matches the host, method, and path of a request to the most
 * specific registered pattern.
 */
export class RoutingTree<H> {
  private root = new RoutingNode<H>()

  /** addPattern registers the handler under the pattern. */
  public addPattern(pattern: Pattern, handler: H): void {
    let node = this.root.addChild(pattern.host).addChild(pattern.method)
    for (const seg of pattern.segments) {
      if (seg.multi) {
        node = node.multiChild = new RoutingNode<H>()
      } else {
        node = node.addChild(seg.wild ? '' : seg.s)
      }
    }
    node.leaf = { pattern, handler }
  }

  /**
   * match returns the leaf for the request, with the values of its wildcards
   * in pattern order. A pattern with the host wins over one without, and a
   * pattern with the method, or GET for a HEAD request, over one without.
   */
  public match(
    host: string,
    method: string,
    p: string,
  ): [Leaf<H> | null, string[]] {
    if (host !== '') {
      const hosted = this.root.findChild(host)?.matchMethodAndPath(method, p)
      if (hosted != null && hosted[0] != null) {
        return hosted
      }
    }
    return this.root.emptyChild?.matchMethodAndPath(method, p) ?? [null, []]
  }

  /**
   * matchingMethods adds to set every method whose request for the host and
   * path would match a pattern.
   */
  public matchingMethods(host: string, p: string, set: Set<string>): void {
    if (host !== '') {
      this.root.findChild(host)?.matchingMethods(p, set)
    }
    this.root.emptyChild?.matchingMethods(p, set)
    if (set.has('GET')) {
      set.add('HEAD')
    }
  }
}
