const express = require("express");
const Anime = require("../models/anime");
const router = express.Router();
const isLoggedIn = require("../utils/isLoggedIn");

router.get("/", async (req, res) => {
  const anime = await Anime.find().exec();
  res.render("landing", { anime });
});

let url = "https://api.myanimelist.net/v2/anime?q=one&limit=4";

router.get("/account", isLoggedIn, (req, res) => {
  res.render("account");
});

module.exports = router;
