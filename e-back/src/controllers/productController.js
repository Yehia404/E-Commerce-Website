const Product = require("../models/Product");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, sizes, details, image } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      sizes,
      details,
      image,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
};
