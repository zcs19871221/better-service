import express from 'express';
import setEnvApi from './api';

const router = express.Router();
router.use('/env', [setEnvApi]);

export default router;
