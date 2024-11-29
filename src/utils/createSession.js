import jwt from 'jsonwebtoken';
import { env } from './env.js';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '../constants/index.js';

export const createSession = (_id) => {
  const accessToken = jwt.sign(
    {
      _id: _id,
    },
    env('JWT_ACCESS_SECRET'),
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
