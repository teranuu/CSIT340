import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/product.section.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL, getImageUrl } from '../../../config/api.js';

function ProductSection({ productId }) {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  // Default product if no ID is provided
  const defaultProduct = {
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

  // Fetch product data if ID is provided
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          setProduct(defaultProduct);
          setLoading(false);
          return;
        }

        // Additional validation: ensure productId is a safe integer
        const safeId = String(productId).replace(/[^0-9]/g, '');
        if (!safeId || parseInt(safeId, 10) <= 0) {
          console.error('Invalid product ID detected');
          setProduct(defaultProduct);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/products/${safeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        
        // Transform the API response to match our expected structure
        const transformedProduct = {
          id: data.id,
          title: data.name || data.title,
          price: data.price || 0,
          stock: data.stock || 0,
          description: data.description || '',
          specs: data.specs || [],
          images: data.images ? data.images.map(img => getImageUrl(img)) : ['/img1.jpg'],
          category: data.category || 'Apparel',
          gender: data.gender || 'Unisex'
        };
        
        setProduct(transformedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(defaultProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(0, quantity + delta));
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      alert('Please select a quantity');
      return;
    }

    if (!product) {
      alert('Product data not available');
      return;
    }

    // Get existing cart items from sessionStorage
    const existingCart = sessionStorage.getItem('cart_items');
    const cartItems = existingCart ? JSON.parse(existingCart) : [];

    // Create new cart item with selected options
    const newCartItem = {
      id: product.id || Date.now(),
      uniqueKey: Date.now().toString(),
      title: product.title,
      price: `₱ ${product.price.toFixed(2)}`,
      quantity: quantity,
      image: product.images && product.images.length > 0 ? product.images[0] : '/img1.jpg',
      category: product.category || 'Apparel',
      size: selectedSize,
      color: selectedColor,
      stock: product.stock
    };

    // Add new item to cart
    cartItems.push(newCartItem);

    // Save updated cart to sessionStorage
    sessionStorage.setItem('cart_items', JSON.stringify(cartItems));

    // Redirect to cart page
    navigate('/dashboard/cart');
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading product...</div>;
  }

  if (!product) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Product not found</div>;
  }

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

            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSection;