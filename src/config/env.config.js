import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT, 10) || 8080,
  mongoUri: process.env.MONGO_URI,
};
