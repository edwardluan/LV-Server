const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    desc: String,
    hashtag: String,
    img: {
      type: Array,
      default: [],
    },
    like: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comments',
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
