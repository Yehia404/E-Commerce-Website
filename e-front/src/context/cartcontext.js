import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./usercontext";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { token } = useUser();
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [subtotal, setSubtotal] = useState(() => {
    const savedSubtotal = localStorage.getItem("subtotal");
    return savedSubtotal ? parseFloat(savedSubtotal) : 0;
  });

  const [discount, setDiscount] = useState(() => {
    const savedDiscount = localStorage.getItem("discount");
    return savedDiscount ? parseFloat(savedDiscount) : 0;
  });

  const [total, setTotal] = useState(() => {
    const savedTotal = localStorage.getItem("total");
    return savedTotal ? parseFloat(savedTotal) : 0;
  });

  useEffect(() => {
    const newSubtotal = cart.reduce((acc, item) => {
      const discountedPrice = item.price - (item.price * item.discount) / 100;
      return acc + discountedPrice * item.quantity;
    }, 0);

    const newDiscount = (newSubtotal * discountPercentage) / 100;
    const newTotal = newSubtotal - newDiscount;

    setSubtotal(newSubtotal);
    setDiscount(newDiscount);
    setTotal(newTotal);

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("subtotal", newSubtotal.toFixed(2));
    localStorage.setItem("discount", newDiscount.toFixed(2));
    localStorage.setItem("total", newTotal.toFixed(2));
  }, [cart, discountPercentage]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(5, item.quantity + product.quantity),
              }
            : item
        );
      } else {
        return [...prevCart, product];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(5, item.quantity + delta)),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const applyPromoCode = async (code) => {
    code = code.toUpperCase();
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/promocodes/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDiscountPercentage(data.discountValue);
        return ""; // No error
      } else {
        setDiscountPercentage(0);
        return data.message; // Return error message
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      return "An error occurred while applying the promo code.";
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        updateQuantity,
        removeItem,
        subtotal,
        setSubtotal,
        discount,
        setDiscount,
        total,
        setTotal,
        discountPercentage,
        setDiscountPercentage,
        applyPromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
