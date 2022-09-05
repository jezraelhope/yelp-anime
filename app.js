//=======================
// IMPORTS
//=======================

//NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const morgan = require('morgan')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const expressSession = require('express-session')



//Config Imports
const config = require("./config");

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
const mongoose = require('mongoose');
mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true});

// Express Config
app.set("view engine", "ejs");
app.use(express.static('public'));

//Express Session Config

app.use(expressSession({
    secret: "asjfajbdf jkidhfjsdbsdjbfgdjf",
    resave: false,
    saveUninitialized: false
}));

//Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

//Method Override Config
app.use(methodOverride('_method'));

//Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// Current User Middleware Config
app.use((req, res, next) => {
    res.locals.user = req.user;
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


app.listen(3000, () => {
    console.log("YAYYYY!!!")
});