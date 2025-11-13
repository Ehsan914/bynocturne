import { useContext } from "react";
import { LiaStarSolid } from "react-icons/lia";
import { IoHeartSharp } from "react-icons/io5";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext.js";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const prod = product;
    const navigate = useNavigate();
    
    const { addToCart, removeItem, isInCart } = useContext(CartContext);
    const { addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useContext(WishlistContext);
    const { isAuthenticated } = useContext(AuthContext);
    
    const wishlistItem = isInWishlist(prod.id);
    const cartItem = isInCart(prod.id);

    const toggleCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (cartItem) {
            const result = await removeItem(cartItem.cart_id);
            if (result.success) {
                toast.success('Removed from cart');
            }
        } else {
            const result = await addToCart(prod.id, 1);
            if (result.success) {
                toast.success('Added to cart');
            } else {
                toast.error(result.error || 'Failed to add to cart');
            }
        }
    };
    
    const toggleWishlist = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to wishlist');
            navigate('/login');
            return;
        }

        if (wishlistItem) {
            const result = await removeFromWishlist(wishlistItem.wishlist_id);
            if (result.success) {
                toast.success('Removed from wishlist');
            }
        } else {
            const result = await addToWishlist(prod.id);
            if (result.success) {
                toast.success('Added to wishlist');
            } else {
                toast.error(result.error || 'Failed to add to wishlist');
            }
        }
    };


    return (
        <div className="card">
        <section className="wishlist-btn-container" onClick={toggleWishlist}>
            <IoHeartSharp
            className="wishlist-btn-icon"
            style={{
                fill: wishlistItem ? "red" : "none",
                strokeWidth: wishlistItem ? 0 : 40,
            }}
            />
        </section>

        <img src={prod.images[0]} alt={prod.title} className="prod-img" />

        <div className="prod-info">
            <section className="info-top">
            <div className="cate-rate">
                <p className="prod-cate">{prod.category.name}</p>
                <p className="prod-rate">
                <LiaStarSolid className="rating-star" />
                {prod.rating} ({prod.ratingAmount})
                </p>
            </div>
            <h3 className="prod-title">{prod.title}</h3>
            </section>

            <section className="info-bottom">
            <div className="price-btn">
                <p className="prod-price">${prod.price}</p>
                <button
                className="add-to-cart-btn"
                onClick={toggleCart}
                style={{ 
                    backgroundColor: cartItem ? "white" : "#1F1F21",
                    color: cartItem ? "red" : "white",
                    border: cartItem ? "2px solid red" : "none"
                }}
                >
                {cartItem ? "Remove Item" : "Add to Cart"}
                </button>
            </div>
            </section>
        </div>
        </div>
    );
};

export default ProductCard;
