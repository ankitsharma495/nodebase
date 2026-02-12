// ===========================================
// Analysis Routes
// ===========================================

const { Router } = require('express');
const analysisController = require('../controllers/analysisController');
const authenticate = require('../middleware/authenticate');

const router = Router();

// All analysis routes require authentication
router.use(authenticate);

router.post('/', analysisController.analyzeProfile);
router.get('/', analysisController.getAnalyses);
router.get('/:id', analysisController.getAnalysisById);
router.delete('/:id', analysisController.deleteAnalysis);

module.exports = router;
