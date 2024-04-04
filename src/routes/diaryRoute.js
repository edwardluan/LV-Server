const diaryController = require("../controllers/diaryController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

const router = require("express").Router();

router.get("/:id", jwtMiddleware.verifyToken, diaryController.getDiaryById)

router.get("/", jwtMiddleware.verifyToken, diaryController.getDiaries)

router.get("/g/:id", jwtMiddleware.verifyToken, diaryController.getDiary);

router.get("/getSaveDiaries/result", jwtMiddleware.verifyToken, diaryController.getSaveDiaries);

router.post("/", jwtMiddleware.verifyToken, diaryController.createDiary)

router.put("/:id", jwtMiddleware.verifyToken, diaryController.updateDiary)

router.delete("/:id", jwtMiddleware.verifyToken, diaryController.deleteDiary);

router.put("/saveDiary/:id", jwtMiddleware.verifyToken, diaryController.saveDiary);

router.put("/unSaveDiary/:id", jwtMiddleware.verifyToken, diaryController.unSaveDiary);



module.exports = router