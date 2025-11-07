import connection from "../config/db.js";

// Get all categories
export const getAllCategories = (req, res) => {
    connection.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
}

// Get category by ID
export const getCategoryById = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid category id' });
    }
    connection.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(results[0]);
    });
}

// Get products by category
export const getProductsByCategory = (req, res) => {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return res.status(400).json({ error: 'Invalid category id' });
    }

    connection.query('SELECT * FROM products WHERE category_id = ?', [categoryId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        const formattedProducts = results.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            imageUrl: product.image_url
        }));
        res.json(formattedProducts);
    });
}