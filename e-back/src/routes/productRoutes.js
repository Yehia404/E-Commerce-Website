const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
} = require("../controllers/productController");

router.post("/addproduct", addProduct); // Add a new product
router.get("/allproducts", getAllProducts); // Get all products

module.exports = router;
