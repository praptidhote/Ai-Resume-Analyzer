const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");
const {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} = require("../controllers/resume.controller");

// All resume endpoints are protected
router.use(authenticate);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", getResumes);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);

module.exports = router;
