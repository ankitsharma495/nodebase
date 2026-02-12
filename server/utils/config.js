// ===========================================
// Configuration - Centralized env access
// ===========================================

const dotenv = require('dotenv');
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  db: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    redirectUri: process.env.LINKEDIN_REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
  },

  client: {
    url: process.env.CLIENT_URL || 'http://localhost:5173',
  },
};

// Validate required env vars at startup
const required = ['DATABASE_URL', 'JWT_SECRET', 'LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'GEMINI_API_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`⚠️  Missing env variable: ${key}`);
  }
}

module.exports = config;
