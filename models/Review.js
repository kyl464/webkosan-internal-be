const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    kosan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kosan",
      required: true,
    },
    user_id: { type: String, required: true }, // UUID dari Supabase
    rating: { type: Number, min: 1, max: 5, required: true },
    komentar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
