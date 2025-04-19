const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

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
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
    // Save the order to the user's orders array
    user.orders.push(order);
    await user.save();

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

    // Find the user associated with this order
    const user = await User.findOne({ "orders._id": id });
    if (user) {
      // Update the status in the user's orders array
      const userOrder = user.orders.id(id);
      if (userOrder) {
        userOrder.status = status;
        await user.save();
      }
    }

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
    // Find the user by ID
    const user = await User.findById(userId).populate("orders");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's orders
    res.status(200).json(user.orders);
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
  getUserOrders, // Export the new function
};
