const mongoose = require("mongoose");

// Define the counter schema
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Create the Counter model
const Counter = mongoose.model("Counter", counterSchema);

// Define the order schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true,
  },
  firstname: {
    type: String,
    required: [true, "Firstname is required"],
  },
  lastname: {
    type: String,
    required: [true, "Lastname is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{11}$/, "Phone number must be 11 digits"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+@.+\..+/, "Please enter a valid email"],
  },
  products: [
    {
      name: {
        type: String,
        required: [true, "Product name is required"],
      },
      price: {
        type: Number,
        required: [true, "Product price is required"],
      },
      size: {
        type: String,
        required: [true, "Product size is required"],
      },
      image: {
        type: String,
        required: [true, "Product image URL is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        min: [1, "Quantity must be at least 1"],
      },
      discount: {
        type: Number,
        default: 0, // Default discount is 0 if not provided
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
  },
  paymentMethod: {
    type: String,
    required: [true, "Payment method is required"],
    enum: ["Credit Card", "COD"], // Example payment methods
  },
  shippingAddress: {
    type: String,
    required: [true, "Shipping address is required"],
  },
  area: {
    type: String,
    required: [true, "Area is required"],
  },
  status: {
    type: String,
    required: true,
    enum: ["confirmed", "cancelled", "refunded", "shipping"], // Order status options
    default: "confirmed", // Default status
  },
});

// Pre-save hook to increment orderId
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "orderId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.orderId = counter.seq;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Create the Order model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
