import React, { useState } from "react";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import { useCart } from "../context/cartcontext";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    total,
    discountPercentage,
    applyPromoCode,
  } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [promoCodeSuccess, setPromoCodeSuccess] = useState("");
  const [isPromoCodeApplied, setIsPromoCodeApplied] = useState(false);
  const itemsPerPage = 3;

  const handleApplyPromoCode = async () => {
    const error = await applyPromoCode(promoCode);
    if (error) {
      setPromoCodeError(error);
      setPromoCodeSuccess("");
    } else {
      setPromoCodeError("");
      setPromoCodeSuccess(`Promo code "${promoCode}" applied successfully!`);
      setIsPromoCodeApplied(true);
    }
  };

  // Calculate pagination only if cart has items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    cart.length > 0 ? cart.slice(indexOfFirstItem, indexOfLastItem) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50 p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-white rounded-full p-6 mb-6">
              <FiShoppingBag size={64} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link
              to="/shop"
              className="px-8 py-3 bg-black text-white rounded-full flex items-center gap-2 hover:bg-gray-800 transition-all"
            >
              <FiShoppingBag />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            <div className="flex-1 space-y-4 sm:space-y-6">
              {currentItems.map((item) => (
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
                    <h2 className="font-semibold text-base break-words">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="font-bold mt-2">
                      {item.discount > 0 && (
                        <span className="line-through text-gray-500 mr-2">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                      $
                      {(
                        item.price -
                        (item.price * item.discount) / 100
                      ).toFixed(2)}
                    </p>
                  </div>
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
                      disabled={item.quantity === 5}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-red-500 ml-4 hover:text-red-700 mt-3 sm:mt-0"
                    onClick={() => removeItem(item.id)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow p-6 space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Discount ({discountPercentage}%)</span>
                <span className="text-red-500">-${discount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="relative mt-4">
                <input
                  type="text"
                  placeholder="Add promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full border rounded-full px-3 py-3 text-sm focus:outline-none"
                  disabled={isPromoCodeApplied}
                />
                <button
                  onClick={handleApplyPromoCode}
                  className="absolute right-1 top-1 bottom-1 bg-black text-white px-4 text-sm hover:bg-gray-800 rounded-full"
                  disabled={isPromoCodeApplied}
                >
                  Apply
                </button>
              </div>

              <div>
                {promoCodeError && (
                  <p className="text-red-500 text-sm mt-2">{promoCodeError}</p>
                )}
                {promoCodeSuccess && (
                  <p className="text-green-500 text-sm mt-2">
                    {promoCodeSuccess}
                  </p>
                )}
              </div>

              <Link
                to="/Checkout"
                className="w-full py-3 rounded-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800"
              >
                Go to Checkout →
              </Link>
            </div>
          </div>
        )}

        {cart.length > itemsPerPage && (
          <div className="flex justify-center mt-6">
            {Array.from(
              { length: Math.ceil(cart.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 mx-1 ${
                    currentPage === i + 1
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  } rounded-full`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
