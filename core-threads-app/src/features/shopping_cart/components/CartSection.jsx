import { useState } from 'react';
import styles from '../styles/cart.section.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import CartItem from './CartItem';

function CartSection() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Nike Shoes', category: 'Shoes', price: 50.00, quantity: 0, image: '/shoe1.jpg' },
    { id: 2, name: 'Classic Black Hoodie', category: 'Apparel', price: 45.00, quantity: 0, image: '/hoodie.jpg' },
    { id: 3, name: 'Denim Jeans', category: 'Bottoms', price: 65.00, quantity: 0, image: '/jeans.jpg' },
    { id: 4, name: 'White Crew Neck Tee', category: 'Apparel', price: 25.00, quantity: 0, image: '/tee.jpg' },
    { id: 5, name: 'Canvas Backpack', category: 'Accessories', price: 75.00, quantity: 0, image: '/backpack.jpg' },
    { id: 6, name: 'Wool Winter Beanie', category: 'Accessories', price: 30.00, quantity: 0, image: '/beanie.jpg' },
    { id: 7, name: 'Athletic Socks Pack', category: 'Accessories', price: 15.00, quantity: 0, image: '/socks.jpg' },
  ]);

  const [discountCode, setDiscountCode] = useState('');
  const [shippingDiscount, setShippingDiscount] = useState('');

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
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={(delta) => handleQuantityChange(item.id, delta)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
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