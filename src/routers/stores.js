import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getAllStores, getNearestStores } from '../controllers/stores.js';

const router = Router();

router.get('/nearest', ctrlWrapper(getNearestStores));

router.get('/', ctrlWrapper(getAllStores));

export default router;
