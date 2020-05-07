import Appender from './appender';
export default class ConsoleAppender extends Appender {
  append(msg: string) {
    console.log(msg);
  }

  errorAppend(msg: string) {
    console.error(msg);
  }
}
