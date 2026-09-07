import * as $ from '@goscript/builtin/index.js'

import type { StackTrace } from './stack.js'

// fmt formats the verbs supported by this package override.
const fmt = {
  Sprintf: (format: string, ...args: any[]): string => {
    let result = format
    let argIndex = 0
    result = result.replace(/%[sdqv%]/g, (match) => {
      if (match === '%%') return '%'
      if (argIndex >= args.length) return match
      const arg = args[argIndex++]
      switch (match) {
        case '%s':
          return String(arg)
        case '%d':
          return String(Number(arg))
        case '%q':
          return JSON.stringify(String(arg))
        case '%v':
          return String(arg)
        default:
          return match
      }
    })
    return result
  },
}

// New returns an error with the supplied message.
// JavaScript errors do not expose Go program-counter stacks.
export function New(message: string): $.GoError {
  return new fundamental({ msg: message })
}

// Errorf formats according to a format specifier and returns the string
// as a value that satisfies error.
// JavaScript errors do not expose Go program-counter stacks.
export function Errorf(format: string, ...args: any[]): $.GoError {
  return new fundamental({
    msg: fmt.Sprintf(format, ...args),
  })
}

class fundamental {
  public get msg(): string {
    return this._fields.msg.value
  }
  public set msg(value: string) {
    this._fields.msg.value = value
  }

  public _fields: {
    msg: $.VarRef<string>
  }

  constructor(init?: Partial<{ msg?: string }>) {
    this._fields = {
      msg: $.varRef(init?.msg ?? ''),
    }
  }

  public clone(): fundamental {
    const cloned = new fundamental()
    cloned._fields = {
      msg: $.varRef(this._fields.msg.value),
    }
    return cloned
  }

  public Error(): string {
    return this.msg
  }

  // StackTrace returns nil because Go program counters are unavailable.
  public StackTrace(): StackTrace {
    return null
  }

  static __typeInfo = $.registerStructType(
    'fundamental',
    new fundamental(),
    [
      {
        name: 'Error',
        args: [],
        returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
      },
    ],
    fundamental,
    [
      {
        name: 'msg',
        key: 'msg',
        type: { kind: $.TypeKind.Basic, name: 'string' },
      },
    ],
  )
}

// WithStack wraps err while retaining its cause and message.
// Go program-counter stacks are unavailable in the JavaScript target.
// If err is nil, WithStack returns nil.
export function WithStack(err: $.GoError): $.GoError {
  if (err == null) {
    return null
  }
  return new withStack({ error: err })
}

class withStack {
  public get error(): $.GoError {
    return this._fields.error.value
  }
  public set error(value: $.GoError) {
    this._fields.error.value = value
  }

  public _fields: {
    error: $.VarRef<$.GoError>
  }

  constructor(init?: Partial<{ error?: $.GoError }>) {
    this._fields = {
      error: $.varRef(init?.error ?? null),
    }
  }

  public clone(): withStack {
    const cloned = new withStack()
    cloned._fields = {
      error: $.varRef(this._fields.error.value),
    }
    return cloned
  }

  public Cause(): $.GoError {
    return this.error
  }

  // Unwrap returns the next error in the chain.
  public Unwrap(): $.GoError {
    return this.error
  }

  public Error(): string | PromiseLike<string> {
    const inner = this.error?.Error()
    if (inner == null) {
      return ''
    }
    // A synchronous cause keeps the whole WithStack chain synchronous; only
    // an async transpiled Error() resolves through a Promise.
    if (typeof inner === 'string') {
      return inner
    }
    return Promise.resolve(inner)
  }

  // StackTrace returns nil because Go program counters are unavailable.
  public StackTrace(): StackTrace {
    return null
  }

