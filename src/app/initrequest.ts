import { Request, Response, NextFunction } from 'express';
import { random } from 'better-utils';
import Logger from '../logger';
import Env from '../env/env';

const createTransId = (len: number = 6) => {
  let id = '';
  for (let i = 0; i < len; i++) {
    const type = random('[', ']', 0, 2);
    if (type === 0) {
      id += String.fromCharCode(random('[', ']', 0, 9) + '0'.charCodeAt(0));
    } else if (type === 1) {
      id += String.fromCharCode(random('[', ']', 0, 25) + 'a'.charCodeAt(0));
    } else if (type === 2) {
      id += String.fromCharCode(random('[', ']', 0, 25) + 'A'.charCodeAt(0));
    }
  }
  return id;
};
export default function extendRequest(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.id = createTransId();
  req.entryTime = Date.now();
  req.executeStatus = 'success';
  const logger = Logger.get(req.id);
  const env = Env.getInstance();
  if (req.query.debug) {
    logger.setLevel('debug');
  } else {
    logger.setLevel(<any>env.get('logger_level'));
  }
  logger.setRequestId(req.id);
  logger.setRequestEntryTime(req.entryTime);
  next();
}
