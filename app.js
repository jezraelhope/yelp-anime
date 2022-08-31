//=======================
// IMPORTS
//=======================

//NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const morgan = require('morgan')

//Config Imports
const config = require("./config");

//Model Imports
const Anime = require('./models/anime');
const Comment = require('./models/comment')

//Route Imports
const animeRoutes = require('./routes/animes')
const commentRoutes = require('./routes/comments')
const mainRoutes = require('./routes/main')

//========================
// DEVELOPMENT
//========================
//Morgan
app.use(morgan('tiny'))

//Seed the DB
const seed = require('./utils/seed');
seed();

//========================
// CONFIG
//========================

//Connect to DB
const mongoose = require('mongoose');
mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true});

// Express Config
app.set("view engine", "ejs");
app.use(express.static('public'));

//Body Parser Config
app.use(bodyParser.urlencoded({extended: true}));

//Method Override Config
app.use(methodOverride('_method'));

//Route Config
app.use(mainRoutes)
app.use("/anime", animeRoutes)
app.use("/anime/:id/comments", commentRoutes)

//========================
// LISTEN
//========================


app.listen(3000, () => {
    console.log("YAYYYY!!!")
});