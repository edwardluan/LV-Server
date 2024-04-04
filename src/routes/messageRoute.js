const jwtMiddleware = require("../middlewares/jwtMiddleware");
const router = require("express").Router();
const messageController = require("../controllers/messageController");

router.post("/", jwtMiddleware.verifyToken, messageController.createMessage);

router.get("/conversations", jwtMiddleware.verifyToken, messageController.getConversation);

router.get("/:id", jwtMiddleware.verifyToken, messageController.getMessage);

router.delete("/:id", jwtMiddleware.verifyToken, messageController.deleteMessages);

router.delete("/conversations/:id", jwtMiddleware.verifyToken, messageController.deleteConversation);

module.exports = router;
