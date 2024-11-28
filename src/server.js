import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './utils/env.js';
import router from './routers/index.js';

dotenv.config();

const PORT = Number(env('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  const corsOptions = {
    origin: ['http://localhost:5173', 'https://top-e-pharmacy.vercel.app'],
    credentials: true, // Для передачі cookies та авторизаційних заголовків
  };

  app.use(cors(corsOptions));

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
