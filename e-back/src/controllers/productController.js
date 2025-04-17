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
    const { name, description, price, sizes, details, image, style } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      sizes,
      details,
      image,
      style,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Edit a product by name
const editProductByName = async (req, res) => {
  try {
    const { name, description, price, sizes, details, image, style } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { name: req.params.name },
      { name, description, price, sizes, details, image, style },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a product by name
const removeProductByName = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      name: req.params.name,
    });
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products with required attributes
const getInventoryProducts = async (req, res) => {
  try {
    const products = await Product.find(
      {},
      "name sizes available image discount _id"
    ).sort({
      createdAt: -1,
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to update product inventory
const updateProductInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { sizes, available, discount } = req.body;

    // Find the product by ID and update its sizes, availability, and discount
    const product = await Product.findByIdAndUpdate(
      id,
      { sizes, available, discount },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error updating product inventory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  editProductByName,
  removeProductByName,
  getInventoryProducts,
  updateProductInventory,
};
