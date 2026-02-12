// ===========================================
// Auth Routes
// ===========================================

const { Router } = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = Router();

// LinkedIn OAuth
router.get('/linkedin', authController.linkedinLogin);
router.get('/linkedin/callback', authController.linkedinCallback);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
