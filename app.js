//=======================
// IMPORTS
//=======================

//NPM Imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const morgan = require('morgan')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const expressSession = require('express-session')
const flash = require('connect-flash')


//Config Imports
try{
    var config = require("./config");
} catch (err) {
    console.log("Could not import config. Not working locally");
    console.log(err)
}

//Model Imports
const Anime = require('./models/anime');
const Comment = require('./models/comment');
const User = require('./models/user')

//Route Imports
const animeRoutes = require('./routes/animes')
const commentRoutes = require('./routes/comments')
const mainRoutes = require('./routes/main')
const authRoutes = require('./routes/auth')

//========================
// DEVELOPMENT
//========================
//Morgan
app.use(morgan('tiny'))

// //Seed the DB
// const seed = require('./utils/seed');
// seed();

//========================
// CONFIG
//========================

//Connect to DB
try {
    mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true});
} catch (err) {
    console.log("Could not connect. Not Working Locally")
    mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
}

// Express Config
app.set("view engine", "ejs");
app.use(express.static('public'));

//Express Session Config

app.use(expressSession({
    secret: process.env.ES_SECRET || config.expressSession.secret,
    resave: false,
    saveUninitialized: false
}));

//Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

//Method Override Config
app.use(methodOverride('_method'));

//Connect Flash
app.use(flash());

//Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// State Config
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
})

//Route Config
app.use("/", authRoutes)
app.use("/", mainRoutes);
app.use("/anime", animeRoutes);
app.use("/anime/:id/comments", commentRoutes);

//========================
// LISTEN
//========================


app.listen(process.env.PORT || 3000, () => {
    console.log("YAYYYY!!!")
});