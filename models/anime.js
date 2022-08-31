const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
    title: String,
    description: String,
    writer: String,
    seasons: Number,
    studio: String,
    genre: String,
    storyCompleted: Boolean,
    releaseDate: Date,
    image: String
})

module.exports = mongoose.model("anime", animeSchema);