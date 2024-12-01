import { ProductsCollection } from '../db/models/product.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllProducts = async ({
  page = 1,
  perPage = 12,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const productsQuery = ProductsCollection.find();

  if (filter.category) {
    productsQuery.where('category').equals(filter.category);
  }

  if (filter.name) {
    productsQuery
      .where('name')
      .equals(filter.name)
      .collation({ locale: 'en', strength: 2 }); // ігнорує регістр введеного значення
  }

  const productsCount = await ProductsCollection.find()
    .merge(productsQuery)
    .countDocuments();

  const products = await productsQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(productsCount, perPage, page);

  return {
    data: products,
    ...paginationData,
  };
};

export const getCategoriesAllProducts = async () => {
  const products = await ProductsCollection.find({}, 'category');
  // Фільтрація унікальних значень категорій
  const categories = [...new Set(products.map((item) => item.category))];

  return categories;
};
