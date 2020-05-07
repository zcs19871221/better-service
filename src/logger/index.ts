import Formatter, { FormatterInterface } from './formatter';
import ConsoleAppender from './console_appender';
import { LevelEnum, LevelStr } from './index.d';
import Appender from './appender';

class Logger {
  private level: LevelStr;
  private appender: Appender[];
  private formatter: FormatterInterface;
  private reqId!: string;
  private entryTime!: number;
  private name: string;
  private constructor({
    level = 'info',
    formatter = new Formatter(),
    name,
    appender = new ConsoleAppender({ threshold: 'info' }),
  }: {
    level?: LevelStr;
    fileName?: string;
    name: string;
    appender?: Appender;
    formatter?: FormatterInterface;
  }) {
    this.level = level;
    this.appender = [appender];
    this.formatter = formatter;
    this.name = name;
  }

  static levelOrder: LevelStr[] = ['debug', 'info', 'warn', 'error'];

  static instance: Map<string, Logger> = new Map();

  static get(name: string = ''): Logger {
    if (!Logger.instance.has(name)) {
      Logger.instance.set(
        name,
        new Logger({
          name,
        }),
      );
    }
    return <Logger>Logger.instance.get(name);
  }

  static delete(name: string) {
    Logger.instance.delete(name);
  }

  static canLog(input: LevelStr, exist: LevelStr) {
    if (Logger.levelOrder.indexOf(input) >= Logger.levelOrder.indexOf(exist)) {
      return true;
    }
    return false;
  }

  private _out(
    level: keyof typeof LevelEnum,
    {
      pattern,
      error,
      messages = '',
    }: {
      pattern?: string;
      messages?: string | string[];
      error?: Error;
    },
  ) {
    if (Logger.canLog(level, this.level)) {
      this.appender.forEach(appender => {
        if (Logger.canLog(level, appender.getThreshold())) {
          const str: string = this.formatter.out({
            messages,
            error,
            level,
            pattern,
            requestId: this.reqId,
            requestEntryTime: this.entryTime,
          });
          if (error) {
            appender.errorAppend(str);
          } else {
            appender.append(str);
          }
        }
      });
    }
  }

  private _noError(
    patternOrMessage: string | string[],
    messageOrUndefined?: string | string[],
  ): {
    pattern?: string;
    messages?: string | string[];
    error?: Error;
  } {
    if (messageOrUndefined === undefined) {
      return {
        messages: patternOrMessage,
      };
    } else if (typeof patternOrMessage === 'string') {
      return {
        pattern: patternOrMessage,
        messages: messageOrUndefined,
      };
    }
    throw new Error('参数错误');
  }

  private _hasError(
    patternOrMessage: string | string[],
    messageOrError?: string | string[] | Error,
    error?: Error,
  ): {
    pattern?: string;
    messages?: string | string[];
    error?: Error;
  } {
    if (error) {
      return {
        pattern: <string>patternOrMessage,
        messages: <string | string[]>messageOrError,
        error,
      };
    }
    if (messageOrError === undefined) {
      return {
        messages: patternOrMessage,
      };
    } else {
      if (messageOrError instanceof Error) {
        return {
          messages: patternOrMessage,
          error: messageOrError,
        };
      } else {
        return {
          messages: messageOrError,
          pattern: <string>patternOrMessage,
        };
      }
    }
  }

  debug(message: string | string[]): void;
  debug(pattern: string, message: string | string[]): void;
  debug(
    patternOrMessage: string | string[],
    messageOrUndefined?: string | string[],
  ) {
    this._out('debug', this._noError(patternOrMessage, messageOrUndefined));
  }

  info(message: string | string[]): void;
  info(pattern: string, message: string | string[]): void;
  info(
    patternOrMessage: string | string[],
    messageOrUndefined?: string | string[],
  ) {
    this._out('info', this._noError(patternOrMessage, messageOrUndefined));
  }

  error(message: string | string[], error?: Error): void;
  error(pattern: string, message: string | string[], error?: Error): void;
  error(
    patternOrMessage: string | string[],
    messageOrError?: string | string[] | Error,
    error?: Error,
  ): void {
    this._out('error', this._hasError(patternOrMessage, messageOrError, error));
  }

  warn(message: string | string[], error?: Error): void;
  warn(pattern: string, message: string | string[], error?: Error): void;
  warn(
    patternOrMessage: string | string[],
    messageOrError?: string | string[] | Error,
    error?: Error,
  ): void {
    this._out('warn', this._hasError(patternOrMessage, messageOrError, error));
  }

  setLevel(level: LevelStr) {
    this.level = level;
  }

  getLevel() {
    return this.level;
  }

  getName() {
    return this.name;
  }

  setFormatter(formatter: FormatterInterface) {
    this.formatter = formatter;
  }

  addAppender(appender: Appender) {
    this.appender.push(appender);
  }

  setAppender(appender: Appender) {
    this.appender = [appender];
  }

  setRequestId(id: string) {
    this.reqId = id;
  }

  setRequestEntryTime(entry: number) {
    this.entryTime = entry;
  }
}
export { LevelStr };
export default Logger;
