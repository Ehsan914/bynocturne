import { useState, useEffect } from 'react';
import { getAdminUsers } from '../../api/adminAPI';
import toast from 'react-hot-toast';
import '../admin.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAdminUsers({ search: searchTerm });
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Users Management</h1>
                <div className="admin-filters">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="admin-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="admin-empty">No users found</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td className="user-name-cell">{user.username}</td>
                                    <td className="user-email-cell">{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin' ? 'badge-purple' : 'badge-default'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{user.order_count || 0}</td>
                                    <td className="amount-cell">${parseFloat(user.total_spent || 0).toFixed(2)}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;