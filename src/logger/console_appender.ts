import { AppenderInterface } from './index.d';
export default class ConsoleAppender implements AppenderInterface {
  append(msg: string) {
    console.log(msg);
  }

  errorAppend(msg: string) {
    console.error(msg);
  }
}
