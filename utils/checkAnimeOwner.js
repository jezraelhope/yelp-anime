const Anime = require('../models/anime');


const checkAnimeOwner = async (req, res, next) => {
    if(req.isAuthenticated()) {
        const anime = await Anime.findById(req.params.id).exec();
        if(anime.owner.id.equals(req.user._id)) {
            next();
        } else {
            res.redirect("back")
        }
    } else {
        res.redirect('/login')
    }
}

module.exports = checkAnimeOwner;