import { ProductsCollection } from '../db/models/product.js';

export const getAllProducts = async () => {
  const students = await ProductsCollection.find();
  return students;
};
