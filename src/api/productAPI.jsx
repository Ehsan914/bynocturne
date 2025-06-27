import axios from "axios";

const inStance = axios.create({
    baseURL: "https://api.escuelajs.co/api/v1",
});

export const getAllProducts = () => inStance.get('/products');