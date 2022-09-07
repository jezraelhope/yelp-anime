const Anime = require('../models/anime');


const checkAnimeOwner = async (req, res, next) => {
    if(req.isAuthenticated()) {
        const anime = await Anime.findById(req.params.id).exec();
        if(anime.owner.id.equals(req.user._id)) {
            next();
        } else {
            req.flash("error", "You don't have permission to do that!")
            res.redirect("back")
        }
    } else {
        req.flash("error", "You must be logged in to do that!")
        res.redirect('/login')
    }
}

module.exports = checkAnimeOwner;