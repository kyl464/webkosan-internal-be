const express = require("express");
const router = express.Router();
const {
  addToFavorit,
  getFavorit,
  removeFromFavorit,
} = require("../controllers/favoritController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, addToFavorit);
router.get("/", authenticate, getFavorit);
router.delete("/:id", authenticate, removeFromFavorit);

module.exports = router;
