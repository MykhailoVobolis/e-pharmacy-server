import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { cartSchema } from '../validation/cart.js';
import {
  addProductsToCartController,
  createOrderController,
  deleteProductFromCartController,
  getCartByIdController,
} from '../controllers/cart.js';
import { authenticate } from '../middlewares/authenticate.js';
import { orderSchema } from '../validation/order.js';

const router = Router();

router.put(
  '/update',
  authenticate,
  validateBody(cartSchema),
  ctrlWrapper(addProductsToCartController),
);

router.get('/', authenticate, ctrlWrapper(getCartByIdController));

router.delete(
  '/product/delete',
  authenticate,
  ctrlWrapper(deleteProductFromCartController),
);

router.post(
  '/checkout',
  authenticate,
  validateBody(orderSchema),
  ctrlWrapper(createOrderController),
);

export default router;
