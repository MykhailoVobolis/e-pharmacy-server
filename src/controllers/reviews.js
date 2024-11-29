import { ReviewsCollection } from '../db/models/review.js';

export const getCustomerReviews = async (req, res) => {
  const { limit = 3 } = req.body;

  const customerReviews = await ReviewsCollection.find().limit(limit);

  res.status(200).json({
    status: 200,
    message: 'Successfully found reviews!',
    data: customerReviews,
  });
};
