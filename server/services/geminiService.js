// ===========================================
// Gemini AI Service - Profile Analysis & Plans
// ===========================================

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../utils/config');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: config.gemini.model });
  }

  /**
   * Analyze LinkedIn posts and return structured profile analysis.
   * @param {string} postsText - Raw text of user's last 5 LinkedIn posts
   * @returns {Promise<object>} Structured analysis JSON
   */
  async analyzeProfile(postsText) {
    const prompt = `
You are an expert LinkedIn growth strategist and content analyst.

Analyze the following LinkedIn posts from a creator and provide a detailed, structured analysis.

POSTS:
"""
${postsText}
"""

Return your analysis as a valid JSON object with EXACTLY these fields:

{
  "detected_niche": "The primary niche/topic area of the creator (string)",
  "target_audience": "Description of who the content is aimed at (string)",
  "content_strengths": ["Array of 3-5 specific strengths identified in the posts"],
  "content_gaps": ["Array of 3-5 content gaps or missing opportunities"],
  "tone_analysis": {
    "primary_tone": "The dominant tone (e.g., professional, casual, inspirational)",
    "secondary_tone": "A secondary tone if present",
    "consistency": "How consistent the tone is across posts (high/medium/low)"
  },
  "growth_opportunities": ["Array of 3-5 actionable growth opportunities"],
  "hashtag_usage": "Assessment of hashtag strategy (string)",
  "cta_effectiveness": "Assessment of calls-to-action usage (string)",
  "posting_patterns": "Observations about posting patterns (string)"
}

IMPORTANT: 
- Return ONLY the JSON object, no markdown, no code blocks, no extra text.
- All fields must be present.
- Arrays must contain 3-5 items each.
- Be specific and actionable in your analysis.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      return this._parseJsonResponse(responseText);
    } catch (error) {
      logger.error('Gemini profile analysis failed', { error: error.message });
      throw new AppError('AI analysis failed. Please try again.', 502);
    }
  }

  /**
   * Generate a 7-day growth plan based on analysis.
   * @param {object} analysis - The profile analysis result
   * @param {string} postsText - Original posts for context
   * @returns {Promise<object>} 7-day growth plan
   */
  async generateGrowthPlan(analysis, postsText) {
    const prompt = `
You are an expert LinkedIn growth strategist.

Based on the following profile analysis and original posts, create a detailed 7-day LinkedIn growth plan.

PROFILE ANALYSIS:
${JSON.stringify(analysis, null, 2)}

ORIGINAL POSTS:
"""
${postsText}
"""

Return a valid JSON object with EXACTLY this structure:

{
  "plan_title": "Personalized title for the 7-day plan",
  "plan_summary": "Brief overview of the plan strategy",
  "days": [
    {
      "day": 1,
      "theme": "Day theme (e.g., 'Authority Building')",
      "post_idea": "Detailed post idea with topic and angle",
      "hook": "An attention-grabbing opening line for the post",
      "suggested_cta": "A specific call-to-action to include",
      "engagement_task": "A specific engagement activity to do that day (e.g., 'Comment on 10 posts in your niche')",
      "best_posting_time": "Suggested time to post",
      "content_format": "Format suggestion (text, carousel, poll, video, etc.)"
    }
  ]
}

IMPORTANT:
- Return ONLY the JSON object, no markdown, no code blocks, no extra text.
- Include exactly 7 days in the "days" array (day 1 through day 7).
- Each day must have all fields filled with specific, actionable content.
- Make hooks compelling and scroll-stopping.
- CTAs should drive engagement (comments, shares, follows).
- Engagement tasks should be practical and time-bound.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      return this._parseJsonResponse(responseText);
    } catch (error) {
      logger.error('Gemini growth plan generation failed', { error: error.message });
      throw new AppError('Growth plan generation failed. Please try again.', 502);
    }
  }

  /**
   * Parse and validate JSON response from Gemini.
   * Handles cases where the model wraps JSON in markdown code blocks.
   * @param {string} text - Raw response text
   * @returns {object} Parsed JSON
   */
  _parseJsonResponse(text) {
    let cleaned = text.trim();

    // Remove markdown code block wrappers if present
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }

    cleaned = cleaned.trim();

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      logger.error('Failed to parse Gemini JSON response', {
        error: parseError.message,
        rawResponse: text.substring(0, 500),
      });
      throw new AppError('AI returned an invalid response. Please try again.', 502);
    }
  }
}

module.exports = new GeminiService();
