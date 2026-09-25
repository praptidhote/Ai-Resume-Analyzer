const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "pdf", "docx"],
    },
    storagePath: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    extractedText: {
      type: String,
      required: true,
    },
    parsedSections: {
      summary: { type: String, default: "" },
      skills: [{ type: String }],
      experience: [{ type: String }],
      education: [{ type: String }],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
