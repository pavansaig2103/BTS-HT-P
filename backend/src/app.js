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

// Custom CORS middleware: set CORS headers explicitly so preflight replies are always correct
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Allow requests with no origin (curl, Postman) or from configured/known origins
  const ok =
    !origin ||
    origin === env.FRONTEND_URL ||
    allowedOrigins.includes(origin) ||
    env.NODE_ENV === 'development' ||
    (typeof origin === 'string' && origin.endsWith('.vercel.app'));

  if (ok && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    // Respond to preflight immediately
    return res.sendStatus(204);
  }
  next();
});

// Also keep the cors middleware as a fallback for downstream middleware that may rely on it
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.FRONTEND_URL || allowedOrigins.includes(origin) || env.NODE_ENV === 'development' || (typeof origin === 'string' && origin.endsWith('.vercel.app'))) {
        callback(null, true);
      } else {
        callback(null, false);
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
