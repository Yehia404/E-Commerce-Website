const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const stripe = require("../utils/stripe");
const transporter = require("../utils/node_mailer");
const { createOrderConfirmationEmail } = require("../utils/emailTemplate");
// Register User
const registerUser = async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
    });

    // Save the user
    const newUser = await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        image: user.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const processPayment = async (req, res) => {
  const { amount, paymentMethodId } = req.body;

  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      return_url: "http://localhost:3000/order-confirmation",
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(400).json({ error: error.message });
  }
};

// Create Order
const createOrder = async (req, res) => {
  const userId = req.user.userId; // Extract userId from token
  const {
    firstname,
    lastname,
    phone,
    email,
    products,
    totalPrice,
    paymentMethod,
    shippingAddress,
    area,
    paymentMethodId,
  } = req.body;
  try {
    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Iterate over each product in the order
    for (const productOrder of products) {
      const { name, size, quantity } = productOrder;

      // Find the product by name
      const product = await Product.findOne({ name: name });
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with name ${name} not found` });
      }

      // Ensure the sizes field is an array
      if (!Array.isArray(product.sizes)) {
        return res.status(400).json({
          message: `Size information is missing for product ${product.name}`,
        });
      }

      // Find the size entry for the specified size
      const sizeEntry = product.sizes.find((entry) => entry.size === size);
      if (!sizeEntry) {
        return res.status(400).json({
          message: `Size ${size} not available for product ${product.name}`,
        });
      }

      // Check if there is enough stock
      if (sizeEntry.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name} in size ${size}`,
        });
      }

      // Decrement the stock
      sizeEntry.stock -= quantity;

      // Save the updated product
      await product.save();
    }

    // Create a new order
    const order = new Order({
      userId,
      firstname,
      lastname,
      phone,
      email,
      products,
      totalPrice,
      paymentMethod,
      shippingAddress,
      area,
      status: "confirmed", // Default status
    });

    await order.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmation",
      html: createOrderConfirmationEmail(order),
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message: "Order created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const editStatus = async (req, res) => {
  const { id } = req.params; // Order ID
  const { status } = req.body;

  try {
    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get Orders for a Specific User
const getUserOrders = async (req, res) => {
  const userId = req.user.userId; // Extract userId from token

  try {
    const orders = await Order.find({ userId: userId });
    // Return the user's orders
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  const userId = req.user.userId;
  const { firstname, lastname, phone, removeImage } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Store old image for deletion
    const oldImage = user.image;

    // Update user details
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.phone = phone || user.phone;

    // Handle image updates/removal
    if (removeImage === "true") {
      // Remove image
      user.image = null;

      // Delete old image from Cloudinary if it exists
      if (oldImage && oldImage.includes("cloudinary.com")) {
        const publicId = oldImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    } else if (req.file && req.file.path) {
      // Update to new image
      user.image = req.file.path;

      // Delete old image from Cloudinary if it exists
      if (
        oldImage &&
        oldImage !== req.file.path &&
        oldImage.includes("cloudinary.com")
      ) {
        const publicId = oldImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        image: user.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createOrder,
  getAllOrders,
  editStatus,
  getUserOrders,
  updateUserProfile,
  processPayment,
};
