const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comments = require("../models/commentModel");

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

const postController = {
  createPost: async (req, res) => {
    try {
      const { desc, img, hashtag } = req.body;

      const newPost = new Post({ hashtag, desc, img, user: req.user._id });
      await newPost.save();
      return res.status(200).json({
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
        msg: "Tạo bài viết mới thành công !",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllPost: async (req, res) => {
    try {
      const post = await Post.find({
        user: [...req.user.subscribes, req.user._id],
      })
        .sort("-createdAt")
        .populate("user like", " -password")
        .populate({
          path: "comments",
          populate: { path: "user likes", select: "-password" },
        });
      return res.status(200).json({
        msg: "Lấy bài viết thành công !",
        result: post.length,
        post,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getNewsPost: async (req, res) => {
    try {
      const post = await Post.find()
        .sort("-createdAt")
        .populate("user like", " -password")
        .populate({
          path: "comments",
          populate: { path: "user likes", select: "-password" },
        });
      return res.status(200).json({
        msg: "Lấy bài viết thành công !",
        result: post.length,
        post,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUserPost: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.params.id }).sort("-createdAt");
      return res.status(200).json({ posts, result: posts.length });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("user like", " -password")
        .populate({
          path: "comments",
          populate: { path: "user likes", select: "-password" },
        });
      return res.status(200).json({ post });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { hashtag, desc, img } = req.body;
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          desc,
          img,
          hashtag
        }
      )
        .populate("user like", "profilePicture username followers")
        .populate({
          path: "comments",
          populate: { path: "user likes", select: "-password" },
        });
      return res.status(200).json({
        msg: "Cập nhật bài viết thành công !",
        newPost: {
          ...post._doc,
          desc,
          img,
          hashtag
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  likePost: async (req, res) => {
    try {
      const post = await Post.find({ _id: req.params.id, like: req.user._id });
      if (post.length > 0)
        return res.status(403).json({ msg: "Bạn đã thích bài viết nảy rồi !" });
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { like: req.user._id },
        },
        { new: true }
      );

      res.json({ msg: "Bạn vừa thích bài viết này !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unlikePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { like: req.user._id },
        },
        { new: true }
      );
      res.json({ msg: "Bạn đã bỏ thích bài viết này !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.json({
        msg: "Xóa bài viết thành công !",
        newPost: {
          ...post,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  savePost: async (req, res) => {
    try {
      const user = await User.find({ _id: req.user._id, saved: req.params.id });
      if (user.length > 0)
        return res.status(400).json({ msg: "Bạn đã lưu bài viết này rồi !." });

      const save = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        { new: true }
      );

      if (!save)
        return res.status(400).json({ msg: "Có lỗi xảy ra khi lưu !." });

      return res.json({ msg: "Lưu bài viết thành công !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unSavePost: async (req, res) => {
    try {
      const save = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { saved: req.params.id },
        },
        { new: true }
      );

      if (!save)
        return res.status(400).json({ msg: "Có lỗi xảy ra khi bỏ lưu !." });

      return res.json({ msg: "Đã bỏ lưu bài viết !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getSavePosts: async (req, res) => {
    try {
      const features = new APIfeatures(Post.find({
        _id: { $in: req.user.saved }
      }), req.query).paginating()

      const savePosts = await features.query.sort("-createdAt")

      return res.status(200).json({
        savePosts,
        result: savePosts.length
      })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
};

module.exports = postController;
