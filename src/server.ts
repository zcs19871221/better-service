import { Express } from 'express';
import Logger from './logger';
import settings from './settings';

export default function Server(app: Express) {
  const logger = Logger.get('');
  const server = app.listen(settings.port, function serverCallback() {
    logger.info(`listen on: ${settings.port} node version: ${process.version}`);
  });
  const close = () =>
    server.close(function closeCallback(errorOnClose) {
      if (errorOnClose) {
        logger.error('关闭server失败', errorOnClose);
        process.exit(1);
      }
    });
  server.setTimeout(settings.serverTimeout);
  server.on('error', function errorCallback(unCaught) {
    logger.error('server 捕获error', unCaught);
  });
  process.on('SIGINT', close);
  process.on('warning', function warningCb(warning) {
    logger.warn('进程警告', warning);
  });
  process.on('unhandledRejection', function unHandleRejectCb(reason) {
    logger.error('进程未处理promise reject', new Error(String(reason)));
  });
  process.on('uncaughtException', function unCaughtCb(uncaughtErr) {
    close();
    logger.error('进程未捕获错误抛出:', uncaughtErr);
  });
}
