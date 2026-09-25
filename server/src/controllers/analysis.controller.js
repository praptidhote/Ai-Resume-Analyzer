const Analysis = require("../models/Analysis");
const Resume = require("../models/Resume");
const { calculateATSScore } = require("../services/scoring.service");
const { rewriteBulletPoint } = require("../services/llm.service");
const { generatePdfReport } = require("../services/report.service");

// @desc    Run ATS analysis for a resume and job description
// @route   POST /api/analysis
// @access  Private
const createAnalysis = async (req, res, next) => {
  try {
    const { resumeId, jobDescription, jobTitle, companyName } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Please select a resume to analyze.",
      });
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Job description is too short. Please paste at least 50 characters of job requirements.",
      });
    }

    // Verify resume exists and belongs to this user
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or access denied.",
      });
    }

    // Run hybrid scoring calculation
    const analysisResult = await calculateATSScore(
      resume.extractedText,
      jobDescription,
      resume.parsedSections
    );

    // Save to database
    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      jobTitle: jobTitle || "Target Role",
      companyName: companyName || "",
      jobDescription,
      scores: analysisResult.scores,
      keywords: analysisResult.keywords,
      sectionFeedback: analysisResult.sectionFeedback,
      suggestions: analysisResult.suggestions,
      rewrittenBullets: analysisResult.rewrittenBullets,
    });

    res.status(201).json({
      success: true,
      message: "Analysis completed successfully",
      analysis,
      formatChecks: analysisResult.formatChecks,
      strengths: analysisResult.strengths,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's analysis history
// @route   GET /api/analysis
// @access  Private
const getAnalysisHistory = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .populate("resumeId", "fileName fileType createdAt")
      .select("-jobDescription") // exclude long JD text in history table
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single analysis by ID
// @route   GET /api/analysis/:id
// @access  Private
const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("resumeId", "fileName fileType extractedText parsedSections");

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis record not found.",
      });
    }

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an analysis
// @route   DELETE /api/analysis/:id
// @access  Private
const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis record not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Analysis deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rewrite a specific bullet point
// @route   POST /api/analysis/:id/rewrite
// @access  Private
const rewriteBullet = async (req, res, next) => {
  try {
    const { bulletText, targetRole } = req.body;

    if (!bulletText || bulletText.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid bullet point to rewrite.",
      });
    }

    const rewritten = await rewriteBulletPoint(bulletText, targetRole);

    res.status(200).json({
      success: true,
      result: rewritten,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download PDF report of analysis
// @route   GET /api/analysis/:id/report
// @access  Private
const downloadReport = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("resumeId", "fileName");

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis record not found.",
      });
    }

    const doc = generatePdfReport(analysis, analysis.resumeId);

    const filename = `ATS-Report-${analysis.jobTitle ? analysis.jobTitle.replace(/\s+/g, "_") : "Resume"}-${new Date().toISOString().slice(0, 10)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  rewriteBullet,
  downloadReport,
};
