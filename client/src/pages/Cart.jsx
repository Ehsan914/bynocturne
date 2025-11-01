import { useContext } from 'react';
import './cart.css'
import { CountContext } from '../context/CountContext'
import CartCard from '../components/CartCard'
import { LuShoppingBag } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Promo from '../components/Promo';
import Billing from '../components/Billing';

const Cart = () => {
  const navigate = useNavigate();
  const {
      cartItems = []
  } = useContext(CountContext);

  return (
    <div className="cart-page-container">
      <section className="cart-heading-container">
        <section className='cart-heading-icon'>
          <FaArrowLeft />
        </section>
        <section className="cart-heading-text-container">
          <h1 className='cart-heading'>Shopping Cart</h1>
          <p className='cart-text'>{cartItems.length} items in your cart</p>
        </section>
      </section>
  <section
    className="cart-content"
    style={
      cartItems.length > 0
        ? { display: "flex", marginBottom: "150px", justifyContent: "space-between" }
        : { marginBottom: "150px" }
    }
  >
        {cartItems.length > 0 ? (
          <>
            <ul className="cart-items">
              {cartItems.map((cartItem) => (
                <li key={cartItem.id}>
                  <CartCard cartItem={cartItem} />
                </li>
              ))}
            </ul>
            <section className='promo-billing'>
              <Promo />
              <Billing />
            </section>
          </>
        ) : (
          <div className='empty-cart-display'>
            <LuShoppingBag className='empty-cart-icon' />
            <section className="empty-cart-text-container">
              <h2 className='empty-cart-heading'>Your cart is empty</h2>
              <p className='empty-cart-text'>Add some shoes to your cart to get started.</p>
            </section>
            <button className='empty-cart-btn' onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        )}
      </section>
    </div>
  )
}

export default Cart

