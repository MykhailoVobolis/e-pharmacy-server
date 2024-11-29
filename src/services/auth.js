import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { parseToken } from '../utils/parseToken.js';
import { createSession } from '../utils/createSession.js';

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

export const logoutUser = async (accessToken) => {
  // Знаходимо сесію за `accessToken`
  const session = await SessionsCollection.findOne({
    accessToken: accessToken,
  });

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

  const { _id } = parseToken(refreshToken, 'refresh');

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
