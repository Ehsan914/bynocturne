import { useContext } from "react";
import { PriceContext } from "../context/PriceContext";

const PriceRange = () => {
  const { minPrice, setMinPrice, maxPrice, setMaxPrice } = useContext(PriceContext);
  const min = 0;
  const max = 1000;
  const step = 10;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - step);
    setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + step);
    setMaxPrice(value);
  };

  const handleMinInput = (e) => {
    const value = Math.max(min, Math.min(Number(e.target.value), maxPrice - step));
    setMinPrice(value);
  };

  const handleMaxInput = (e) => {
    const value = Math.min(max, Math.max(Number(e.target.value), minPrice + step));
    setMaxPrice(value);
  };

  return (
    <div className="price-range-container">
      <h4 className="price-range-title">Price Range</h4>
      
      <div className="slider-wrapper">
        <div className="slider-container">
          {/* Range highlight */}
          <div
            className="range-highlight"
            style={{
              left: `${((minPrice - min) / (max - min)) * 100}%`,
              width: `${((maxPrice - minPrice) / (max - min)) * 100}%`,
            }}
          />
          
          {/* Min range slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minPrice}
            onChange={handleMinChange}
            className="range-slider range-slider-min"
          />
          
          {/* Max range slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxPrice}
            onChange={handleMaxChange}
            className="range-slider range-slider-max"
          />
        </div>
        
        {/* Price labels */}
        <div className="price-labels">
          <span className="price-label">${minPrice}</span>
          <span className="price-label">${maxPrice}</span>
        </div>
        
        {/* Manual input fields */}
        <div className="price-inputs">
          <div className="input-group">
            <label className="input-label">Min:</label>
            <input
              type="number"
              value={minPrice}
              onChange={handleMinInput}
              min={min}
              max={maxPrice - step}
              className="price-input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Max:</label>
            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxInput}
              min={minPrice + step}
              max={max}
              className="price-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;