  static __typeInfo = $.registerStructType(
    'withStack',
    new withStack(),
    [
      {
        name: 'Cause',
        args: [],
        returns: [
          {
            type: {
              kind: $.TypeKind.Interface,
              name: 'GoError',
              methods: [
                {
                  name: 'Error',
                  args: [],
                  returns: [
                    { type: { kind: $.TypeKind.Basic, name: 'string' } },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        name: 'Unwrap',
        args: [],
        returns: [
          {
            type: {
              kind: $.TypeKind.Interface,
              name: 'GoError',
              methods: [
                {
                  name: 'Error',
                  args: [],
                  returns: [
                    { type: { kind: $.TypeKind.Basic, name: 'string' } },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
    withStack,
    [
      {
        name: 'error',
        key: 'error',
        type: {
          kind: $.TypeKind.Interface,
          name: 'GoError',
          methods: [
            {
              name: 'Error',
              args: [],
              returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
            },
          ],
        },
      },
    ],
  )
}

// Wrap annotates err with the supplied message and retains its cause.
// If err is nil, Wrap returns nil.
export function Wrap(err: $.GoError, message: string): $.GoError {
  if (err == null) {
    return null
  }
  const wrappedErr = new withMessage({ cause: err, msg: message })
  return new withStack({ error: wrappedErr })
}

// Wrapf annotates err with a formatted message and retains its cause.
// If err is nil, Wrapf returns nil.
export function Wrapf(
  err: $.GoError,
  format: string,
  ...args: any[]
): $.GoError {
  if (err == null) {
    return null
  }
  const wrappedErr = new withMessage({
    cause: err,
    msg: fmt.Sprintf(format, ...args),
  })
  return new withStack({ error: wrappedErr })
}

// WithMessage annotates err with a new message.
// If err is nil, WithMessage returns nil.
export function WithMessage(err: $.GoError, message: string): $.GoError {
  if (err == null) {
    return null
  }
  return new withMessage({ cause: err, msg: message })
}

// WithMessagef annotates err with the format specifier.
// If err is nil, WithMessagef returns nil.
export function WithMessagef(
  err: $.GoError,
  format: string,
  ...args: any[]
): $.GoError {
  if (err == null) {
    return null
  }
  return new withMessage({ cause: err, msg: fmt.Sprintf(format, ...args) })
}

class withMessage {
  public get cause(): $.GoError {
    return this._fields.cause.value
  }
  public set cause(value: $.GoError) {
    this._fields.cause.value = value
  }

  public get msg(): string {
    return this._fields.msg.value
  }
  public set msg(value: string) {
    this._fields.msg.value = value
  }

  public _fields: {
    cause: $.VarRef<$.GoError>
    msg: $.VarRef<string>
  }

  constructor(init?: Partial<{ cause?: $.GoError; msg?: string }>) {
    this._fields = {
      cause: $.varRef(init?.cause ?? null),
      msg: $.varRef(init?.msg ?? ''),
    }
  }

  public clone(): withMessage {
    const cloned = new withMessage()
    cloned._fields = {
      cause: $.varRef(this._fields.cause.value),
      msg: $.varRef(this._fields.msg.value),
    }
    return cloned
  }

  // Error preserves synchronous messages and awaits asynchronous causes.
  public Error(): string | PromiseLike<string> {
    const inner = this.cause!.Error()
    if (typeof inner === 'string') {
      return this.msg + ': ' + inner
    }
    return Promise.resolve(inner).then((text) => this.msg + ': ' + text)
  }

  public Cause(): $.GoError {
    return this.cause
  }

  // Unwrap returns the next error in the chain.
  public Unwrap(): $.GoError {
    return this.cause
  }

  static __typeInfo = $.registerStructType(
    'withMessage',
    new withMessage(),
    [
      {
        name: 'Error',
        args: [],
        returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
      },
      {
        name: 'Cause',
        args: [],
        returns: [
          {
            type: {
              kind: $.TypeKind.Interface,
              name: 'GoError',
              methods: [
                {
                  name: 'Error',
                  args: [],
                  returns: [
                    { type: { kind: $.TypeKind.Basic, name: 'string' } },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        name: 'Unwrap',
        args: [],
        returns: [
          {
            type: {
              kind: $.TypeKind.Interface,
              name: 'GoError',
              methods: [
                {
                  name: 'Error',
                  args: [],
                  returns: [
                    { type: { kind: $.TypeKind.Basic, name: 'string' } },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
    withMessage,
    [
      {
        name: 'cause',
        key: 'cause',
        type: {
          kind: $.TypeKind.Interface,
          name: 'GoError',
          methods: [
            {
              name: 'Error',
              args: [],
              returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
            },
          ],
        },
      },
      {
        name: 'msg',
        key: 'msg',
        type: { kind: $.TypeKind.Basic, name: 'string' },
      },
    ],
  )
}

// Cause follows Cause methods to the underlying error, or returns nil for nil.
export function Cause(err: $.GoError): $.GoError {
  type causer = null | {
    Cause(): $.GoError
  }

  $.registerInterfaceType(
    'causer',
    null, // Zero value for interface is null
    [
      {
        name: 'Cause',
        args: [],
        returns: [
          {
            type: {
              kind: $.TypeKind.Interface,
              name: 'GoError',
              methods: [
                {
                  name: 'Error',
                  args: [],
                  returns: [
                    { type: { kind: $.TypeKind.Basic, name: 'string' } },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  )

  for (; err != null; ) {
    const { value: cause, ok } = $.typeAssert<causer>(err, 'causer')
    if (!ok) {
      break
    }
    err = cause!.Cause()
  }
  return err
}
