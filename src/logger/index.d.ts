export enum LevelEnum {
  debug,
  info,
  warn,
  error,
}
export type LevelStr = keyof typeof LevelEnum;
export interface AppenderInterface {
  append(msg: string): void;
  errorAppend(msg: string): void;
}
