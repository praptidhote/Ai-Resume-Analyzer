const {
  matchResumeKeywords,
  checkResumeFormatting,
} = require("./keyword.service");
const { analyzeResumeWithLLM } = require("./llm.service");

/**
 * Calculates hybrid ATS score combining Deterministic Layer 1 and LLM Semantic Layer 2
 */
async function calculateATSScore(resumeText, jobDescription, parsedSections = {}) {
  // --- Layer 1: Deterministic ---
  const { matched, missing, keywordScore } = matchResumeKeywords(
    resumeText,
    jobDescription
  );

  const { formatScore, checks: formatChecks } = checkResumeFormatting(
    resumeText,
    parsedSections
  );

  // --- Layer 2: LLM Semantic Analysis ---
  const llmResult = await analyzeResumeWithLLM(
    resumeText,
    jobDescription,
    matched,
    missing
  );

  const relevanceScore = llmResult.relevanceScore ?? 70;
  const impactScore = llmResult.impactScore ?? 65;

  // --- Final Score Formula ---
  // Keyword match: 40%
  // Relevance (LLM): 30%
  // Formatting & Completeness: 15%
  // Impact & Quantification (LLM): 15%
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        keywordScore * 0.4 +
          relevanceScore * 0.3 +
          formatScore * 0.15 +
          impactScore * 0.15
      )
    )
  );

  return {
    scores: {
      overall: overallScore,
      keywordMatch: keywordScore,
      relevance: relevanceScore,
      formatting: formatScore,
      impact: impactScore,
    },
    keywords: {
      matched,
      missing: Array.from(new Set([...missing, ...(llmResult.missingSkills || [])])),
    },
    strengths: llmResult.strengths || [],
    sectionFeedback: llmResult.sectionFeedback || {},
    suggestions: llmResult.suggestions || [],
    rewrittenBullets: llmResult.rewrittenBullets || [],
    formatChecks,
  };
}

module.exports = {
  calculateATSScore,
};
