const express = require('express')
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment')

//New Comment - Show Form

router.get("/new", (req, res) => {
    res.render("comments_new", {animeId: req.params.id})
})

//Create Comment - Actually Update DB
router.post('/', (req, res) => {
    Comment.create({
        user: req.body.user,
        text: req.body.text,
        animeId: req.body.animeId
    })
    .then((newComment) => {
        console.log(newComment)
        res.redirect(`/anime/${req.body.animeId}`)
    })
    .catch(err => {
        console.log(err)
        res.redirect(`/anime/${req.body.animeId}`)
    })
})

module.exports = router