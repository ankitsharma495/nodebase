// ===========================================
// Route Index - Central route registration
// ===========================================

const { Router } = require('express');
const authRoutes = require('./authRoutes');
const analysisRoutes = require('./analysisRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/analysis', analysisRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Flowbase API is running', timestamp: new Date().toISOString() });
});

module.exports = router;
