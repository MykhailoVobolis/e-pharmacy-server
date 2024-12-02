import Joi from 'joi';

import { productPriceRegexp } from '../constants/productPrice.js';

// Joi схема для валідації об'єкта продукту при його додаванні у кошик
export const cartProductSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.string().pattern(productPriceRegexp).required(),
}).messages({
  'string.base': 'The field {#label} must be a string.',
  'string.length': 'The field {#label} must be exactly 24 characters long.',
  'number.base': 'The field {#label} must be a number.',
  'number.min': 'The field {#label} cannot be less than {#limit}.',
  'number.integer': 'The field {#label} must be an integer.',
  'any.required': 'The field {#label} is required.',
});

// Схема для об'єкта body
export const cartSchema = Joi.object({
  products: Joi.array().items(cartProductSchema).min(1).required(), // Масив продуктів
}).messages({
  'string.base': 'The field {#label} must be a string.',
  'string.length': 'The field {#label} must be exactly 24 characters long.',
  'number.base': 'The field {#label} must be a number.',
  'number.min': 'The field {#label} cannot be less than {#limit}.',
  'number.integer': 'The field {#label} must be an integer.',
  'any.required': 'The field {#label} is required.',
  'array.min': 'The field {#label} must contain at least {#limit} items.',
});
