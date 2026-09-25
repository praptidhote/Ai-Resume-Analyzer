const PDFDocument = require("pdfkit");

/**
 * Generates a clean, professional PDF report of the ATS analysis
 */
function generatePdfReport(analysis, resume) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  // Title & Header
  doc
    .fillColor("#0f172a")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("ATS Resume Assessment Report", { align: "center" });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#64748b")
    .text(`Generated on ${new Date(analysis.createdAt || Date.now()).toLocaleDateString()}`, {
      align: "center",
    });

  doc.moveDown(1.5);

  // Metadata block
  doc.rect(40, doc.y, 515, 60).fillAndStroke("#f8fafc", "#e2e8f0");
  const metaY = doc.y + 12;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#1e293b")
    .text("Target Role:", 55, metaY)
    .font("Helvetica")
    .text(analysis.jobTitle || "Not specified", 130, metaY)
    .font("Helvetica-Bold")
    .text("Company:", 55, metaY + 18)
    .font("Helvetica")
    .text(analysis.companyName || "Not specified", 130, metaY + 18)
    .font("Helvetica-Bold")
    .text("Resume File:", 320, metaY)
    .font("Helvetica")
    .text(resume?.fileName || "Uploaded Resume", 395, metaY);

  doc.y = metaY + 50;
  doc.moveDown();

  // Score Summary
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#0f172a")
    .text("Overall ATS Match Score");

  const scoreY = doc.y + 5;
  const overall = analysis.scores?.overall || 0;
  const scoreColor = overall >= 80 ? "#16a34a" : overall >= 60 ? "#d97706" : "#dc2626";

  doc
    .fontSize(32)
    .font("Helvetica-Bold")
    .fillColor(scoreColor)
    .text(`${overall}/100`, 55, scoreY);

  // Breakdown
  const scores = analysis.scores || {};
  const breakdownX = 200;
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#334155")
    .text(`Keyword Match (40%): ${scores.keywordMatch || 0}%`, breakdownX, scoreY + 2)
    .text(`Relevance (30%): ${scores.relevance || 0}%`, breakdownX, scoreY + 16)
    .text(`Formatting (15%): ${scores.formatting || 0}%`, breakdownX + 160, scoreY + 2)
    .text(`Impact / Metrics (15%): ${scores.impact || 0}%`, breakdownX + 160, scoreY + 16);

  doc.y = scoreY + 45;
  doc.moveDown();

  // Keywords section
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#0f172a")
    .text("Keyword Alignment");

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#16a34a")
    .text("Matched Skills: ", { continued: true })
    .font("Helvetica")
    .fillColor("#334155")
    .text(analysis.keywords?.matched?.slice(0, 15).join(", ") || "None");

  doc
    .font("Helvetica-Bold")
    .fillColor("#dc2626")
    .text("Missing Skills: ", { continued: true })
    .font("Helvetica")
    .fillColor("#334155")
    .text(analysis.keywords?.missing?.slice(0, 15).join(", ") || "None");

  doc.moveDown();

  // Actionable Suggestions
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#0f172a")
    .text("Priority Improvement Suggestions");

  if (analysis.suggestions && analysis.suggestions.length > 0) {
    analysis.suggestions.slice(0, 4).forEach((sug, idx) => {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#1e293b")
        .text(`${idx + 1}. ${sug.issue}`)
        .font("Helvetica")
        .fillColor("#475569")
        .text(`Recommendation: ${sug.fix}`, { indent: 15 });
      doc.moveDown(0.5);
    });
  }

  doc.moveDown(0.5);

  // Rewritten Bullets
  if (analysis.rewrittenBullets && analysis.rewrittenBullets.length > 0) {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#0f172a")
      .text("High-Impact Bullet Point Rewrites (XYZ Formula)");

    analysis.rewrittenBullets.slice(0, 2).forEach((bullet) => {
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#dc2626")
        .text("Original: ", { continued: true })
        .font("Helvetica")
        .fillColor("#64748b")
        .text(bullet.original);

      doc
        .font("Helvetica-Bold")
        .fillColor("#16a34a")
        .text("Improved: ", { continued: true })
        .font("Helvetica")
        .fillColor("#1e293b")
        .text(bullet.improved);

      doc.moveDown(0.5);
    });
  }

  doc.end();
  return doc;
}

module.exports = {
  generatePdfReport,
};
