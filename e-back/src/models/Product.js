const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: 10,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
    },
    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL"],
      required: [true, "Product size is required"],
    },
    details: {
      type: String,
      required: [true, "Product details are required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
