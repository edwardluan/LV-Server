const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");

const authController = {
  //generate access token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1h" }
    );
  },

  //generate refesh token
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30d" }
    );
  },

  //register
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);

      const phNum = await User.findOne({ phoneNumber: req.body.phoneNumber })
      if (phNum) return res.status(400).json({ msg: "Số điện thoại đã được đăng ký !" })

      const name = await User.findOne({ username: req.body.username })
      if (name) return res.status(400).json({ msg: "Tên đăng nhập đã được đăng ký !" })

      if (req.body.password.length < 6) return res.status(400).json({ msg: "Mật khẩu phải nhiều hơn 6 ký tự !" })

      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = await new User({
        username: req.body.username,
        phoneNumber: req.body.phoneNumber,
        password: hashed,
        roles: req.body.roles
      });
      await newUser.save();
      return res.status(200).json({ msg: "Đăng ký thành công !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ phoneNumber: req.body.phoneNumber }).populate("followers subscribes");
      if (!user) {
        return res.status(404).json({ msg: "Số điện thoại chưa đúng !" });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json({ msg: "Mật khẩu chưa đúng !" });
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);

        const refreshTk = await RefreshToken.findOne({ userId: user.id });
        if (!refreshTk) {
          const newRefreshToken = await new RefreshToken({
            token: refreshToken,
            userId: user.id,
          });
          await newRefreshToken.save();
        } else {
          await RefreshToken.findOneAndUpdate({ token: refreshToken });
        }
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        return res.status(200).json({ msg: "Đăng nhập thành công !", accessToken, ...others });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logoutUser: async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      return res.status(200).json({ msg: "Đăng xuất thành công !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  requestRefreshtoken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json("You are not authenticated !");
    }
    const isRefreshToken = await RefreshToken.findOne({ token: refreshToken });
    if (!isRefreshToken) {
      return res.status(403).json("RefreshToken is not valid");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
      if (err) {
        return res.status(401).json("Token is not verify !");
      }
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      await RefreshToken.findOneAndUpdate({ token: newRefreshToken });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false, //deploy update "true"
        path: "/",
        sameSite: "strict",
      });
      const newUser = await User.findById(user.id).select("-password").populate("followers subscribes")
      const { password, ...others } = newUser._doc;
      const userR = { ...others, accessToken: newAccessToken };
      return res.status(200).json(userR);
    });
  },
};

module.exports = authController;
