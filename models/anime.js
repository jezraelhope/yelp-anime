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
    image: String,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    upVotes: [String],
    downVotes: [String]
})

animeSchema.index({
    '$**': 'text'
});

module.exports = mongoose.model("anime", animeSchema);