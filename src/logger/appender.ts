import { LevelStr } from './index.d';

export default abstract class Appender {
  threshold: LevelStr;
  constructor({ threshold = 'info' }: { threshold: LevelStr }) {
    this.threshold = threshold;
  }

  getThreshold() {
    return this.threshold;
  }

  abstract append(msg: string): void;
  abstract errorAppend(msg: string): void;
}
