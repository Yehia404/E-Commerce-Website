const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  editProductByName,
  removeProductByName,
  getInventoryProducts,
  updateProductInventory,
} = require("../controllers/productController");

// Get all products
router.get("/allproducts", getAllProducts);

// Add a new product
router.post("/addproduct", addProduct);

// Get inventory products
router.get("/inventory", getInventoryProducts);

// Update product inventory by ID
router.put("/inventory/:id", updateProductInventory);

// Edit a product by name
router.put("/:name", editProductByName);

// Remove a product by name
router.delete("/:name", removeProductByName);

module.exports = router;
