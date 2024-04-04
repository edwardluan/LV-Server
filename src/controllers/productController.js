const Product = require("../models/productModel");

const productController = {
  createProduct: async (req, res) => {
    try {
      const newProduct = new Product({ ...req.body, user: req.user });
      newProduct.save();
      return res.status(200).json({
        newProduct: {
          ...newProduct._doc,
          user: req.user,
        },
        msg: "Tạo sản phẩm mới thành công!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProducts: async (req, res) => {
    try {
      const products = await Product.find().sort("-createdAt").populate("user");
      return res.status(200).json({
        products,
        result: products.length,
        msg: "Lấy sản phẩm thành công!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate("user");
      return res.status(200).json({
        product,
        msg: "Lấy sản phẩm thành công!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserProducts: async (req, res) => {
    try {
      const userProduct = await Product.find({ user: req.params.id })
        .sort("-createdAt")
        .populate("user");
      return res.status(200).json({
        userProduct,
        result: userProduct.length,
        msg: "Lấy sản phẩm người dùng thành công!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { productName, desc, price, typeProduct, address, hashtag, img } =
        req.body;
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          productName,
          desc,
          price,
          typeProduct,
          address,
          hashtag,
          img,
        }
      ).populate("user");
      return res.status(200).json({
        newProduct: {
          ...product._doc,
          productName,
          desc,
          price,
          typeProduct,
          address,
          hashtag,
          img,
        },
        msg: "Cập nhật sản phẩm thành công!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      return res.status(200).json({
        msg: "Xóa sản phẩm thành công!",
        newProduct: {
          ...product,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  categoriesSelect: async (req, res) => {
    try {
      const category = req.query.category;

      const regex = new RegExp(category, 'i');

      const products = await Product.find({
        typeProduct: {$regex: regex} ,
      }).populate("user");
      return res.status(200).json({
        products,
        result: products.length,
        msg: "Lấy danh mục thành công!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchProduct: async (req, res) => {
    try {
      const search = req.query.search;

      const regex = new RegExp(search, 'i');

      const products = await Product.find({
        productName: {$regex: regex} ,
      }).populate("user");
      return res.status(200).json({
        products,
        result: products.length,
        msg: "Lấy danh mục thành công!",
      });
    }catch (err) {
      return res.status(500).json({ msg: err.message });
    }
   }
};
module.exports = productController;
