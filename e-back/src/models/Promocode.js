// models/PromoCode.js

const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: null, // null means unlimited usage
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

module.exports = PromoCode;
