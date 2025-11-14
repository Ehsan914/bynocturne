import { useState, useEffect } from 'react';
import { getAllProducts } from '../../api/productAPI';
import toast from 'react-hot-toast';
import '../admin.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getAllProducts();
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockStatus = (quantity) => {
        if (quantity === 0) return 'out-of-stock';
        if (quantity < 10) return 'low-stock';
        return 'in-stock';
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Products Management</h1>
                <div className="admin-filters">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="admin-empty">No products found</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td className="product-name-cell">
                                        <div className="product-cell">
                                            {product.images && product.images[0] && (
                                                <img
                                                    src={product.images[0].startsWith('http') 
                                                        ? product.images[0] 
                                                        : `http://localhost:5000${product.images[0]}`}
                                                    alt={product.title}
                                                    className="product-thumb"
                                                    onError={(e) => {
                                                        console.log('Image failed to load:', e.target.src);
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <span>{product.title}</span>
                                        </div>
                                    </td>
                                    <td>{product.category?.name || 'N/A'}</td>
                                    <td className="amount-cell">${parseFloat(product.price).toFixed(2)}</td>
                                    <td className="stock-cell">
                                        <span className={`stock-badge ${getStockStatus(product.stock_quantity)}`}>
                                            {product.stock_quantity}
                                        </span>
                                    </td>
                                    <td>
                                        {product.stock_quantity > 0 ? (
                                            <span className="badge badge-success">Available</span>
                                        ) : (
                                            <span className="badge badge-danger">Out of Stock</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Products;