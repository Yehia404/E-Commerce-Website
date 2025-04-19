const express = require("express");
const {
  registerUser,
  loginUser,
  createOrder,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

router.post("/orders", authMiddleware, createOrder);

module.exports = router;
