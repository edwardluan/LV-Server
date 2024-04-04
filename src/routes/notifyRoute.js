const jwtMiddleware = require("../middlewares/jwtMiddleware");
const router = require("express").Router();
const notifyController = require("../controllers/notifyController");

router.post("/", jwtMiddleware.verifyToken, notifyController.createNotify);

router.delete("/:id", jwtMiddleware.verifyToken, notifyController.removeNotify);

router.get("/", jwtMiddleware.verifyToken, notifyController.getNotifies);

router.put("/isReadNotify/:id", jwtMiddleware.verifyToken, notifyController.isReadNotify);

router.delete("/", jwtMiddleware.verifyToken, notifyController.deleteAllNotifies);

module.exports = router;
