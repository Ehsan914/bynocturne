import { useContext } from "react";
import { CountContext } from "./CountContext";
import { CartContext } from "./CartContext";
import { WishlistContext } from "./WishlistContext.js";

export const CountProvider = ({ children }) => {
  const { getCount: getCartCount } = useContext(CartContext);
  const { getCount: getWishlistCount } = useContext(WishlistContext);

  const cartCount = getCartCount ? getCartCount() : 0;
  const wishlistCount = getWishlistCount ? getWishlistCount() : 0;

  return (
    <CountContext.Provider
      value={{
        cartCount,
        wishlistCount
      }}
    >
      {children}
    </CountContext.Provider>
  );
};
