import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext.js";
import { CartContext } from "../context/CartContext";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuShoppingCart } from "react-icons/lu";
import toast from 'react-hot-toast';
import './wishlistcard.css';

const WishlistCard = ({ wishlistItem }) => {
  const { removeItem } = useContext(WishlistContext);
  const { addToCart, isInCart } = useContext(CartContext);

  const removeFromWishlist = async () => {
    const result = await removeItem(wishlistItem.wishlist_id);
    if (result.success) {
      toast.success('Removed from wishlist');
    }
  };

  const handleAddToCart = async () => {
    // Add to cart with quantity = 1 if not already in cart
    const alreadyInCart = isInCart(wishlistItem.product_id);
    if (!alreadyInCart) {
      const result = await addToCart(wishlistItem.product_id, 1);
      if (result.success) {
        toast.success('Added to cart');
      }
    } else {
      toast.info('Item already in cart');
    }

    // Remove from wishlist after adding to cart
    await removeFromWishlist();
  };

  // Handle image - it's an array from the API
  const imageUrl = Array.isArray(wishlistItem.image) ? wishlistItem.image[0] : wishlistItem.image;

  return (
    <div className="wishlist-item">
      <section className="wishlist-img-container">
        <img src={imageUrl} alt={wishlistItem.name} className="wishlist-item-image" />
      </section>

      <section className="wishlist-item-desc">
        <div className="upper">
          <div className="upper-left">
            <div className="category-container">
              <p className="wishlist-item-category">
                {wishlistItem.category || 'Product'}
              </p>
            </div>
            <h1 className="wishlist-item-title">
              {wishlistItem.name}
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
