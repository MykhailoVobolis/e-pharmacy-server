import createHttpError from 'http-errors';
import {
  getAllProducts,
  getCategoriesAllProducts,
} from '../services/products.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// Контроллер отримання категорій всіх продуктів
export const getCategoriesAllProductsController = async (req, res) => {
  const categories = await getCategoriesAllProducts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found categories of all products!',
    data: categories,
  });
};

// Контроллер отримання колекції всіх продуктів
export const getProductsController = async (req, res, _next) => {
  const { page, perPage } = parsePaginationParams(req.query);

  // Отримання категорій
  const categories = await getCategoriesAllProducts();

  // Парсинг фільтрів
  const filter = parseFilterParams(req.query, categories);

  const products = await getAllProducts({
    page,
    perPage,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found products!',
    data: products,
  });
};
