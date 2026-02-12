// ===========================================
// Flowbase API - Main Application Entry Point
// ===========================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const config = require('./utils/config');
const logger = require('./utils/logger');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// ===========================================
// Security Middleware
// ===========================================

app.use(helmet());

app.use(cors({
  origin: config.client.url,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    data: null,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// Stricter rate limit for AI analysis endpoint
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    data: null,
    message: 'Analysis rate limit reached. Please try again in an hour.',
  },
});

app.use('/api/analysis', analysisLimiter);

// ===========================================
// Body Parsing & Logging
// ===========================================

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// HTTP request logging
if (config.env !== 'test') {
  app.use(morgan('dev', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));
}

// ===========================================
// Routes
// ===========================================

app.use('/api', routes);

// ===========================================
// Error Handling
// ===========================================

app.use(notFound);
app.use(errorHandler);

// ===========================================
// Start Server
// ===========================================

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Flowbase API running on port ${PORT} [${config.env}]`);
  logger.info(`📡 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
