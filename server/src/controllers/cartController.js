import db from '../config/db.js';

// Get user's cart items with product details
export const getCartItems = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT
            c.id as cart_id,
            c.quantity,
            p.id as product_id,
            p.title as name,
            p.price,
            p.images as image,
            (p.price * c.quantity) as subtotal
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const total = results.reduce((sum, item) => sum + item.subtotal, 0);
        
        res.json({
            items: results,
            total: total,
            count: results.length
        });
    });
}

// Add item to cart
export const addToCart = (req, res) => {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    db.query('SELECT id FROM products WHERE id = ?', [product_id], (err, products) => {
        if (err) {
            console.error('Product query error:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (products.length === 0) return res.status(404).json({ error: 'Product not found' });

        // Check if item already in cart
        db.query(
            'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, product_id],
            (err, existingItems) => {
                if (err) {
                    console.error('Cart check error:', err);
                    return res.status(500).json({ error: 'Database error', details: err.message });
                }

                if (existingItems.length > 0) {
                    // Update quantity
                    const newQuantity = existingItems[0].quantity + quantity;

                    db.query(
                        'UPDATE cart SET quantity = ? WHERE id = ?',
                        [newQuantity, existingItems[0].id],
                        (err) => {
                            if (err) {
                                console.error('Cart update error:', err);
                                return res.status(500).json({ error: 'Database error', details: err.message });
                            }
                            res.json({ message: 'Cart updated successfully' });
                        }
                    );
                } else {
                    // Insert new item
                    db.query(
                        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                        [userId, product_id, quantity],
                        (err) => {
                            if (err) {
                                console.error('Cart insert error:', err);
                                return res.status(500).json({ error: 'Database error', details: err.message });
                            }
                            res.status(201).json({ message: 'Item added to cart' });
                        }
                    );
                }
            }
        );
    });
};


// Update cart item quantity
export const updateCartItem = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params; // cart item id
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Verify cart item belongs to user
    const query = `
        SELECT c.id
        FROM cart c
        WHERE c.id = ? AND c.user_id = ?
    `;

    db.query(query, [id, userId], (err, items) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (items.length === 0) return res.status(404).json({ error: 'Cart item not found' });

        db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Quantity updated successfully' });
        });
    });
};

// Remove item from cart
export const removeFromCart = (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }
        res.json({ message: 'Item removed from cart' });
    });
};

// Clear entire cart
export const clearCart = (req, res) => {
    const userId = req.user.id;

    db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Cart cleared successfully' });
    });
};