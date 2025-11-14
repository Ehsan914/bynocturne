import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { 
    getDashboardStats, 
    getAllOrders, 
    getAllUsers, 
    getUserDetails 
} from '../controllers/adminController.js';
import { updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(isAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);

// Update order status (reuse from orderController)
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
