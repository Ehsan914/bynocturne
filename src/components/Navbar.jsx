import { IoMdHeartEmpty } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import logo from '../assets/logo2.png'
import { CountContext } from '../context/CountContext';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();
    const count = useContext(CountContext);
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
                    <FiUser className="option-icon" />
                </section>
            </div>
        </section>
    )
}

export default Navbar