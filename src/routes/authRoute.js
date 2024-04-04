const authController = require("../controllers/authController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

const router = require("express").Router();

//resgister user
router.post("/register", authController.registerUser);

//login user
router.post("/login", authController.loginUser);

//logout user
router.post("/logout", authController.logoutUser);

//refresh token
router.post("/refresh", authController.requestRefreshtoken);

module.exports = router;
