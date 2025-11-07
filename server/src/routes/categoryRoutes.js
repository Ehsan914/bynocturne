import express from 'express';
import {
    getAllCategories,
    getCategoryById,
    getProductsByCategory
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/:id/products', getProductsByCategory);

export default router;