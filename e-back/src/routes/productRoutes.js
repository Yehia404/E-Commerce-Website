const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllProducts,
  addProduct,
  editProductByName,
  removeProductByName,
  getInventoryProducts,
  updateProductInventory,
  getProductById,
  addReview,
} = require("../controllers/productController");

// Get all products
router.get("/allproducts", getAllProducts);

// Add a new product
router.post("/addproduct", authMiddleware, addProduct);

// Get inventory products
router.get("/inventory", authMiddleware, getInventoryProducts);

// Update product inventory by ID
router.put("/inventory/:id", authMiddleware, updateProductInventory);

// Get a product by ID
router.get("/:id", getProductById);

// Add a review to a product
router.post("/:id/reviews", authMiddleware, addReview);

// Edit a product by name
router.put("/:name", authMiddleware, editProductByName);

// Remove a product by name
router.delete("/:name", authMiddleware, removeProductByName);

module.exports = router;
