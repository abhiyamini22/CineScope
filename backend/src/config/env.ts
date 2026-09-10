import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  tmdbApiKey: process.env.TMDB_API_KEY || '',
  tmdbBaseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinescope',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export const ensureEnv = () => {
  if (!env.tmdbApiKey) {
    throw new Error('TMDB_API_KEY is required');
  }
};
