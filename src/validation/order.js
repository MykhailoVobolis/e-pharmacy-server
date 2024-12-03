import Joi from 'joi';

import { regex } from '../constants/user.js';

const { emailRegexp, phoneNumberRegexp } = regex;

export const detailsSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.string().pattern(phoneNumberRegexp).required(),
  address: Joi.string().required(),
  payment: Joi.string().valid('cash', 'bank').required(),
}).messages({
  'string.base': 'Field {#label} must be a string.',
  'string.empty': 'Field {#label} cannot be empty.',
  'string.email': 'Field {#label} must be a valid email address.',
  'string.phone': 'Field {#label} must be a valid phone number.',
  'any.required': 'missing required {#label} field',
  'any.only': 'Payment field must be one of: cash, bank.',
});

export const orderSchema = Joi.object({
  orderDetails: detailsSchema.required(),
}).messages({
  'string.base': 'The field {#label} must be a string.',
  'number.base': 'The field {#label} must be a number.',
  'any.required': 'The field {#label} is required.',
});
