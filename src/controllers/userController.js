const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const userController = {
  // GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find()
        .populate("subscribes followers", "-password")
        .select("-password");
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // GET USER
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate("subscribes followers", "-password")
      // .select("-password");
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // DELETE USER
  deleteUser: async (req, res) => {
    try {
      //finbyidanddelete
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Delete user successfully !");
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // UPDATE USER BY ID
  updateUserById: async (req, res) => {
    try {
      let updateData = req.body;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        updateData = { ...updateData, password: hashed };
      }

      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateData }
      );

      if (!user) {
        return res.status(404).json("No user !");
      }

      return res.status(200).json({ msg: "Cập nhật thông tin thành công !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //follow user
  followUser: async (req, res) => {
    try {
      const user = await User.find({
        _id: req.params.id,
        followers: req.user.id,
      });

      if (user.length > 0)
        return res
          .status(500)
          .json({ msg: "Bạn đã theo dõi người dùng này !" });

      const newUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.user.id },
        },
        { new: true }
      ).populate("subscribes followers").select("-password");

      await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          $push: { subscribes: req.params.id },
        },
        { new: true }
      );

      return res.status(200).json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //unfollow user
  unfollowUser: async (req, res) => {
    try {
      const newUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user.id },
        },
        { new: true }
      ).populate("subscribes followers").select("-password");

      await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          $pull: { subscribes: req.params.id },
        },
        { new: true }
      );

      return res.status(200).json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //search user
  searchUser: async (req, res) => {
    try {
      const searchQuery = req.query.username;

      const regex = new RegExp(searchQuery, 'i');

      const users = await User.find({
        username: { $regex: regex },
      })
        .limit(5)
        .select("username profilePicture roles");
      return res.json({ users });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.subscribes, req.user._id]
      const num = req.query.num || 10
      const users = await User.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
        { $lookup: { from: 'users', localField: 'subscribes', foreignField: '_id', as: 'subscribes' } },
      ]).project("-password")
      return res.json({
        users,
        result: users.length
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
};

module.exports = userController;
