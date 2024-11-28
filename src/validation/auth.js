import Joi from 'joi';

import { regex } from '../constants/user.js';

const { emailRegexp, phoneNumberRegexp } = regex;

// Joi схема для валідації об'єкта юзера при його створенні
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.string().pattern(phoneNumberRegexp).required(),
  password: Joi.string().min(6).required(),
}).messages({
  'string.base': 'Field {#label} must be a string.',
  'string.empty': 'Field {#label} cannot be empty.',
  'string.email': 'Field {#label} must be a valid email address.',
  'string.phone': 'Field {#label} must be a valid phone number.',
  'any.required': 'missing required {#label} field',
});

// Joi схема для валідації об'єкта юзера при його login
export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
}).messages({
  'string.base': 'Field {#label} must be a string.',
  'string.empty': 'Field {#label} cannot be empty.',
  'string.email': 'Field {#label} must be a valid email address.',
  'any.required': 'missing required {#label} field',
});
