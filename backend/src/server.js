import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';

// Initialize Database connection
connectDB();

// Bind and listen HTTP server
const server = app.listen(config.port, () => {
  console.log(`[Server] AI News Intelligence Platform Backend running on port: ${config.port}`);
});

/**
 * Handle graceful process termination
 * @param {string} signal 
 */
const gracefulShutdown = (signal) => {
  console.log(`[Server] Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    console.log('[Server] HTTP server stopped accepting connections.');
    try {
      await mongoose.connection.close();
      console.log('[Database] MongoDB Mongoose connection terminated successfully.');
      process.exit(0);
    } catch (err) {
      console.error('[Database Error] Error terminating MongoDB connection:', err.message);
      process.exit(1);
    }
  });

  // Timeout handler to force terminate in case of socket leaks
  setTimeout(() => {
    console.error('[Server] Graceful shutdown timed out. Forcing termination.');
    process.exit(1);
  }, 10000);
};

// Bind POSIX termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
