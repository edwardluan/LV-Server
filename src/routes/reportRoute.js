const router = require("express").Router();
const reportController = require("../controllers/reportController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");


router.post("/", jwtMiddleware.verifyToken, reportController.createReport)

router.get("/", jwtMiddleware.verifyToken, reportController.getReport)

router.put("/:id",jwtMiddleware.verifyToken, reportController.updateReport)

router.delete("/:id",jwtMiddleware.verifyToken, reportController.deleteReport)

module.exports = router