import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from './env.js';

export const parseToken = (token, tokenType) => {
  try {
    // Визначаємо секретний ключ залежно від типу токена
    const secretKey =
      tokenType === 'refresh'
        ? env('JWT_REFRESH_SECRET')
        : env('JWT_ACCESS_SECRET');

    // Перевірка та розбір токена
    const payload = jwt.verify(token, secretKey);

    return payload; // Повертає _id або інші закодовані дані
  } catch (err) {
    throw createHttpError(401, `Invalid or expired ${tokenType} token`);
  }
};
