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
        },
        upVotes: [req.user.username],
        downVotes: []
    }
    try {
        const anime = await Anime.create(newAnime)
        req.flash("success", "Anime created!")
        res.redirect(`/anime/${anime._id}`)

    } catch (err) {
        req.flash("error", "Error creating comic")
        res.redirect("/anime");
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

//Genre
router.get("/genre/:genre", async (req, res) => {
    const validGenres = ["romance", "comedy", "seinen", "isekai", "mecha", "sports", "psychological", "horror", "adventure", "scifi", "slice-of-life", "shoujo", "shonen"];
    if(validGenres.includes(req.params.genre.toLowerCase())){
        const animes = await Anime.find({genre: req.params.genre}).exec();
        res.render("anime", {animes})
    } else {
        res.send("Please enter a valid genre")
    }
})

let response = {}

//Vote

router.post("/vote", isLoggedIn, async (req, res) => {
    console.log("Request body:", req.body);
    const anime = await Anime.findById(req.body.animeId);
    const alreadyUpvoted = anime.upVotes.indexOf(req.user.username)
    const alreadyDownvoted = anime.downVotes.indexOf(req.user.username)

    if (alreadyUpvoted === -1 && alreadyDownvoted === -1) {
        if(req.body.voteType === "up") {
            anime.upVotes.push(req.user.username)
            anime.save()
            response.message = "Upvote Tallied!"
        } else if(req.body.voteType === "down") {
            anime.downVotes.push(req.user.username)
            anime.save()
            response.message = "Downvote Tallied!"
        } else {
            response.message = "Error 1"
        }
    } else if(alreadyUpvoted >= 0) { //Already Upvoted
        if(req.body.voteType === "up") {
            anime.upVotes.splice(alreadyUpvoted, 1);
            anime.save()
            response.message = "Upvote Removed"
        } else if(req.body.voteType === "down") {
            anime.upVotes.splice(alreadyUpvoted, 1);
            anime.downVotes.push(req.user.username);
            anime.save()
            response.message = "Changed to downvoted"
        } else {
            response.message = "Error 2"
        }
    } else if(alreadyDownvoted >= 0) { //Already Downvoted
        if(req.body.voteType === "up") {
            anime.downVotes.splice(alreadyDownvoted, 1);
            anime.upVotes.push(req.user.username);
            anime.save();
            response.message = "Changed to Upvote"
        } else if(req.body.voteType === "down") {
            anime.downVotes.splice(alreadyDownvoted, 1);
            anime.save();
            response.message = "Removed Downvote"

        } else {
            response.message = "Error 3"
        }

    } else {
        response.message = "Error 4"
    }

    res.json(response);
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
        req.flash("success", "Anime updated!")
        res.redirect(`/anime/${req.params.id}`)
    } catch (err) {
        console.log(err)
        req.flash("error", "Error Updating Comic!")
        res.redirect('/anime');
    }
})

//Delete

router.delete("/:id", checkAnimeOwner, async (req, res) => {
    try {
        const deletedAnime = await Anime.findByIdAndDelete(req.params.id).exec()
        req.flash("success", "Anime deleted!")
        res.redirect("/anime")
    } catch (err) {
        req.flash("error", "Error deletign anime")
        res.redirect("back")
    }
})

module.exports = router