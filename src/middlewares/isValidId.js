import { isValidObjectId } from 'mongoose';

import createHttpError from 'http-errors';

// Валідація ідентифікатора
export const isValidId = (req, res, next) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    next(createHttpError(404, 'Sorry, id is not valid'));
  }

  next();
};
