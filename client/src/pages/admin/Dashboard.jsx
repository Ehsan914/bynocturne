import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/adminAPI';
import toast from 'react-hot-toast';
import '../admin.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="admin-error">Failed to load stats</div>;
    }

    const orderStatusCounts = stats.orderStats.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
    }, {});

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Revenue Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Today's Revenue</div>
                    <div className="stat-value">${parseFloat(stats.revenue.today_revenue || 0).toFixed(2)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">This Week</div>
                    <div className="stat-value">${parseFloat(stats.revenue.week_revenue || 0).toFixed(2)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">This Month</div>
                    <div className="stat-value">${parseFloat(stats.revenue.month_revenue || 0).toFixed(2)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">${parseFloat(stats.revenue.total_revenue || 0).toFixed(2)}</div>
                </div>
            </div>

            {/* Order Status */}
            <div className="section-grid">
                <div className="section-card">
                    <h2 className="section-title">Order Status</h2>
                    <div className="status-list">
                        <div className="status-item">
                            <span className="status-label">Pending</span>
                            <span className="status-value">{orderStatusCounts.pending || 0}</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Processing</span>
                            <span className="status-value">{orderStatusCounts.processing || 0}</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Shipped</span>
                            <span className="status-value">{orderStatusCounts.shipped || 0}</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Delivered</span>
                            <span className="status-value">{orderStatusCounts.delivered || 0}</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Cancelled</span>
                            <span className="status-value">{orderStatusCounts.cancelled || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="section-card">
                    <h2 className="section-title">Top Selling Products</h2>
                    {stats.topProducts.length > 0 ? (
                        <div className="products-list">
                            {stats.topProducts.map((product, index) => (
                                <div key={index} className="product-item">
                                    <div className="product-info">
                                        <span className="product-rank">{index + 1}</span>
                                        <span className="product-name">{product.product_name}</span>
                                    </div>
                                    <div className="product-stats">
                                        <span className="product-sold">{product.total_sold} sold</span>
                                        <span className="product-revenue">${parseFloat(product.revenue).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">No sales data yet</p>
                    )}
                </div>
            </div>

            {/* Low Stock & Recent Orders */}
            <div className="section-grid">
                {/* Low Stock */}
                <div className="section-card">
                    <h2 className="section-title">Low Stock Alert</h2>
                    {stats.lowStock.length > 0 ? (
                        <div className="stock-list">
                            {stats.lowStock.map((product) => (
                                <div key={product.id} className="stock-item">
                                    <div className="stock-info">
                                        <span className="stock-name">{product.name}</span>
                                        <span className="stock-price">${parseFloat(product.price).toFixed(2)}</span>
                                    </div>
                                    <span className={`stock-quantity ${product.stock_quantity < 5 ? 'critical' : 'warning'}`}>
                                        {product.stock_quantity} left
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">All products are well stocked</p>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="section-card">
                    <h2 className="section-title">Recent Orders</h2>
                    {stats.recentOrders.length > 0 ? (
                        <div className="recent-orders-list">
                            {stats.recentOrders.map((order) => (
                                <div key={order.id} className="recent-order-item">
                                    <div className="order-info">
                                        <span className="order-number">{order.order_number}</span>
                                        <span className="order-customer">{order.email}</span>
                                    </div>
                                    <div className="order-details">
                                        <span className={`order-status status-${order.status}`}>
                                            {order.status}
                                        </span>
                                        <span className="order-amount">${parseFloat(order.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">No orders yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;