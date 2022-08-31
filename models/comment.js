const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: String,
    text: String,
    animeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }
})

module.exports = mongoose.model("comment", commentSchema);