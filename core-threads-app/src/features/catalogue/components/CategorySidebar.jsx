import { useState, useMemo } from 'react';
import styles from '../styles/category.sidebar.module.css';
import { useFilterState, useFilterDispatch } from '../../../context/FilterContext';

function CategorySidebar() {
  const filterState = useFilterState();
  const filterDispatch = useFilterDispatch();
  const { priceMin, priceMax, color } = filterState;
  const PRICE_MAX = 1000;
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState({ price: true, color: true });

  const minPercent = Math.round((priceMin / PRICE_MAX) * 100);
  const maxPercent = Math.round((priceMax / PRICE_MAX) * 100);

  // visual background showing selected range between sliders (uses theme variable)
  const rangeBackground = `linear-gradient(to right, #d1d5db ${minPercent}%, var(--color-primary) ${minPercent}%, var(--color-primary) ${maxPercent}%, #d1d5db ${maxPercent}%)`;

  const handleClearFilters = () => {
    filterDispatch({ type: 'RESET_FILTERS' });
  };

  const categories = useMemo(() => [
    { name: 'All Products', count: 124 },
    { name: 'Hoodies', count: 24 },
    { name: 'Shirts', count: 36 },
    { name: 'Jackets', count: 12 },
    { name: 'Pants', count: 18 },
  ], []);

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
        <aside className={styles.categorySidebarWrapper}>
            <div className={styles.breadcrumb}>Dashboard / Catalog</div>
            <h1 className={styles.sidebarTitle}>Catalog</h1>

            <div className={styles.searchRow}>
              <input
                type="search"
                placeholder="Search categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                aria-label="Search categories"
              />
            </div>

            <nav>
              <ul className={styles.categoryList}>
                {filteredCategories.map(c => (
                  <li
                    key={c.name}
                    className={`${styles.categoryItem} ${filterState.category === c.name ? styles.active : ''}`}
                    onClick={() => filterDispatch({ type: 'SET_CATEGORY', payload: c.name })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') filterDispatch({ type: 'SET_CATEGORY', payload: c.name }); }}
                  >
                    <span className={styles.categoryLabel}>{c.name}</span>
                    <span className={styles.categoryBadge}>{c.count}</span>
                  </li>
                ))}
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
                  onChange={(e) => filterDispatch({ type: 'SET_PRICE_MIN', payload: Math.min(Number(e.target.value), priceMax) })}
                  className={styles.slider}
                  aria-label="Minimum price"
                  style={{ background: rangeBackground }}
                />
                <input
                  type="range"
                  min="0"
                  max={PRICE_MAX}
                  value={priceMax}
                  onChange={(e) => filterDispatch({ type: 'SET_PRICE_MAX', payload: Math.max(Number(e.target.value), priceMin) })}
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
                    onChange={(e) => filterDispatch({ type: 'SET_PRICE_MIN', payload: Math.min(Number(e.target.value || 0), priceMax) })}
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
                    onChange={(e) => filterDispatch({ type: 'SET_PRICE_MAX', payload: Math.max(Number(e.target.value || 0), priceMin) })}
                    className={styles.priceInput}
                    min="0"
                    max="1000"
                  />
                </div>
              </div>
            </div>

            <div className={styles.filterSection}>
              <label className={styles.filterTitle}>Color</label>
              <select value={color} onChange={(e) => filterDispatch({ type: 'SET_COLOR', payload: e.target.value })} className={styles.colorSelect}>
                <option value="All">All</option>
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