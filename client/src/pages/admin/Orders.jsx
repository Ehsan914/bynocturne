import { useState, useEffect } from 'react';
import { getAdminOrders, updateAdminOrderStatus } from '../../api/adminAPI';
import toast from 'react-hot-toast';
import '../admin.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        payment_status: '',
        search: ''
    });

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getAdminOrders(filters);
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateAdminOrderStatus(orderId, newStatus);
            toast.success('Order status updated successfully');
            fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update order status');
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'badge-warning',
            processing: 'badge-info',
            shipped: 'badge-purple',
            delivered: 'badge-success',
            cancelled: 'badge-danger'
        };
        return classes[status] || 'badge-default';
    };

    const getPaymentBadgeClass = (status) => {
        const classes = {
            pending: 'badge-warning',
            paid: 'badge-success',
            failed: 'badge-danger',
            refunded: 'badge-info'
        };
        return classes[status] || 'badge-default';
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Orders Management</h1>
                <div className="admin-filters">
                    <input
                        type="text"
                        placeholder="Search by order number, email..."
                        className="admin-search-input"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                    <select
                        className="admin-select"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                        className="admin-select"
                        value={filters.payment_status}
                        onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                    >
                        <option value="">All Payment Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="admin-empty">No orders found</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="order-number-cell">{order.order_number}</td>
                                    <td>
                                        <div className="customer-cell">
                                            <div className="customer-name">{order.username || 'N/A'}</div>
                                            <div className="customer-email">{order.email}</div>
                                        </div>
                                    </td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="amount-cell">${parseFloat(order.total_amount).toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${getPaymentBadgeClass(order.payment_status)}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="status-select"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
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

export default Orders;