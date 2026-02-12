// ===========================================
// JWT Authentication Middleware
// ===========================================

const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const prisma = require('../models/prisma');
const AppError = require('../utils/AppError');

const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header or cookie
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        linkedinId: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
