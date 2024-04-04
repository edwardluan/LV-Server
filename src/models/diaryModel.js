const mongoose = require("mongoose")

const diarySchema = new mongoose.Schema({
    user:  {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    recipients: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    text: String,
    media: Array
},{timestamps: true})

module.exports = mongoose.model("diary", diarySchema)
