import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from './env.js';

export const parseRefreshToken = (refreshToken) => {
  try {
    // Перевірка та розбір токена
    const payload = jwt.verify(refreshToken, env('JWT_REFRESH_SECRET'));
    return payload; // Повертає _id або інші закодовані дані
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }
};
