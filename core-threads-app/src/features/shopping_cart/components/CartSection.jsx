import { useState, useEffect, useRef } from 'react';
import styles from '../styles/cart.section.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import CartItem from './CartItem';
import { API_BASE_URL } from '../../../config/api.js';

function CartSection() {
  const [cartItems, setCartItems] = useState([]);
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0, 10, or 20 for percentage
  const [isFirstTimePurchase, setIsFirstTimePurchase] = useState(true); // Assume first-time unless we know otherwise
  const [modalState, setModalState] = useState({ open: false, type: 'info', title: '', message: '', details: [] });
  // Avoid overwriting sessionStorage with an empty cart on initial mount
  const hasInitialized = useRef(false);
  // Track last non-empty cart to prevent accidental replacement with []
  const lastNonEmptyCartRef = useRef([]);

  const showModal = ({ type = 'info', title = '', message = '', details = [] }) => {
    setModalState({ open: true, type, title, message, details });
  };

  const closeModal = () => setModalState(prev => ({ ...prev, open: false }));

  // Function to load and transform cart items
  const loadCartItems = () => {
    const KEY = 'cart_items';
    const storedItems = sessionStorage.getItem(KEY);
    console.log('Loading cart items from sessionStorage:', storedItems);
    
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        console.log('Parsed items:', parsedItems);
        
        // Transform to match cart item structure with quantity
        const cartItemsWithQuantity = parsedItems.map((item, idx) => {
          // Handle both product page items (title, price as number) and catalog items (title, imageUrl)
          const itemName = item.title || item.name;
          const itemImage = item.imageUrl || item.image;
          // Price could be a string with $ or a number
          const priceStr = String(item.price || 0).replace('$', '').trim();
          const itemPrice = parseFloat(priceStr) || 0;
          // Try to retain productId for checkout
          let productId = undefined;
          if (item.id && /^\d+$/.test(String(item.id))) {
            productId = parseInt(item.id, 10);
          } else if (item.uniqueKey && typeof item.uniqueKey === 'string') {
            const first = item.uniqueKey.split('-')[0];
            if (first && /^\d+$/.test(first)) productId = parseInt(first, 10);
          }
          
          console.log(`Item ${idx}:`, { itemName, itemImage, priceStr, itemPrice });
          
          return {
            id: item.uniqueKey || item.id || `item-${idx}`,
            productId,
            name: itemName,
            category: item.category || 'Apparel',
            price: itemPrice,
            quantity: item.quantity || 1,
            image: itemImage,
            gender: item.gender,
            color: item.color,
            size: item.size,
            originalPrice: item.originalPrice
          };
        });
        console.log('Transformed items:', cartItemsWithQuantity);
        setCartItems(cartItemsWithQuantity);
        if (cartItemsWithQuantity.length > 0) {
          lastNonEmptyCartRef.current = cartItemsWithQuantity;
        }
        hasInitialized.current = true;
      } catch (error) {
        console.error('Error parsing cart items:', error);
        setCartItems([]);
        hasInitialized.current = true;
      }
    } else {
      console.log('No items in sessionStorage');
      setCartItems([]);
      hasInitialized.current = true;
    }
  };

  // Load cart items on component mount and when storage changes
  useEffect(() => {
    loadCartItems();
    
    // Also listen for storage changes (in case items are added from another tab/window)
    const handleStorageChange = (e) => {
      if (e.key === 'cart_items' || e.key === null) {
        console.log('Storage changed, reloading cart');
        loadCartItems();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync cartItems to sessionStorage whenever cart changes
  useEffect(() => {
    // Do not clobber existing storage before we've loaded once
    if (!hasInitialized.current) return;
    // Don't overwrite storage with empty on initial load; explicit clears will set storage directly
    if (cartItems.length === 0) {
      console.log('Skip syncing empty cart state to sessionStorage');
      return;
    }
    try {
      const KEY = 'cart_items';
      const next = JSON.stringify(cartItems);
      const currentSS = sessionStorage.getItem(KEY);
      if (currentSS !== next) sessionStorage.setItem(KEY, next);
    } catch (e) {
      console.warn('Unable to sync cart to storage', e);
    }
  }, [cartItems]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 50.00;
  
  // Check if discount is eligible (first-time purchase, single product with qty 1)
  const isDiscountEligible = isFirstTimePurchase && cartItems.length === 1 && cartItems[0]?.quantity === 1;
  
  // Only apply discount if eligible
  const discountAmount = isDiscountEligible ? (subtotal * appliedDiscount) / 100 : 0;
  const orderTotal = subtotal + deliveryFee - discountAmount;

  const handleQuantityChange = (id, delta) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleApplyDiscount = (percentage) => {
    // Check eligibility first
    if (!isDiscountEligible) {
      let reason = '';
      if (!isFirstTimePurchase) {
        reason = 'This discount is only valid for first-time purchases.';
      } else if (cartItems.length !== 1) {
        reason = 'This discount is only valid when ordering a single product.';
      } else if (cartItems[0]?.quantity !== 1) {
        reason = 'This discount is only valid when ordering exactly 1 unit of a product.';
      }
      showModal({ type: 'warning', title: 'Discount not eligible', message: reason || 'This discount is not eligible for your cart.' });
      return;
    }

    // If already applied the same discount, remove it
    if (appliedDiscount === percentage) {
      setAppliedDiscount(0);
    } else {
      // Apply the new discount (allow switching between them)
      setAppliedDiscount(percentage);
    }
  };

  const finalizeOrder = async () => {
    try {
      if (!cartItems.length) {
        showModal({ type: 'warning', title: 'Cart is empty', message: 'Add items to your cart before checking out.' });
        return;
      }

      // Build checkout items payload
      // Resolve missing productIds by searching the backend by product name
      const resolved = await Promise.all(cartItems.map(async (ci) => {
        let pid = ci.productId;
        const qty = Math.max(1, parseInt(ci.quantity || 1, 10));
        if (!pid && ci.name) {
          try {
            const r = await fetch(`${API_BASE_URL}/api/products/search?keyword=${encodeURIComponent(ci.name)}`, { credentials: 'include' });
            if (r.ok) {
              const list = await r.json();
              if (Array.isArray(list) && list.length > 0) {
                // Prefer active product, else first
                const active = list.find(p => p.isActive === true) || list[0];
                if (active?.productId) {
                  pid = active.productId;
                }
              }
            }
          } catch {}
        }
        return {
          productId: pid,
          size: ci.size || null,
          color: ci.color || null,
          quantity: qty
        };
      }));

      const items = resolved.filter(i => i.productId && i.quantity > 0);

      if (!items.length) {
        showModal({ type: 'error', title: 'Missing product info', message: 'Cart items are missing product references. Try re-adding from product pages.' });
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error || `Checkout failed (${res.status})`;
        if (res.status === 409 && err.failures) {
          const details = err.failures.map(f => {
            if (f.reason === 'Insufficient balance') {
              const cur = f.currentBalance !== undefined ? Number(f.currentBalance).toFixed(2) : 'unknown';
              const req = f.requiredAmount !== undefined ? Number(f.requiredAmount).toFixed(2) : 'unknown';
              return `Insufficient balance: current $${cur}, required $${req}`;
            }
            return `Product ${f.productId}: ${f.reason}${f.available !== undefined ? ` (available ${f.available}, requested ${f.requested})` : ''}`;
          });
          const message = err.failures.some(f => f.reason === 'Insufficient balance')
            ? 'Payment failed due to insufficient balance.'
            : 'Some items cannot be fulfilled.';
          showModal({ type: 'warning', title: msg, message, details });
        } else {
          showModal({ type: 'error', title: 'Checkout failed', message: msg });
        }
        return;
      }

      const data = await res.json();
      const details = [`Total: $${Number(data.totalAmount).toFixed(2)}`];
      if (data.remainingBalance !== undefined && data.remainingBalance !== null) {
        details.push(`Remaining Balance: $${Number(data.remainingBalance).toFixed(2)}`);
      }
      showModal({ type: 'success', title: 'Order placed', message: `Order Number: ${data.orderNumber}`, details });
      // Clear cart
      try {
        sessionStorage.setItem('cart_items', '[]');
      } catch {}
      setCartItems([]);
    } catch (e) {
      console.error('Finalize order error:', e);
      showModal({ type: 'error', title: 'Unexpected error', message: 'An unexpected error occurred during checkout.' });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContainer}>
        {/* Left: Cart Items */}
        <div className={styles.leftSection}>
          <div className={styles.cartHeader}>
            <h1 className={styles.cartTitle}>Shopping Cart</h1>
            <FontAwesomeIcon icon={faShoppingCart} className={styles.cartIcon} />
          </div>

          <div className={styles.cartItemsList}>
            {cartItems.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#999',
                fontSize: '16px'
              }}>
                <p style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</p>
                <p style={{ fontWeight: 600, marginBottom: '8px' }}>Your cart is empty</p>
                <p>Add items from the catalog to get started</p>
              </div>
            ) : (
              cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={(delta) => handleQuantityChange(item.id, delta)}
                  onRemove={() => handleRemoveItem(item.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className={styles.rightSection}>
          <div className={styles.orderSummary}>
            <div className={styles.summaryHeader}>
              <h3 className={styles.summaryTitle}>Order Details</h3>
            </div>

            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span className={styles.label}>Order Amount</span>
                <span className={styles.value}>${subtotal.toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Delivery Fee</span>
                <span className={styles.value}>${deliveryFee.toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.label}>Discounts Applied</span>
                <span className={styles.valueDiscount}>-${discountAmount.toFixed(2)}</span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Order Total:</span>
                <span className={styles.totalValue}>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount Buttons */}
            <div className={styles.discountSection}>
              <h4 className={styles.discountTitle}>Apply Discount</h4>
              <p className={styles.discountHint}>Valid for first-time purchases only. Limited to 1 product with quantity 1.</p>
              <div className={styles.discountButtons}>
                <button 
                  className={`${styles.discountBtn} ${appliedDiscount === 20 ? styles.active : ''} ${!isDiscountEligible ? styles.disabled : ''}`}
                  onClick={() => handleApplyDiscount(20)}
                  disabled={!isDiscountEligible}
                >
                  20% Off
                  <span className={styles.badgeText}>Free</span>
                </button>
                <button 
                  className={`${styles.discountBtn} ${appliedDiscount === 10 ? styles.active : ''} ${!isDiscountEligible ? styles.disabled : ''}`}
                  onClick={() => handleApplyDiscount(10)}
                  disabled={!isDiscountEligible}
                >
                  10% Off
                  <span className={styles.badgeText}>Free</span>
                </button>
              </div>
            </div>

            {/* Finalize Order Button */}
            <button className={styles.finalizeBtn} onClick={finalizeOrder} disabled={cartItems.length === 0}>
              Finalize Order
            </button>
          </div>
        </div>
      </div>
        {modalState.open && (
          <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={`${styles.modalCard} ${styles[`modal-${modalState.type}`] || ''}`}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>{modalState.title || 'Notice'}</h3>
                <button className={styles.modalClose} onClick={closeModal} aria-label="Close">×</button>
              </div>
              <div className={styles.modalBody}>
                <p className={styles.modalMessage}>{modalState.message}</p>
                {modalState.details && modalState.details.length > 0 && (
                  <ul className={styles.modalList}>
                    {modalState.details.map((d, idx) => <li key={idx}>{d}</li>)}
                  </ul>
                )}
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.modalButton} onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default CartSection;