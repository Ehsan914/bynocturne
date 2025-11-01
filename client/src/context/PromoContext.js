import React, { createContext } from "react";

export const PromoContext = createContext({
    promoCode: "SAVE10",
    promoDiscount: 10,
    applyPromo: () => {
    },
});