const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors());
const corsOptions = {
  // Untuk production, ganti '*' dengan URL Vercel frontend Anda, contoh: 'https://webkosan-internal-fe.vercel.app'
  origin: "https://webkosan-internal-fe.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Secara eksplisit izinkan metode-metode ini
  allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
};
app.use(cors(corsOptions));
// ===============================================================

app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
