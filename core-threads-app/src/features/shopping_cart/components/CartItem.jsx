import styles from '../styles/cart.item.module.css';

function CartItem(){
    

    return(

        <>
        <div className={styles.cartItemWrapper}>
            <div className={styles.cartImage}>

                image
            </div>
            <div className={styles.cartContent}>
    
                <div className={styles.contentHeader}>

                    <h3 className={styles.contentHeaderName}>Gradient Graphic T-shirt</h3>
                    <div className={styles.contentHeaderTrash}>TRASH</div>

                </div>

                <div className={styles.contentDesc}>

                    <span className={styles.descText}>Size: </span>
                    <span className={styles.descText}>Color: </span>

                </div>

                <div className={styles.contentFooter}>

                    <h3 className={styles.contentHeaderName}>Total: </h3>
                    <div className={styles.contentHeaderTrash}>TRASH</div>
                </div>

            </div>

        </div>
        </>

    );


}

export default CartItem