const router = require("express").Router();
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const commentController = require("../controllers/commentController")

//create comment
router.post("/", jwtMiddleware.verifyToken, commentController.createComment);

//update comment
router.put("/:id", jwtMiddleware.verifyToken, commentController.updateComment);

//like comment
router.put("/:id/like", jwtMiddleware.verifyToken, commentController.likeComment);

//unlike comment
router.put("/:id/unlike", jwtMiddleware.verifyToken, commentController.unlikeComment);

//delete comment
router.delete("/:id", jwtMiddleware.verifyToken, commentController.deleteComment);

module.exports = router;
