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

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, details, image, style, gender } =
      req.body;
    const sizes = JSON.parse(req.body.sizes);
    const newProduct = new Product({
      name,
      description,
      price,
      sizes,
      details,
      image,
      style,
      gender,
    });

    // If a file was uploaded, Cloudinary URL is in req.file.path
    if (req.file && req.file.path) {
      newProduct.image = req.file.path;                       
    }
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Edit a product by name
const editProductByName = async (req, res) => {
  try {
    const { name, description, price, details,style, gender } =
      req.body;
    const sizes = JSON.parse(req.body.sizes);
    let image = req.body.image
    // If a file was uploaded, Cloudinary URL is in req.file.path
    if (req.file && req.file.path) {
      image = req.file.path;                       
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { name: req.params.name },
      { name, description, price, sizes, details, image, style, gender },
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

// Add a review to a product
const addReview = async (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = { user, rating, comment };
    product.reviews.push(newReview);
    await product.save();

    // Return the updated product
    res.status(201).json({
      message: "Review added successfully",
      reviews: product.reviews,
      averageRating: product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: "Error adding review" });
  }
};
// Get new arrivals
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(4);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get collection items
const getCollectionItems = async (req, res) => {
  try {
    const products = await Product.find().limit(4);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getNewArrivals,
  getCollectionItems,
  addProduct,
  editProductByName,
  removeProductByName,
  getInventoryProducts,
  updateProductInventory,
  getProductById,
  addReview,
};
