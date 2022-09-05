const express = require('express');
const { update } = require('../models/anime');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment')
const Anime = require('../models/anime');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner')

//New Comment - Show Form

router.get("/new", isLoggedIn, (req, res) => {
    res.render("comments_new", {animeId: req.params.id})
})

//Create Comment - Actually Update DB
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const comment = await Comment.create({
            user: {
                id: req.user._id,
                username: req.user.username
            },
            text: req.body.text,
            animeId: req.body.animeId
        });
        console.log(comment);
        res.redirect(`/anime/${req.body.animeId}`);
    } catch (err) {
        console.log(err)
        res.send("BROKENNN!! POST /comments")
    }
})

//Edit

router.get('/:commentId/edit', checkCommentOwner, async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id).exec();
        const comment = await Comment.findById(req.params.commentId).exec();
        res.render("comments_edit", {anime, comment})
    } catch (err) {
        console.log(err)
        res.send("Broken comment edit /Edit")
    }
})

//Update

router.put('/:commentId', checkCommentOwner, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new:true}).exec()
        console.log(comment)
        res.redirect(`/anime/${req.params.id}`)

    } catch (err) {
        console.log(err);
        res.send("Brooooke Comment /PUT")
    }
})

//Delete

router.delete('/:commentId', checkCommentOwner, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        console.log(comment);
        res.redirect(`/anime/${req.params.id}`)
    } catch (err){
        console.log(err)
        res.send("Error Deleting??! /DELETE")
    }
});

module.exports = router