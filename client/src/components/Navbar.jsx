import { IoMdHeartEmpty } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { LogOut } from 'lucide-react';
import { User } from 'lucide-react';
import { UserPlus } from 'lucide-react';
import { IoSearchOutline } from "react-icons/io5";
import logo from '../assets/logo2.png'
import { AuthContext } from "../context/AuthContext";
import { CountContext } from '../context/CountContext';
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();
    const count = useContext(CountContext);

    const [showDropdown, setShowDropdown] = useState(false);
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const dropdownRef = useRef(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);
    
    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    }
    return (
        <section className="navbar">
            <div className="navbar-content">
                <section className="logo" onClick={() => navigate('/')}>      
                    <img src={logo} alt="" className="logo" />
                </section>
                <section className="search-container">
                    <IoSearchOutline className="search-icon"/>
                    <input type="text" placeholder="Search products..." className="search-bar"/>
                </section>
                <section className="options">
                    <section className="wl-container" onClick={() => navigate('/wishlist')}>
                        <p className="wl-count" 
                        style={{display: count.wishlistCount > 0 ?
                        "flex" : "none"}}>{count.wishlistCount}</p>
                        <IoMdHeartEmpty className="option-icon" />
                    </section>
                    <section className="cart-container" onClick={() => navigate('/cart')}>
                        <p className="cart-count" 
                        style={{display: count.cartCount > 0 ?
                        "flex" : "none"}}>{count.cartCount}</p>
                        <LuShoppingCart className="option-icon" />
                    </section>
                    <FiUser 
                        className="option-icon" 
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                        <div className="profile-dropdown" ref={dropdownRef}>
                            {isAuthenticated ? (
                                <>  
                                    <div className="user-info">
                                        {isAuthenticated && user && (
                                            <p>Hello, {user.name}!</p>
                                        )}
                                    </div>
                                    <div className="divider"></div>
                                    <div onClick={() => { navigate('/account'); setShowDropdown(false); }} className="profile-optn-btn optn">
                                        <FiUser />
                                        <span>Profile</span>
                                    </div>
                                    <div onClick={handleLogout} className="sign-out-btn optn" style={{color: 'crimson'}}> 
                                        <LogOut className="sign-out-icon"/> 
                                        <span>Sign Out</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div onClick={() => { navigate('/login'); setShowDropdown(false); }} className="profile-optn-btn optn">
                                        <User className="sign-out-icon"/>
                                        <span>Sign In</span>
                                    </div>
                                    <div onClick={() => { navigate('/register'); setShowDropdown(false); }} className="profile-optn-btn optn">
                                        <UserPlus className="sign-out-icon"/>
                                        <span>Sign Up</span></div>
                                </>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </section>
    )
}

export default Navbar