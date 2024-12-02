import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { cartSchema } from '../validation/cart.js';
import {
  addProductsToCartController,
  getCartByIdController,
} from '../controllers/cart.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.put(
  '/update',
  authenticate,
  validateBody(cartSchema),
  ctrlWrapper(addProductsToCartController),
);

router.get('/', authenticate, ctrlWrapper(getCartByIdController));

export default router;
