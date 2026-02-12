// ===========================================
// Growth Score Service
// ===========================================

const logger = require('../utils/logger');

class GrowthScoreService {
  /**
   * Calculate a growth score (0-100) from the AI analysis.
   *
   * Scoring dimensions (each out of 25):
   *  - Consistency (posting patterns, tone consistency)
   *  - Niche Clarity (how clear and focused the niche is)
   *  - CTA Usage (effectiveness of calls-to-action)
   *  - Engagement Encouragement (growth opportunities, engagement strategies)
   *
   * @param {object} analysis - Full analysis JSON from Gemini
   * @returns {number} Score between 0-100
   */
  calculate(analysis) {
    try {
      let score = 0;

      // 1. Consistency Score (0-25)
      score += this._scoreConsistency(analysis);

      // 2. Niche Clarity Score (0-25)
      score += this._scoreNicheClarity(analysis);

      // 3. CTA Usage Score (0-25)
      score += this._scoreCtaUsage(analysis);

      // 4. Engagement Encouragement Score (0-25)
      score += this._scoreEngagement(analysis);

      return Math.min(100, Math.max(0, Math.round(score)));
    } catch (error) {
      logger.error('Growth score calculation failed', { error: error.message });
      return 50; // Default middle score on error
    }
  }

  /**
   * Get a detailed score breakdown.
   * @param {object} analysis
   * @returns {object} Breakdown with individual scores
   */
  getBreakdown(analysis) {
    const consistency = this._scoreConsistency(analysis);
    const nicheClarity = this._scoreNicheClarity(analysis);
    const ctaUsage = this._scoreCtaUsage(analysis);
    const engagement = this._scoreEngagement(analysis);

    return {
      total: Math.min(100, Math.max(0, Math.round(consistency + nicheClarity + ctaUsage + engagement))),
      breakdown: {
        consistency: { score: Math.round(consistency), maxScore: 25 },
        nicheClarity: { score: Math.round(nicheClarity), maxScore: 25 },
        ctaUsage: { score: Math.round(ctaUsage), maxScore: 25 },
        engagementEncouragement: { score: Math.round(engagement), maxScore: 25 },
      },
    };
  }

  // --- Private scoring methods ---

  _scoreConsistency(analysis) {
    let score = 10; // Base score

    const toneConsistency = analysis.tone_analysis?.consistency?.toLowerCase();
    if (toneConsistency === 'high') score += 15;
    else if (toneConsistency === 'medium') score += 8;
    else score += 3;

    // Bonus for having posting patterns mentioned positively
    if (analysis.posting_patterns && !analysis.posting_patterns.toLowerCase().includes('inconsist')) {
      score += 2;
    }

    return Math.min(25, score);
  }

  _scoreNicheClarity(analysis) {
    let score = 5;

    // Has a detected niche
    if (analysis.detected_niche && analysis.detected_niche.length > 3) {
      score += 10;
    }

    // Content strengths indicate focus
    const strengths = analysis.content_strengths || [];
    score += Math.min(5, strengths.length * 1.5);

    // Fewer content gaps = more clarity
    const gaps = analysis.content_gaps || [];
    if (gaps.length <= 2) score += 5;
    else if (gaps.length <= 4) score += 3;

    return Math.min(25, score);
  }

  _scoreCtaUsage(analysis) {
    let score = 5;

    const ctaEffectiveness = (analysis.cta_effectiveness || '').toLowerCase();
    if (ctaEffectiveness.includes('strong') || ctaEffectiveness.includes('effective') || ctaEffectiveness.includes('good')) {
      score += 15;
    } else if (ctaEffectiveness.includes('moderate') || ctaEffectiveness.includes('some')) {
      score += 8;
    } else if (ctaEffectiveness.includes('weak') || ctaEffectiveness.includes('missing') || ctaEffectiveness.includes('lacking')) {
      score += 2;
    } else {
      score += 5; // Neutral default
    }

    // Hashtag usage as minor bonus
    const hashtagUsage = (analysis.hashtag_usage || '').toLowerCase();
    if (hashtagUsage.includes('good') || hashtagUsage.includes('effective') || hashtagUsage.includes('strategic')) {
      score += 5;
    }

    return Math.min(25, score);
  }

  _scoreEngagement(analysis) {
    let score = 5;

    // Growth opportunities indicate potential
    const opportunities = analysis.growth_opportunities || [];
    score += Math.min(10, opportunities.length * 2.5);

    // Target audience clarity
    if (analysis.target_audience && analysis.target_audience.length > 10) {
      score += 5;
    }

    // Tone having a secondary tone suggests variety
    if (analysis.tone_analysis?.secondary_tone) {
      score += 3;
    }

    return Math.min(25, score);
  }
}

module.exports = new GrowthScoreService();
