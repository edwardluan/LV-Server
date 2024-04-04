const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

const jwtMiddleware = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.token;
      const accessToken = token.split(" ")[1];

      if (!accessToken) return res.status(400).json({ msg: "Invalid Authentication." })
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY)
      if (!decoded) return res.status(400).json({ msg: "Invalid Authentication." })

      const user = await User.findOne({ _id: decoded.id })

      req.user = user
      next();
    }
    catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  //   verifyTokenAndAdmin: (req, res, next) => {
  //     jwtMiddleware.verifyToken(req, res, () => {
  //       if (req.user.id == req.params.id || req.user.admin) {
  //         next();
  //       } else {
  //         return res.status(403).json("Your are not authenticated or admin !");
  //       }
  //     });
  //   },
};

module.exports = jwtMiddleware;
