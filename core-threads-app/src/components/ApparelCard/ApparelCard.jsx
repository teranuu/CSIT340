import styles from './apparel.card.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

const FALLBACK_IMG = 'https://via.placeholder.com/300x300?text=No+Image';

function ApparelCard({
  id,
  image,
  name,
  price,
  onClick,
  isHighlighted,
  imageHeight = '180px',
  gender,
  isSelected,
  onSelect,
  isWishlisted,
  onToggleWishlist,
}) {
  const navigate = useNavigate();
  const [src, setSrc] = useState(image || FALLBACK_IMG);

  useEffect(() => {
    setSrc(image || FALLBACK_IMG);
  }, [image]);

  const handleError = () => {
    // Gracefully fall back if the image fails to load
    setSrc(FALLBACK_IMG);
  };

  const handleCardClick = (e) => {
    // Don't trigger onClick if clicking checkbox
    if (e.target.type === 'checkbox') return;
    
    // Navigate to product page if ID is available and valid
    if (id) {
      // Validate ID to prevent directory traversal
      const safeId = String(id).replace(/[^0-9]/g, '');
      if (safeId && parseInt(safeId, 10) > 0) {
        navigate(`/dashboard/product/${safeId}`);
      }
    } else if (onClick) {
      onClick(e);
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) onToggleWishlist();
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect();
  };

  return (
    <div 
      className={`${styles.apparelItemCard} ${isHighlighted ? styles.highlighted : ''} ${isSelected ? styles.selected : ''}`}
      onClick={handleCardClick}
    >
      {onSelect && (
        <input 
          type="checkbox" 
          checked={isSelected || false}
          onChange={handleCheckboxChange}
          className={styles.selectCheckbox}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <div className={styles.apparelItemImageWrapper}>
        <img src={src} alt={name} loading="lazy" onError={handleError} style={{ height: imageHeight }} />
        {gender && (
          <div className={styles.genderBadge}>{gender}</div>
        )}
        {onToggleWishlist && (
          <button
            className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlistActive : ''}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleWishlistClick}
            type="button"
          >
            <FontAwesomeIcon icon={faHeartSolid} />
          </button>
        )}
      </div>
      <div className={styles.apparelItemDetails}>
        <span className={styles.apparelItemName}>{name}</span>
        <span className={styles.apparelItemPrice}>{price}</span>
      </div>
    </div>
  );
}

export default ApparelCard;