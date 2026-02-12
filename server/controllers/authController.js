// ===========================================
// Auth Controller - LinkedIn OAuth flow
// ===========================================

const linkedinService = require('../services/linkedinService');
const tokenService = require('../services/tokenService');
const prisma = require('../models/prisma');
const config = require('../utils/config');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * GET /api/auth/linkedin
 * Redirect user to LinkedIn OAuth consent screen.
 */
const linkedinLogin = async (req, res, next) => {
  try {
    const authUrl = linkedinService.getAuthorizationUrl();
    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/linkedin/callback
 * Handle LinkedIn OAuth callback, create/update user, issue JWT.
 */
const linkedinCallback = async (req, res, next) => {
  try {
    const { code, error: oauthError } = req.query;

    if (oauthError) {
      logger.warn('LinkedIn OAuth denied', { error: oauthError });
      return res.redirect(`${config.client.url}/login?error=access_denied`);
    }

    if (!code) {
      return res.redirect(`${config.client.url}/login?error=no_code`);
    }

    // Exchange code for access token
    const accessToken = await linkedinService.getAccessToken(code);

    // Fetch user profile
    const profile = await linkedinService.getUserProfile(accessToken);

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { linkedinId: profile.linkedinId },
      update: {
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        accessToken,
      },
      create: {
        linkedinId: profile.linkedinId,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        accessToken,
      },
    });

    // Generate JWT
    const jwtToken = tokenService.generateToken(user.id);

    logger.info('User authenticated via LinkedIn', { userId: user.id });

    // Redirect to frontend with token
    res.redirect(`${config.client.url}/auth/callback?token=${jwtToken}`);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user's profile.
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user }, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Clear auth cookie (if using cookies).
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  linkedinLogin,
  linkedinCallback,
  getMe,
  logout,
};
