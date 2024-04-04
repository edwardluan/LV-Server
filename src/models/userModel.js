const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      maxlength: 20,
    },
    phoneNumber: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default:
        "./image/hinhnen.png",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subscribes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedDiary: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    desc: {
      type: String,
      maxlength: 50,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: String,
      default: "user"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
