const express = require("express");
const router = express.Router();
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
router.post("/addproduct", addProduct);

// Get inventory products
router.get("/inventory", getInventoryProducts);

// Update product inventory by ID
router.put("/inventory/:id", updateProductInventory);

// Get a product by ID
router.get("/:id", getProductById);

// Add a review to a product
router.post("/:id/reviews", addReview);

// Edit a product by name
router.put("/:name", editProductByName);

// Remove a product by name
router.delete("/:name", removeProductByName);

module.exports = router;
