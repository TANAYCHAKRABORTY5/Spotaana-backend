const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song = require("../models/Song.model");

router.post("/create", passport.authenticate("user"), async (req, res) => {
  const { name, thumbnail, track } = req.body;
  if (!name || !thumbnail || !track)
    return res.status(300).json({ err: "fields are empty" });

  const artist = req.user._id;
  const songDetails = { name, thumbnail, track, artist };
  const createdSong = await Song.create(songDetails);

  return res.status(200).json(createdSong);
});

module.exports = router;
