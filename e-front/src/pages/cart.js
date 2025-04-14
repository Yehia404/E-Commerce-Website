// App.jsx
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const productsData = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    price: 145,
    size: "Large",
    color: "White",
    image: "https://via.placeholder.com/80x80.png?text=T-shirt",
    quantity: 1,
  },
  {
    id: 2,
    name: "Checkered Shirt",
    price: 180,
    size: "Medium",
    color: "Red",
    image: "https://via.placeholder.com/80x80.png?text=Shirt",
    quantity: 1,
  },
  {
    id: 3,
    name: "Skinny Fit Jeans",
    price: 240,
    size: "Large",
    color: "Blue",
    image: "https://via.placeholder.com/80x80.png?text=Jeans",
    quantity: 1,
  },
];

function App() {
  const [cart, setCart] = useState(productsData);

  const updateQuantity = (id, delta) => {
    setCart(cart =>
      cart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart => cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * 0.2;
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Your Cart</h1>
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex flex-wrap sm:flex-nowrap items-center bg-white rounded-2xl shadow p-4 text-sm font-semibold text-gray-900 w-full"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0 mb-3 sm:mb-0"
                />
                <div className="ml-0 sm:ml-4 flex-1 min-w-[150px]">
                  <h2 className="font-semibold text-base break-words">{item.name}</h2>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p className="text-sm text-gray-600">Color: {item.color}</p>
                  <p className="font-bold mt-2">${item.price}</p>
                </div>
                {/* Quantity Controls */}
                <div className="flex items-center mt-3 sm:mt-0 sm:ml-4">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                {/* Remove */}
                <button
                  className="text-red-500 ml-4 hover:text-red-700 mt-3 sm:mt-0"
                  onClick={() => removeItem(item.id)}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="font-bold text-lg">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Discount (-20%)</span>
              <span className="text-red-500">-${discount.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Fee</span>
              <span>${deliveryFee}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${total}</span>
            </div>

            {/* Promo Code */}
            
            <div className="relative mt-4">
            <input type="text" placeholder="Add promo code" className="w-full border rounded-full px-3 py-3 text-sm focus:outline-none"/>
            <button className="absolute right-1 top-1 bottom-1 bg-black text-white px-4 text-sm hover:bg-gray-800 rounded-full">
              Apply
            </button>
</div>
  
            <button className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 flex items-center justify-center gap-2">
              Go to Checkout →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
