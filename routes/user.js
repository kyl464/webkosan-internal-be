const express = require("express");
const router = express.Router();

// Route dummy untuk testing
router.get("/", (req, res) => {
  res.send("List user akan muncul di sini");
});

module.exports = router;
