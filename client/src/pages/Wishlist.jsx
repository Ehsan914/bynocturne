import { useContext } from 'react';
import './wishlist.css';
import { WishlistContext } from '../context/WishlistContext.js';
import { CartContext } from '../context/CartContext';
import { IoHeartOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import WishlistCard from '../components/WishlistCard';
import { LuShoppingCart } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import toast from 'react-hot-toast';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, clearWishlist, loading } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const totalValue = wishlist.reduce(
    (total, item) => total + parseFloat(item.price),
    0
  );
  
  const showBorder = wishlist.length > 0;

  const handleAddAllToCart = async () => {
    let successCount = 0;
    for (const item of wishlist) {
      const result = await addToCart(item.product_id, 1);
      if (result.success) successCount++;
    }
    await clearWishlist();
    if (successCount > 0) {
      toast.success(`Added ${successCount} items to cart`);
    }
  };

  const handleClearWishlist = async () => {
    const result = await clearWishlist();
    if (result.success) {
      toast.success('Wishlist cleared');
    }
  };

  return (
    <div className="wishlist-page-container">
      <section
        className="wishlist-heading-container"
        style={
          showBorder
            ? { paddingBottom: "24px", borderBottom: "1px solid #d1d5db" }
            : {}
        }
      >
        <section className="wishlist-heading-upper">
          <section className="wishlist-heading-container-left" onClick={() => navigate(-1)}>
            <section className='wishlist-heading-icon'>
              <FaArrowLeft />
            </section>
            <section className="wishlist-heading-text-container">
              <h1 className='wishlist-heading'>My Wishlist</h1>
              <p className='wishlist-text'>{wishlist.length} items saved</p>
            </section>
          </section>
          <section className="wishlist-heading-container-right">
            <p className='total-text'>Total Value</p>
            <h2 className='total-value'>${totalValue.toFixed(2)}</h2>
          </section>
        </section>

        <section
          className="wishlist-heading-lower"
          style={showBorder ? { visibility: 'visible' } : { visibility: 'hidden' }}
        >
          <button className='wishlist-cart-btn' onClick={handleAddAllToCart}>
            <LuShoppingCart /> Add All to Cart
          </button>
          <button className='clear-wishlist-btn' onClick={handleClearWishlist}>
            <RiDeleteBinLine /> Clear Wishlist
          </button>
        </section>
      </section>

      <section className="wishlist-content">
        {
          loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              fontSize: '18px',
              color: '#6b7280'
            }}>
              Loading wishlist...
            </div>
          ) : wishlist.length > 0 ? (
            <ul className="wishlist-items">
              {wishlist.map((wishlistItem) => (
                <li key={wishlistItem.wishlist_id}>
                  <WishlistCard wishlistItem={wishlistItem} />
                </li>
              ))}
            </ul>
          ) : (
            <div className='empty-wishlist-display'>
              <IoHeartOutline className='empty-wishlist-icon' />
              <section className="empty-wishlist-text-container">
                <h2 className='empty-wishlist-heading'>Your wishlist is empty</h2>
                <p className='empty-wishlist-text'>Save items you love to your wishlist and never lose track of them.</p>
              </section>
              <button className='empty-wishlist-btn' onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
          )
        }
      </section>
    </div>
  );
};

export default Wishlist;
