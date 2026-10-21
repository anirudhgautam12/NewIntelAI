import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[Database] MongoDB Connected to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Initial connection failed: ${error.message}`);
    process.exit(1);
  }
};
