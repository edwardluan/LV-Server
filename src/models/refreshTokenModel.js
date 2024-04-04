const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    token: String,
    userId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("RefeshToken", refreshTokenSchema);
