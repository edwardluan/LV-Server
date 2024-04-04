const User = require("../models/userModel");
const Post = require("../models/postModel");
const Product = require ("../models/productModel")

const searchController = {
    search: async (req, res) => {
        try {
          const searchQuery = req.query.search;
    
          const regex = new RegExp(searchQuery, 'i');
    
          const users = await User.find({
            username: { $regex: regex },
          })
            .limit(5)
            .select("username profilePicture roles");
          const posts = await Post.find({
            desc: { $regex: regex }
          })
          .limit(5)
          const product= await Product.find({
            address: { $regex: regex},
          })
          return res.json({ users, posts, product });
        } catch (err) {
          return res.status(500).json(err);
        }
      },
}

module.exports = searchController;