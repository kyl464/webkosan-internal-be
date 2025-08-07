const Review = require("../models/Review");
const mongoose = require("mongoose");
exports.createReview = async (req, res) => {
  const { kosan_id, rating, komentar } = req.body;
  const user_id = req.user.id; // dari middleware auth

  try {
    const review = new Review({ kosan_id, user_id, rating, komentar });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: "Gagal membuat review" });
  }
};

exports.getReviewsByKosan = async (req, res) => {
  const { id } = req.params; // kosan_id

  try {
    const reviews = await Review.find({ kosan_id: id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil review" });
  }
};

exports.getRatingSummaryByKosan = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Review.aggregate([
      { $match: { kosan_id: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: "$kosan_id",
          rating_avg: { $avg: "$rating" },
          jumlah_review: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ rating_avg: 0, jumlah_review: 0 });
    }

    const { rating_avg, jumlah_review } = result[0];
    res.json({ rating_avg, jumlah_review });
  } catch (err) {
    console.error("[ERROR] getRatingSummaryByKosan:", err); // ⬅️ Tambahkan ini
    res.status(500).json({ error: "Gagal mengambil data rating" });
  }
};
