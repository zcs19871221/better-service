import { Request, Response, NextFunction } from 'express';
import { genId } from 'better-utils';
import settings from '../settings';
import Logger from '../logger';
import Env from '../env/env';

export default function extendRequest(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.id = genId();
  req.entryTime = Date.now();
  req.executeStatus = 'success';
  const logger = Logger.get(req.id);
  const env = Env.getInstance();
  if (req.query.debug) {
    logger.setLevel('debug');
  } else {
    logger.setLevel(<any>env.get('logger_level'));
  }
  logger.addAppender(settings.fileAppender);
  logger.setRequestId(req.id);
  logger.setRequestEntryTime(req.entryTime);
  next();
}
