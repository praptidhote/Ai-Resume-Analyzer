const Resume = require("../models/Resume");
const { parseResumeFile } = require("../services/parser.service");

// @desc    Upload and parse resume file (PDF/DOCX)
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file was uploaded. Please attach a PDF or DOCX file.",
      });
    }

    const { extractedText, parsedSections } = await parseResumeFile(req.file);

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype || "application/pdf",
      storagePath: "",
      extractedText,
      parsedSections,
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        fileType: resume.fileType,
        extractedText: resume.extractedText,
        parsedSections: resume.parsedSections,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes of the authenticated user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select("-extractedText") // omit long text for list view
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume with full text and parsed sections
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
};
