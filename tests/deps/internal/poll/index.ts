export type { String } from './fd.gs.js'
export {
  AcceptFunc,
  CloseFunc,
  __goscript_set_AcceptFunc,
  __goscript_set_CloseFunc,
} from './hook_unix.gs.js'
export {
  DeadlineExceededError,
  ErrDeadlineExceeded,
  ErrFileClosing,
  ErrNetClosing,
  ErrNoDeadline,
  ErrNotPollable,
  TestHookDidWritev,
  __goscript_set_ErrDeadlineExceeded,
  __goscript_set_ErrFileClosing,
  __goscript_set_ErrNetClosing,
  __goscript_set_ErrNoDeadline,
  __goscript_set_ErrNotPollable,
  __goscript_set_TestHookDidWritev,
  errNetClosing,
} from './fd.gs.js'
export {
  TestHookDidSendFile,
  __goscript_get_TestHookDidSendFile,
  __goscript_init_TestHookDidSendFile,
  __goscript_set_TestHookDidSendFile,
} from './sendfile.gs.js'
export { DupCloseOnExec, FD } from './fd_unix.gs.js'
export { IsPollDescriptor, pollDesc } from './fd_poll_js.gs.js'
export { SysFile } from './fd_unixjs.gs.js'
export { fdMutex } from './fd_mutex.gs.js'
