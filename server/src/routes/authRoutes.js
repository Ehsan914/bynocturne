import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getUserProfile } from "../controllers/authController.js";

const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

// Get user profile (protected route)
router.get('/profile', authenticateToken, getUserProfile);

export default router;
