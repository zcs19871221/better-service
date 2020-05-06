import express from 'express';
import listApi from './list_api';
import checkApi from './check_api';

const router = express.Router();
router.use('/trace', [listApi, checkApi]);

export default router;
