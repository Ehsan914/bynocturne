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
import { IoSearch } from "react-icons/io5";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllProducts().then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading products:', err);
      setLoading(false);
    });
  }, []);

  // Search filter
  const searchFilteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Category filter
  const categoryFilteredProducts = selectedCategories.length === 0
    ? searchFilteredProducts
    : searchFilteredProducts.filter((product) =>
        selectedCategories.includes(product.category.name)
      );

  // Price filter
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

          {/* Search Bar */}
          <div className="search-container">
            <IoSearch size={20} color="#6b7280" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="search-clear-btn"
              >
                Clear
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="loading-state-container">
              Loading products...
            </div>
          ) : priceFilteredProducts.length === 0 ? (
            <div className="empty-state-container">
              <p className="empty-state-text">No products found</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                  setMinPrice(0);
                  setMaxPrice(5000);
                }}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: '#000',
                  color: '#fff',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
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
          )}
        </section>
      </div>
      
    </div>
  )
}

export default Home


