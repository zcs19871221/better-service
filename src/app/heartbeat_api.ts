import express, { Request, Response } from 'express';

const router = express.Router();
router.get(['/isalive', '/api/isalive'], function isAlive(
  _req: Request,
  res: Response,
) {
  res.send('server is alive');
});
export default router;
