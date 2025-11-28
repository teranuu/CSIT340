import { useState } from 'react';
import styles from '../styles/catalogue.main.module.css';

function CatalogueToolbar() {
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarControl}>
        <label className={styles.toolbarLabel}>Sort by</label>
        <select className={styles.toolbarSelect} defaultValue="price">
          <option value="price">Price</option>
          <option value="name">Name</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className={styles.toolbarControl}>
        <label className={styles.toolbarLabel}>Gender / fit</label>
        <select className={styles.toolbarSelect} defaultValue="men">
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
