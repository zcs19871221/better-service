import { Request, Response, NextFunction } from 'express';
import Logger from '../logger';

export default function logOnResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on('finish', () => {
    const { method } = req;
    const logger = Logger.get(req.id);
    logger.info(`%e|%i|%4m|%60m|%7m|%5n`, [
      method,
      `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      req.executeStatus,
    ]);
    res.locals = null;
    Logger.delete(req.id);
  });
  next();
}
