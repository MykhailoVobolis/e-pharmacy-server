import { ProductsCollection } from '../db/models/product.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

// Сервіс-функція яка отримує категорії всіх продуктів з бази данних
export const getCategoriesAllProducts = async () => {
  const products = await ProductsCollection.find({}, 'category');
  // Фільтрація унікальних значень категорій
  const categories = [...new Set(products.map((item) => item.category))];

  return categories;
};

// Сервіс-функція яка отримує всі продукти з бази данних
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

  if (filter.discount) {
    productsQuery.where('discount').equals(filter.discount);
  }

  /* Використання Promise.all для поліпшення продуктивності */
  const [productsCount, products] = await Promise.all([
    ProductsCollection.find().merge(productsQuery).countDocuments(),
    productsQuery.skip(skip).limit(limit).exec(),
  ]);

  const paginationData = calculatePaginationData(productsCount, perPage, page);

  return {
    data: products,
    ...paginationData,
  };
};

// Сервіс-функція яка отримує один продукт з бази данних за його ID
export const getProductById = async (productId) => {
  const product = await ProductsCollection.findById(productId);
  return product;
};
