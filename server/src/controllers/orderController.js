import db from '../config/db.js';

// Generate unique order number
const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
};

// Create new order
export const createOrder = (req, res) => {
    const userId = req.user.id;
    const {
        items,
        totalAmount,
        subtotal,
        tax,
        shipping,
        discount = 0,
        paymentMethod,
        stripePaymentIntentId,
        shippingAddress
    } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const orderNumber = generateOrderNumber();
    
    // Set payment status based on whether we have a payment intent
    const paymentStatus = stripePaymentIntentId ? 'paid' : 'pending';
    const orderStatus = stripePaymentIntentId ? 'processing' : 'pending';

    // Start transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction error:', err);
            return res.status(500).json({ error: 'Failed to create order' });
        }

        // Insert order
        const orderQuery = `
            INSERT INTO orders (
                user_id, order_number, total_amount, subtotal, 
                tax, shipping, discount, payment_method, payment_status,
                status, stripe_payment_intent_id, shipping_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            orderQuery,
            [
                userId, orderNumber, totalAmount, subtotal, tax, shipping, 
                discount, paymentMethod, paymentStatus, orderStatus,
                stripePaymentIntentId, JSON.stringify(shippingAddress)
            ],
            (err, orderResult) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Order insert error:', err);
                        res.status(500).json({ error: 'Failed to create order' });
                    });
                }

                const orderId = orderResult.insertId;

                // Insert order items
                const itemsQuery = `
                    INSERT INTO order_items (
                        order_id, product_id, product_name, 
                        product_price, quantity, subtotal
                    ) VALUES ?
                `;

                const itemsData = items.map(item => [
                    orderId,
                    item.product_id,
                    item.name,
                    item.price,
                    item.quantity,
                    item.quantity * item.price
                ]);

                db.query(itemsQuery, [itemsData], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Order items insert error:', err);
                            res.status(500).json({ error: 'Failed to create order items' });
                        });
                    }

                    // Clear user's cart
                    db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Cart clear error:', err);
                                res.status(500).json({ error: 'Failed to clear cart' });
                            });
                        }

                        // Commit transaction
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Commit error:', err);
                                    res.status(500).json({ error: 'Failed to complete order' });
                                });
                            }

                            res.status(201).json({
                                message: 'Order created successfully',
                                orderId,
                                orderNumber
                            });
                        });
                    });
                });
            }
        );
    });
};

// Get user's orders
export const getUserOrders = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT 
            id, order_number, total_amount, status, 
            payment_status, created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(query, [userId], (err, orders) => {
        if (err) {
            console.error('Get orders error:', err);
            return res.status(500).json({ error: 'Failed to fetch orders' });
        }

        res.json({ orders });
    });
};

// Get single order details
export const getOrderById = (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    const orderQuery = `
        SELECT * FROM orders 
        WHERE id = ? AND user_id = ?
    `;

    db.query(orderQuery, [orderId, userId], (err, orders) => {
        if (err) {
            console.error('Get order error:', err);
            return res.status(500).json({ error: 'Failed to fetch order' });
        }

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orders[0];

        // Get order items
        const itemsQuery = `
            SELECT * FROM order_items 
            WHERE order_id = ?
        `;

        db.query(itemsQuery, [orderId], (err, items) => {
            if (err) {
                console.error('Get order items error:', err);
                return res.status(500).json({ error: 'Failed to fetch order items' });
            }

            res.json({
                ...order,
                items,
                shipping_address: JSON.parse(order.shipping_address)
            });
        });
    });
};

// Update order status (admin only - we'll add admin check later)
export const updateOrderStatus = (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    db.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId],
        (err, result) => {
            if (err) {
                console.error('Update order error:', err);
                return res.status(500).json({ error: 'Failed to update order' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json({ message: 'Order status updated successfully' });
        }
    );
};
