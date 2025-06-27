import { useContext } from "react"
import { CountContext } from "../context/CountContext"
import { RiDeleteBinLine } from "react-icons/ri";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import './cartcard.css'


const CartCard = ({cartItem}) => {
    const {
        increaseQty,
        decreaseQty,
        removeFromCart,
    } = useContext(CountContext);

    console.log(cartItem.quantity);
    return (
        <div className="cart-item">
            <section className="cart-img-container">
                <img src={cartItem.images[0]} alt="" className="cart-item-image" />
            </section>
            <section className="cart-item-desc">
                <div className="upper">
                    <div className="upper-left">
                        <div className="category-container">
                            <p className="cart-item-category">
                                {cartItem.category.name}
                            </p>
                        </div>
                        <h1 className="cart-item-title">
                            {cartItem.title}
                        </h1>
                    </div>
                    <div className="upper-right">
                        <RiDeleteBinLine className="cart-item-delete"
                        onClick={() => removeFromCart(cartItem.id)}/>
                    </div>
                </div>
                <div className="lower">
                    <div className="lower-left">
                        <h1 className="cart-item-price">
                            ${cartItem.price}
                        </h1>
                    </div>
                    <div className="lower-right">
                        <FaMinus className="item-deduction"
                        onClick={() => decreaseQty(cartItem.id)}/>
                        <div className="cart-item-quantity">
                            <p>{cartItem.quantity}</p>
                        </div>
                        <FaPlus className="item-addition"
                        onClick={() => increaseQty(cartItem.id)}/>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CartCard