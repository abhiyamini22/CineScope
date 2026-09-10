import mongoose from 'mongoose';

import app from './app.js';
import { env, ensureEnv } from './config/env.js';

const startServer = async () => {
  try {
    ensureEnv();

    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('MongoDB connected');

    app.listen(env.port, () => {
      console.log(`CineScope backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
