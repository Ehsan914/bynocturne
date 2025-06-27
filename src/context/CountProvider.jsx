import { useState, useEffect } from "react";
import { CountContext } from "./CountContext";

export const CountProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [cartItems, wishlistItems]);

  // ✅ Add to Cart
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // ✅ Increase quantity
  const increaseQty = (productId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ✅ Decrease quantity
  const decreaseQty = (productId) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0) // remove if quantity becomes 0
    );
  };

  // ✅ Remove from cart
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <CountContext.Provider
      value={{
        cartItems,
        setCartItems,
        wishlistItems,
        setWishlistItems,
        cartCount: cartItems.length,
        wishlistCount: wishlistItems.length,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart
      }}
    >
      {children}
    </CountContext.Provider>
  );
};
