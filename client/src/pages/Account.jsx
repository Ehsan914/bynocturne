import { useState, useEffect, useContext } from 'react';
import './account.css';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { getUserOrders } from '../api/orderAPI';
import { confirmPayment } from '../api/paymentAPI';
import Checkout from '../components/Checkout';
import toast from 'react-hot-toast';

const Account = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await getUserOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#666';
  };

  const handleMakePayment = (order) => {
    setSelectedOrder(order);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Confirm payment with backend
      await confirmPayment(paymentIntent.id, selectedOrder.id);

      toast.success('Payment successful! Your order has been confirmed.');
      setShowCheckout(false);
      setSelectedOrder(null);
      
      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Payment processed but order update failed. Please contact support.');
    }
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
    setSelectedOrder(null);
  };

  return (
    <div className="account-page-container">
      <section className="account-heading-container">
        <section className='account-heading-icon' onClick={() => navigate('/')}>
          <FaArrowLeft />
        </section>
        <section className="account-heading-text-container">
          <h1 className='account-heading'>My Account</h1>
          <p className='account-text'>Manage your account and preferences</p>
        </section>
      </section>

      <div className="account-tabs">
        <button 
          className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`account-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className="account-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Profile Information</h2>
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{user?.username || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value">
                  {user?.street_address || 'N/A'}<br />
                  {user?.city && user?.state && `${user.city}, ${user.state}`}<br />
                  {user?.zip_code && user?.country && `${user.zip_code}, ${user.country}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order History</h2>
            {loadingOrders ? (
              <p className="loading-text">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="empty-orders">
                <p>No orders yet</p>
                <button className="shop-now-btn" onClick={() => navigate('/')}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-number">
                        <span className="label">Order #</span>
                        <span className="value">{order.order_number}</span>
                      </div>
                      <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                    <div className="order-details">
                      <div className="detail-item">
                        <span className="label">Date:</span>
                        <span className="value">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Total:</span>
                        <span className="value">${parseFloat(order.total_amount).toFixed(2)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Payment:</span>
                        <span className="value">
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      </div>
                      {order.payment_status === 'pending' && (
                        <div className="detail-item order-actions">
                          <button 
                            className="make-payment-btn"
                            onClick={() => handleMakePayment(order)}
                          >
                            Make Payment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showCheckout && selectedOrder && (
        <div className="payment-modal-overlay" onClick={handlePaymentCancel}>
          <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
            <Checkout
              amount={parseFloat(selectedOrder.total_amount)}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Account

