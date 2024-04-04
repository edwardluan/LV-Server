const mongoose = require('mongoose')

const notifySchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipients: [mongoose.Schema.Types.ObjectId],
    url: String,
    text: String,
    content: String,
    image: String,
    isRead: { type: Boolean, default: false }
}, {
    timestamps: true
})

module.exports = mongoose.model('notify', notifySchema)