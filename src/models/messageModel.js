const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    media: Array
}, { timestamps: true })

module.exports = mongoose.model("message", messageSchema)
