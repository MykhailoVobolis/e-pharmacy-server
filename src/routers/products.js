import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getCategoriesAllProductsController,
  getProductsController,
} from '../controllers/products.js';

const router = Router();

router.get('/', ctrlWrapper(getProductsController));

router.get('/categories', ctrlWrapper(getCategoriesAllProductsController));

export default router;
