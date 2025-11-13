import express from 'express';
import {
    getWishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
} from '../controllers/wishlistController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.get('/', authenticateToken, getWishlistItems);
router.post('/', authenticateToken, addToWishlist);
router.delete('/:wishlistItemId', authenticateToken, removeFromWishlist);
router.delete('/clear/all', authenticateToken, clearWishlist);
router.get('/check/:productId', authenticateToken, isInWishlist);

export default router;
