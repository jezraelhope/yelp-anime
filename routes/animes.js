const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkAnimeOwner = require('../utils/checkAnimeOwner')

//Index
router.get("/", async (req, res) => {
    try {
        const animes = await Anime.find().exec();
        res.render("anime", {animes})

    } catch (err){
        console.log(err)
        res.send("you broke it.. /index")
    }
});


//Create
router.post("/", isLoggedIn, async (req, res) => {
    const genre = req.body.genre.toLowerCase();
    const newAnime = {
        title: req.body.title,
        description: req.body.description,
        writer: req.body.writer,
        seasons: req.body.seasons,
        studio: req.body.studio,
        genre,
        storyCompleted: !!req.body.storyCompleted,
        releaseDate: req.body.releaseDate,
        image: req.body.image,
        owner: {
            id: req.user._id,
            username: req.user.username
        }
    }
    try {
        const anime = await Anime.create(newAnime)
        console.log(anime)
        res.redirect(`/anime/${anime._id}`)

    } catch (err) {
        console.log(err)
        res.send("This is broken... /POST")
    }
})


//New
router.get("/new", isLoggedIn, (req, res) => {
    res.render("anime_new");
})

//Search
router.get("/search", async (req, res) => {
    try{
        const anime = await Anime.find({
            $text: {
                $search: req.query.term
            }
        });
        console.log(req.query.term)
        res.render("anime", {anime})
    } catch(err) {
        console.log(err)
        res.send("broken search")
    }
})

//Show
router.get('/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id).exec()
        const comments = await Comment.find({animeId: req.params.id});
        res.render("anime_show", {anime, comments})
        
    } catch(err) {
        console.log(err)
        res.send("IZZ broken... /anime/:id")
    }
})

//Edit
router.get("/:id/edit", checkAnimeOwner, async (req, res) => {
    const anime = await Anime.findById(req.params.id).exec();
    res.render("anime_edit", {anime});
})

//Update
router.put("/:id", checkAnimeOwner, async (req, res) => {
    const genre = req.body.genre.toLowerCase();
    const animeBody = {
        title: req.body.title,
        description: req.body.description,
        writer: req.body.writer,
        seasons: req.body.seasons,
        studio: req.body.studio,
        genre,
        storyCompleted: !!req.body.storyCompleted,
        releaseDate: req.body.releaseDate,
        image: req.body.image
    }

    try {
        const anime = await Anime.findByIdAndUpdate(req.params.id, animeBody, {new:true}).exec()
        res.redirect(`/anime/${req.params.id}`)
    } catch (err) {
        console.log(err)
        res.send("Error!!")
    }
})

//Delete

router.delete("/:id", checkAnimeOwner, async (req, res) => {
    try {
        const deletedAnime = await Anime.findByIdAndDelete(req.params.id).exec()
        console.log("Deleted:", deletedAnime)
        res.redirect("/anime")
    } catch (err) {
        res.send("ERROR!!! /DELETE")
    }
})

module.exports = router