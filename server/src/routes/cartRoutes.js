import express from 'express';
import {
    getCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cartController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All cart routes require authentication
router.get('/', authenticateToken, getCartItems);
router.post('/', authenticateToken, addToCart);
router.put('/:id', authenticateToken, updateCartItem);
router.delete('/:id', authenticateToken, removeFromCart);
router.delete('/clear/all', authenticateToken, clearCart);

export default router;