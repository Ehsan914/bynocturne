import { createContext } from 'react';

export const WishlistContext = createContext({
    wishlist: [],
    loading: false,
    addToWishlist: async () => {},
    isInWishlist: () => null,
    removeItem: async () => {},
    clearWishlist: async () => {},
    getCount: () => 0,
    refreshWishlist: async () => {}
});
