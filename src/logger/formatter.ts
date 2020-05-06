import { formatDate } from 'better-utils';
import { LevelStr } from '.';
interface FormatterInterface {
  out({
    messages,
    error,
    level,
    pattern,
    requestId,
    requestEntryTime,
  }: {
    error?: Error;
    level: LevelStr;
    requestId?: string;
    requestEntryTime?: number;
    messages: string | string[];
    pattern?: string;
  }): string;
}
export { FormatterInterface };
export default class Formatter implements FormatterInterface {
  private pattern: string;
  constructor(
    pattern: string = '%d{YYYY-MM-DD/hh:mm:ss} %-5p [%l] - %i %n %m',
  ) {
    this.pattern = pattern;
  }

  static startTime = Date.now();

  private handelDate(pattern: string) {
    return pattern.replace(
      new RegExp(
        `%${this.conversionReg().source}${/d(?:\{([^}].*?)\})?/.source}`,
        'g',
      ),
      (_match: any, conversion: string, pattern: string) => {
        return this.handleConversion(
          conversion,
          formatDate(Date.now(), pattern || 'YYYY-MM-DD/hh:mm:ss'),
        );
      },
    );
  }

  private handleRequestEntryTime(
    pattern: string,
    handleRequestEntryTime?: number,
  ) {
    return pattern.replace(
      new RegExp(
        `%${this.conversionReg().source}${/e(?:\{([^}].*?)\})?/.source}`,
        'g',
      ),
      (_match: any, conversion: string, pattern: string) => {
        if (handleRequestEntryTime === undefined) {
          return '';
        }
        return this.handleConversion(
          conversion,
          formatDate(handleRequestEntryTime, pattern || 'YYYY-MM-DD/hh:mm:ss'),
        );
      },
    );
  }

  private _handleString(pattern: string, input: string, tag: string) {
    return pattern.replace(
      new RegExp(`%${this.conversionReg().source}${tag}`, 'g'),
      (_match: any, conversion: string) => {
        return this.handleConversion(conversion, input);
      },
    );
  }

  private handlePercentage(pattern: string) {
    return pattern.replace(/%%/, (_match: any) => {
      return '%';
    });
  }

  private handleLocate(pattern: string) {
    return pattern.replace(
      new RegExp(`%${this.conversionReg().source}l`, 'g'),
      (_match: any, conversion: string) => {
        let invokeStack = (new Error().stack || '').split('\n')[9];
        if (invokeStack) {
          let [funcName = '', locate = ''] = invokeStack
            .trim()
            .replace('at ', '')
            .split(/\s+/);
          funcName = funcName.replace(/.*?\.(.*)/, '$1');
          locate = (locate.match(/[^\\/]+$/) || [''])[0].replace(')', '');
          if (funcName && locate) {
            invokeStack = `${funcName}-${locate}`;
          }
        }
        return this.handleConversion(conversion, invokeStack);
      },
    );
  }

  private handelThread(pattern: string) {
    return this._handleString(pattern, String(process.pid), 't');
  }

  private handleRequestId(pattern: string, requestId?: string) {
    return pattern.replace(
      new RegExp(`%${this.conversionReg().source}i`, 'g'),
      (_match: any, conversion: string) => {
        if (requestId === undefined) {
          return '';
        }
        return this.handleConversion(conversion, requestId);
      },
    );
  }

  private handlePast(pattern: string) {
    return this._handleString(
      pattern,
      String(Date.now() - Formatter.startTime),
      'r',
    );
  }

  private handlePastTimeFromRequestEntry(
    pattern: string,
    requestEntryTime?: number,
  ) {
    return pattern.replace(
      new RegExp(`%${this.conversionReg().source}n`, 'g'),
      (_match: any, conversion: string) => {
        if (requestEntryTime === undefined) {
          return '';
        }
        return this.handleConversion(
          conversion,
          String(Date.now() - requestEntryTime),
        );
      },
    );
  }

  private handelLevel(pattern: string, level: string) {
    return this._handleString(pattern, level, 'p');
  }

  private handleMessage(pattern: string, message: string | string[]) {
    let messages: string[] = [];
    if (typeof message === 'string') {
      messages.push(message);
    } else {
      messages = message;
    }
    let index = 0;
    return pattern.replace(
      new RegExp(`%${this.conversionReg().source}m`, 'g'),
      (_match: any, conversion: string) => {
        return this.handleConversion(conversion, messages[index++]);
      },
    );
  }

  private conversionReg() {
    return /((?:[-.]?\d+)*)/;
  }

  private handleConversion(conversion: string, input: string) {
    if (!conversion) {
      return input;
    }
    let result: string = input;
    conversion.replace(
      /([.-]?)(\d+)/g,
      (match: string, prev: string, num: string) => {
        const length = Number(num);
        if (prev === '.' && result.length > length) {
          result = result.slice(0, length);
        } else if (result.length < length && prev === '') {
          result = result.padStart(length, ' ');
        } else if (result.length < length && prev === '-') {
          result = result.padEnd(length, ' ');
        }
        return match;
      },
    );
    return result;
  }

  help() {
    console.log('%d{YYYY-MM-DD hh:mm:ss} : 时间');
    console.log('%l 执行log的位置');
    console.log('%i 每个request分配的唯一id');
    console.log('%e 每个request进入时间');
    console.log('%n request进入到现在的毫秒数');
    console.log('%m 输出消息');
    console.log('%p 日志级别');
    console.log('%r 程序启动毫秒数');
    console.log('%t pm2进程');
    console.log('%% 转义百分号');
    console.log('修饰符: %20m  小于20个字符,左侧填充空白');
    console.log('修饰符: %-20m 小于20个字符,右侧填充空白');
    console.log('修饰符: %.20m 大于20个字符,只保留20个字符');
    console.log(
      '修饰符: %20.30m 如果小于20个字符,左侧填充空白;如果大于30个字符,只保留30个字符',
    );
    console.log(
      '修饰符: %-20.30m 如果小于20个字符,右侧填充空白;如果大于30个字符,只保留30个字符',
    );
  }

  setPattern(pattern: string) {
    this.pattern = pattern;
  }

  out({
    messages,
    error,
    level,
    pattern = this.pattern,
    requestId,
    requestEntryTime,
  }: {
    messages: string | string[];
    error?: Error;
    level: LevelStr;
    pattern?: string;
    requestId?: string;
    requestEntryTime?: number;
  }) {
    let result = pattern;
    result = this.handelDate(result);
    result = this.handleRequestEntryTime(result, requestEntryTime);
    result = this.handlePastTimeFromRequestEntry(result, requestEntryTime);
    result = this.handleRequestId(result, requestId);
    result = this.handleLocate(result);
    result = this.handleMessage(result, messages);
    result = this.handelLevel(result, level);
    result = this.handlePast(result);
    result = this.handelThread(result);
    result = this.handlePercentage(result);
    if (error) {
      result += '\n' + error.stack;
    }
    return result;
  }
}
