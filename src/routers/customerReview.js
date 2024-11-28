import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getCustomerReviews } from '../controllers/reviews.js';

const router = Router();

router.get('/customer-reviews', ctrlWrapper(getCustomerReviews));

export default router;
