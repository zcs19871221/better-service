import * as fs from 'better-fs';
import Appender from './appender';
import Logger from '.';
import { LevelStr } from './index.d';

export default class FileAppender extends Appender {
  private errorLocate: string;
  private locate: string;
  private commonStream: fs.WriteStream;
  private errorStream: fs.WriteStream;
  private keepLogNum: number;
  private rotateInterval: number;
  private thresholdSize: number;
  private timer: NodeJS.Timeout | null = null;
  constructor({
    errorLocate,
    locate,
    keepLogNum = 4,
    thresholdSize = 50 * 1024 * 1024,
    rotateInterval = 24 * 60 * 60 * 1000,
    threshold,
  }: {
    errorLocate: string;
    keepLogNum?: number;
    rotateInterval?: number;
    thresholdSize?: number;
    locate: string;
    threshold: LevelStr;
  }) {
    super({ threshold });
    this.locate = locate;
    this.errorLocate = errorLocate;
    this.commonStream = fs.createWriteStream(this.locate, {
      flags: 'a',
    });
    this.errorStream = fs.createWriteStream(this.errorLocate, {
      flags: 'a',
    });
    this.keepLogNum = keepLogNum;
    this.thresholdSize = thresholdSize;
    this.rotateInterval = rotateInterval;
  }

  start() {
    this.timer = setInterval(() => {
      this.rotate(this.locate);
      this.rotate(this.errorLocate);
    }, this.rotateInterval);
    return this.timer;
  }

  stop() {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
  }

  async rotate(fileLocate: string) {
    const stat = await fs.lstat(fileLocate);
    if (stat.size > this.thresholdSize) {
      const logger = Logger.get();
      logger.debug(`${fileLocate}超出${this.thresholdSize}字节,执行rotate`);
      for (let i = this.keepLogNum; i >= 1; i--) {
        const log = `${fileLocate}.${i}`;
        if (await fs.isExist(log)) {
          if (log === `${fileLocate}.${this.keepLogNum}`) {
            await fs.unlink(log);
            logger.debug(`删除最老日志:${log}`);
          } else {
            logger.debug(`重命名:${i} -> ${i + 1}`);
            await fs.rename(log, `${fileLocate}.${i + 1}`);
          }
        }
      }
      logger.debug(`复制: -> 1`);
      await fs.pipe(fileLocate, `${fileLocate}.1`);
      return new Promise((resolve, reject) => {
        fs.truncate(fileLocate, error => {
          if (error) {
            logger.error(`清空日志:${fileLocate}失败`);
            reject();
            return;
          }
          logger.debug('清空原日志');
          resolve();
        });
      });
    }
  }

  append(msg: string) {
    this.commonStream.write(msg + '\n');
  }

  errorAppend(msg: string) {
    this.errorStream.write(msg + '\n');
  }
}
