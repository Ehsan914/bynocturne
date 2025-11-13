import db from '../config/db.js';

// Get all wishlist items for a user
export const getWishlistItems = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT 
            wishlist.id as wishlist_id,
            wishlist.product_id,
            products.title as name,
            products.price,
            products.images as image,
            products.category_name as category
        FROM wishlist
        JOIN products ON wishlist.product_id = products.id
        WHERE wishlist.user_id = ?
        ORDER BY wishlist.created_at DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Get wishlist error:', err);
            return res.status(500).json({ error: 'Failed to fetch wishlist' });
        }

        res.json({ wishlist: results });
    });
};

// Add product to wishlist
export const addToWishlist = (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    db.query('SELECT id FROM products WHERE id = ?', [productId], (err, products) => {
        if (err) {
            console.error('Add to wishlist error:', err);
            return res.status(500).json({ error: 'Failed to add product to wishlist' });
        }

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if already in wishlist
        db.query(
            'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId],
            (err, existing) => {
                if (err) {
                    console.error('Add to wishlist error:', err);
                    return res.status(500).json({ error: 'Failed to add product to wishlist' });
                }

                if (existing.length > 0) {
                    return res.status(400).json({ error: 'Product already in wishlist' });
                }

                // Add to wishlist
                db.query(
                    'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
                    [userId, productId],
                    (err) => {
                        if (err) {
                            console.error('Add to wishlist error:', err);
                            return res.status(500).json({ error: 'Failed to add product to wishlist' });
                        }

                        res.status(201).json({ message: 'Product added to wishlist' });
                    }
                );
            }
        );
    });
};

// Remove product from wishlist
export const removeFromWishlist = (req, res) => {
    const userId = req.user.id;
    const { wishlistItemId } = req.params;

    // Verify the wishlist item belongs to the user
    db.query(
        'DELETE FROM wishlist WHERE id = ? AND user_id = ?',
        [wishlistItemId, userId],
        (err, result) => {
            if (err) {
                console.error('Remove from wishlist error:', err);
                return res.status(500).json({ error: 'Failed to remove product from wishlist' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Wishlist item not found' });
            }

            res.json({ message: 'Product removed from wishlist' });
        }
    );
};

// Clear entire wishlist
export const clearWishlist = (req, res) => {
    const userId = req.user.id;

    db.query('DELETE FROM wishlist WHERE user_id = ?', [userId], (err) => {
        if (err) {
            console.error('Clear wishlist error:', err);
            return res.status(500).json({ error: 'Failed to clear wishlist' });
        }

        res.json({ message: 'Wishlist cleared' });
    });
};

// Check if product is in wishlist
export const isInWishlist = (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    db.query(
        'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
        [userId, productId],
        (err, result) => {
            if (err) {
                console.error('Check wishlist error:', err);
                return res.status(500).json({ error: 'Failed to check wishlist status' });
            }

            res.json({ isInWishlist: result.length > 0 });
        }
    );
};
