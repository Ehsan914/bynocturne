import { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { CategoryContext } from '../context/CategoryContext';

const Category = () => {
  const prod = useContext(ProductContext);
  const categories = useContext(CategoryContext);
  // Get unique category names
  const uniqueCategories = [
    ...new Set(prod.map((product) => product.category.name))
  ];

  const handleCategoryChange = (e) => {
    const {value, checked} = e.target;
    categories.setSelectedCategories( checked ? ((prev) => [...prev, value]) 
    : ((prev) => prev.filter((cat) => cat !== value)))
  }

  console.log(categories.selectedCategories)
  return (
    <div className="category">
      <div className="category-heading-container">
        <h3 className="category-heading">Category</h3>
        <button className='clear-category' onClick={() => categories.setSelectedCategories([])}>Clear All</button>
      </div>
      <form className='category-options'>
        {uniqueCategories.map((category) => (
          <section className="category-option" key={category}>
            <input type="checkbox" className='category-checkbox' 
            value={category} onChange={handleCategoryChange}
            checked={categories.selectedCategories.includes(category)}/>
            <p>{category}</p>
          </section>
        ))}
      </form>
    </div>
  )
}

export default Category