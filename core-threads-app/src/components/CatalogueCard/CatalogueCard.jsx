import { Link } from 'react-router-dom';
import styles from './catalogue.card.module.css';

function CatalogueCard({ id, title, price, imageUrl }) {
  return (
    <Link to={`/product/${id}`} className={styles.link}>
      <div className={styles.catalogueCardWrapper}>
        <div className={styles.imageSection}>
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%239ca3af">Image unavailable</text></svg>'; }}
          />
        </div>

        <div className={styles.detailSection}>
          <p className={styles.title}>{title}</p>
          <p className={styles.price}>${price}</p>
        </div>
      </div>
    </Link>
  );
}

export default CatalogueCard;