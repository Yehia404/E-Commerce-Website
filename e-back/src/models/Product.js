const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
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
    sizes: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL"],
          required: [true, "Product size is required"],
        },
        stock: {
          type: Number,
          default: 0,
          min: [0, "Stock must be a non-negative number"],
        },
      },
    ],
    details: {
      type: String,
      required: [true, "Product details are required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    available: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount must be a non-negative number"],
    },
    style: {
      type: String,
      required: [true, "Product style is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      required: [true, "Product gender is required"],
    },
    reviews: [
      {
        user: {
          type: String,
          trim: true,
        },
        rating: {
          type: Number,
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
