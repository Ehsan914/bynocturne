import { useState, useEffect, useContext } from 'react';
import { getCart, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from '../api/cartAPI';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, token } = useContext(AuthContext);

    // Fetch cart when user logs in
    useEffect(() => {
        if (isAuthenticated && token) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [isAuthenticated, token]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await getCart();
            setCart(response.data.items || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            await addToCartAPI(productId, quantity);
            await fetchCart(); // Refresh cart
            return { success: true, message: 'Added to cart!' };
        } catch (error) {
            console.error('Error adding to cart:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Failed to add to cart' 
            };
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        try {
            await updateCartItem(cartItemId, quantity);
            await fetchCart();
            return { success: true };
        } catch (error) {
            console.error('Error updating quantity:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Failed to update quantity' 
            };
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            await removeFromCartAPI(cartItemId);
            await fetchCart();
            return { success: true };
        } catch (error) {
            console.error('Error removing item:', error);
            return { success: false };
        }
    };

    const clearAllCart = async () => {
        try {
            await clearCartAPI();
            await fetchCart();
            return { success: true };
        } catch (error) {
            console.error('Error clearing cart:', error);
            return { success: false };
        }
    };

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    };

    const getCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const isInCart = (productId) => {
        return cart.find(item => item.product_id === productId);
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            isInCart,
            updateQuantity,
            removeItem,
            clearCart: clearAllCart,
            getTotal,
            getCount,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
