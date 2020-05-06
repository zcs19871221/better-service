import express, { Request, Response } from 'express';
import setEnv from './set';

const router = express.Router();
router.use('/set', function setEnvController(req: Request, res: Response) {
  const { query } = req;
  res.send('环境变量设置:' + setEnv(query));
});

export default router;
