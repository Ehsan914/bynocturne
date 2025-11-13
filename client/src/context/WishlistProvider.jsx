import { useState, useEffect, useContext } from 'react';
import { getWishlist, addToWishlist as addToWishlistAPI, removeFromWishlist as removeFromWishlistAPI, clearWishlist as clearWishlistAPI } from '../api/wishlistAPI';
import { AuthContext } from './AuthContext';
import { WishlistContext } from './WishlistContext.js';

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, token } = useContext(AuthContext);

    // Fetch wishlist when user logs in
    useEffect(() => {
        if (isAuthenticated && token) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [isAuthenticated, token]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await getWishlist();
            setWishlist(response.wishlist || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            await addToWishlistAPI(productId);
            await fetchWishlist(); // Refresh wishlist
            return { success: true, message: 'Added to wishlist!' };
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Failed to add to wishlist' 
            };
        }
    };

    const removeItem = async (wishlistItemId) => {
        try {
            await removeFromWishlistAPI(wishlistItemId);
            await fetchWishlist();
            return { success: true };
        } catch (error) {
            console.error('Error removing item:', error);
            return { success: false };
        }
    };

    const clearAllWishlist = async () => {
        try {
            await clearWishlistAPI();
            await fetchWishlist();
            return { success: true };
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            return { success: false };
        }
    };

    // Check if product is in wishlist
    const isInWishlist = (productId) => {
        return wishlist.find(item => item.product_id === productId);
    };

    // Get total number of items
    const getCount = () => {
        return wishlist.length;
    };

    const value = {
        wishlist,
        loading,
        addToWishlist,
        isInWishlist,
        removeItem,
        clearWishlist: clearAllWishlist,
        getCount,
        refreshWishlist: fetchWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
