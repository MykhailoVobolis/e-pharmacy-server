import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { env } from '../utils/env.js';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '../constants/index.js';
import { parseRefreshToken } from '../utils/parseRefreshToken.js';

// Функція створення сессії
const createSession = (_id) => {
  const accessToken = jwt.sign(
    {
      _id: _id,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const refreshToken = jwt.sign({ _id: _id }, env('JWT_REFRESH_SECRET'), {
    expiresIn: '30d',
  });

  return {
    userId: _id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  };
};

export const registerUser = async (payload) => {
  // перевірка на унікальність email
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  const { _id } = user;

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: _id });

  const newSession = createSession(_id);

  return await SessionsCollection.create({
    ...newSession,
  });
};

export const logoutUser = async (authorization) => {
  // Перевірка наявності токена
  if (!authorization) {
    throw createHttpError(401, 'No token provided');
  }

  const token = authorization.split(' ')[1]; // Витягуємо токен після 'Bearer'

  // Знаходимо сесію за `accessToken`
  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) {
    throw createHttpError(404, 'Session not found');
  }

  // Видаляємо сесію з бази
  await SessionsCollection.deleteOne({ _id: session._id });
};

// Функція для refresh
export const refreshUsersSession = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw createHttpError(400, 'Refresh token is required');
  }

  const { _id } = parseRefreshToken(refreshToken);

  const session = await SessionsCollection.findOne({
    userId: _id,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession(_id);

  await SessionsCollection.deleteOne({ userId: _id, refreshToken });

  return await SessionsCollection.create({
    ...newSession,
  });
};
