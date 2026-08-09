export type {
  Ext1FieldLogger,
  FieldLogger,
  Fields,
  Level,
  StdLogger,
} from './logrus.gs.js'
export type { BufferPool } from './buffer_pool.gs.js'
export type { FieldMap, fieldKey } from './json_formatter.gs.js'
export type { Formatter } from './formatter.gs.js'
export type { Hook, LevelHooks } from './hooks.gs.js'
export type { LogFunction } from './logger.gs.js'
export {
  AddHook,
  Debug,
  DebugFn,
  Debugf,
  Debugln,
  Error,
  ErrorFn,
  Errorf,
  Errorln,
  Fatal,
  FatalFn,
  Fatalf,
  Fatalln,
  GetLevel,
  Info,
  InfoFn,
  Infof,
  Infoln,
  IsLevelEnabled,
  Panic,
  PanicFn,
  Panicf,
  Panicln,
  Print,
  PrintFn,
  Printf,
  Println,
  SetFormatter,
  SetLevel,
  SetOutput,
  SetReportCaller,
  StandardLogger,
  Trace,
  TraceFn,
  Tracef,
  Traceln,
  Warn,
  WarnFn,
  Warnf,
  Warning,
  WarningFn,
  Warningf,
  Warningln,
  Warnln,
  WithContext,
  WithError,
  WithField,
  WithFields,
  WithTime,
} from './exported.gs.js'
export {
  AllLevels,
  DebugLevel,
  ErrorLevel,
  FatalLevel,
  InfoLevel,
  Level_MarshalText,
  Level_String,
  Level_UnmarshalText,
  PanicLevel,
  ParseLevel,
  TraceLevel,
  WarnLevel,
  __goscript_get_AllLevels,
  __goscript_init_AllLevels,
  __goscript_set_AllLevels,
} from './logrus.gs.js'
export {
  Entry,
  ErrorKey,
  NewEntry,
  __goscript_set_ErrorKey,
} from './entry.gs.js'
export {
  FieldKeyFile,
  FieldKeyFunc,
  FieldKeyLevel,
  FieldKeyLogrusError,
  FieldKeyMsg,
  FieldKeyTime,
} from './formatter.gs.js'
export { DeferExitHandler, Exit, RegisterExitHandler } from './alt_exit.gs.js'
export { FieldMap_resolve, JSONFormatter } from './json_formatter.gs.js'
export { LevelHooks_Add, LevelHooks_Fire } from './hooks.gs.js'
export { Logger, MutexWrap, New } from './logger.gs.js'
export { SetBufferPool, defaultPool } from './buffer_pool.gs.js'
export { TextFormatter } from './text_formatter.gs.js'
export { lvlPrefix } from './level.gs.js'
import './buffer_pool.gs.js'
import './formatter.gs.js'
import './hooks.gs.js'
import './logrus.gs.js'
