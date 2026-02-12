// ===========================================
// LinkedIn OAuth Service
// ===========================================

const config = require('../utils/config');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

class LinkedInService {
  /**
   * Generate the LinkedIn OAuth 2.0 authorization URL.
   * @returns {string} Authorization URL to redirect user to
   */
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.linkedin.clientId,
      redirect_uri: config.linkedin.redirectUri,
      scope: config.linkedin.scopes.join(' '),
      state: this._generateState(),
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token.
   * @param {string} code - Authorization code from LinkedIn callback
   * @returns {Promise<string>} Access token
   */
  async getAccessToken(code) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: config.linkedin.clientId,
      client_secret: config.linkedin.clientSecret,
      redirect_uri: config.linkedin.redirectUri,
    });

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('LinkedIn token exchange failed', { status: response.status, errorData });
      throw new AppError('Failed to authenticate with LinkedIn.', 401);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Fetch user profile from LinkedIn using access token.
   * @param {string} accessToken
   * @returns {Promise<{linkedinId: string, name: string, email: string|null, avatarUrl: string|null}>}
   */
  async getUserProfile(accessToken) {
    // Fetch profile using OpenID Connect userinfo endpoint
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      logger.error('LinkedIn profile fetch failed', { status: response.status });
      throw new AppError('Failed to fetch LinkedIn profile.', 502);
    }

    const profile = await response.json();

    return {
      linkedinId: profile.sub,
      name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
      email: profile.email || null,
      avatarUrl: profile.picture || null,
    };
  }

  /**
   * Generate a random state parameter for CSRF protection.
   * @returns {string}
   */
  _generateState() {
    return require('crypto').randomBytes(16).toString('hex');
  }
}

module.exports = new LinkedInService();
