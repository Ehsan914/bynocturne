import { useContext } from "react";
import { CountContext } from "../context/CountContext";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuShoppingCart } from "react-icons/lu";
import './wishlistcard.css';

const WishlistCard = ({ wishlistItem }) => {
  const {
    setWishlistItems,
    wishlistItems,
    addToCart,
    cartItems,
  } = useContext(CountContext);

  const removeFromWishlist = () => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== wishlistItem.id);
    setWishlistItems(updatedWishlist);
  };

  const handleAddToCart = () => {
    // Add to cart with quantity = 1 if not already in cart
    const alreadyInCart = cartItems.some(item => item.id === wishlistItem.id);
    if (!alreadyInCart) {
      addToCart({ ...wishlistItem, quantity: 1 });
    }

    // Remove from wishlist after adding to cart
    removeFromWishlist();
  };

  return (
    <div className="wishlist-item">
      <section className="wishlist-img-container">
        <img src={wishlistItem.images[0]} alt="" className="wishlist-item-image" />
      </section>

      <section className="wishlist-item-desc">
        <div className="upper">
          <div className="upper-left">
            <div className="category-container">
              <p className="wishlist-item-category">
                {wishlistItem.category.name}
              </p>
            </div>
            <h1 className="wishlist-item-title">
              {wishlistItem.title}
            </h1>
          </div>
          <div className="upper-right">
            <RiDeleteBinLine
              className="wishlist-item-delete"
              onClick={removeFromWishlist}
            />
          </div>
        </div>

        <div className="lower">
          <div className="lower-left">
            <h1 className="wishlist-item-price">${wishlistItem.price}</h1>
          </div>
          <div className="lower-right">
            <button className="wishlist-card-cart-btn" onClick={handleAddToCart}>
              <LuShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WishlistCard;
