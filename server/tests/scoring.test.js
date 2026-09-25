const assert = require("assert");
const {
  extractJobKeywords,
  matchResumeKeywords,
  checkResumeFormatting,
} = require("../src/services/keyword.service");
const { calculateATSScore } = require("../src/services/scoring.service");

async function runTests() {
  console.log("--- Starting Scoring & Keyword Unit Tests ---");

  // Test 1: Extract keywords from Job Description
  const sampleJD = `
    We are looking for a Senior Full Stack Developer proficient in React, Node.js, and TypeScript.
    Experience with Docker, Kubernetes, AWS, and MongoDB is strongly desired.
    Must have experience with RESTful APIs, CI/CD pipelines, and Agile development.
  `;

  const extractedKeywords = extractJobKeywords(sampleJD);
  console.log("✓ Extracted JD Keywords:", extractedKeywords);
  assert(extractedKeywords.includes("React"), "Should detect React");
  assert(extractedKeywords.includes("Node.js"), "Should detect Node.js");
  assert(extractedKeywords.includes("TypeScript"), "Should detect TypeScript");
  assert(extractedKeywords.includes("Docker"), "Should detect Docker");
  assert(extractedKeywords.includes("MongoDB"), "Should detect MongoDB");
  assert(extractedKeywords.includes("AWS"), "Should detect AWS");

  // Test 2: Match Resume with Synonyms
  const sampleResume = `
    Jane Doe - Full Stack Software Engineer
    Email: jane@example.com | Phone: 555-123-4567

    SUMMARY
    Experienced developer with 4 years building scalable web applications.

    SKILLS
    Languages & Tools: JS, TS, React.js, Python, Mongo, Git, Docker, REST API

    EXPERIENCE
    Software Engineer at TechCorp
    - Built responsive frontend using React and Next.js for 100k users.
    - Designed microservices with Node and Express.
    - Improved deployment speed by 40% using GitHub Actions and containerization.

    EDUCATION
    B.S. in Computer Science - University of Science
  `;

  const matchResult = matchResumeKeywords(sampleResume, sampleJD);
  console.log("✓ Matched Keywords:", matchResult.matched);
  console.log("✓ Missing Keywords:", matchResult.missing);
  console.log("✓ Keyword Match Score:", matchResult.keywordScore);

  assert(matchResult.matched.includes("React"), "Should match React");
  assert(matchResult.matched.includes("TypeScript"), "Should match TS synonym for TypeScript");
  assert(matchResult.matched.includes("MongoDB"), "Should match Mongo synonym for MongoDB");
  assert(matchResult.matched.includes("Docker"), "Should match Docker");
  assert(matchResult.missing.includes("Kubernetes"), "Kubernetes should be missing");
  assert(matchResult.keywordScore > 50, "Score should reflect matches");

  // Test 3: Formatting checks
  const formatResult = checkResumeFormatting(sampleResume, {
    summary: "Experienced developer...",
    skills: ["JS", "TS", "React.js"],
    experience: ["Built responsive frontend..."],
    education: ["B.S. in Computer Science"],
  });
  console.log("✓ Format Score:", formatResult.formatScore);
  assert(formatResult.formatScore >= 70, "Format score should pass for well-formed resume");

  // Test 4: End-to-end hybrid scoring
  const fullScore = await calculateATSScore(sampleResume, sampleJD, {
    summary: "Experienced developer...",
    skills: ["JS", "TS", "React.js"],
    experience: ["Built responsive frontend..."],
    education: ["B.S. in Computer Science"],
  });
  console.log("✓ End-to-End ATS Score Result:", fullScore.scores);
  assert(fullScore.scores.overall >= 50 && fullScore.scores.overall <= 100, "Overall score within 0-100");
  assert(fullScore.suggestions.length > 0, "Suggestions should be provided");
  assert(fullScore.rewrittenBullets.length > 0, "Rewritten bullets should be provided");

  console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY!\n");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
