import mongoose from 'mongoose';
import { config } from './env.config.js';

export async function connectDB() {
  if (!config.mongoUri) {
    console.error('Falta la variable MONGO_URI en el archivo .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
}
