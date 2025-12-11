import { useMemo } from "react";
import styles from "../styles/wishlist.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

import { useCartState, useCartDispatch } from '../../../context/CartContext';

function WishlistSection() {
  const { wishlist } = useCartState();
  const dispatch = useCartDispatch();
  const items = wishlist;
  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0), 0), [items]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContainer}>
        {/* LEFT COLUMN – Wishlist items */}
        <section className={styles.leftSection}>
          <header className={styles.wishlistHeader}>
            <div className={styles.headerRow}>
              <div className={styles.titleBlock}>
                <div className={styles.iconBadge}>
                  <FontAwesomeIcon icon={faHeart} className={styles.iconHeart} />
                </div>
                <div>
                  <h1 className={styles.wishlistTitle}>My Wishlist</h1>
                  <p className={styles.wishlistSubtitle}>
                    {items.length} item{items.length !== 1 && "s"} saved for
                    later
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.wishlistList}>
            {items.map((item) => (
              <article key={item.id} className={styles.wishlistItem}>
                {/* Remove */}
                <button
                  className={styles.removeBtn}
                  aria-label={`Remove ${item.name} from wishlist`}
                  onClick={() => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: item.id })}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>

                {/* Image */}
                <div className={styles.itemImageWrapper}>
                  <div className={styles.itemImagePlaceholder}>
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af">No image</text></svg>'; }}
                    />
                  </div>
                </div>

                {/* Name + variant */}
                <div className={styles.itemInfo}>
                  <h2 className={styles.itemName}>{item.name}</h2>
                  <p className={styles.itemVariant}>{item.variant}</p>
                </div>

                {/* Price */}
                <div className={styles.itemPrice}>
                  ₱{item.price.toLocaleString()}
                </div>

                {/* Status */}
                <div className={styles.itemStatus}>
                  <span
                    className={`${styles.statusPill} ${
                      item.inStock ? styles.inStock : styles.outOfStock
                    }`}
                  >
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Action */}
                <div className={styles.itemAction}>
                  <button
                    className={`${styles.addBtn} ${!item.inStock ? styles.addBtnDisabled : ""}`}
                    disabled={!item.inStock}
                    onClick={() => {
                      dispatch({ type: 'ADD_TO_CART', payload: { id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 } });
                      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: item.id });
                    }}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span>
                      {item.inStock ? "Move to Cart" : "Unavailable"}
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default WishlistSection;
