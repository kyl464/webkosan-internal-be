const Favorit = require("../models/Favorit");
const Kosan = require("../models/Kosan");
const mongoose = require("mongoose");

exports.addToFavorit = async (req, res) => {
  const { kosan_id } = req.body;
  const user_id = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(kosan_id)) {
    return res.status(400).json({ error: "ID Kosan tidak valid" });
  }

  try {
    const existing = await Favorit.findOne({ user_id, kosan_id });
    if (existing)
      return res.status(400).json({ error: "Sudah ada di favorit" });

    const favorit = new Favorit({ user_id, kosan_id });
    await favorit.save();
    res.status(201).json(favorit);
  } catch (err) {
    res.status(500).json({ error: "Gagal menambah ke favorit" });
  }
};

exports.getFavorit = async (req, res) => {
  const user_id = req.user.id;

  try {
    const favoritList = await Favorit.find({ user_id }).populate("kosan_id");
    res.json(favoritList);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data favorit" });
  }
};

exports.removeFromFavorit = async (req, res) => {
  const { id } = req.params; // id favorit document

  try {
    await Favorit.findByIdAndDelete(id);
    res.json({ message: "Dihapus dari favorit" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus" });
  }
};
