const express = require("express");
const {
  registerUser,
  loginUser,
  createOrder,
  getAllOrders,
  editStatus,
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

// Edit order status
router.put("/orders/:id/status", authMiddleware, editStatus);

module.exports = router;
