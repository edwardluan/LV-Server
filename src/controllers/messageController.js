const Conversations = require("../models/conversationModel")
const Messages = require("../models/messageModel")

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}


const messageController = {
    createMessage: async (req, res) => {
        try {
            const { sender, recipient, text, media } = req.body
            if (!recipient || (!text.trim() && media.length === 0)) return;

            const newConversation = await Conversations.findOneAndUpdate({
                $or: [
                    { recipients: [sender, recipient] },
                    { recipients: [recipient, sender] }
                ]
            }, {
                recipients: [sender, recipient],
                text, media
            }, { new: true, upsert: true })

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender: req.user._id,
                recipient,
                text,
                media
            })

            await newMessage.save()

            return res.status(200).json({ msg: 'Gửi tin nhắn !' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getConversation: async (req, res) => {
        try {
            const features = new APIfeatures(Conversations.find({
                recipients: req.user._id
            }), req.query).paginating()
            const conversations = await features.query.sort("updatedAt")
                .populate("recipients", "username profilePicture roles")

            return res.status(200).json({
                conversations,
                result: conversations.length
            })

        } catch (err) {
            return res.status(500).json({ err: err.message })
        }
    },
    getMessage: async (req, res) => {
        try {
            const features = new APIfeatures(Messages.find({
                $or: [
                    { sender: req.user._id, recipient: req.params.id },
                    { sender: req.params.id, recipient: req.user._id }
                ]
            }), req.query).paginating()

            const messages = await features.query.sort("-createdAt")

            return res.status(200).json({
                messages,
                result: messages.length
            })
        } catch (err) {
            return res.status(500).json({ err: err.message })
        }
    },
    deleteMessages: async (req, res) => {
        try {
            await Messages.findOneAndDelete({ _id: req.params.id, sender: req.user._id })
            return res.status(200).json({ msg: 'Xóa tin nhắn !' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const newConver = await Conversations.findOneAndDelete({
                $or: [
                    { recipients: [req.user._id, req.params.id] },
                    { recipients: [req.params.id, req.user._id] }
                ]
            })
            await Messages.deleteMany({ conversation: newConver._id })

            res.status(200).json({ msg: 'Xóa đoạn hội thoại!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}
module.exports = messageController;