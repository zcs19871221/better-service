import Formatter from './formatter';

beforeEach(() => {
  Date.now = () => 1585903755320;
  Formatter.startTime = 1585903755310;
});
it('test flag', () => {
  const formater = new Formatter(
    '当前时间:%d{YYYY_MM_DD/hh:mm:ss} 消息:%m 日志级别:[%p] 从启动到现在用时:%r 线程:%t 百分号转义:%%',
  );
  expect(
    formater.out({
      messages: 'hello world',
      level: 'debug',
    }),
  ).toBe(
    `当前时间:2020_04_03/16:49:15 消息:hello world 日志级别:[debug] 从启动到现在用时:10 线程:${process.pid} 百分号转义:%`,
  );
});

it('test conversion', () => {
  const formater = new Formatter(
    '%.4d{YYYY_MM_DD/hh:mm:ss}|%12d{YYYY/MM/DD}|%-12d{YYYY/MM/DD}|%12.20m|%-2.3m|%-10.20m',
  );
  expect(
    formater.out({
      messages: ['hello world', 'abcdefg', 'abcde', 'abcdef'],
      level: 'debug',
    }),
  ).toBe('2020|  2020/04/03|2020/04/03  | hello world|abc|abcde     ');
});

it('test change pattern', () => {
  const formater = new Formatter(
    '%.4d{YYYY_MM_DD/hh:mm:ss}|%12d{YYYY/MM/DD}|%-12d{YYYY/MM/DD}|%12.20m|%-2.3m|%-10.20m',
  );
  formater.setPattern('%m');
  expect(
    formater.out({
      messages: ['hello world'],
      level: 'debug',
    }),
  ).toBe('hello world');
});
