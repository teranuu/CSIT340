import styles from './apparel.card.module.css';

function ApparelCard({ image, name, price }) {
  return (

    <>
        

            <div className={styles.apparelItemCard}>
                    <div className={styles.apparelItemImageWrapper} >
                        <img src={image} alt={name} />
                        <div className={styles.apparelItemDetails}>
                        <span className={styles.apparelItemName}>{name}</span>
                        <span className={styles.apparelItemPrice}>{price}</span>
                    </div>
                    </div>
            </div>

    
    </>
    
  );
}

export default ApparelCard;