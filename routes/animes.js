const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');
const Comment = require('../models/comment');

//Index
router.get("/", (req, res) => {
    Anime.find()
    .exec()
    .then((foundAnime) => {
        res.render("anime", {animes: foundAnime})
    })
    .catch((err) => {
        console.log(err)
        res.send(err)
    })
})


//Create
router.post("/", (req, res) => {
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
        image: req.body.image
    }
    Anime.create(newAnime)
    .then((anime) => {
        res.redirect(`/anime/${anime._id}`)
    })
    .catch((err) => {
        console.log(err)
        res.redirect('/anime')
    })
})


//New
router.get("/new", (req, res) => {
    res.render("anime_new");
})

//Show
router.get('/:id', (req, res) => {
    Anime.findById(req.params.id)
    .exec()
    .then((anime) => {
        Comment.find({comicId: req.params.id}, (err, comments) => {
            if(err) {
                res.send(err)
            } else {
                res.render('anime_show', {anime, comments})
            }
        })

    })
    .catch((err) => {
        res.send(err)
    })
})

//Edit
router.get("/:id/edit", (req, res) => {
    Anime.findById(req.params.id)
    .exec()
    .then(anime => {
        res.render("anime_edit", {anime})
    })
})

//Update
router.put("/:id", (req, res) => {
    const genre = req.body.genre.toLowerCase();
    const anime = {
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

    Anime.findByIdAndUpdate(req.params.id, anime, {new:true})
    .exec()
    .then(updatedAnime => {
        console.log(updatedAnime)
        res.redirect(`/anime/${req.params.id}`)
    })
    .catch(err => {
        res.send("Error!!", err)
    })
})

//Delete

router.delete("/:id", (req, res) => {
    Anime.findByIdAndDelete(req.params.id)
    .exec()
    .then(deletedAnime => {
        console.log("Deleted:", deletedAnime)
        res.redirect("/anime")
    })
    .catch(err => {
        res.send("Error Deletinng:", err)
    })
})

module.exports = router