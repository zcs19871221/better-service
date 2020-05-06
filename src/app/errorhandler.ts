import { Request, Response, NextFunction } from 'express';
import Logger from '../logger';
import isIgnoreError from './isignoreerror';
import settings from '../settings';

export default function errorHandler(
  catchedError: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  req.executeStatus = 'error';
  const logger = Logger.get(req.id);
  if (!isIgnoreError(catchedError)) {
    logger.error('捕获错误:', catchedError);
  }
  if (settings.isDevelopment) {
    return res
      .status(404)
      .set({ 'Content-Type': 'text/plain' })
      .send(catchedError.stack);
  }
  return res
    .status(404)
    .set({ 'Content-Type': `text/html;charset=utf-8` })
    .send(settings.errorContent);
}
