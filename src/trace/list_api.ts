import express, { Request, Response } from 'express';
import listRoutes from './listroutes';

const router = express.Router();
router.get('/list', function listTrace(_req: Request, res: Response) {
  return res
    .set('content-type', 'text/plain; charset=UTF-8')
    .send(listRoutes());
});

export default router;
