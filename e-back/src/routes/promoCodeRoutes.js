const express = require("express");
const {
  createPromoCode,
  validatePromoCode,
  updatePromoCode,
  getAllPromoCodes,
} = require("../controllers/promoCodeController");

const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create a promo code (admin only)
router.post("/create", authMiddleware, createPromoCode);

// Validate a promo code
router.post("/validate", authMiddleware, validatePromoCode);

// Update a promo code (admin only)
router.put("/update/:id", authMiddleware, updatePromoCode);

// Get all promo codes (admin only)
router.get("/all", authMiddleware, getAllPromoCodes);

module.exports = router;
