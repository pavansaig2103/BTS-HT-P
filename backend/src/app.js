const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const errorHandler = require('./middleware/error.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const documentRoutes = require('./routes/document.routes');
const workflowRoutes = require('./routes/workflow.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Trust proxy for rate limiters behind reverse proxies (Render, Vercel)
app.set('trust proxy', 1);

// CORS configuration
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      // Allow configured FRONTEND_URL, localhost dev origins, and Vercel preview/production domains ending with .vercel.app
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development' || (typeof origin === 'string' && origin.endsWith('.vercel.app')) || (env.FRONTEND_URL && origin === env.FRONTEND_URL)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },

    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// General Rate Limiter
app.use('/api', apiLimiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AccessFlow AI Backend',
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/ai', aiRoutes);

// Catch 404s
app.use(notFoundHandler);

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
