export {
  Bswap32,
  Bswap64,
  GetCallerPC,
  GetCallerSP,
  GetClosurePtr,
  LeadingZeros64,
  LeadingZeros8,
  Len64,
  Len8,
  OnesCount64,
  Prefetch,
  PrefetchStreamed,
  TrailingZeros32,
  TrailingZeros64,
  TrailingZeros8,
} from './intrinsics.gs.js'
export {
  DITEnabled,
  DITSupported,
  DisableDIT,
  EnableDIT,
  __goscript_set_DITSupported,
} from './no_dit.gs.js'
export {
  DefaultPhysPageSize,
  Int64Align,
  MinFrameSize,
  PCQuantum,
  StackAlign,
  StackGuardMultiplier,
} from './consts.gs.js'
export { NotInHeap, nih } from './nih.gs.js'
