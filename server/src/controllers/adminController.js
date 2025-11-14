import connection from '../config/db.js';

/* eslint-disable no-undef */

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Total revenue
        const [revenueResult] = await connection.promise().query(
            `SELECT 
                SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_revenue,
                SUM(CASE WHEN payment_status = 'paid' AND DATE(created_at) = CURDATE() THEN total_amount ELSE 0 END) as today_revenue,
                SUM(CASE WHEN payment_status = 'paid' AND WEEK(created_at) = WEEK(CURDATE()) THEN total_amount ELSE 0 END) as week_revenue,
                SUM(CASE WHEN payment_status = 'paid' AND MONTH(created_at) = MONTH(CURDATE()) THEN total_amount ELSE 0 END) as month_revenue
            FROM orders`
        );

        // Order counts by status
        const [orderStats] = await connection.promise().query(
            `SELECT 
                status,
                COUNT(*) as count
            FROM orders
            GROUP BY status`
        );

        // Recent orders
        const [recentOrders] = await connection.promise().query(
            `SELECT o.*, u.name as username, u.email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 10`
        );

        // Top selling products
        const [topProducts] = await connection.promise().query(
            `SELECT 
                oi.product_name,
                SUM(oi.quantity) as total_sold,
                SUM(oi.subtotal) as revenue
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.payment_status = 'paid'
            GROUP BY oi.product_id, oi.product_name
            ORDER BY total_sold DESC
            LIMIT 5`
        );

        // Low stock products
        const [lowStock] = await connection.promise().query(
            `SELECT id, name, stock_quantity, price
            FROM products
            WHERE stock_quantity < 10 AND stock_quantity > 0
            ORDER BY stock_quantity ASC
            LIMIT 5`
        );

        res.json({
            revenue: revenueResult[0],
            orderStats,
            recentOrders,
            topProducts,
            lowStock
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};

// Get all orders with filters
export const getAllOrders = async (req, res) => {
    try {
        const { status, payment_status, search, limit = 50, offset = 0 } = req.query;

        let query = `
            SELECT o.*, u.name as username, u.email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ` AND o.status = ?`;
            params.push(status);
        }

        if (payment_status) {
            query += ` AND o.payment_status = ?`;
            params.push(payment_status);
        }

        if (search) {
            query += ` AND (o.order_number LIKE ? OR u.email LIKE ? OR u.name LIKE ?)`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        query += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [orders] = await connection.promise().query(query, params);

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(*) as total
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE 1=1
        `;
        const countParams = [];

        if (status) {
            countQuery += ` AND o.status = ?`;
            countParams.push(status);
        }

        if (payment_status) {
            countQuery += ` AND o.payment_status = ?`;
            countParams.push(payment_status);
        }

        if (search) {
            countQuery += ` AND (o.order_number LIKE ? OR u.email LIKE ? OR u.name LIKE ?)`;
            const searchPattern = `%${search}%`;
            countParams.push(searchPattern, searchPattern, searchPattern);
        }

        const [countResult] = await connection.promise().query(countQuery, countParams);

        res.json({
            orders,
            total: countResult[0].total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const { search, limit = 50, offset = 0 } = req.query;

        let query = `
            SELECT 
                u.id,
                u.name as username,
                u.email,
                u.role,
                u.created_at,
                COUNT(DISTINCT o.id) as order_count,
                SUM(CASE WHEN o.payment_status = 'paid' THEN o.total_amount ELSE 0 END) as total_spent
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        query += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [users] = await connection.promise().query(query, params);

        // Get total count
        let countQuery = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
        const countParams = [];

        if (search) {
            countQuery += ` AND (name LIKE ? OR email LIKE ?)`;
            const searchPattern = `%${search}%`;
            countParams.push(searchPattern, searchPattern);
        }

        const [countResult] = await connection.promise().query(countQuery, countParams);

        res.json({
            users,
            total: countResult[0].total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get user details with orders
export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await connection.promise().query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [orders] = await connection.promise().query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [id]
        );

        res.json({
            user: users[0],
            orders
        });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
};


