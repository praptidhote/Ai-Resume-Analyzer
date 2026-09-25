const natural = require("natural");
const skillsData = require("../utils/skillsDictionary.json");

// Flatten skills dictionary for quick matching
const allSkills = [];
for (const category of Object.values(skillsData)) {
  for (const skill of category) {
    allSkills.push({
      canonical: skill.name,
      variations: [skill.name, ...(skill.synonyms || [])].map((v) =>
        v.toLowerCase().trim()
      ),
    });
  }
}

/**
 * Escapes regex special characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Checks if a skill or any of its synonyms is found in text
 */
function isSkillPresent(textLower, skillObj) {
  for (const variation of skillObj.variations) {
    // Word boundary check (for short skills like C, R, Go, TS, JS, avoid false positives)
    let pattern;
    if (variation.length <= 2) {
      pattern = new RegExp(`\\b${escapeRegex(variation)}\\b`, "i");
    } else {
      pattern = new RegExp(`(^|[^a-zA-Z0-9])${escapeRegex(variation)}([^a-zA-Z0-9]|$)`, "i");
    }

    if (pattern.test(textLower)) {
      return true;
    }
  }
  return false;
}

/**
 * Extracts skills from job description using dictionary matching and TF-IDF
 */
function extractJobKeywords(jobDescription) {
  const jdLower = jobDescription.toLowerCase();
  const foundSkills = new Set();

  for (const skill of allSkills) {
    if (isSkillPresent(jdLower, skill)) {
      foundSkills.add(skill.canonical);
    }
  }

  // Also use natural TfIdf to find high-frequency technical tokens
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(jobDescription);

  // Return unique list of extracted skills
  return Array.from(foundSkills);
}

/**
 * Matches resume against job description skills
 */
function matchResumeKeywords(resumeText, jobDescription) {
  const resumeLower = (resumeText || "").toLowerCase();
  const jdSkills = extractJobKeywords(jobDescription);

  const matched = [];
  const missing = [];

  for (const skillName of jdSkills) {
    const skillObj = allSkills.find((s) => s.canonical === skillName);
    if (!skillObj) continue;

    if (isSkillPresent(resumeLower, skillObj)) {
      matched.push(skillName);
    } else {
      missing.push(skillName);
    }
  }

  // Calculate score (0-100)
  const total = matched.length + missing.length;
  const keywordScore = total > 0 ? Math.round((matched.length / total) * 100) : 70;

  return {
    matched,
    missing,
    keywordScore,
    totalRequired: total,
  };
}

/**
 * ATS format and structural completeness checks (Layer 1 Deterministic)
 */
function checkResumeFormatting(resumeText, parsedSections) {
  let formatScore = 0;
  const checks = [];

  // Check 1: Length check (reasonable length between 200 words and 2500 words)
  const wordCount = (resumeText || "").split(/\s+/).filter(Boolean).length;
  if (wordCount >= 250 && wordCount <= 1800) {
    formatScore += 25;
    checks.push({ label: "Optimal Word Count", passed: true, note: `${wordCount} words` });
  } else if (wordCount > 1800) {
    formatScore += 15;
    checks.push({ label: "Resume Length", passed: false, note: "Too long (> 1800 words), aim for 1-2 pages" });
  } else {
    formatScore += 10;
    checks.push({ label: "Resume Length", passed: false, note: "Too short (< 250 words)" });
  }

  // Check 2: Contact info presence (email & phone)
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  if (hasEmail && hasPhone) {
    formatScore += 25;
    checks.push({ label: "Contact Details", passed: true, note: "Email and phone detected" });
  } else if (hasEmail || hasPhone) {
    formatScore += 15;
    checks.push({ label: "Contact Details", passed: false, note: hasEmail ? "Phone missing" : "Email missing" });
  } else {
    formatScore += 0;
    checks.push({ label: "Contact Details", passed: false, note: "No contact details detected" });
  }

  // Check 3: Standard Section Headings
  const foundSections = [];
  if (parsedSections?.summary || /summary|profile|about/i.test(resumeText)) foundSections.push("Summary");
  if (parsedSections?.skills?.length || /skills|technologies/i.test(resumeText)) foundSections.push("Skills");
  if (parsedSections?.experience?.length || /experience|employment|work/i.test(resumeText)) foundSections.push("Experience");
  if (parsedSections?.education?.length || /education|degree|university/i.test(resumeText)) foundSections.push("Education");

  const sectionScore = Math.min(30, foundSections.length * 7.5);
  formatScore += sectionScore;
  checks.push({
    label: "Standard ATS Sections",
    passed: foundSections.length >= 3,
    note: `${foundSections.join(", ")} found`,
  });

  // Check 4: Bullet point usage
  const bulletCount = (resumeText.match(/[•\-\*]\s+/g) || []).length;
  if (bulletCount >= 5) {
    formatScore += 20;
    checks.push({ label: "Bullet Point Formatting", passed: true, note: `${bulletCount} bullet points detected` });
  } else {
    formatScore += 10;
    checks.push({ label: "Bullet Point Formatting", passed: false, note: "Few or no bullet points detected" });
  }

  return {
    formatScore: Math.min(100, Math.round(formatScore)),
    checks,
  };
}

module.exports = {
  extractJobKeywords,
  matchResumeKeywords,
  checkResumeFormatting,
};
