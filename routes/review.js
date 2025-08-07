const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsByKosan,
  getRatingSummaryByKosan,
} = require("../controllers/reviewController");
const authenticate = require("../middleware/authMiddleware");

router.get("/rating/:id", getRatingSummaryByKosan); // <-- new route
router.post("/", authenticate, createReview);
router.get("/:id", getReviewsByKosan); // berdasarkan kosan_id

module.exports = router;
