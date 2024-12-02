import { Router } from 'express';

import productsRouter from './products.js';
import storesRouter from './stores.js';
import authRouter from './auth.js';
import customerReviewRouter from './customerReview.js';
import cartRouter from './cart.js';

const router = Router();

router.use('/products', productsRouter);
router.use('/stores', storesRouter);
router.use('/user', authRouter);
router.use('/', customerReviewRouter);
router.use('/cart', cartRouter);

export default router;
