import express from 'express';
import env from './env';
import trace from './trace';

const router = express.Router();
router.use(env);
router.use(trace);

export default router;
