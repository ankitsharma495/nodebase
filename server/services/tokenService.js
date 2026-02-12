// ===========================================
// JWT Token Service
// ===========================================

const jwt = require('jsonwebtoken');
const config = require('../utils/config');

class TokenService {
  /**
   * Generate a JWT for a user.
   * @param {string} userId
   * @returns {string} JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { userId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  /**
   * Verify and decode a JWT.
   * @param {string} token
   * @returns {object} Decoded payload
   */
  verifyToken(token) {
    return jwt.verify(token, config.jwt.secret);
  }
}

module.exports = new TokenService();
