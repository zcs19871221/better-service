export enum LevelEnum {
  debug,
  info,
  warn,
  error,
}
export type LevelStr = keyof typeof LevelEnum;
