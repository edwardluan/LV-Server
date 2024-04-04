const router = require("express").Router();
const userController = require("../controllers/userController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

//get user
router.get("/:id", jwtMiddleware.verifyToken, userController.getUser);

//get all user
router.get("/", jwtMiddleware.verifyToken, userController.getAllUsers);

//delete user
router.delete("/:id", userController.deleteUser);

//update user
router.put("/:id", jwtMiddleware.verifyToken, userController.updateUserById);

//follow user
router.put("/:id/follow", jwtMiddleware.verifyToken, userController.followUser);

//unfollow user
router.put("/:id/unfollow", jwtMiddleware.verifyToken, userController.unfollowUser);

//search user
router.get("/search/result", jwtMiddleware.verifyToken, userController.searchUser);

//suggestion user
router.get("/suggestionUser/result", jwtMiddleware.verifyToken, userController.suggestionsUser);

module.exports = router;
