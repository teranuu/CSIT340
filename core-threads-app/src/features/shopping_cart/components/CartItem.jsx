import { useState } from 'react';
import styles from '../styles/cart.item.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className={styles.cartItemWrapper}>
      {/* Image */}
      <div className={styles.imageContainer}>
        <div className={styles.imagePlaceholder}>
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af">No image</text></svg>'; }}
          />
        </div>
      </div>

      {/* Content */}
      <div className={styles.contentContainer}>
        {/* Header: Name and Trash */}
        <div className={styles.itemHeader}>
          <div className={styles.itemInfo}>
            <h4 className={styles.itemName}>{item.name}</h4>
            <p className={styles.itemCategory}>{item.category}</p>
          </div>
          <button className={styles.trashBtn} onClick={onRemove}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>

        {/* Body: Details */}
        <div className={styles.itemDetails}>
          <span className={styles.detailLabel}>Unit Price</span>
          <span className={styles.detailValue}>${item.price.toFixed(2)}</span>
        </div>

        {/* Footer: Quantity Controls */}
        <div className={styles.itemFooter}>
          <div className={styles.quantityGroup}>
            <span className={styles.qtyLabel}>Qty</span>
            <button
              className={styles.qtyBtn}
              onClick={() => onQuantityChange(-1)}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <input
              type="text"
              className={styles.qtyInput}
              value={item.quantity}
              readOnly
            />
            <button
              className={styles.qtyBtn}
              onClick={() => onQuantityChange(1)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;