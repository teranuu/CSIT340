import { useState } from 'react';
import styles from '../styles/catalogue.main.module.css';

function CatalogueToolbar({ onGenderChange, onSortChange }) {
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedSort, setSelectedSort] = useState('name');

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setSelectedGender(value);
    if (onGenderChange) {
      onGenderChange(value);
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSelectedSort(value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarControl}>
        <label className={styles.toolbarLabel}>Sort by</label>
        <select 
          className={styles.toolbarSelect} 
          value={selectedSort}
          onChange={handleSortChange}
        >
          <option value="name">Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <div className={styles.toolbarControl}>
        <label className={styles.toolbarLabel}>Gender / fit</label>
        <select 
          className={styles.toolbarSelect} 
          value={selectedGender}
          onChange={handleGenderChange}
        >
          <option value="all">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      <div className={styles.toolbarToggle}>
        <span className={styles.toggleLabel}>Only in Stock</span>
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className={styles.toggleCheckbox}
          />
          <span className={styles.toggleSlider}></span>
        </label>
      </div>
    </div>
  );
}

export default CatalogueToolbar;
