import { Request, Response } from 'express';
import RouteParser from '../trace/parseroute';
import app from '.';
import settings from '../settings';
import Logger from '../logger';

export default function noMatch(req: Request, res: Response) {
  Logger.get(req.id).debug('未捕获请求:' + req.originalUrl);
  req.executeStatus = 'noMatch';
  if (settings.isDevelopment) {
    const route = new RouteParser(app);
    return res
      .set('Content-Type', 'text/html;charset=utf-8')
      .status(404)
      .send(
        `没找到匹配路径，参考如下：<br>${route.checkPath(req.path, req.method)}`
      );
  }
  return res
    .status(404)
    .set({ 'Content-Type': `text/html;charset=utf-8` })
    .send(settings.errorContent);
}
