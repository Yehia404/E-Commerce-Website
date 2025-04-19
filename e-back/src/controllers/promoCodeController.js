const PromoCode = require("../models/Promocode");

// Create a new promo code
const createPromoCode = async (req, res) => {
  const { code, discountValue, expirationDate, usageLimit } = req.body;

  try {
    const promoCode = new PromoCode({
      code,
      discountValue,
      expirationDate,
      usageLimit,
    });

    await promoCode.save();
    res
      .status(201)
      .json({ message: "Promo code created successfully", promoCode });
  } catch (error) {
    console.error("Error creating promo code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Validate a promo code
const validatePromoCode = async (req, res) => {
  const { code } = req.body;

  try {
    const promoCode = await PromoCode.findOne({ code });

    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    if (!promoCode.isActive || promoCode.expirationDate < new Date()) {
      return res
        .status(400)
        .json({ message: "Promo code is expired or inactive" });
    }

    if (
      promoCode.usageLimit !== null &&
      promoCode.usedCount >= promoCode.usageLimit
    ) {
      return res
        .status(400)
        .json({ message: "Promo code usage limit reached" });
    }

    res.status(200).json({ message: "Promo code is valid", promoCode });
  } catch (error) {
    console.error("Error validating promo code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing promo code
const updatePromoCode = async (req, res) => {
  const { id } = req.params;
  const { discountValue, expirationDate, usageLimit, isActive } = req.body;

  try {
    const promoCode = await PromoCode.findById(id);

    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    if (discountValue !== undefined) promoCode.discountValue = discountValue;
    if (expirationDate) promoCode.expirationDate = new Date(expirationDate);
    if (usageLimit !== undefined) promoCode.usageLimit = usageLimit;
    if (isActive !== undefined) promoCode.isActive = isActive;

    await promoCode.save();

    res
      .status(200)
      .json({ message: "Promo code updated successfully", promoCode });
  } catch (error) {
    console.error("Error updating promo code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all promo codes
const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPromoCode,
  validatePromoCode,
  updatePromoCode,
  getAllPromoCodes,
};
