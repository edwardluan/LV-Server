const dotenv = require("dotenv");
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 8000,
  },

  db: {
    uri: process.env.MONGODB_URI,
  },
};

module.exports = config;
