import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [discountPercentage, setDiscountPercentage] = useState(() => {
    const savedDiscount = localStorage.getItem("discountPercentage");
    return savedDiscount ? parseFloat(savedDiscount) : 0;
  });

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
    localStorage.setItem("discountPercentage", discountPercentage.toString());
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

  const applyPromoCode = (code) => {
    if (code.toUpperCase() === "SAVE20") {
      setDiscountPercentage(20);
      alert("Promo code applied! You get a 20% discount.");
    } else {
      setDiscountPercentage(0);
      alert("Invalid promo code.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        subtotal,
        discount,
        total,
        discountPercentage,
        applyPromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
