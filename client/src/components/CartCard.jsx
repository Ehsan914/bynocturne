import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { RiDeleteBinLine } from "react-icons/ri";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import toast from 'react-hot-toast';
import './cartcard.css'


const CartCard = ({cartItem}) => {
    const { updateQuantity, removeItem } = useContext(CartContext);

    const handleRemove = async () => {
        const result = await removeItem(cartItem.cart_id);
        if (result.success) {
            toast.success('Item removed from cart');
        }
    };

    const handleUpdateQuantity = async (newQuantity) => {
        if (newQuantity < 1) {
            handleRemove();
            return;
        }
        const result = await updateQuantity(cartItem.cart_id, newQuantity);
        if (result.success) {
            toast.success('Quantity updated');
        }
    };
    
    // Handle image - it's an array from the API
    const imageUrl = Array.isArray(cartItem.image) ? cartItem.image[0] : cartItem.image;
    
    return (
        <div className="cart-item">
            <section className="cart-img-container">
                <img src={imageUrl} alt={cartItem.name} className="cart-item-image" />
            </section>
            <section className="cart-item-desc">
                <div className="upper">
                    <div className="upper-left">
                        <div className="category-container">
                            <p className="cart-item-category">
                                Product
                            </p>
                        </div>
                        <h1 className="cart-item-title">
                            {cartItem.name}
                        </h1>
                    </div>
                    <div className="upper-right">
                        <RiDeleteBinLine className="cart-item-delete"
                        onClick={handleRemove}/>
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
                        onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}/>
                        <div className="cart-item-quantity">
                            <p>{cartItem.quantity}</p>
                        </div>
                        <FaPlus className="item-addition"
                        onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}/>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CartCard