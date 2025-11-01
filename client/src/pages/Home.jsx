import { useEffect, useState } from "react";
import { getAllProducts } from '../api/productAPI';
import ProductCard from "../components/ProductCard";
import "../index.css"
import Category from "../components/Category";
import PriceRange from "../components/PriceRange";
import { CountContext } from "../context/CountContext";
import { ProductContext } from "../context/ProductContext"
import { CategoryContext } from "../context/CategoryContext";
import { PriceContext } from "../context/PriceContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    getAllProducts().then(res => {
      setProducts(res.data);
    });
  }, []);

  const categoryFilteredProducts = selectedCategories.length === 0
    ? products
    : products.filter((product) =>
        selectedCategories.includes(product.category.name)
      );

  const priceFilteredProducts = categoryFilteredProducts.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );

  return (
    <div className="home-container">
      <div className="content-container">
        <section className="filter">
          <section className="filter-heading-container">
            <h2 className="filter-heading">Filters</h2>
            <button className='clear-filters' 
            onClick={() => (setMaxPrice(5000), setMinPrice(0)
            , setSelectedCategories([]))}>Clear Filters</button>
          </section>
          <ProductContext.Provider value={products}>
            <CategoryContext.Provider value={{selectedCategories, setSelectedCategories}}>
              <Category />
            </CategoryContext.Provider>
            <PriceContext.Provider value={{minPrice, setMinPrice, maxPrice, setMaxPrice}}>
              <PriceRange />
            </PriceContext.Provider>
          </ProductContext.Provider>
        </section>
        
        <section className="prod-sec">
          <section className="prod-sec-heading">
            <h1>All Products</h1>
            <p className="prod-count">({priceFilteredProducts.length} Results)</p>
          </section>
          <ul className="prod-list">
            {priceFilteredProducts.map((prod) => {
              return (
                <li key={prod.id}>
                  <ProductCard
                    product={prod}
                    rating={prod.rating}
                    ratingAmount={prod.ratingAmount}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      
    </div>
  )
}

export default Home


