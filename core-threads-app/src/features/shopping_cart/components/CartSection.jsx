import styles from '../styles/cart.section.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CartItem from './CartItem';
function CartSection() {


  return (

    <>

    <div className={styles.sectionWrapper}>

      <div className={styles.leftContent}>
        <div className={styles.cartHeader}>
          <h2 className="text" style={{ fontSize: "2.8rem", margin: "0" }}>
            YOUR CART
          </h2>
          <FontAwesomeIcon
            icon={["fas", "cart-shopping"]}
            size="lg"
            color="var(--color-primary-dark)"
            className={styles.icon}
          />
         

        </div>
        <CartItem/>
         
      
      </div>
    </div>
    
    </>
    
  );
}

export default CartSection;