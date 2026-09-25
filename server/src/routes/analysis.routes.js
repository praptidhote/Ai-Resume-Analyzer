const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { analysisLimiter } = require("../middleware/rateLimit");
const {
  createAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  rewriteBullet,
  downloadReport,
} = require("../controllers/analysis.controller");

// All analysis routes require authentication
router.use(authenticate);

router.post("/", analysisLimiter, createAnalysis);
router.get("/", getAnalysisHistory);
router.get("/:id", getAnalysisById);
router.delete("/:id", deleteAnalysis);
router.post("/:id/rewrite", rewriteBullet);
router.get("/:id/report", downloadReport);

module.exports = router;
