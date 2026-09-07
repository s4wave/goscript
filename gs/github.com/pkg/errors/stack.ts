import * as $ from '@goscript/builtin/index.js'

// uintptr represents a Go program counter; JavaScript cannot resolve its location.
export type uintptr = number
export type Frame = uintptr
export type StackTrace = $.Slice<Frame>

export function Frame_pc(receiver: Frame): uintptr {
  return receiver - 1
}

export function Frame_file(_receiver: Frame): string {
  return 'unknown'
}

export function Frame_line(_receiver: Frame): number {
  return 0
}

export function Frame_name(_receiver: Frame): string {
  return 'unknown'
}

export function Frame_MarshalText(receiver: Frame): [$.Bytes, $.GoError] {
  const name = Frame_name(receiver)
  if (name == 'unknown') {
    return [new TextEncoder().encode(name), null]
  }
  return [
    new TextEncoder().encode(
      `${name} ${Frame_file(receiver)}:${Frame_line(receiver)}`,
    ),
    null,
  ]
}

export function StackTrace_Format(
  _receiver: StackTrace,
  _state: any,
  _verb: number,
): void {
  // JavaScript has no Go program-counter frames to format.
}

// funcname extracts the function name from a full function path.
export function funcname(name: string): string {
  const lastDot = name.lastIndexOf('.')
  if (lastDot >= 0) {
    return name.substring(lastDot + 1)
  }
  return name
}
