import { useMemo } from "react";
import styles from "../styles/wishlist.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";


const WISHLIST_ITEMS = [
  {
    id: 1,
    name: "Oversized Hoodie",
    price: 2500,
    inStock: true,
    image: "/images/hoodie-charcoal.jpg",
  },
  {
    id: 2,
    name: "Premium Tee",
    price: 1200,
    inStock: true,
    image: "/images/tee-obsidian.jpg",
  },
  {
    id: 3,
    name: "Cargo Pants",
    price: 3500,
    inStock: false,
    image: "/images/cargo-tactical.jpg",
  },
  {
    id: 4,
    name: "Retro Kicks",
    price: 8999,
    inStock: true,
    image: "/images/retro-kicks.jpg",
  },
];

function WishlistSection() {
  const items = WISHLIST_ITEMS;
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );

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
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>

                {/* Image */}
                <div className={styles.itemImageWrapper}>
                  <div className={styles.itemImagePlaceholder}>
                    <img src={item.image} alt={item.name} />
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
                    className={`${styles.addBtn} ${
                      !item.inStock ? styles.addBtnDisabled : ""
                    }`}
                    disabled={!item.inStock}
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
