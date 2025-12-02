import { useState } from 'react';
import styles from '../styles/product.section.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

function ProductSection() {
  const [quantity, setQuantity] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  const product = {
    title: 'Casual T-Shirt - Basic Black',
    price: 500.00,
    stock: 3,
    description: 'Elevate your everyday wardrobe with our Classic Casual Black Shirt. Crafted from soft, breathable fabric, this versatile shirt offers all-day comfort and a sleek, timeless look. Whether you\'re dressing up for a night out or keeping it relaxed for the weekend, this shirt pairs effortlessly with any outfit.',
    specs: [
      'Material: 100% cotton for breathability and comfort',
      'Fit: Regular fit for a flattering silhouette',
      'Color: Deep black that stays vibrant wash after wash',
      'Details: Minimalist design with a clean neckline and subtle stitching',
      'Care: Machine washable and easy to maintain'
    ],
    images: ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg']
  };

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(0, quantity + delta));
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className={styles.productSection}>
      <div className={styles.container}>
        {/* Left: Image Gallery */}
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            <img src={product.images[0]} alt={product.title} />
          </div>
          <div className={styles.thumbnailRow}>
            {product.images.map((img, idx) => (
              <div key={idx} className={styles.thumbnail}>
                <img src={img} alt={`View ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className={styles.productInfo}>
          {/* Header with title and favorite */}
          <div className={styles.header}>
            <h1 className={styles.title}>{product.title}</h1>
            <button className={styles.favoriteBtn} onClick={toggleFavorite}>
              <FontAwesomeIcon 
                icon={isFavorited ? faHeartSolid : faHeartRegular} 
                size="lg"
              />
            </button>
          </div>

          {/* Price and Stock */}
          <div className={styles.priceRow}>
            <span className={styles.price}>₱ {product.price.toFixed(2)}</span>
            <span className={styles.stock}>Stock: In-Stock ({product.stock})</span>
          </div>

          {/* Size and Color Dropdowns */}
          <div className={styles.selectorsRow}>
            <select 
              className={styles.selector}
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option>Size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>

            <select 
              className={styles.selector}
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option>Color</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Grey">Grey</option>
              <option value="Navy">Navy</option>
            </select>
          </div>

          {/* Description */}
          <p className={styles.description}>{product.description}</p>

          {/* Specs List */}
          <ul className={styles.specsList}>
            {product.specs.map((spec, idx) => (
              <li key={idx}>{spec}</li>
            ))}
          </ul>

          {/* Quantity and Add to Cart */}
          <div className={styles.actionRow}>
            <div className={styles.quantityControl}>
              <span className={styles.label}>Quantity:</span>
              <button 
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange(-1)}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <input 
                type="text" 
                className={styles.quantityInput}
                value={quantity}
                readOnly
              />
              <button 
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange(1)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

            <button className={styles.addToCartBtn}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSection;