const express = require('express');
const Anime = require('../models/anime');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedIn');

router.get("/", async (req, res) => {
    const anime = await Anime.find().exec()
    console.log(anime)
    res.render("landing", {anime});
})

router.get('/account', isLoggedIn, (req, res) => {
    res.render("account")
});

module.exports = router