import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './adminLayout.css';

const AdminLayout = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/orders', label: 'Orders', icon: '📦' },
        { path: '/admin/products', label: 'Products', icon: '🛍️' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2 className="admin-logo">Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            <span className="admin-nav-label">{item.label}</span>
                        </Link>
                    ))}
                    <Link to="/" className="admin-nav-item">
                        <span className="admin-nav-icon">🏠</span>
                        <span className="admin-nav-label">Back to Store</span>
                    </Link>
                </nav>
            </aside>
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
