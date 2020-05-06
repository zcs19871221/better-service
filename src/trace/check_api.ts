import express, { Request, Response } from 'express';
import checkRoute from './checkroute';

const router = express.Router();
router.get('/check', function checkPath(req: Request, res: Response) {
  const { path, method } = req.query;
  return res
    .set('content-type', 'text/html; charset=UTF-8')
    .send(checkRoute(<string>path, <string>method));
});

export default router;
