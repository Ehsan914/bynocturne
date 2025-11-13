import { useState, useContext, useEffect } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { getAllCategories } from '../api/categoryAPI';

const Category = () => {
  const categories = useContext(CategoryContext);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  
  useEffect(() => {
    getAllCategories()
      .then(res => {
        setFetchedCategories(res.data);
      });
  }, []);
  

  const handleCategoryChange = (e) => {
    const {value, checked} = e.target;
    categories.setSelectedCategories( checked ? ((prev) => [...prev, value]) 
    : ((prev) => prev.filter((cat) => cat !== value)))
  }

  return (
    <div className="category">
      <div className="category-heading-container">
        <h3 className="category-heading">Category</h3>
        <button className='clear-category' onClick={() => categories.setSelectedCategories([])}>Clear All</button>
      </div>
      <form className='category-options'>
        {fetchedCategories.map((category) => (
          <section className="category-option" key={category.id}>
            <input type="checkbox" className='category-checkbox' 
            value={category.name} onChange={handleCategoryChange}
            checked={categories.selectedCategories.includes(category.name)}/>
            <p>{category.name}</p>
          </section>
        ))}
      </form>
    </div>
  )
}

export default Category