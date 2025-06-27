import { useContext, useState } from "react";
import { PromoContext } from "../context/PromoContext";
import './promo.css'

const Promo = () => {
  const { promoCode, promoDiscount, applyPromo, promoUsed } = useContext(PromoContext);
  const [inputCode, setInputCode] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    applyPromo(inputCode.trim());
  };

  return (
    <div className="promo-container">
      <h1>Promo Code</h1>
      <section className="lower-promo-desc">
        <form onSubmit={handleSubmit} className="promo-code-form">
          <input
            type="text"
            className="promo-input"
            placeholder="Enter promo code"
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              if (formSubmitted) setFormSubmitted(false); // reset warning while typing
            }}
          />
          <button type="submit" className="apply-btn" disabled={promoUsed}>
            {promoUsed ? "Applied" : "Apply"}
          </button>
        </form>
        <p
        style={{
            color: "red",
            fontSize: "12px",
            padding: '3px 0px',
            visibility: formSubmitted && inputCode.trim() === "" ? "visible" : "hidden"
        }}>
            No promo code applied
        </p>


        <div className="promo-det">
            <p>
                Try <strong>{promoCode}</strong> for {promoDiscount}% off
            </p>
        </div>
      </section>
    </div>
  );
};

export default Promo;
