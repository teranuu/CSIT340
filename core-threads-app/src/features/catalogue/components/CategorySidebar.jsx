import { useState } from 'react';
import styles from '../styles/category.sidebar.module.css';

function CategorySidebar() {
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);
  const [color, setColor] = useState('White');
  const PRICE_MAX = 1000;

  const minPercent = Math.round((priceMin / PRICE_MAX) * 100);
  const maxPercent = Math.round((priceMax / PRICE_MAX) * 100);

  // visual background showing selected range between sliders (uses theme variable)
  const rangeBackground = `linear-gradient(to right, #d1d5db ${minPercent}%, var(--color-primary) ${minPercent}%, var(--color-primary) ${maxPercent}%, #d1d5db ${maxPercent}%)`;

  const handleClearFilters = () => {
    setPriceMin(0);
    setPriceMax(500);
    setColor('White');
  };

    return (
        <>
        <aside className={styles.categorySidebarWrapper}>
            <div className={styles.breadcrumb}>Dashboard / Catalog</div>
            <h1 className={styles.sidebarTitle}>Catalog</h1>

            <nav>
              <ul className={styles.categoryList}>
                  <li className={styles.categoryItem}>All Products</li>
                  <li className={styles.categoryItem}>Hoodies</li>
                  <li className={styles.categoryItem}>Shirts</li>
                  <li className={styles.categoryItem}>Jackets</li>
                  <li className={styles.categoryItem}>Pants</li>
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
                  onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax))}
                  className={styles.slider}
                  aria-label="Minimum price"
                  style={{ background: rangeBackground }}
                />
                <input
                  type="range"
                  min="0"
                  max={PRICE_MAX}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin))}
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
                    onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax))}
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
                    onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin))}
                    className={styles.priceInput}
                    min="0"
                    max="1000"
                  />
                </div>
              </div>
            </div>

            <div className={styles.filterSection}>
              <label className={styles.filterTitle}>Color</label>
              <select value={color} onChange={(e) => setColor(e.target.value)} className={styles.colorSelect}>
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Navy">Navy</option>
                <option value="Red">Red</option>
              </select>
            </div>

            <button onClick={handleClearFilters} className={styles.clearButton}>
              Clear Filters
            </button>

        </aside>
        </>
    );
}

export default CategorySidebar;