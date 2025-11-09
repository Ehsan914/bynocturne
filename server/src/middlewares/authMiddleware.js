import jwt from 'jsonwebtoken';
import connection from '../config/db.js';

/* eslint-disable no-undef */

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' }); // Unauthorized
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' }); // Forbidden
        }

        connection.query(
            'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
            [decoded.id],
            (dbErr, results) => {
                if (dbErr) {
                    return res.status(500).json({ error: 'Database error' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }

                if (!results[0].is_active) {
                   return res.status(403).json({ error: 'Account is inactive' });
                }

                req.user = results[0];
                next();
            }
        );
    });
};