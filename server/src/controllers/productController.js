import connection from '../config/db.js';

// Helper to safely parse the JSON `images` column which may be returned
// as a string depending on the MySQL driver/config.
function parseImagesField(images) {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// Get all products
export const getAllProducts = (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }

    const formattedProducts = results.map(product => {
      const images = parseImagesField(product.images);

      return {
        id: product.id,
        title: product.title,
        price: Number(product.price),
        description: product.description,
        category: {
          id: product.category_id,
          name: product.category_name
        },
        images,
        rating: Number(product.rating),
        ratingAmount: product.ratingAmount
      };
    });

    res.json(formattedProducts);
  });
};

// Get single product by ID
export const getProductById = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid product id' });
  }

  connection.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = results[0];
    const images = parseImagesField(product.images);

    const formattedProduct = {
      id: product.id,
      title: product.title,
      price: Number(product.price),
      description: product.description,
      category: {
        id: product.category_id,
        name: product.category_name
      },
      images,
      rating: Number(product.rating),
      ratingAmount: product.ratingAmount
    };

    res.json(formattedProduct);
  });
};
