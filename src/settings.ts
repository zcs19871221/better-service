import path from 'path';
import FileAppender from './logger/file_appender';

const fileAppender = new FileAppender({
  errorLocate: 'error.log',
  locate: 'access.log',
  keepLogNum: 3,
  rotateInterval: 1000,
  threshold: 'debug',
  thresholdSize: 200 * 1024 * 1024,
});
fileAppender.start();
export default {
  serverTimeout: 30 * 1000,
  port: 9478,
  errorContent: `<html>not found</html>`,
  isDevelopment: process.env.NODE_ENV === 'development',
  root: path.join(__dirname, '../'),
  fileAppender,
};
