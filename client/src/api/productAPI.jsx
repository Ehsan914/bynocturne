import axios from "axios";

const inStance = axios.create({
    baseURL: "http://localhost:5000/api/",
});

export const getAllProducts = () => inStance.get('/products');