import { useContext } from 'react';
import './wishlist.css';
import { CountContext } from '../context/CountContext';
import { IoHeartOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import WishlistCard from '../components/WishlistCard';
import { LuShoppingCart } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";

const Wishlist = () => {
  const navigate = useNavigate();
  const {
    wishlistItems = [],
    setWishlistItems,
    addToCart,
  } = useContext(CountContext);

  const totalValue = wishlistItems.reduce(
    (total, item) => total + item.price,
    0
  );
  
  //something is done here

  const showBorder = wishlistItems.length > 0;

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart({ ...item, quantity: 1 });
    });

    setWishlistItems([]);
  };


  const handleClearWishlist = () => {
    setWishlistItems([]);
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
          <section className="wishlist-heading-container-left">
            <section className='wishlist-heading-icon'>
              <FaArrowLeft onClick={() => navigate(-1)} />
            </section>
            <section className="wishlist-heading-text-container">
              <h1 className='wishlist-heading'>My Wishlist</h1>
              <p className='wishlist-text'>{wishlistItems.length} items saved</p>
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
          wishlistItems.length > 0 ? (
            <ul className="wishlist-items">
              {wishlistItems.map((wishlistItem) => (
                <li key={wishlistItem.id}>
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
