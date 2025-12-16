import { useState, useEffect } from 'react';
import styles from '../styles/cart.section.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import CartItem from './CartItem';

function CartSection() {
  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [shippingDiscount, setShippingDiscount] = useState('');

  // Load cart items from sessionStorage on component mount
  useEffect(() => {
    const storedItems = sessionStorage.getItem('cart_items');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        // Transform to match cart item structure with quantity
        const cartItemsWithQuantity = parsedItems.map((item, idx) => {
          // Handle both catalog items (title, imageUrl) and deal items (name, image)
          const itemName = item.title || item.name;
          const itemImage = item.imageUrl || item.image;
          const itemPrice = item.price ? parseFloat(item.price.replace('$', '')) : 0;
          
          return {
            id: item.uniqueKey || item.id || `deal-${idx}`,
            name: itemName,
            category: item.category || 'Apparel',
            price: itemPrice,
            quantity: item.quantity || 1,
            image: itemImage,
            gender: item.gender,
            originalPrice: item.originalPrice
          };
        });
        setCartItems(cartItemsWithQuantity);
      } catch (error) {
        console.error('Error parsing cart items:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Sync cartItems to sessionStorage whenever cart changes
  useEffect(() => {
    sessionStorage.setItem('cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 50.00;
  const discountAmount = 50.00;
  const orderTotal = subtotal + deliveryFee - discountAmount;

  const handleQuantityChange = (id, delta) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
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
              <button className={styles.editBtn}>⚙ Edit Order Details</button>
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

            {/* Voucher Selectors */}
            <div className={styles.voucherSection}>
              <select className={styles.voucherSelect}>
                <option>Select Shopping Discount Voucher</option>
                <option value="discount10">10% Off</option>
                <option value="discount20">20% Off</option>
              </select>

              <select className={styles.voucherSelect}>
                <option>Select Shipping Discount Voucher</option>
                <option value="ship5">Free Shipping</option>
                <option value="ship10">$10 Off Shipping</option>
              </select>
            </div>

            {/* Finalize Order Button */}
            <button className={styles.finalizeBtn}>Finalize Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSection;