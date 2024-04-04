const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    user:  {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    related: mongoose.Schema.Types.ObjectId,
    text: String,
    type: String,
    act: String,
},{timestamps: true})

module.exports = mongoose.model("report", reportSchema)
