const Diary = require("../models/diaryModel");
const User = require("../models/userModel")

const diaryController = {
  createDiary: async (req, res) => {
    try {
      const { recipients, text, media } = req.body;
      if (!recipients || (!text.trim() && media.length === 0)) return;

      const newDiary = new Diary({ recipients, text, media, user: req.user._id });
      await newDiary.save();

      return res.status(200).json({
        newDiary: {
          ...newDiary._doc,
          user: req.user
        },
        msg: "Tạo nhật ký mới thành công !",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDiary: async (req, res) => {
    try {
      const diary = await Diary.find({ user: req.params.id })
        .populate("recipients user")
        .sort("-createdAt");
      return res.status(200).json({ diary });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDiaryById: async (req, res) => {
    try {
      const diary = await Diary.findById(req.params.id).populate("recipients user");
      return res.status(200).json({ diary });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getDiaries: async (req, res) => {
    try {
      const diaries = await Diary.find({
        user: [...req.user.subscribes, req.user._id],
      }).populate("recipients user").sort("-createdAt");
      return res.status(200).json({
        msg: "Lấy nhật ký thành công !",
        result: diaries.length,
        diaries,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateDiary: async (req, res) => {
    try {
      const { text, media, recipients } = req.body;
      const diary = await Diary.findOneAndUpdate(
        { _id: req.params.id },
        {
          text,
          media,
          recipients,
        }
      ).populate("recipients user")
      return res.status(200).json({
        msg: "Cập nhật nhật ký thành công !",
        newDiary: {
          ...diary._doc,
          text, media, recipients
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteDiary: async (req, res) => {
    try {
      await Diary.findOneAndDelete({ _id: req.params.id })
      return res.status(200).json({ msg: "Xóa nhật ký thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });

    }
  },
  saveDiary: async (req, res) => {
    try {
      const user = await User.find({ _id: req.user._id, savedDiary: req.params.id });
      if (user.length > 0)
        return res.status(400).json({ msg: "Bạn đã lưu nhật ký này rồi !." });

      const save = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { savedDiary: req.params.id },
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
  unSaveDiary: async (req, res) => {
    try {
      const save = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { savedDiary: req.params.id },
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
  getSaveDiaries: async (req, res) => {
    try {
      const savedDiaries = await Diary.find({
        _id: { $in: req.user.savedDiary }
      })
      return res.status(200).json({
        savedDiaries,
        result: savedDiaries.length
      })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
};

module.exports = diaryController;
