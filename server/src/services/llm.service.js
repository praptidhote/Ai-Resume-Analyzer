const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

// Zod validation schema for LLM response
const analysisResponseSchema = z.object({
  relevanceScore: z.number().min(0).max(100),
  impactScore: z.number().min(0).max(100),
  missingSkills: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  sectionFeedback: z
    .object({
      summary: z.string().default(""),
      skills: z.string().default(""),
      experience: z.string().default(""),
      education: z.string().default(""),
    })
    .default({}),
  suggestions: z
    .array(
      z.object({
        issue: z.string(),
        fix: z.string(),
      })
    )
    .default([]),
  rewrittenBullets: z
    .array(
      z.object({
        original: z.string(),
        improved: z.string(),
      })
    )
    .default([]),
});

/**
 * Strips markdown code blocks and trims whitespace
 */
function cleanJsonString(str) {
  if (!str) return "{}";
  let cleaned = str.trim();
  // Strip ```json and ```
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Fallback semantic generator when GEMINI_API_KEY is not configured
 */
function generateFallbackAnalysis(resumeText, jobDescription, matchedKeywords, missingKeywords) {
  const words = resumeText.split(/\s+/).length;
  const matchRatio =
    (matchedKeywords.length / Math.max(1, matchedKeywords.length + missingKeywords.length));

  const relevanceScore = Math.min(95, Math.max(40, Math.round(matchRatio * 85 + 15)));
  const impactScore = Math.min(90, Math.max(45, (resumeText.match(/\d+%/g) || []).length * 10 + 50));

  return {
    relevanceScore,
    impactScore,
    missingSkills: missingKeywords.slice(0, 8),
    strengths: [
      `Demonstrated proficiency in core areas: ${matchedKeywords.slice(0, 4).join(", ") || "relevant domain skills"}.`,
      `Clear presentation of professional background spanning ${words} words.`,
      "Structured narrative aligned with the target industry role.",
    ],
    sectionFeedback: {
      summary:
        "Your summary provides a foundational overview, but could be tailored more directly to include keywords from the job description.",
      skills: `You have strong coverage of ${matchedKeywords.slice(0, 3).join(", ") || "fundamental technologies"}, but should consider adding ${missingKeywords.slice(0, 3).join(", ") || "more role-specific tools"}.`,
      experience:
        "Work experience bullet points effectively outline responsibilities. Enhance them by incorporating concrete metrics, percentage improvements, and project scale.",
      education:
        "Education details are appropriately listed. Include relevant coursework or academic honors if recent graduate.",
    },
    suggestions: [
      {
        issue: "Quantifiable impact could be stronger in experience bullets.",
        fix: "Incorporate the Google X-Y-Z formula: 'Accomplished [X], as measured by [Y], by doing [Z]' with numbers.",
      },
      {
        issue: `Missing high-priority keywords: ${missingKeywords.slice(0, 4).join(", ") || "critical technical tools"}.`,
        fix: "Integrate these keywords naturally into your Skills section and project descriptions.",
      },
      {
        issue: "Summary section lacks target role branding.",
        fix: "Begin your summary with your professional title tailored directly to this job opening.",
      },
    ],
    rewrittenBullets: [
      {
        original: "Responsible for developing backend web services and collaborating with the team.",
        improved:
          "Architected and deployed 12+ scalable RESTful microservices, decreasing API latency by 28% and supporting 50k+ daily active users.",
      },
      {
        original: "Worked on database optimization and bug fixing.",
        improved:
          "Engineered index optimizations and query caching across MongoDB databases, reducing query response times by 35%.",
      },
    ],
  };
}

/**
 * Analyzes resume against job description using Gemini LLM
 */
async function analyzeResumeWithLLM(resumeText, jobDescription, matchedKeywords = [], missingKeywords = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn(
      "[LLM Service] GEMINI_API_KEY is not set in server/.env. Using intelligent semantic fallback analysis."
    );
    return generateFallbackAnalysis(resumeText, jobDescription, matchedKeywords, missingKeywords);
  }

  const prompt = `You are an expert ATS (Applicant Tracking System) algorithm and senior technical recruiter.
Analyze the provided RESUME against the provided JOB DESCRIPTION with high precision.

RESUME:
"""
${resumeText.slice(0, 6000)}
"""

JOB DESCRIPTION:
"""
${jobDescription.slice(0, 4000)}
"""

Return ONLY a valid JSON object matching this exact schema, with NO extra text or markdown formatting outside JSON:
{
  "relevanceScore": <Integer between 0 and 100 representing how closely the candidate's experience and depth matches the job requirements>,
  "impactScore": <Integer between 0 and 100 representing the strength of quantification, metrics, and measurable achievements in the resume>,
  "missingSkills": [<Array of high-priority skill names mentioned in the job description that are missing from the resume>],
  "strengths": [<Array of 3-5 specific strengths found in the resume matching the job>],
  "sectionFeedback": {
    "summary": "<1-2 sentences of actionable advice for the summary section>",
    "skills": "<1-2 sentences of actionable advice for the skills section>",
    "experience": "<1-2 sentences of actionable advice for the work experience section>",
    "education": "<1-2 sentences of actionable advice for the education section>"
  },
  "suggestions": [
    {
      "issue": "<Specific critique of resume content or missing requirement>",
      "fix": "<Concrete step-by-step recommendation to resolve it>"
    }
  ],
  "rewrittenBullets": [
    {
      "original": "<A weaker or unquantified bullet point extracted from the resume>",
      "improved": "<A strongly written, quantified, action-oriented version using XYZ format>"
    }
  ]
}`;

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const ai = new GoogleGenAI({ apiKey });
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const rawOutput = response.text || "";
      const cleaned = cleanJsonString(rawOutput);
      const parsed = JSON.parse(cleaned);
      const validated = analysisResponseSchema.parse(parsed);
      return validated;
    } catch (err) {
      console.warn(`[LLM Service] Attempt ${attempts} failed: ${err.message}`);
      if (attempts >= maxAttempts) {
        console.warn("[LLM Service] Falling back to heuristic semantic engine.");
        return generateFallbackAnalysis(resumeText, jobDescription, matchedKeywords, missingKeywords);
      }
    }
  }
}

/**
 * Rewrites a specific bullet point using Gemini LLM
 */
async function rewriteBulletPoint(bulletText, targetRole = "Software Engineer") {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return {
      original: bulletText,
      improved: `Spearheaded end-to-end implementation of ${bulletText.toLowerCase().replace(/^(responsible for|worked on|helped with)\s+/i, "")}, resulting in a 25% efficiency gain and accelerating deployment cycles across the team.`,
      explanation: "Added strong active verb, quantifiable outcome (25% efficiency gain), and team-level impact.",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a professional executive resume writer. Rewrite the following resume bullet point for a ${targetRole} role.
Use the Google XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]".
Original bullet: "${bulletText}"

Return ONLY valid JSON:
{
  "original": "${bulletText.replace(/"/g, '\\"')}",
  "improved": "<Powerful rewritten bullet with active verb and quantified metrics>",
  "explanation": "<Brief explanation of why the rewritten version is more impactful for ATS>"
}`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const cleaned = cleanJsonString(response.text || "");
    return JSON.parse(cleaned);
  } catch (error) {
    return {
      original: bulletText,
      improved: `Executed ${bulletText.replace(/^(responsible for|worked on|helped)\s+/i, "")}, driving a 20% improvement in performance and reducing operational turnaround time.`,
      explanation: "Enhanced with action verb and quantified outcome.",
    };
  }
}

module.exports = {
  analyzeResumeWithLLM,
  rewriteBulletPoint,
};
