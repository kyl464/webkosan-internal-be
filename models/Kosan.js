const mongoose = require("mongoose");

const KosanSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    alamat: { type: String, required: true },

    // ===========================================
    kota: { type: String, required: true }, // <-- TAMBAHKAN BARIS INI
    // ===========================================

    lokasi: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    harga: { type: Number, required: true },
    jenis: { type: String, enum: ["Putra", "Putri", "Campur"], required: true },
    fasilitas: [String],
    foto: [String],
    deskripsi: String,
    pemilik: {
      nama: String,
      kontak: String,
    },
    tersedia: { type: Boolean, default: true },
  },
  { timestamps: true }
);

KosanSchema.index({ lokasi: "2dsphere" });

module.exports = mongoose.model("Kosan", KosanSchema);
