const router = require("express").Router();
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const productController = require("../controllers/productController");

router.post("/", jwtMiddleware.verifyToken, productController.createProduct);

router.get("/", jwtMiddleware.verifyToken,productController.getProducts);

router.get("/:id", jwtMiddleware.verifyToken, productController.getProduct);

router.get("/user_products/:id", jwtMiddleware.verifyToken, productController.getUserProducts);

router.get("/s/category", jwtMiddleware.verifyToken, productController.categoriesSelect)

router.get("/s/search", jwtMiddleware.verifyToken, productController.searchProduct)

router.put("/:id", jwtMiddleware.verifyToken, productController.updateProduct);

router.delete("/:id", jwtMiddleware.verifyToken, productController.deleteProduct);

module.exports = router
