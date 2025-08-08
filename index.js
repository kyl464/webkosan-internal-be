const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Konfigurasi CORS yang benar
const corsOptions = {
  origin: "https://webkosan-internal-fe.vercel.app/", // Ganti dengan URL Vercel Anda untuk production
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// ======================= BAGIAN YANG HILANG DI GITHUB ANDA =======================
// Root Route untuk Health Check
app.get("/", (req, res) => {
  res.status(200).json({ status: "UP", message: "Welcome to Kosan API!" });
});
// =================================================================================

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes API Anda
const kosanRoutes = require("./routes/kosan");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const reviewRoutes = require("./routes/review");
const favoritRoutes = require("./routes/favorit");

app.use("/api/kosan", kosanRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/favorit", favoritRoutes);

// Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server backend berjalan di http://localhost:${PORT}`)
);
