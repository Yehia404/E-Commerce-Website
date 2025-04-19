const express = require("express");
const {
  registerUser,
  loginUser,
  createOrder,
  getAllOrders,
  editStatus,
  getUserOrders, // Import the new function
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Create order
router.post("/orders", authMiddleware, createOrder);

// Get all orders
router.get("/orders", authMiddleware, getAllOrders);

// Get orders for a specific user
router.get("/user/orders", authMiddleware, getUserOrders);

// Edit order status
router.put("/orders/:id/status", authMiddleware, editStatus);

module.exports = router;
