import { Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import Navbar from './components/Navbar'
import './navbar.css'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './routes/ProtectedRoute'

// Admin
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Users from './pages/admin/Users'
import Orders from './pages/admin/Orders'
import Settings from './pages/admin/Settings'

const App = () => {
  return (
    <>
      <Navbar />  {/* Always visible */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        {/* Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App