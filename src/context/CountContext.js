import { createContext } from "react";

export const CountContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  wishlistItems: [],
  setWishlistItems: () => {},
  cartCount: 0,
  wishlistCount: 0,
});
