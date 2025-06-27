import React, { useState } from "react";
import { PromoContext } from "./PromoContext";

export const PromoProvider = ({ children }) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState();
  const [promoUsed, setPromoUsed] = useState(false);

  const applyPromo = (code) => {
    if (promoUsed) {
      return;
    }

    if (code === "SAVE10") {
      setPromoCode(code);
      setPromoDiscount(10);
      setPromoUsed(true);
    } else {
      setPromoCode("");
      setPromoDiscount(0);
      setPromoUsed(false);
    }
  };

  return (
    <PromoContext.Provider
      value={{ promoCode, promoDiscount, promoUsed, applyPromo }}
    >
      {children}
    </PromoContext.Provider>
  );
};
