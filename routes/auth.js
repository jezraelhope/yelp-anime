const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

//Sign Up - New
router.get('/signup', (req, res) => {
    res.render('signup');
})


//Sign Up - Create
router.post('/signup', async (req, res) => {
    try{
        const newUser = await User.register(new User({
            email: req.body.email,
            username: req.body.username
        }), req.body.password);
        passport.authenticate('local')(req, res, () => {
            res.redirect('/anime')
        });
        req.flash("success", `Signed you up as ${newUser.username}`);
    } catch (err) {
        console.log(err);
        res.send(err)
    }
});

// Log In Show Form
router.get('/login', (req, res) => {
    res.render('login')
})

//Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/anime',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: "Logged in successfully!"
}));

// Lgout

router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if(err) {
            return next(err)
        }
        req.flash("success", "Logged you out!")
        res.redirect('/anime');
    });
});

module.exports = router;