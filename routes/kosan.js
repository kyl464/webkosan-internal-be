const express = require("express");
const router = express.Router();
const {
  getAllKosan,
  getKosanById,
  createKosan,
} = require("../controllers/kosanController"); // ⬅️ PASTIKAN PATH dan NAMA FUNGSI benar!

router.get("/", getAllKosan); // ✅ ini di sini tempatnya!
router.get("/:id", getKosanById);
router.post("/", createKosan);

module.exports = router;
