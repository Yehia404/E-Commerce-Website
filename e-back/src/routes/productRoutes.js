const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const parser  = require('../middleware/upload'); 
const {
  getAllProducts,
  addProduct,
  editProductByName,
  removeProductByName,
  getInventoryProducts,
  updateProductInventory,
  getProductById,
  addReview,
  getNewArrivals,
  getCollectionItems,
} = require("../controllers/productController");

// Get all products
router.get("/allproducts", getAllProducts);

// Get new arrivals
router.get("/newarrivals", getNewArrivals);

// Get collection items
router.get("/collection", getCollectionItems);

// Add a new product
router.post("/addproduct", authMiddleware, parser.single('image'),addProduct);

// Get inventory products
router.get("/inventory", authMiddleware, getInventoryProducts);

// Update product inventory by ID
router.put("/inventory/:id", authMiddleware, updateProductInventory);

// Get a product by ID
router.get("/:id", getProductById);

// Add a review to a product
router.post("/:id/reviews", authMiddleware, addReview);

// Edit a product by name
router.put("/:name", authMiddleware, parser.single('image'),editProductByName);

// Remove a product by name
router.delete("/:name", authMiddleware, removeProductByName);

module.exports = router;
