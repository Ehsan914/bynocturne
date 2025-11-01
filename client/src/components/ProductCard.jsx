import { useContext } from "react";
import { LiaStarSolid } from "react-icons/lia";
import { IoHeartSharp } from "react-icons/io5";
import { CountContext } from "../context/CountContext";

const ProductCard = ({ product }) => {
    const prod = product;
    const {
        wishlistItems = [],
        setWishlistItems = () => {},
        cartItems = [],
        addToCart = () => {},
    } = useContext(CountContext);

    const isWishlisted = wishlistItems.some(item => item.id === prod.id);
    const isInCart = cartItems.some(item => item.id === prod.id);

    const toggleCart = () => {
        addToCart(prod);
    };

    console.log(prod.ratingAmount);
    
    const toggleWishlist = () => {
        if (wishlistItems.some(item => item.id === prod.id)) {
            setWishlistItems(wishlistItems.filter(item => item.id !== prod.id));
        } else {
            setWishlistItems([...wishlistItems, prod]);
        }
    };


    return (
        <div className="card">
        <section className="wishlist-btn-container" onClick={toggleWishlist}>
            <IoHeartSharp
            className="wishlist-btn-icon"
            style={{
                fill: isWishlisted ? "red" : "none",
                strokeWidth: isWishlisted ? 0 : 40,
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
                style={{ backgroundColor: isInCart ? "#8B8B8D" : "#1F1F21" }}
                >
                {isInCart ? "Added" : "Add to Cart"}
                </button>
            </div>
            </section>
        </div>
        </div>
    );
};

export default ProductCard;
