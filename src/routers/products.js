import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getCategoriesAllProductsController,
  getProductByIdController,
  getProductsController,
} from '../controllers/products.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getProductsController));

router.get('/categories', ctrlWrapper(getCategoriesAllProductsController));

router.get('/:productId', isValidId, ctrlWrapper(getProductByIdController));

export default router;
