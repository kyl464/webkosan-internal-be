const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

// ======================= PERBAIKAN DI SINI =======================
// 1. Konfigurasi CORS yang lebih spesifik dan aman
const corsOptions = {
  // 2. Hapus garis miring (/) di akhir URL origin
  origin: "https://webkosan-internal-fe.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Hapus `app.use(cors());` yang lama, cukup panggil satu kali dengan options
app.use(cors(corsOptions));

app.use(express.json());

// 3. Tambahkan Root Route untuk Health Check (SANGAT PENTING untuk Railway)
app.get("/", (req, res) => {
  res.status(200).json({ status: "UP", message: "Welcome to Kosan API!" });
});
// ===============================================================

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
app.set("supabase", supabase);

// Routes
const kosanRoutes = require("./routes/kosan");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/review");
const favoritRoutes = require("./routes/favorit");
app.use("/api/kosan", kosanRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/favorit", favoritRoutes);

// ======================= PERBAIKAN DI SINI =======================
// 4. Menggunakan fallback port yang berbeda dari Next.js (5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
// ===============================================================
