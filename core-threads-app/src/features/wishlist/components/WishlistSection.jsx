import { useEffect, useMemo, useState } from "react";
import styles from "../styles/wishlist.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { getImageUrl } from "../../../config/api";

const WISHLIST_STORAGE_KEY = "wishlist_items";
const FALLBACK_IMG = "https://via.placeholder.com/300x300?text=No+Image";

function WishlistSection() {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Unable to read wishlist from storage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Unable to persist wishlist", e);
    }
  }, [items]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (item.price ?? 0), 0),
    [items]
  );

  const handleRemove = (id, key) => {
    setItems((prev) => prev.filter((item) => {
      if (key) return String(item.key) !== String(key);
      return String(item.id) !== String(id);
    }));
  };

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

          {items.length === 0 ? (
            <div className={styles.wishlistList} style={{ padding: "24px", textAlign: "center", color: "#666" }}>
              No items in your wishlist yet. Add favorites from the catalog.
            </div>
          ) : (
            <div className={styles.wishlistList}>
              {items.map((item) => (
                <article key={item.id} className={styles.wishlistItem}>
                  {/* Remove */}
                  <button
                    className={styles.removeBtn}
                    aria-label={`Remove ${item.name} from wishlist`}
                    onClick={() => handleRemove(item.id, item.key)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>

                  {/* Image */}
                  <div className={styles.itemImageWrapper}>
                    <div className={styles.itemImagePlaceholder}>
                      <img src={getImageUrl(item.imageUrl) || FALLBACK_IMG} alt={item.name} />
                    </div>
                  </div>

                  {/* Name + variant */}
                  <div className={styles.itemInfo}>
                    <h2 className={styles.itemName}>{item.name}</h2>
                    <p className={styles.itemVariant}>
                      {item.category ? `${item.category}` : '—'}
                      {item.color ? ` • ${item.color}` : ''}
                      {item.size ? ` • Size ${item.size}` : ''}
                    </p>
                  </div>

                  {/* Price */}
                  <div className={styles.itemPrice}>
                    ${(item.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  {/* Status */}
                  <div className={styles.itemStatus}>
                    <span className={`${styles.statusPill} ${styles.inStock}`}>
                      In Stock
                    </span>
                  </div>

                  {/* Action */}
                  <div className={styles.itemAction}>
                    <button className={styles.addBtn}>
                      <FontAwesomeIcon icon={faShoppingCart} />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default WishlistSection;
