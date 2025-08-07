const mongoose = require("mongoose");

const FavoritSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true }, // UUID Supabase
    kosan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kosan", // ✅ penting untuk populate!
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favorit", FavoritSchema);
