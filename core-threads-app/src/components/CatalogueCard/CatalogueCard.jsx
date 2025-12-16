import styles from './catalogue.card.module.css';

function CatalogueCard({ title, price, imageUrl, isHighlighted }) {
  return (
    <div className={`${styles.catalogueCardWrapper} ${isHighlighted ? styles.highlighted : ''}`}>
      <div className={styles.imageSection}>
        <img src={imageUrl} alt={title} />
      </div>

      <div className={styles.detailSection}>
        <p className={styles.title}>{title}</p>
        <p className={styles.price}>${price}</p>
      </div>
    </div>
  );
}

export default CatalogueCard;