import { useState, useEffect } from 'react';
import styles from '../styles/category.sidebar.module.css';

function CategorySidebar({ initialCategory, onCategoryChange, onPriceRangeChange }) {
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All Products');
  const PRICE_MAX = 1000;

  // Sync activeCategory when initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const minPercent = Math.round((priceMin / PRICE_MAX) * 100);
  const maxPercent = Math.round((priceMax / PRICE_MAX) * 100);

  // visual background showing selected range between sliders (uses theme variable)
  const rangeBackground = `linear-gradient(to right, #d1d5db ${minPercent}%, var(--color-primary) ${minPercent}%, var(--color-primary) ${maxPercent}%, #d1d5db ${maxPercent}%)`;

  const handleClearFilters = () => {
    setPriceMin(0);
    setPriceMax(500);
    setActiveCategory('All Products');
    if (onCategoryChange) onCategoryChange('All Products');
    if (onPriceRangeChange) onPriceRangeChange({ min: 0, max: 500 });
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const handlePriceChange = (min, max) => {
    if (onPriceRangeChange) {
      onPriceRangeChange({ min, max });
    }
  };

    return (
        <>
        <aside className={styles.categorySidebarWrapper}>
            <div className={styles.breadcrumb}>Dashboard / Catalog</div>
            <h1 className={styles.sidebarTitle}>Catalog</h1>

            <nav>
              <ul className={styles.categoryList}>
                  <li 
                    className={`${styles.categoryItem} ${activeCategory === 'All Products' ? styles.active : ''}`}
                    onClick={() => handleCategoryClick('All Products')}
                  >
                    All Products
                  </li>
                  <li 
                    className={`${styles.categoryItem} ${activeCategory === 'Hoodies' ? styles.active : ''}`}
                    onClick={() => handleCategoryClick('Hoodies')}
                  >
                    Hoodies
                  </li>
                  <li 
                    className={`${styles.categoryItem} ${activeCategory === 'Shirts' ? styles.active : ''}`}
                    onClick={() => handleCategoryClick('Shirts')}
                  >
                    Shirts
                  </li>
                  <li 
                    className={`${styles.categoryItem} ${activeCategory === 'Pants' ? styles.active : ''}`}
                    onClick={() => handleCategoryClick('Pants')}
                  >
                    Pants
                  </li>
                  <li 
                    className={`${styles.categoryItem} ${activeCategory === 'Kicks' ? styles.active : ''}`}
                    onClick={() => handleCategoryClick('Kicks')}
                  >
                    Kicks
                  </li>
              </ul>
            </nav>

            <hr className={styles.divider} />

            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Price Range</h3>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max={PRICE_MAX}
                  value={priceMin}
                  onChange={(e) => {
                    const newMin = Math.min(Number(e.target.value), priceMax);
                    setPriceMin(newMin);
                    handlePriceChange(newMin, priceMax);
                  }}
                  className={styles.slider}
                  aria-label="Minimum price"
                  style={{ background: rangeBackground }}
                />
                <input
                  type="range"
                  min="0"
                  max={PRICE_MAX}
                  value={priceMax}
                  onChange={(e) => {
                    const newMax = Math.max(Number(e.target.value), priceMin);
                    setPriceMax(newMax);
                    handlePriceChange(priceMin, newMax);
                  }}
                  className={styles.slider}
                  aria-label="Maximum price"
                  style={{ background: rangeBackground }}
                />
              </div>
              <div className={styles.priceInputRow}>
                <div className={styles.priceInputWrapper}>
                  <span className={styles.dollarSign}>$</span>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => {
                      const newMin = Math.min(Number(e.target.value), priceMax);
                      setPriceMin(newMin);
                      handlePriceChange(newMin, priceMax);
                    }}
                    className={styles.priceInput}
                    min="0"
                    max="1000"
                  />
                </div>
                <span className={styles.inputSeparator}>to</span>
                <div className={styles.priceInputWrapper}>
                  <span className={styles.dollarSign}>$</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => {
                      const newMax = Math.max(Number(e.target.value), priceMin);
                      setPriceMax(newMax);
                      handlePriceChange(priceMin, newMax);
                    }}
                    className={styles.priceInput}
                    min="0"
                    max="1000"
                  />
                </div>
              </div>
            </div>

        </aside>
        </>
    );
}

export default CategorySidebar;