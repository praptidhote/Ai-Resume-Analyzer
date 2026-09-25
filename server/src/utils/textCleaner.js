/**
 * Cleans and normalizes extracted resume and job description text
 */
function cleanText(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return (
    text
      // Replace non-breaking spaces and irregular whitespace with standard space
      .replace(/[\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000]/g, " ")
      // Replace multiple spaces with a single space
      .replace(/[ \t]+/g, " ")
      // Replace 3+ consecutive newlines with 2 newlines
      .replace(/\n\s*\n\s*\n+/g, "\n\n")
      // Remove unprintable control characters except newline and tab
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim()
  );
}

/**
 * Extracts sections (summary, skills, experience, education) using common regex patterns
 */
function extractSections(text) {
  const sections = {
    summary: "",
    skills: [],
    experience: [],
    education: [],
  };

  if (!text) return sections;

  const lines = text.split("\n").map((line) => line.trim());
  let currentSection = null;
  const sectionContent = {
    summary: [],
    skills: [],
    experience: [],
    education: [],
  };

  const sectionPatterns = {
    summary: /^(professional summary|summary|profile|about me|objective|career objective)/i,
    skills: /^(skills|technical skills|core competencies|areas of expertise|technologies|proficiencies)/i,
    experience: /^(work experience|experience|professional experience|employment history|work history)/i,
    education: /^(education|academic background|qualifications|academic history)/i,
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Check if line matches any section header
    let matchedHeader = null;
    for (const [sec, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line) && line.length < 40) {
        matchedHeader = sec;
        break;
      }
    }

    if (matchedHeader) {
      currentSection = matchedHeader;
      continue;
    }

    if (currentSection) {
      sectionContent[currentSection].push(line);
    }
  }

  // Assign extracted content
  sections.summary = sectionContent.summary.join(" ").trim();
  sections.skills = sectionContent.skills
    .flatMap((line) => line.split(/[,•|·\t]/))
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 50);
  sections.experience = sectionContent.experience;
  sections.education = sectionContent.education;

  return sections;
}

module.exports = {
  cleanText,
  extractSections,
};
