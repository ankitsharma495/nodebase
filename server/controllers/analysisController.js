// ===========================================
// Analysis Controller - Profile analysis & plans
// ===========================================

const geminiService = require('../services/geminiService');
const growthScoreService = require('../services/growthScoreService');
const prisma = require('../models/prisma');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * POST /api/analysis
 * Analyze user's LinkedIn posts using Gemini AI.
 * Body: { posts: "string of pasted posts" }
 */
const analyzeProfile = async (req, res, next) => {
  try {
    const { posts } = req.body;
    const userId = req.user.id;

    if (!posts || typeof posts !== 'string' || posts.trim().length < 50) {
      throw new AppError('Please provide at least 50 characters of LinkedIn post content.', 400);
    }

    // Run AI analysis
    const analysisResult = await geminiService.analyzeProfile(posts.trim());

    // Calculate growth score
    const scoreData = growthScoreService.getBreakdown(analysisResult);

    // Generate 7-day growth plan
    const growthPlan = await geminiService.generateGrowthPlan(analysisResult, posts.trim());

    // Save to database
    const analysis = await prisma.analysis.create({
      data: {
        userId,
        rawPosts: posts.trim(),
        detectedNiche: analysisResult.detected_niche || null,
        growthScore: scoreData.total,
        fullAnalysisJson: analysisResult,
        growthPlanJson: growthPlan,
      },
    });

    logger.info('Profile analysis completed', { userId, analysisId: analysis.id, score: scoreData.total });

    return sendSuccess(res, {
      analysisId: analysis.id,
      analysis: analysisResult,
      growthScore: scoreData,
      growthPlan,
    }, 'Profile analysis completed successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analysis
 * Get all analyses for the authenticated user.
 */
const getAnalyses = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const analyses = await prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        detectedNiche: true,
        growthScore: true,
        createdAt: true,
      },
    });

    return sendSuccess(res, { analyses }, 'Analyses retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analysis/:id
 * Get a single analysis by ID (must belong to user).
 */
const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await prisma.analysis.findFirst({
      where: { id, userId },
    });

    if (!analysis) {
      throw new AppError('Analysis not found.', 404);
    }

    // Build score breakdown from stored analysis
    const scoreData = growthScoreService.getBreakdown(analysis.fullAnalysisJson);

    return sendSuccess(res, {
      analysis: {
        id: analysis.id,
        rawPosts: analysis.rawPosts,
        detectedNiche: analysis.detectedNiche,
        growthScore: scoreData,
        fullAnalysis: analysis.fullAnalysisJson,
        growthPlan: analysis.growthPlanJson,
        createdAt: analysis.createdAt,
      },
    }, 'Analysis retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/analysis/:id
 * Delete an analysis (must belong to user).
 */
const deleteAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await prisma.analysis.findFirst({
      where: { id, userId },
    });

    if (!analysis) {
      throw new AppError('Analysis not found.', 404);
    }

    await prisma.analysis.delete({ where: { id } });

    return sendSuccess(res, null, 'Analysis deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeProfile,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
};
