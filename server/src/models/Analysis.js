const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      default: "Target Role",
      trim: true,
    },
    companyName: {
      type: String,
      default: "",
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    scores: {
      overall: { type: Number, default: 0, min: 0, max: 100 },
      keywordMatch: { type: Number, default: 0, min: 0, max: 100 },
      relevance: { type: Number, default: 0, min: 0, max: 100 },
      formatting: { type: Number, default: 0, min: 0, max: 100 },
      impact: { type: Number, default: 0, min: 0, max: 100 },
    },
    keywords: {
      matched: [{ type: String }],
      missing: [{ type: String }],
    },
    sectionFeedback: {
      summary: { type: String, default: "" },
      skills: { type: String, default: "" },
      experience: { type: String, default: "" },
      education: { type: String, default: "" },
    },
    suggestions: [
      {
        issue: { type: String, required: true },
        fix: { type: String, required: true },
      },
    ],
    rewrittenBullets: [
      {
        original: { type: String, required: true },
        improved: { type: String, required: true },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user history retrieval ordered by date
analysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Analysis", analysisSchema);
