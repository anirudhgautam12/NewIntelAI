import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import articleRouter from './routes/article.routes.js';
import chatRouter from './routes/chat.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { ApiError } from './utils/ApiError.js';

const app = express();

// Configure CORS to allow requests from client url or common vite dev ports
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS origin ${origin} not allowed`));
    },
    credentials: true
  })
);

// Express body parsers with 5mb payload limit for larger articles
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI News Intelligence Backend is running'
  });
});

// Route mountings
app.use('/api/auth', authRouter);
app.use('/api/articles', articleRouter);
app.use('/api/articles', chatRouter);

// Catch all unmatched routes and throw 404 ApiError
app.use((req, res, next) => {
  next(new ApiError(404, `API route not found: ${req.method} ${req.originalUrl}`));
});

// Global error handler (must be mounted last)
app.use(errorHandler);

export default app;
