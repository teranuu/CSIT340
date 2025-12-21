import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/product.section.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faPlus, faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../../../config/api.js';

const WISHLIST_STORAGE_KEY = 'wishlist_items';

function ProductSection({ productId }) {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [availableColors, setAvailableColors] = useState([]);
  const [colorImages, setColorImages] = useState({});
  const [activeImage, setActiveImage] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Default product if no ID is provided
  const defaultProduct = {
    title: 'CoreThreads Shoes',
    price: 49.50,
    stock: 25,
    description: 'Experience the perfect blend of comfort and style with CoreThreads Shoes. Engineered with premium materials and advanced cushioning technology, these athletic shoes provide superior support for all-day wear. Whether you\'re hitting the gym, running errands, or just hanging out, CoreThreads Shoes deliver exceptional comfort and durability. The sleek design pairs seamlessly with any outfit, making them the ideal choice for active individuals.',
    specs: [
      'Material: Premium mesh upper with breathable lining',
      'Sole: Cushioned EVA foam with rubber outsole for superior traction',
      'Color: White with subtle CoreThreads branding',
      'Fit: True to size with padded ankle collar for comfort',
      'Care: Machine washable - use mild detergent and air dry'
    ],
    images: ['https://via.placeholder.com/400x400?text=No+Image']
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
          console.warn(`API returned ${response.status}. Using default product.`);
          setProduct(defaultProduct);
          setLoading(false);
          return;
        }
        const data = await response.json();
        
        // Reduce verbose logging in production
        if (import.meta.env.DEV) {
          console.log('Fetched product data:', data);
        }
        
        // Normalize images from backend to absolute URLs
        const absImages = (data.images || []).map((img) =>
          (img && (img.startsWith('http://') || img.startsWith('https://'))) ? img : `${API_BASE_URL}${img}`
        );

        // Transform the API response to match our expected structure
        const transformedProduct = {
          id: data.productId,
          title: data.name || 'CoreThreads Shoes',
          price: data.price ? parseFloat(data.price) : 0,
          stock: data.stock || 0,
          description: data.description || '',
          specs: data.variants ? data.variants.map(v => `${v.size} - ${v.color}`) : [],
          images: absImages.length > 0 ? absImages : ['https://via.placeholder.com/400x400?text=No+Image'],
          category: data.category || 'Apparel'
        };

        if (import.meta.env.DEV) {
          console.log('Transformed product:', transformedProduct);
        }

        // Build color to image mapping from API data with improved matching
        const colorMap = {};
        if (data.variants && data.variants.length > 0) {
          const uniqueColors = [...new Set(data.variants.map(v => v.color))];
          setAvailableColors(uniqueColors);
          
          // Create a helper to normalize strings for matching
          const normalize = (str) => str.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
          
          if (import.meta.env.DEV) {
            console.log('Available colors:', uniqueColors);
            console.log('Available images:', absImages);
          }
          
          uniqueColors.forEach((color, index) => {
            let img = null;
            
            // Strategy 1: Try exact filename match with color name
            const normalizedColor = normalize(color);
            img = absImages.find(i => {
              const urlParts = i.split('/');
              const filename = urlParts[urlParts.length - 1].toLowerCase();
              return filename.includes(normalizedColor) || normalize(filename).includes(normalizedColor);
            });
            
            if (import.meta.env.DEV && !img) {
              console.log(`No filename match for color "${color}", trying index strategy...`);
            }
            
            // Strategy 2: If color index is within images array bounds, use corresponding image
            if (!img && index < absImages.length) {
              img = absImages[index];
              if (import.meta.env.DEV) {
                console.log(`Using index ${index} for color "${color}": ${img}`);
              }
            }
            
            // Strategy 3: Fallback to first image
            if (!img) {
              img = absImages[0];
              if (import.meta.env.DEV) {
                console.log(`Using first image for color "${color}": ${img}`);
              }
            }
            
            // Final fallback
            if (!img) {
              img = 'https://via.placeholder.com/400x400?text=No+Image';
            }
            
            colorMap[color] = img;
            if (import.meta.env.DEV) {
              console.log(`Color "${color}" → ${img}`);
            }
          });
          
          if (import.meta.env.DEV) {
            console.log('Final color map:', colorMap);
          }
        }
        const colorKeys = Object.keys(colorMap);
        if (colorKeys.length > 0) {
          const initialColor = colorKeys[0];
          setColorImages(colorMap);
          setSelectedColor(initialColor);
          setActiveImage(colorMap[initialColor]);
        } else {
          setActiveImage(absImages[0] || 'https://via.placeholder.com/400x400?text=No+Image');
        }
        
        setProduct(transformedProduct);

        // Track recently viewed products
        if (transformedProduct.title) {
          const RECENT_KEY = 'recently_viewed_products';
          const recent = JSON.parse(sessionStorage.getItem(RECENT_KEY) || '[]');
          // Remove if already exists, then add to front
          const filtered = recent.filter(name => name !== transformedProduct.title);
          const updated = [transformedProduct.title, ...filtered].slice(0, 10);
          sessionStorage.setItem(RECENT_KEY, JSON.stringify(updated));
        }

        // Check if product is already in wishlist
        const wishlist = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]');
        const itemKey = transformedProduct.id ?? transformedProduct.title;
        const isInWishlist = wishlist.some((w) => String(w.key) === String(itemKey));
        setIsFavorited(isInWishlist);
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
    if (!product) return;

    const itemKey = product.id ?? product.title;
    if (!itemKey) return;

    try {
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]');
      const exists = wishlist.find((w) => String(w.key) === String(itemKey));
      const chosenColor = selectedColor || availableColors[0] || product.color || 'N/A';
      const chosenSize = selectedSize || 'One Size';

      if (exists) {
        // Remove from wishlist
        const updated = wishlist.filter((w) => String(w.key) !== String(itemKey));
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
        setIsFavorited(false);
      } else {
        // Add to wishlist
        const priceValue = product.price ?? 0;
        const newItem = {
          key: itemKey,
          id: product.id,
          name: product.title,
          price: priceValue,
          imageUrl: activeImage || colorImages[chosenColor] || product.images?.[0],
          gender: product.gender,
          category: product.category,
          color: chosenColor,
          size: chosenSize,
        };
        wishlist.push(newItem);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
        setIsFavorited(true);
      }
    } catch (e) {
      console.warn('Unable to update wishlist', e);
    }
  };

  const handleColorChange = (value) => {
    setSelectedColor(value);
    if (colorImages[value]) {
      setActiveImage(colorImages[value]);
    } else if (product?.images?.length) {
      setActiveImage(product.images[0]);
    }
  };

  const handleThumbnailClick = (img) => {
    setActiveImage(img);
    const match = Object.entries(colorImages).find(([, url]) => url === img);
    if (match) {
      setSelectedColor(match[0]);
    }
  };

  const handleAddToCart = () => {
    console.log('Add to cart clicked - quantity:', quantity);
    
    if (quantity === 0) {
      setCartMessage('Please select a quantity');
      setIsSuccess(false);
      setShowCartModal(true);
      return;
    }

    if (!product) {
      console.error('No product data available');
      setCartMessage('Product data not available');
      setIsSuccess(false);
      setShowCartModal(true);
      return;
    }

    try {
      console.log('=== ADD TO CART DEBUG ===');
      console.log('Product:', product);
      console.log('Selected color:', selectedColor);
      console.log('Selected size:', selectedSize);
      console.log('Active image:', activeImage);
      console.log('Quantity:', quantity);
      
      // Extract ONLY primitive values from product
      const productTitle = product.title ? String(product.title) : 'Unknown';
      const productPrice = product.price ? parseFloat(product.price) : 0;
      const productId = product.id ? parseInt(product.id) : Date.now();
      const productCategory = product.category ? String(product.category) : 'Apparel';
      const productImage = activeImage && typeof activeImage === 'string' ? activeImage : (product.images && product.images[0] ? String(product.images[0]) : '');
      const productStock = product.stock ? parseInt(product.stock) : 0;

      console.log('Extracted values:', {
        productTitle,
        productPrice,
        productId,
        productCategory,
        productImage,
        productStock,
        selectedColor: String(selectedColor || 'N/A'),
        selectedSize: String(selectedSize || 'One Size'),
        quantity: parseInt(quantity)
      });

      // Get existing cart
      let cartItems = [];
      let existingCart = sessionStorage.getItem('cart_items');
      if (existingCart) {
        try {
          cartItems = JSON.parse(existingCart);
          console.log('Existing cart items:', cartItems);
        } catch (e) {
          console.error('Failed to parse existing cart, starting fresh', e);
          cartItems = [];
        }
      }

      // Create cart item with ONLY primitive values
      const cartItem = {
        id: productId,
        uniqueKey: `${productId}-${Date.now()}`,
        title: productTitle,
        price: productPrice,
        quantity: parseInt(quantity),
        imageUrl: productImage,
        category: productCategory,
        size: String(selectedSize || 'One Size'),
        color: String(selectedColor || 'N/A'),
        stock: productStock
      };

      console.log('Created cart item:', cartItem);

      // Add to cart
      cartItems.push(cartItem);
      console.log('Updated cart array:', cartItems);

      // Save to sessionStorage (single source of truth)
      const cartJson = JSON.stringify(cartItems);
      console.log('Cart JSON string:', cartJson);
      sessionStorage.setItem('cart_items', cartJson);

      // Verify it was saved
      const verifyCart = sessionStorage.getItem('cart_items');
      console.log('Verified from sessionStorage:', verifyCart);
      console.log('=== END DEBUG ===');

      // Show success and navigate
      setCartMessage(`Added ${productTitle} to cart!`);
      setIsSuccess(true);
      setShowCartModal(true);
      
      // Auto-navigate after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/cart');
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage('Error adding item to cart: ' + error.message);
      setIsSuccess(false);
      setShowCartModal(true);
    }
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
            <img src={activeImage || colorImages[selectedColor] || product.images[0]} alt={product.title} />
          </div>
          <div className={styles.thumbnailRow}>
            {product.images.map((img, idx) => (
              <div key={idx} className={styles.thumbnail} onClick={() => handleThumbnailClick(img)}>
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
            <span className={styles.price}>$ {product.price.toFixed(2)}</span>
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
              onChange={(e) => handleColorChange(e.target.value)}
            >
              <option value="">Color</option>
              {availableColors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
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

      {/* Cart Modal */}
      {showCartModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${isSuccess ? styles.modalSuccess : styles.modalError}`}>
            <button 
              className={styles.modalCloseBtn}
              onClick={() => setShowCartModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <div className={styles.modalIcon}>
              <FontAwesomeIcon 
                icon={isSuccess ? faCheckCircle : faTimes} 
                className={isSuccess ? styles.iconSuccess : styles.iconError}
              />
            </div>
            
            <h3 className={styles.modalTitle}>
              {isSuccess ? 'Success!' : 'Oops!'}
            </h3>
            
            <p className={styles.modalMessage}>
              {cartMessage}
            </p>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.modalBtn}
                onClick={() => {
                  setShowCartModal(false);
                  if (isSuccess) {
                    navigate('/dashboard/cart');
                  }
                }}
              >
                {isSuccess ? 'Go to Cart' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductSection;