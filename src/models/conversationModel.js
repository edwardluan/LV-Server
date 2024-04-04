const mongoose = require("mongoose")

const conversationSchema = new mongoose.Schema({
    recipients: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    text: String, 
    media: Array
},{timestamps: true})

module.exports = mongoose.model("conversation", conversationSchema)
