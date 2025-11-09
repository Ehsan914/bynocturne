import connection from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


/* eslint-disable no-undef */

// User registration
export const registerUser = (req, res) => {
    const { name, email, password, phone, street_address, city, state, zip_code, country } = req.body;

    // Check if user already exists
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: 'Password hashing failed' });
            }

            // Create user
            const query = 'INSERT INTO users (name, email, password, phone, street_address, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [name, email, hash, phone, street_address, city, state, zip_code, country];
            
            connection.query(query, values, (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'User registration failed' });
                }

                // Generate JWT token
                const token = jwt.sign({ id: results.insertId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

                return res.status(201).json({ 
                    message: 'User registered successfully', 
                    token,
                    user: {
                        id: results.insertId,
                        name,
                        email
                    }
                });
            });
        });
    });
};

export const loginUser = (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare password

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Password comparison failed' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email
                }
            });
        });
    });
};

// Get user profile (protected route)
export const getUserProfile = (req, res) => {
    // req.user is set by authenticateToken middleware
    res.json({
        user: req.user
    });
};