import { createContext } from 'react';

export const CartContext = createContext({
    cart: [],
    loading: false,
    addToCart: () => {},
    updateQuantity: () => {},
    removeItem: () => {},
    clearCart: () => {},
    getTotal: () => 0,
    getCount: () => 0,
    refreshCart: () => {}
});
